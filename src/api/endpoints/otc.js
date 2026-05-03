import { tradingApi as api } from '../client';

export const otcApi = {
  getContracts: () => api.get('/otc/contracts'),
};