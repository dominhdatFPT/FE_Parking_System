import axios from 'axios';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { API_ENDPOINTS } from './endpoints';
import { normalizeApiDateTimes } from '../utils/dateTime';

const apiBaseURL = import.meta.env.VITE_API_BASE_URL || '';

export const apiClient = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function clearAuthStorage() {
  sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.USER);
  sessionStorage.removeItem('smart-parking-user');
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('smart-parking-user');
  localStorage.removeItem('rememberMe');
}

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken() {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
  const data = response.data.data ?? response.data;
  const token = data.token ?? data.accessToken;

  if (!token) {
    throw new Error('No access token returned from refresh endpoint');
  }

  sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  return token;
}

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    || localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    response.data = normalizeApiDateTimes(response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest) {
      const retryRequest = originalRequest as typeof originalRequest & { _retry?: boolean };
      const authRequest = originalRequest as typeof originalRequest & { skipAuthRedirect?: boolean };
      const requestUrl = originalRequest.url || '';
      const isRefreshRequest = requestUrl.includes(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
      const isLoginRequest = requestUrl.includes(API_ENDPOINTS.AUTH.LOGIN)
        || requestUrl.includes(API_ENDPOINTS.AUTH.GOOGLE_LOGIN);
      const isLogoutRequest = requestUrl.includes(API_ENDPOINTS.AUTH.LOGOUT);

      if (isLoginRequest) {
        return Promise.reject(error);
      }

      if (isRefreshRequest || isLogoutRequest || retryRequest._retry) {
        clearAuthStorage();
        if (!authRequest.skipAuthRedirect) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      retryRequest._retry = true;

      try {
        refreshPromise = refreshPromise ?? refreshAccessToken();
        const token = await refreshPromise;
        refreshPromise = null;

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
        clearAuthStorage();
        if (!authRequest.skipAuthRedirect) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
