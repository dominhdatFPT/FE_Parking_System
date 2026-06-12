import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';

export const getActiveParkingOrders = async () => {
  const response = await apiClient.get(API_ENDPOINTS.PARKING.ACTIVE_ORDERS);
  return response.data?.data || [];
};
