import api, { bankingApi } from '../client';

export const accountsApi = {
  getAll: (params) => bankingApi.get('/accounts', { params }),

  // ✅ traži klijenta na user servisu (8080)
  searchClient: (email) =>
      api.get('/clients', { params: { email, page: 1, page_size: 1 } }),

  // ✅ kreira račun na banking servisu (8081)
  create: (data) => bankingApi.post('/accounts', data),

  updateName: (clientId, accountNumber, name) =>
      bankingApi.put(`/clients/${clientId}/accounts/${accountNumber}/name`, { name }),

  requestLimitChange: (clientId, accountNumber, data) =>
      bankingApi.post(`/clients/${clientId}/accounts/${accountNumber}/limits/request`, data),

  confirmLimitChange: (clientId, accountNumber, data) =>
      bankingApi.put(`/clients/${clientId}/accounts/${accountNumber}/limits`, data),
};
