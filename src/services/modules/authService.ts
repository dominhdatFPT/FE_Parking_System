import { apiClient } from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';

export async function login(email: string, password: string) {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
  return response.data.data;
}