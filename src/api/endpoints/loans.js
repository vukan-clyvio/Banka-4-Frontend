import { bankingApi as api } from '../client';

export const loansApi = {
  // Client: list their loans (sortable by amount: asc/desc)
  getMyLoans:    (clientId, params) => api.get(`/clients/${clientId}/loans`, { params }),

  // Client: get loan details with repayment schedule
  getLoanById:   (clientId, loanId) => api.get(`/clients/${clientId}/loans/${loanId}`),

  // Client: submit loan request { account_number, amount, loan_type_id, repayment_period }
  createRequest: (clientId, data)   => api.post(`/clients/${clientId}/loans/request`, data),

  // Employee admin: list all loan requests (paginated)
  getRequests: (params) => api.get('/loan-requests', { params }),

  // Employee admin: approve / reject a loan request
  approve: (id) => api.patch(`/loan-requests/${id}/approve`),
  reject:  (id) => api.patch(`/loan-requests/${id}/reject`),
};
