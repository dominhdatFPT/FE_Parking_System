import { apiClient } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../services/endpoints';

export async function loginApi(credentials) {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  return response.data.data ?? response.data;
}

export async function refreshTokenApi() {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
  return response.data.data ?? response.data;
}

export async function logoutApi() {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  return response.data.data ?? response.data;
}

export async function googleLoginApi(idToken) {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, { idToken });
  return response.data.data ?? response.data;
}

export async function registerApi(payload) {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
  return response.data.data ?? response.data;
}
