import api from '../client';

export const exchangeApi = {
    getRates: () => api.get('/exchange/rates'),


    convert: ({ amount, fromCurrency, toCurrency }) =>
        api.post('/exchange/convert', { amount, fromCurrency, toCurrency }),
};