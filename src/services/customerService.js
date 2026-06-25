import { apiClient } from './apiClient';

const unwrap = (response) => response.data?.data ?? response.data;

const apiError = (error) => ({
  data: null,
  error,
  message: error?.response?.data?.message || error?.message || 'Không thể tải dữ liệu từ hệ thống',
});

export const customerService = {
  getNotifications: async () => {
    try {
      const response = await apiClient.get('/api/customer/notifications');
      return { data: unwrap(response) || [], error: null };
    } catch (error) {
      return { ...apiError(error), data: [] };
    }
  },

  markNotificationRead: async (id) => {
    try {
      await apiClient.patch(`/api/customer/notifications/${id}/read`);
      return { data: null, error: null };
    } catch (error) {
      return apiError(error);
    }
  },

  markAllNotificationsRead: async () => {
    try {
      await apiClient.patch('/api/customer/notifications/read-all');
      return { data: null, error: null };
    } catch (error) {
      return apiError(error);
    }
  },

  submitSupport: async (payload) => {
    try {
      const response = await apiClient.post('/api/customer/support', payload);
      return { data: unwrap(response), error: null };
    } catch (error) {
      return apiError(error);
    }
  },

  getMySupportRequests: async () => {
    try {
      const response = await apiClient.get('/api/customer/support/my');
      return { data: unwrap(response) || [], error: null };
    } catch (error) {
      return { ...apiError(error), data: [] };
    }
  },

  registerVehicleCard: async (payload) => {
    try {
      const response = await apiClient.post('/api/v1/vehicle-registrations', payload);
      return { data: unwrap(response), error: null };
    } catch (error) {
      return apiError(error);
    }
  },
};
