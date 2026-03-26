import coreApi, { bankingApi as api } from '../client';

export const cardsApi = {
  // List cards for a specific client account
  getByAccount: (clientId, accountNumber) =>
    api.get(`/clients/${clientId}/accounts/${accountNumber}/cards`),

  // Request new card (triggers OTP)
  request: (data) => api.post('/cards/request', data),

  // Confirm card request with OTP code
  confirmRequest: (data) => api.post('/cards/request/confirm', data),

  // Change card limits
  changeLimits: (cardId, data) => api.put(`/cards/${cardId}/limits`, data),

  // Block/unblock/deactivate (backend uses PUT)
  block:      (cardId) => api.put(`/cards/${cardId}/block`),
  unblock:    (cardId) => api.put(`/cards/${cardId}/unblock`),
  deactivate: (cardId) => api.put(`/cards/${cardId}/deactivate`),

  // Admin Request Endpoints
  getRequests: () => coreApi.get('/cards/requests'),
  approveRequest: (id) => coreApi.post(`/cards/requests/${id}/approve`),
  rejectRequest: (id) => coreApi.post(`/cards/requests/${id}/reject`),
};
