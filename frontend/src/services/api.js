import axios from 'axios';
const API_BASE_URL = '/api';
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const analyzeTransaction = async (request) => {
    const response = await api.post('/analyze-transaction', request);
    return response.data;
};
export const retrieveRules = async (request) => {
    const response = await api.post('/retrieve-rules', request);
    return response.data;
};
export const healthCheck = async () => {
    const response = await api.get('/');
    return response.data;
};
export default api;
//# sourceMappingURL=api.js.map