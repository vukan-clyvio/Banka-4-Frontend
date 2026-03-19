import { bankingApi as api } from '../client';

export const paymentsApi = {
  // List all payments for a client (filterable: status, start_date, end_date, min_amount, max_amount, page, page_size)
  getAll:   (clientId, params) => api.get(`/clients/${clientId}/payments`, { params }),

  // Get single payment details
  getById:  (clientId, id)     => api.get(`/clients/${clientId}/payments/${id}`),

  // Create new payment
  create:   (clientId, data)   => api.post(`/clients/${clientId}/payments`, data),

  // Verify payment with OTP code
  verify:   (clientId, id, data) => api.post(`/clients/${clientId}/payments/${id}/verify`, data),

  // Download payment receipt (PDF)
  receipt:  (clientId, id)     => api.get(`/clients/${clientId}/payments/${id}/receipt`, { responseType: 'blob' }),

  // List payments for a specific account
  getByAccount: (clientId, accountNumber, params) =>
    api.get(`/clients/${clientId}/accounts/${accountNumber}/payments`, { params }),
};
