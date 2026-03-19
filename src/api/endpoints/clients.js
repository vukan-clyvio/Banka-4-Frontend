import api from '../client';

export const clientsApi = {
  getAll:   (params)   => api.get('/clients', { params }),
  getById:  (id)       => api.get(`/clients/${id}`),
  create:   (data)     => api.post('/clients/register', data),
  update:   (id, data) => api.patch(`/clients/${id}`, data),
};
