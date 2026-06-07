import { apiClient } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../services/endpoints';

export async function loginApi(credentials) {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  return response.data;
}

export async function registerApi(payload) {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
  return response.data;
}
