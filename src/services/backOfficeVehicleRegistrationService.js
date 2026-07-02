import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';

const unwrap = (response) => response.data?.data ?? response.data;

export async function createVehicleRegistrationForUser(userId, payload) {
  const response = await apiClient.post(
    API_ENDPOINTS.VEHICLE_REGISTRATIONS.CREATE_FOR_USER(userId),
    payload,
  );
  return unwrap(response);
}

