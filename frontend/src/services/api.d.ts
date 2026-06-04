import type { TransactionAnalysisRequest, TransactionAnalysisResponse, RuleRetrievalRequest, RuleRetrievalResponse } from '../types';
declare const api: import("axios").AxiosInstance;
export declare const analyzeTransaction: (request: TransactionAnalysisRequest) => Promise<TransactionAnalysisResponse>;
export declare const retrieveRules: (request: RuleRetrievalRequest) => Promise<RuleRetrievalResponse>;
export declare const healthCheck: () => Promise<any>;
export default api;
//# sourceMappingURL=api.d.ts.map