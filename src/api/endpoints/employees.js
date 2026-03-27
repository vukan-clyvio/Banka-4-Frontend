import api from '../client';

export const employeesApi = {
  getAll:   (params)   => api.get('/employees', { params }),
  getById:  (id)       => api.get(`/employees/${id}`),
  create:   (data)     => api.post('/employees/register', data),
  update:   (id, data) => api.patch(`/employees/${id}`, data),
  remove:   (id)       => api.delete(`/employees/${id}`),
};
