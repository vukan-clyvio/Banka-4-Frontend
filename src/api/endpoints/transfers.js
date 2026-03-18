import api from '../client';

export const transfersApi = {

    getMyAccounts: () => api.get('/client/accounts'),           // ← potvrdi sa backendom tačan path ako nije ovaj

    getPreview: (data) =>
        api.post('/client/transfers/preview', data),             // { fromAccountId, toAccountId, amount }

    execute: (data) =>
        api.post('/client/transfers', data),                     // { fromAccountId, toAccountId, amount }


    getHistory: () => api.get('/client/transfers'),
};