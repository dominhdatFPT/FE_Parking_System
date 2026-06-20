import { apiClient } from './apiClient';

const unwrap = (response) => response.data?.data ?? response.data;

export const incidentService = {
  getAll: async () => unwrap(await apiClient.get('/api/v1/incidents')) || [],
  reply: async (id, payload) => unwrap(await apiClient.patch(`/api/v1/incidents/${id}/reply`, payload)),
};
