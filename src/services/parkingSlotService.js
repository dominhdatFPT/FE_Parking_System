import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';

export const getParkingSlots = async () => {
  const response = await apiClient.get(API_ENDPOINTS.PARKING.SLOTS);
  return response.data?.data || response.data || [];
};
