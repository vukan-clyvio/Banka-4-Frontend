import api from '../client';

export const authApi = {

  login:          (data)  => api.post('/auth/login', data),
  register:       (data)  => api.post('/clients/register', data),
  activate:       (data)  => api.post('/auth/activate', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword:  (data)  => api.post('/auth/reset-password', data),
  refresh:        (refreshToken) => api.post('/auth/refresh', { refresh_token: refreshToken }),
};

