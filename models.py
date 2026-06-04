"""
Pydantic models for request and response validation.
"""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class RuleRetrievalRequest(BaseModel):
    """Request model for rule retrieval endpoint."""
    transaction_context: str = Field(
        ...,
        description="Transaction context for rule matching",
        examples=["Large wire transfer to high-risk country"]
    )
    top_k: Optional[int] = Field(
        default=5,
        description="Number of top matching rules to return",
        ge=1,
        le=20
    )


class RuleDetail(BaseModel):
    """Model representing a single fraud rule."""
    rule_id: Optional[str] = None
    rule_name: Optional[str] = None
    description: Optional[str] = None
    score: Optional[float] = None


class RuleRetrievalResponse(BaseModel):
    """Response model for rule retrieval endpoint."""
    rules: List[Dict[str, Any]] = Field(
        ...,
        description="List of matching fraud rules"
    )
    count: int = Field(
        ...,
        description="Number of rules returned"
    )


class TransactionAnalysisRequest(BaseModel):
    """Request model for transaction analysis endpoint."""
    transaction_metadata: Dict[str, Any] = Field(
        ...,
        description="Transaction details and metadata",
        examples=[{
            "transactionId": "TXN123456789",
            "eventTimestamp": "2026-01-19T08:32:45Z",
            "card": {
                "panMasked": "411111XXXXXX1111",
                "cardType": "CREDIT",
                "expiryDate": "12/28",
                "cardholderId": "CH987654321"
            },
            "transactionDetails": {
                "amount": 249.99,
                "currency": "USD",
                "merchantCategoryCode": "5814",
                "merchantName": "FOOD & BEVERAGE OUTLET",
                "merchantLocation": {
                    "city": "San Francisco",
                    "state": "CA",
                    "country": "USA"
                },
                "channel": "ECOM",
                "entryMode": "KEYED",
                "transactionType": "PURCHASE",
                "isCardPresent": False,
                "isPinAuthenticated": False
            },
            "customerContext": {
                "deviceId": "DEV-9988-ABCD-1234",
                "ipAddress": "172.16.45.122",
                "geoLocation": {
                    "latitude": 37.7749,
                    "longitude": -122.4194
                },
                "previousTransactionsLast24h": 12,
                "averageTicketSize": 89.50
            },
            "velocityIndicators": {
                "txnCountLast10Min": 3,
                "txnAmountLast10Min": 540.75,
                "crossBorderTxnInLastHour": False
            },
            "riskContext": {
                "channelRiskScore": 42,
                "merchantRiskScore": 65,
                "deviceRiskScore": 58
            },
            "falconScoringRequest": {
                "modelVersion": "6.5",
                "scoreRequestId": "SCR000987654321",
                "requestType": "REAL_TIME"
            }
        }]
    )
    rule_details: str | List[str] = Field(
        ...,
        description="Fraud rules that triggered the alert"
    )


class ConsiderationDetail(BaseModel):
    """Detailed supporting data for a key consideration."""
    consideration: str = Field(
        ...,
        description="The key consideration text"
    )
    children: List[str] = Field(
        ...,
        description="Relevant synthetic or actual data points supporting this consideration (e.g., past transaction data, account info, behavioral patterns)"
    )


class FraudAnalysis(BaseModel):
    """Structured output model for LLM-generated fraud analysis."""
    risk_explanation: str = Field(
        ...,
        description="Plain-language summary of why the alert fired"
    )
    implied_risks: List[str] = Field(
        ...,
        description="List of potential financial or regulatory risks"
    )
    analyst_considerations: List[ConsiderationDetail] = Field(
        ...,
        description="Specific points for the human reviewer to check, each with supporting data"
    )
    recommended_action: str = Field(
        ...,
        description="Recommended action",
        pattern="^(Escalate|Close|Investigate Further)$"
    )


class TransactionAnalysisResponse(BaseModel):
    """Response model for transaction analysis endpoint."""
    analysis: FraudAnalysis
    transaction_id: Optional[str] = None


# ============================================================================
# LANGGRAPH AGENT STRUCTURED OUTPUT MODELS
# ============================================================================

class RuleMatch(BaseModel):
    """Individual fraud rule that was matched."""
    rule_id: str = Field(..., description="Unique rule identifier")
    rule_name: str = Field(..., description="Human-readable rule name")
    description: str = Field(..., description="Detailed rule description")
    risk_level: Optional[str] = Field(None, description="Rule risk level (Low, Medium, High, Critical)")
    category: Optional[str] = Field(None, description="Rule category (e.g., AML, Sanctions, Behavioral)")
    match_score: float = Field(..., description="Relevance score (0-1)", ge=0, le=1)
    triggered: bool = Field(True, description="Whether this rule was triggered by the transaction")


class RiskScoreBreakdown(BaseModel):
    """Detailed breakdown of risk scoring components."""
    country_risk: float = Field(..., description="Country/destination risk score (0-1)", ge=0, le=1)
    amount_risk: float = Field(..., description="Transaction amount risk score (0-1)", ge=0, le=1)
    type_risk: float = Field(..., description="Transaction type risk score (0-1)", ge=0, le=1)
    composite_risk: float = Field(..., description="Overall composite risk score (0-1)", ge=0, le=1)
    risk_level: str = Field(..., description="Risk level classification", pattern="^(Low|Medium|High|Critical)$")
    confidence: float = Field(..., description="Confidence in risk assessment (0-1)", ge=0, le=1)


class BehavioralPattern(BaseModel):
    """Customer behavioral pattern analysis."""
    is_anomalous: bool = Field(..., description="Whether transaction shows anomalous behavior")
    anomaly_score: float = Field(..., description="Anomaly detection score (0-1)", ge=0, le=1)
    anomaly_level: str = Field(..., description="Anomaly severity", pattern="^(Low|Medium|High)$")
    anomalies_detected: List[str] = Field(..., description="List of specific behavioral anomalies found")
    deviation_from_average: float = Field(..., description="Percentage deviation from customer's average transaction")
    is_new_country: bool = Field(..., description="Whether destination is a new country for this customer")
    is_new_account: bool = Field(..., description="Whether customer account is new (< 90 days)")


class CustomerContext(BaseModel):
    """Customer historical context and profile."""
    customer_id: str = Field(..., description="Unique customer identifier")
    account_age_days: int = Field(..., description="Age of customer account in days")
    total_transactions: int = Field(..., description="Total number of historical transactions")
    average_transaction_amount: float = Field(..., description="Customer's average transaction amount")
    max_transaction_amount: float = Field(..., description="Customer's maximum previous transaction amount")
    previous_countries: List[str] = Field(..., description="List of countries customer has transacted with")
    previous_fraud_flags: int = Field(..., description="Number of previous fraud flags")
    risk_profile: str = Field(..., description="Overall customer risk profile", pattern="^(Low|Medium|High)$")
    kyc_status: str = Field(..., description="KYC verification status")


class ComplianceAssessment(BaseModel):
    """Regulatory compliance assessment."""
    compliance_risk_level: str = Field(..., description="Overall compliance risk", pattern="^(Low|Medium|High|Critical)$")
    aml_threshold_exceeded: bool = Field(..., description="Whether AML reporting threshold exceeded")
    edd_required: bool = Field(..., description="Whether Enhanced Due Diligence is required")
    sanctions_screening_required: bool = Field(..., description="Whether sanctions screening is required")
    travel_rule_applicable: bool = Field(..., description="Whether Travel Rule applies")
    compliance_flags: List[str] = Field(..., description="List of compliance issues identified")
    required_actions: List[str] = Field(..., description="Required compliance actions")
    regulatory_deadline: Optional[str] = Field(None, description="Deadline for regulatory action (if applicable)")


class InvestigationGuidance(BaseModel):
    """Specific guidance for fraud analysts."""
    priority_level: str = Field(..., description="Investigation priority", pattern="^(Low|Medium|High|Critical)$")
    estimated_investigation_time: str = Field(..., description="Estimated time to investigate (e.g., '15-30 minutes')")
    key_questions: List[str] = Field(..., description="Key questions analyst should answer")
    data_to_verify: List[str] = Field(..., description="Specific data points to verify")
    red_flags: List[str] = Field(..., description="Critical red flags to investigate")
    recommended_next_steps: List[str] = Field(..., description="Concrete next steps for the analyst")
    escalation_criteria: List[str] = Field(..., description="Criteria that warrant immediate escalation")


class ConfidenceMetrics(BaseModel):
    """Confidence metrics for the analysis."""
    overall_confidence: float = Field(..., description="Overall confidence in analysis (0-1)", ge=0, le=1)
    data_completeness: float = Field(..., description="Completeness of available data (0-1)", ge=0, le=1)
    rule_match_confidence: float = Field(..., description="Confidence in rule matching (0-1)", ge=0, le=1)
    behavioral_analysis_confidence: float = Field(..., description="Confidence in behavioral analysis (0-1)", ge=0, le=1)
    risk_score_confidence: float = Field(..., description="Confidence in risk scoring (0-1)", ge=0, le=1)


class LangGraphFraudAnalysis(BaseModel):
    """Comprehensive structured output from LangGraph fraud detection agent."""
    
    # Executive Summary
    summary: str = Field(..., description="Executive summary of the fraud analysis in 2-3 sentences")
    recommended_action: str = Field(
        ..., 
        description="Primary recommended action",
        pattern="^(Block Transaction|Escalate Immediately|Investigate Further|Request Additional Information|Approve with Monitoring|Reject)$"
    )
    urgency: str = Field(..., description="Urgency level", pattern="^(Low|Medium|High|Critical)$")
    
    # Risk Assessment
    risk_assessment: RiskScoreBreakdown = Field(..., description="Detailed risk score breakdown")
    
    # Rules Analysis
    matched_rules: List[RuleMatch] = Field(..., description="Fraud rules matched by this transaction")
    total_rules_matched: int = Field(..., description="Total number of rules matched")
    highest_risk_rule: Optional[str] = Field(None, description="Name of the highest risk rule matched")
    
    # Customer & Behavioral Analysis
    customer_context: Optional[CustomerContext] = Field(None, description="Customer historical context (if available)")
    behavioral_analysis: Optional[BehavioralPattern] = Field(None, description="Behavioral pattern analysis (if available)")
    
    # Compliance
    compliance: ComplianceAssessment = Field(..., description="Regulatory compliance assessment")
    
    # Analyst Guidance
    investigation_guidance: InvestigationGuidance = Field(..., description="Specific guidance for fraud analysts")
    
    # Detailed Risk Explanation
    risk_explanation: str = Field(..., description="Detailed explanation of why this transaction is flagged")
    implied_risks: List[str] = Field(..., description="Potential financial, regulatory, and reputational risks")
    
    # Confidence & Metadata
    confidence_metrics: ConfidenceMetrics = Field(..., description="Confidence in analysis components")
    tools_used: List[str] = Field(..., description="List of tools used in analysis")
    analysis_timestamp: str = Field(..., description="ISO timestamp of when analysis was performed")
    
    # Supporting Evidence
    supporting_evidence: List[str] = Field(..., description="Key evidence supporting the recommendation")
    mitigating_factors: List[str] = Field(default_factory=list, description="Factors that reduce concern")
    
    # Model Configuration
    model_config = {
        "json_schema_extra": {
            "example": {
                "summary": "High-risk transaction: $50,000 wire transfer to unknown country from new customer with no transaction history.",
                "recommended_action": "Escalate Immediately",
                "urgency": "Critical",
                "risk_assessment": {
                    "country_risk": 0.95,
                    "amount_risk": 0.75,
                    "type_risk": 0.70,
                    "composite_risk": 0.82,
                    "risk_level": "Critical",
                    "confidence": 0.88
                },
                "total_rules_matched": 3,
                "tools_used": ["kb_tool", "historical_data_tool", "risk_scoring_tool", "behavioral_analysis_tool", "compliance_check_tool"]
            }
        }
    }
