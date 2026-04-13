import api from '../client';
import {tradingApi} from '../client';

const userNameCache = {};

export async function fetchUserName(userId) {
  if (!userId) return '—';
  if (userNameCache[userId] !== undefined) return userNameCache[userId];

  try {
    const res = await api.get('/clients', { params: { page: 1, page_size: 9999 } });
    const list = Array.isArray(res) ? res : (res?.data ?? []);
    const found = list.find(c =>
      String(c.id) === String(userId) ||
      String(c.user_id) === String(userId)
    );
    const name = found
      ? [found.first_name, found.last_name].filter(Boolean).join(' ') || found.name || '—'
      : '—';
    userNameCache[userId] = name;
    return name;
  } catch {
    userNameCache[userId] = '—';
    return '—';
  }
}

export const ordersApi = {
  getSupervisorOrders(params = {}) {
    return tradingApi.get('/orders', { params: { page: 1, page_size: 100, ...params } });
  },

  approveOrder(orderId) {
    return tradingApi.patch(`/orders/${orderId}/approve`);
  },

  declineOrder(orderId, payload = {}) {
    return tradingApi.patch(`/orders/${orderId}/decline`);
  },

  cancelOrder(orderId, payload = {}) {
    return tradingApi.patch(`/orders/${orderId}/cancel`);
  },
};