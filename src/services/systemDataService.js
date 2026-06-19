import { apiClient } from './apiClient';

export const systemDataService = {
  async getConfiguration() {
    const response = await apiClient.get('/api/v1/system-configuration');
    return response.data;
  },
  async saveConfiguration(config) {
    const response = await apiClient.put('/api/v1/system-configuration', config);
    return response.data;
  },
  async getIncidents() {
    const response = await apiClient.get('/api/v1/incidents');
    return response.data;
  },
  async createIncident(payload) {
    const response = await apiClient.post('/api/v1/incidents', payload);
    return response.data;
  },
  async closeIncident(id, resolution) {
    const response = await apiClient.patch(`/api/v1/incidents/${id}/close`, { resolution });
    return response.data;
  },
  async getAuditLogs() {
    const response = await apiClient.get('/api/v1/audit-logs');
    return response.data;
  },
  async getMySubscriptions() {
    const response = await apiClient.get('/api/v1/fee-subscriptions/my');
    return response.data?.data ?? [];
  },
  async paySubscription(id) {
    const response = await apiClient.post(`/api/v1/fee-subscriptions/${id}/payment`);
    return response.data?.data;
  },
};
