import api from '../client';

export const cardsApi = {
  getAll:   (params)     => api.get('/cards', { params }),
  getById:  (id)         => api.get(`/cards/${id}`),

  unblock:  (id)         => api.patch(`/cards/${id}/unblock`),
};
