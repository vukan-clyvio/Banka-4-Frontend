import { bankingApi } from '../client';
import api from '../client';

// NOTE: Recipient endpoints are not yet available in the backend.
// They are kept here as frontend-only stubs until the backend adds support.

export const clientApi = {
  // Get accounts for a specific client (banking service)
  getAccounts: (clientId) => bankingApi.get('/accounts', { params: { client_id: clientId } }),

  // Recipients (frontend-only — no backend endpoint yet)
  getRecipients:   ()          => api.get('/client/recipients'),
  createRecipient: (data)      => api.post('/client/recipients', data),
  updateRecipient: (id, data)  => api.put(`/client/recipients/${id}`, data),
  deleteRecipient: (id)        => api.delete(`/client/recipients/${id}`),
};
