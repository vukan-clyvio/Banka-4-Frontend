import { tradingApi as api } from '../client';

export const otcApi = {
  getContracts: () => api.get('/otc/contracts'),
};
  getMyNegotiations: ()              => api.get('/otc/offers/active'),
  acceptOffer:       (offerId, data) => api.patch(`/otc/offers/${offerId}/accept`, data ?? {}),
  rejectOffer:       (offerId, comment) => api.patch(`/otc/offers/${offerId}/reject`, comment ? { comment } : {}),
  sendCounterOffer:  (offerId, data) => api.put(`/otc/offers/${offerId}/counter`, data),
};
