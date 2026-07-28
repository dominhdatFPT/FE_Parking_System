import { apiClient } from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';

export async function login(email, password, rememberMe = false) {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password, rememberMe });
  return response.data.data ?? response.data;
}

export async function refreshSession() {
  const response = await apiClient.post(
    API_ENDPOINTS.AUTH.REFRESH_TOKEN,
    undefined,
    { skipAuthRedirect: true, timeout: 8000 },
  );
  return response.data.data ?? response.data;
}

export async function logoutSession() {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  return response.data.data ?? response.data;
}
