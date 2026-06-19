import { apiClient } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../services/endpoints';

export async function loginApi(credentials) {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
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

export async function requestPasswordResetApi(email) {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  return response.data.data ?? response.data;
}

export async function verifyResetOtpApi(payload) {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_RESET_OTP, payload);
  return response.data.data ?? response.data;
}

export async function resetPasswordApi(payload) {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
  return response.data.data ?? response.data;
}
