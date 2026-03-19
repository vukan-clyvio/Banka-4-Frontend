import { bankingApi as api } from '../client';

export const transfersApi = {
  // Get transfer history for a client (paginated)
  getHistory: (clientId, params) => api.get(`/clients/${clientId}/transfers`, { params }),

  // Execute internal transfer: { from_account, to_account, amount }
  execute: (clientId, data) => api.post(`/clients/${clientId}/transfers`, data),
};
