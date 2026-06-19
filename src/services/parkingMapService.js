import { apiClient } from './apiClient';

export const parkingMapService = {
  getParkingMap: async (facilityId) => {
    try {
      const response = await apiClient.get(`/api/v1/parking-map/facility/${facilityId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching parking map:', error);
      throw error;
    }
  },

  getParkingFacilities: async () => {
    try {
      const response = await apiClient.get('/api/v1/parking-facilities');
      return response.data;
    } catch (error) {
      console.error('Error fetching facilities:', error);
      throw error;
    }
  },

  getParkingFacilityById: async (facilityId) => {
    try {
      const response = await apiClient.get(`/api/v1/parking-facilities/${facilityId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching facility:', error);
      throw error;
    }
  },

  getAvailableSlots: async (facilityId, floorId) => {
    try {
      const response = await apiClient.get('/api/v1/parking-slots', {
        params: {
          facilityId,
          floorId,
          status: 'AVAILABLE',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  },
};

export default apiClient;
