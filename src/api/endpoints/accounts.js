import { bankingApi as api } from '../client';

export const accountsApi = {
  // Employee: list all accounts (paginated, filterable)
  getAll: (params) => api.get('/accounts', { params }),

  // Client: create new bank account
  create: (data) => api.post('/accounts', data),

  // Update account name
  updateName: (clientId, accountNumber, name) =>
    api.put(`/clients/${clientId}/accounts/${accountNumber}/name`, { name }),

  // Request limit change (sends OTP to client)
  requestLimitChange: (clientId, accountNumber, data) =>
    api.post(`/clients/${clientId}/accounts/${accountNumber}/limits/request`, data),

  // Confirm limit change with OTP code
  confirmLimitChange: (clientId, accountNumber, data) =>
    api.put(`/clients/${clientId}/accounts/${accountNumber}/limits`, data),
};
