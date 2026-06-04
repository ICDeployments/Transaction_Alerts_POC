"""
Fraud Advisory Orchestrator - FastAPI Application
Provides endpoints for rule retrieval and transaction analysis.
"""
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging
import sys

from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient
from azure.search.documents.models import VectorizedQuery
from openai import AzureOpenAI
from pydantic import ValidationError

from config import settings
from models import (
    RuleRetrievalRequest,
    RuleRetrievalResponse,
    TransactionAnalysisRequest,
    TransactionAnalysisResponse,
    FraudAnalysis
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Azure OpenAI Configuration loaded from environment variables
AZURE_OPENAI_ENDPOINT = settings.azure_openai_endpoint
AZURE_OPENAI_API_KEY = settings.azure_openai_api_key
AZURE_OPENAI_DEPLOYMENT_NAME = settings.azure_openai_deployment_name
AZURE_OPENAI_API_VERSION = settings.azure_openai_api_version

# Azure Search Configuration loaded from environment variables
SEARCH_ENDPOINT = settings.search_endpoint
SEARCH_API_KEY = settings.search_api_key
SEARCH_INDEX_NAME = settings.search_index_name

# Application Configuration
APP_TITLE = "Fraud Advisory Orchestrator"
APP_VERSION = "1.0.0"

# Initialize FastAPI app
app = FastAPI(
    title=APP_TITLE,
    version=APP_VERSION,
    description="API for fraud detection rule retrieval and transaction analysis"
)

# Add CORS middleware to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Azure Search Client
try:
    search_client = SearchClient(
        endpoint=SEARCH_ENDPOINT,
        index_name=SEARCH_INDEX_NAME,
        credential=AzureKeyCredential(SEARCH_API_KEY)
    )
    logger.info("Azure Search client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Azure Search client: {e}")
    raise

# Initialize Azure OpenAI Client
try:
    openai_client = AzureOpenAI(
        azure_endpoint=AZURE_OPENAI_ENDPOINT,
        api_key=AZURE_OPENAI_API_KEY,
        api_version=AZURE_OPENAI_API_VERSION
    )
    logger.info("Azure OpenAI client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Azure OpenAI client: {e}")
    raise


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": APP_TITLE,
        "version": APP_VERSION
    }


@app.post(
    "/retrieve-rules",
    response_model=RuleRetrievalResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve Relevant Fraud Rules",
    description="Uses Azure AI Search to retrieve fraud rules matching the transaction context"
)
async def retrieve_rules(request: RuleRetrievalRequest) -> RuleRetrievalResponse:
    """
    Endpoint 1: Rule Retriever
    
    Queries Azure AI Search to find the most relevant fraud detection rules
    based on the provided transaction context.
    
    Args:
        request: RuleRetrievalRequest containing transaction_context and optional top_k
        
    Returns:
        RuleRetrievalResponse with matching rules and count
        
    Raises:
        HTTPException: If search operation fails
    """
    try:
        logger.info(f"Retrieving rules for context: {request.transaction_context[:100]}...")
        
        # Perform search query
        search_results = search_client.search(
            search_text=request.transaction_context,
            top=request.top_k,
            select=["rule_id", "rule_name", "description", "risk_level", "category"],
            include_total_count=True
        )
        
        # Extract and format results
        rules = []
        for result in search_results:
            rule = {
                "rule_id": result.get("rule_id"),
                "rule_name": result.get("rule_name"),
                "description": result.get("description"),
                "risk_level": result.get("risk_level"),
                "category": result.get("category"),
                "score": result.get("@search.score")
            }
            rules.append(rule)
        
        logger.info(f"Retrieved {len(rules)} matching rules")
        
        return RuleRetrievalResponse(
            rules=rules,
            count=len(rules)
        )
        
    except Exception as e:
        logger.error(f"Error retrieving rules: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve rules: {str(e)}"
        )


@app.post(
    "/analyze-transaction",
    response_model=TransactionAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze Transaction with LLM",
    description="Uses Azure OpenAI to generate risk analysis and recommendations for flagged transactions"
)
async def analyze_transaction(request: TransactionAnalysisRequest) -> TransactionAnalysisResponse:
    """
    Endpoint 2: LLM Advisor
    
    Uses Azure OpenAI with structured output to generate a comprehensive
    fraud risk analysis including explanations, risks, and recommendations.
    
    Args:
        request: TransactionAnalysisRequest with transaction_metadata and rule_details
        
    Returns:
        TransactionAnalysisResponse with structured fraud analysis
        
    Raises:
        HTTPException: If LLM call or parsing fails
    """
    try:
        # Extract transaction ID from either new or legacy format
        transaction_id = (
            request.transaction_metadata.get('transactionId') or 
            request.transaction_metadata.get('transaction_id') or 
            'Unknown'
        )
        logger.info(f"Analyzing transaction: {transaction_id}")
        
        # Format rule details for prompt
        if isinstance(request.rule_details, list):
            rules_text = "\n".join([f"- {rule}" for rule in request.rule_details])
        else:
            rules_text = request.rule_details
        
        # Format transaction metadata
        metadata_text = "\n".join([
            f"- {key}: {value}" 
            for key, value in request.transaction_metadata.items()
        ])
        
        # Extract key information for contextual data
        transaction = request.transaction_metadata
        customer_id = transaction.get('customer_id', 'Unknown')
        customer_name = transaction.get('customer_name', transaction.get('entity_name', 'Unknown Customer'))
        amount = transaction.get('amount', 0)
        currency = transaction.get('currency', 'USD')
        
        # Extract transaction details if available
        txn_details = transaction.get('transactionDetails', {})
        merchant_name = txn_details.get('merchantName', transaction.get('beneficiary', 'Unknown Merchant'))
        merchant_location = txn_details.get('merchantLocation', {})
        merchant_city = merchant_location.get('city', 'Unknown')
        merchant_country = merchant_location.get('country', 'Unknown')
        
        # Extract customer context if available
        customer_context = transaction.get('customerContext', {})
        prev_txns_24h = customer_context.get('previousTransactionsLast24h', 12)
        avg_ticket = customer_context.get('averageTicketSize', 89.50)
        
        # Extract card details if available
        card_info = transaction.get('card', {})
        card_masked = card_info.get('panMasked', '****1111')
        card_expiry = card_info.get('expiryDate', '12/28')
        
        # Build contextual data for the LLM
        kyc_context = f"""
KYC & PAYMENT SYSTEM DATA (from UI):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IDENTITY VERIFICATION:
• KYC Status: VERIFIED (Verified on Jan 15, 2024)
• Customer Tier: TIER 2 - ENHANCED
• Risk Rating: MEDIUM RISK
• Customer ID: {customer_id}
• Customer Name: {customer_name}
• Last Review Date: Jan 10, 2026

DOCUMENT VERIFICATION:
• Government-Issued ID: ✓ VERIFIED (Driver's License)
• Proof of Address: ✓ VERIFIED (Utility Bill - Dec 2025)
• Source of Funds: ✓ VERIFIED (Employment Letter)
• Tax Identification: ⏳ PENDING RENEWAL (SSN/Tax ID)

COMPLIANCE & SCREENING:
• PEP Screening: ✓ CLEAR (Politically Exposed Person Check)
• Sanctions Screening: ✓ CLEAR (OFAC, UN, EU Sanctions Lists)
• Adverse Media Check: ✓ CLEAR (Negative News Screening)
• AML Watchlist: ✓ CLEAR (Anti-Money Laundering Database)

CUSTOMER PROFILE:
• Full Name: {customer_name}
• Date of Birth: May 12, 1985
• Nationality: United States
• Occupation: Business Owner
• Residential Address: {merchant_city}, CA
• Contact Number: +1 (555) 123-4567

PAYMENT SYSTEM DATA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACCOUNT INFORMATION:
• Account Number: {transaction.get('source_account', 'ACC-001-US')}
• Account Type: Business Checking - Primary
• Account Status: ✓ ACTIVE
• Account Holder: {customer_name}

LINKED PAYMENT METHODS:
• Primary Card: VISA {card_masked} (Exp: {card_expiry}) - PRIMARY
• Backup Card: MasterCard **** **** **** 4532 (Exp: 09/27) - BACKUP

TRANSACTION VELOCITY (Last 24 Hours):
• Total Transactions: {prev_txns_24h}
• Total Volume: {currency} {int(amount * 4.2):,}
• Average Ticket Size: {currency} {avg_ticket:.2f}

RECENT TRANSACTION HISTORY (Last 7 Days):
• Current Transaction: {merchant_name} - {currency} {amount:,.2f} (FLAGGED)
• 1 day ago: Online Purchase - Tech Store - {currency} {amount * 0.6:,.2f} (CLEARED)
• 2 days ago: Salary Deposit - +{currency} {amount * 12:,.2f} (CLEARED)
• 3 days ago: Grocery Store - {currency} {amount * 0.45:,.2f} (CLEARED)
• 4 days ago: Gas Station - {currency} {amount * 0.22:,.2f} (CLEARED)

LINKED ACCOUNTS:
• {transaction.get('source_account', 'ACC-001-US')}: Business Checking - Primary (ACTIVE)
• ACC-002-US: Savings Account (ACTIVE)

ENHANCED DUE DILIGENCE NOTES:
• Jan 10, 2026 (ANNUAL REVIEW): Annual KYC review completed. All documents verified and up to date. Customer business remains consistent with original profile.
• Jan 15, 2024 (ONBOARDING): Initial KYC verification completed successfully. All required documents submitted and verified. Customer approved for Tier 2 services.
"""
        
        # Construct the system prompt
        system_prompt = """You are a fraud detection expert assisting human analysts. 
Your role is to provide clear, actionable analysis of potentially fraudulent transactions.
Analyze the transaction data and triggered rules, then provide structured output following the exact schema provided.

IMPORTANT: For each analyst consideration, provide 2-5 relevant supporting data points as "children":
- If the consideration relates to past transactions, include specific transaction examples with amounts, dates, and merchants
- If about account history, include account age, total transactions, average amounts
- If about behavioral patterns, include specific metrics like velocity, frequency, or deviation from normal
- If about location/geography, include past locations, IP addresses, or travel patterns
- If about merchant/recipient, include merchant category, risk level, or past interactions
- Generate realistic synthetic data when actual data is not explicitly provided in the transaction metadata"""
        
        # Construct the user prompt
        user_prompt = f"""Analyze this potentially fraudulent transaction:

TRANSACTION DETAILS:
{metadata_text}

TRIGGERED FRAUD RULES:
{rules_text}

{kyc_context}

IMPORTANT INSTRUCTIONS:
1. Use the EXACT data from the KYC & PAYMENT SYSTEM sections above when generating considerations
2. Reference SPECIFIC values (amounts, dates, account numbers) that match what's shown in the UI
3. For EACH consideration, provide 2-5 relevant supporting data points as "children":
   
   Example 1 - If consideration is "Verify past transaction history", children should reference the ACTUAL transaction history above:
     * "Recent cleared transaction: Online Purchase - Tech Store - {currency} {amount * 0.6:,.2f} (1 day ago)"
     * "Average transaction amount: {currency} {avg_ticket:.2f} over last 30 days"
     * "Total transactions in last 24h: {prev_txns_24h}"
     * "Current transaction ({currency} {amount:,.2f}) is {(amount/avg_ticket):.1f}x higher than average"
   
   Example 2 - If consideration is "Check account age and activity", children should use ACTUAL KYC data:
     * "Account opened: KYC verified on Jan 15, 2024 (2 years old)"
     * "Customer Tier: TIER 2 - ENHANCED"
     * "Risk Rating: MEDIUM RISK"
     * "Recent KYC review: Jan 10, 2026 (Annual Review - All documents verified)"
   
   Example 3 - If consideration is "Review merchant details", children should use transaction specifics:
     * "Merchant: {merchant_name}"
     * "Location: {merchant_city}, {merchant_country}"
     * "Transaction amount: {currency} {amount:,.2f}"
     * "Payment method: VISA {card_masked} (Primary card)"
   
   Example 4 - If consideration is "Verify compliance checks", children should reference KYC compliance data:
     * "PEP Screening: CLEAR (No politically exposed person match)"
     * "Sanctions Screening: CLEAR (OFAC, UN, EU lists checked)"
     * "AML Watchlist: CLEAR"
     * "Tax ID Status: PENDING RENEWAL (requires attention)"

4. Provide a comprehensive fraud analysis with:
   - A clear explanation of why this alert was triggered
   - Potential financial or regulatory risks
   - Specific points for the analyst to investigate (with children data referencing UI values)
   - A recommended action (Escalate, Close, or Investigate Further)

REMEMBER: All children data should match the KYC & Payment System data shown above so analysts see consistent information across all screens!"""

        # Call Azure OpenAI with structured output
        try:
            completion = openai_client.beta.chat.completions.parse(
                model=AZURE_OPENAI_DEPLOYMENT_NAME,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format=FraudAnalysis,
                temperature=0.3,
                max_tokens=1500
            )
        except Exception as openai_error:
            error_type = type(openai_error).__name__
            logger.error(f"Azure OpenAI API error ({error_type}): {str(openai_error)}")
            
            # Provide more specific error messages
            if "Connection" in error_type or "getaddrinfo" in str(openai_error):
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail=f"Cannot connect to Azure OpenAI service at {AZURE_OPENAI_ENDPOINT}. "
                           f"Please check your Azure OpenAI endpoint configuration and network connection."
                )
            elif "Authentication" in error_type or "401" in str(openai_error):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Azure OpenAI authentication failed. Please check your Azure OpenAI API key."
                )
            elif "NotFound" in error_type or "404" in str(openai_error):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Azure OpenAI deployment '{AZURE_OPENAI_DEPLOYMENT_NAME}' not found. "
                           f"Please check your Azure OpenAI deployment name configuration."
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Azure OpenAI API error: {str(openai_error)}"
                )
        
        # Extract the structured output
        fraud_analysis = completion.choices[0].message.parsed
        
        if fraud_analysis is None:
            logger.error("Failed to parse structured output from OpenAI")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate structured analysis"
            )
        
        logger.info(f"Analysis completed with recommendation: {fraud_analysis.recommended_action}")
        
        # Extract transaction ID from either new or legacy format
        transaction_id = (
            request.transaction_metadata.get('transactionId') or 
            request.transaction_metadata.get('transaction_id')
        )
        
        return TransactionAnalysisResponse(
            analysis=fraud_analysis,
            transaction_id=transaction_id
        )
        
    except ValidationError as e:
        logger.error(f"Validation error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid data format: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Error analyzing transaction: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze transaction: {str(e)}"
        )


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for unexpected errors."""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occurred"}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
