import { tradingApi as api } from '../client'; 

export const portfolioApi = {
  // GET http://rafsi.davidovic.io:8082/api/client/{clientId}/assets
  getClientPortfolio: (clientId) => api.get(`/client/${clientId}/assets`),

  // GET http://rafsi.davidovic.io:8082/api/actuary/{actId}/assets
  getActuaryPortfolio: (actId) => api.get(`/actuary/${actId}/assets`),

  exerciseOption: (actuaryId, assetId, accountNumber) =>
  api.post(`/api/actuary/${actuaryId}/options/${assetId}/exercise`, {
    account_number: accountNumber,
  }),

};