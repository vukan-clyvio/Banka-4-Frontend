import api from '../client';

export const employeesApi = {
  getAll: (params) => api.get('/employees', { params }),
  getById:         (id)        => api.get(`/${id}`),
  update:          (id, data)  => api.patch(`/${id}`, data),
  remove:          (id)        => api.delete(`/${id}`),
  changePassword:  (data)      => api.post('/change-password', data),
};
