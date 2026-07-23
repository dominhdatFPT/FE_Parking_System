import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';

const unwrapList = (response) => {
  const payload = response.data?.data ?? response.data;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.records)) return payload.records;
  if (Array.isArray(payload?.list)) return payload.list;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.orders)) return payload.orders;
  if (Array.isArray(payload?.parkingOrders)) return payload.parkingOrders;
  if (Array.isArray(payload?.sessions)) return payload.sessions;
  return Array.isArray(payload) ? payload : [];
};

export const getActiveParkingOrders = async () => {
  const response = await apiClient.get(API_ENDPOINTS.PARKING.ACTIVE_ORDERS);
  return unwrapList(response);
};
