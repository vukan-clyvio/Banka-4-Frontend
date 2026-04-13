import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const AUTH_BASE = import.meta.env.VITE_API_URL.replace(/\/$/, '');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const bankingApi = axios.create({
  baseURL: import.meta.env.VITE_BANKING_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const tradingApi = axios.create({
  baseURL: import.meta.env.VITE_TRADING_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

function attachToken(config) {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}

api.interceptors.request.use(attachToken);
bankingApi.interceptors.request.use(attachToken);
tradingApi.interceptors.request.use(attachToken);

let refreshPromise = null;

function doRefresh() {
  if (refreshPromise) return refreshPromise;

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken || refreshToken === 'undefined') {
    useAuthStore.getState().logout();
    window.location.href = '/login';
    return Promise.reject(new Error('No refresh token'));
  }

  refreshPromise = axios
    .post(`${AUTH_BASE}/auth/refresh`, { refresh_token: refreshToken })
    .then(res => {
      const newToken   = res.data.token;
      const newRefresh = res.data.refresh_token || refreshToken;
      const currentUser = useAuthStore.getState().user;
      useAuthStore.getState().setAuth(currentUser, newToken, newRefresh);
      return newToken;
    })
    .catch(err => {
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(err);
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

function attachRetry(axiosInstance) {
  return async err => {
    const original = err.config;
    if (err.response?.status !== 401 || original._retry) {
      return Promise.reject(err.response?.data ?? err);
    }
    const authPaths = ['/login', '/refresh', '/activate', '/reset-password', '/forgot-password', '/register'];
    if (authPaths.some(p => original.url?.includes(p))) {
      return Promise.reject(err.response?.data ?? err);
    }
    original._retry = true;
    try {
      const newToken = await doRefresh();
      original.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(original);
    } catch (refreshErr) {
      return Promise.reject(refreshErr);
    }
  };
}

api.interceptors.response.use(res => res.data, attachRetry(api));
bankingApi.interceptors.response.use(res => res.data, attachRetry(bankingApi));
tradingApi.interceptors.response.use(res => res.data, attachRetry(tradingApi));

export default api;

