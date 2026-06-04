// Transaction and Alert Types
export interface Transaction {
  // Required legacy fields (for backward compatibility and display)
  transaction_id: string;
  amount: number;
  currency: string;
  customer_id: string;
  
  // New Falcon scoring format (all optional)
  transactionId?: string;
  eventTimestamp?: string;
  card?: {
    panMasked: string;
    cardType: string;
    expiryDate: string;
    cardholderId: string;
  };
  transactionDetails?: {
    amount: number;
    currency: string;
    merchantCategoryCode: string;
    merchantName: string;
    merchantLocation: {
      city: string;
      state: string;
      country: string;
    };
    channel: string;
    entryMode: string;
    transactionType: string;
    isCardPresent: boolean;
    isPinAuthenticated: boolean;
  };
  customerContext?: {
    deviceId: string;
    ipAddress: string;
    geoLocation: {
      latitude: number;
      longitude: number;
    };
    previousTransactionsLast24h: number;
    averageTicketSize: number;
  };
  velocityIndicators?: {
    txnCountLast10Min: number;
    txnAmountLast10Min: number;
    crossBorderTxnInLastHour: boolean;
  };
  riskContext?: {
    channelRiskScore: number;
    merchantRiskScore: number;
    deviceRiskScore: number;
  };
  falconScoringRequest?: {
    modelVersion: string;
    scoreRequestId: string;
    requestType: string;
  };
  
  // Optional legacy format fields
  destination_country?: string;
  customer_name?: string;
  transaction_date?: string;
  transaction_type?: string;
  source_account?: string;
  destination_account?: string;
  originator?: string;
  beneficiary?: string;
  status?: 'Pending' | 'Flagged' | 'Escalated' | 'Closed';
}

export interface Alert {
  alert_id: string;
  transaction: Transaction;
  rule_ids: string[];
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  created_at: string;
  status: 'Open' | 'In Review' | 'Closed' | 'Escalated';
  assigned_to?: string;
  risk_score?: number;
  age_days?: number;
  sla_status?: 'On Time' | 'At Risk' | 'Overdue';
  alert_type?: string;
  entity_name?: string;
}

// API Request/Response Types
export interface TransactionAnalysisRequest {
  transaction_metadata: Record<string, any>;
  rule_details: string | string[];
}

export interface ConsiderationDetail {
  consideration: string;
  children: string[];
}

export interface FraudAnalysis {
  risk_explanation: string;
  implied_risks: string[];
  analyst_considerations: ConsiderationDetail[];
  recommended_action: 'Escalate' | 'Close' | 'Investigate Further';
}

export interface TransactionAnalysisResponse {
  analysis: FraudAnalysis;
  transaction_id?: string;
}

export interface RuleRetrievalRequest {
  transaction_context: string;
  top_k?: number;
}

export interface Rule {
  rule_id: string;
  rule_name: string;
  description: string;
  risk_level?: string;
  category?: string;
  score?: number;
}

export interface RuleRetrievalResponse {
  rules: Rule[];
  count: number;
}

// UI State Types
export interface AnalysisState {
  loading: boolean;
  data: TransactionAnalysisResponse | null;
  error: string | null;
}

export interface ActionDecision {
  alert_id: string;
  decision: 'Accept' | 'Reject';
  recommendation: string;
  analyst_notes?: string;
  timestamp: string;
}
