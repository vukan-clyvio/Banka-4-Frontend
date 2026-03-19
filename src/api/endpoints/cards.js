import { bankingApi as api } from '../client';

export const cardsApi = {
  // List cards for a specific client account
  getByAccount: (clientId, accountNumber) =>
    api.get(`/clients/${clientId}/accounts/${accountNumber}/cards`),

  // Request new card (triggers OTP)
  request: (data) => api.post('/cards/request', data),

  // Confirm card request with OTP code
  confirmRequest: (data) => api.post('/cards/request/confirm', data),

  // Block/unblock/deactivate (backend uses PUT)
  block:      (cardId) => api.put(`/cards/${cardId}/block`),
  unblock:    (cardId) => api.put(`/cards/${cardId}/unblock`),
  deactivate: (cardId) => api.put(`/cards/${cardId}/deactivate`),
};
