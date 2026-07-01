import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';

const unwrapData = (response) => response.data?.data ?? response.data;

export const getAccountUsers = async ({ status, keyword, page = 0, size = 10 } = {}) => {
  const response = await apiClient.get(API_ENDPOINTS.ACCOUNTS.USERS, {
    params: {
      page,
      size,
      ...(status && status !== 'all' ? { status } : {}),
      ...(keyword ? { keyword } : {}),
    },
  });
  return unwrapData(response);
};

export const getAccountEmployees = async ({ role, status, keyword, page = 0, size = 10 } = {}) => {
  const response = await apiClient.get(API_ENDPOINTS.ACCOUNTS.EMPLOYEES, {
    params: {
      page,
      size,
      ...(role && role !== 'all' ? { role } : {}),
      ...(status && status !== 'all' ? { status } : {}),
      ...(keyword ? { keyword } : {}),
    },
  });
  return unwrapData(response);
};

export const toggleUserStatus = async (userId) => {
  const response = await apiClient.patch(API_ENDPOINTS.ACCOUNTS.USER_STATUS(userId));
  return unwrapData(response);
};

export const changeUserRole = async (userId, role) => {
  const response = await apiClient.patch(API_ENDPOINTS.ACCOUNTS.USER_ROLE(userId), { role });
  return unwrapData(response);
};

export const createAccountUser = async (payload) => {
  const response = await apiClient.post(API_ENDPOINTS.ACCOUNTS.USERS, payload);
  return unwrapData(response);
};
