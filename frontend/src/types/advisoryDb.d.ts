export interface AdvisoryRecord {
    record_id: string;
    alert_id: string;
    investigation_started_at: string;
    investigation_completed_at?: string;
    last_updated_at: string;
    alert_details: {
        entity_name: string;
        customer_id: string;
        risk_score: number;
        alert_type: string;
        severity: string;
        status: string;
        age_days: number;
        sla_status?: string;
        assigned_to?: string;
        triggered_rules: string[];
    };
    transaction_details: {
        transaction_id: string;
        amount: number;
        currency: string;
        transaction_type?: string;
        transaction_date?: string;
        source_account?: string;
        destination_account?: string;
        destination_country?: string;
        merchant_name?: string;
        channel?: string;
    };
    ai_analysis: {
        recommendation?: string;
        confidence_score?: number;
        risk_factors?: string[];
        analysis_text?: string;
        implied_risks?: string[];
        analyst_considerations?: string[];
        generated_at?: string;
    };
    analyst_actions: Array<{
        action_type: string;
        action_label: string;
        new_status: string;
        comments: string;
        timestamp: string;
    }>;
    analyst_ai_feedback?: {
        agreed_with_ai: boolean;
        feedback_text?: string;
        timestamp?: string;
    };
    final_decision: {
        action_taken?: string;
        final_status?: string;
        resolution_time_minutes?: number;
        analyst_confidence?: number;
    };
    session_metadata: {
        tabs_visited: string[];
        time_spent_seconds: number;
        view_count: number;
    };
}
//# sourceMappingURL=advisoryDb.d.ts.map