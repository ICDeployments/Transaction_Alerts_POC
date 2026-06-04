import axios from 'axios';
import type {
  TransactionAnalysisRequest,
  TransactionAnalysisResponse,
  RuleRetrievalRequest,
  RuleRetrievalResponse,
} from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeTransaction = async (
  request: TransactionAnalysisRequest
): Promise<TransactionAnalysisResponse> => {
  const response = await api.post<TransactionAnalysisResponse>(
    '/analyze-transaction',
    request
  );
  return response.data;
};

export const retrieveRules = async (
  request: RuleRetrievalRequest
): Promise<RuleRetrievalResponse> => {
  const response = await api.post<RuleRetrievalResponse>(
    '/retrieve-rules',
    request
  );
  return response.data;
};

export const healthCheck = async (): Promise<any> => {
  const response = await api.get('/');
  return response.data;
};

export default api;
