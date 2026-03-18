import api from '../client';

export const accountsApi = {
  getMyAccounts:   ()              => api.get('/accounts'),
  getById:         (id)            => api.get(`/accounts/${id}`),
  getTransactions: (accountId)     => api.get(`/accounts/${accountId}/transactions`),
  updateName:      (id, name)      => api.patch(`/accounts/${id}`, { name }),
  updateLimits:    (id, data)      => api.patch(`/accounts/${id}`, data),
  createPayment:   (data)          => api.post('/payments', data),
};
