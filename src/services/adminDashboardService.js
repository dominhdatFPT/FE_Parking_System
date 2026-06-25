import { apiClient } from './apiClient';

const unwrapList = (response) => {
  const payload = response.data?.data ?? response.data;
  return Array.isArray(payload) ? payload : [];
};

export const getAdminUsers = async () => {
  const response = await apiClient.get('/api/v1/users');
  return unwrapList(response);
};

export const getAdminParkingSlots = async () => {
  const response = await apiClient.get('/api/v1/parking-slots');
  return unwrapList(response);
};

export const getAdminDashboardData = async () => {
  const [usersResult, slotsResult] = await Promise.allSettled([
    getAdminUsers(),
    getAdminParkingSlots(),
  ]);

  return {
    users: usersResult.status === 'fulfilled' ? usersResult.value : [],
    slots: slotsResult.status === 'fulfilled' ? slotsResult.value : [],
    errors: {
      users: usersResult.status === 'rejected' ? usersResult.reason : null,
      slots: slotsResult.status === 'rejected' ? slotsResult.reason : null,
    },
  };
};
