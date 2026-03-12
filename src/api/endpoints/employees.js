import api from '../client';

export const employeesApi = {
  getAll:          (params)    => api.get('', { params }),
  getById:         (id)        => api.get(`/${id}`),
  update:          (id, data)  => api.put(`/${id}`, data),
  remove:          (id)        => api.delete(`/${id}`),
  changePassword:  (data)      => api.post('/change-password', data),
};
