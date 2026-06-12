import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const parkingMapService = {
  /**
   * Get parking structure by facility ID
   * @param {number} facilityId - Parking facility ID
   * @returns {Promise} Array of floors with slots
   */
  getParkingMap: async (facilityId) => {
    try {
      const response = await api.get(
        `/api/v1/parking-map/facility/${facilityId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching parking map:', error);
      throw error;
    }
  },

  /**
   * Get all parking facilities
   * @returns {Promise} Array of facilities
   */
  getParkingFacilities: async () => {
    try {
      const response = await api.get('/api/v1/parking-facilities');
      return response.data;
    } catch (error) {
      console.error('Error fetching facilities:', error);
      throw error;
    }
  },

  /**
   * Get parking facility by ID
   * @param {number} facilityId - Parking facility ID
   * @returns {Promise} Facility details
   */
  getParkingFacilityById: async (facilityId) => {
    try {
      const response = await api.get(
        `/api/v1/parking-facilities/${facilityId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching facility:', error);
      throw error;
    }
  },

  /**
   * Get available slots for a specific floor
   * @param {number} facilityId - Parking facility ID
   * @param {number} floorId - Floor ID
   * @returns {Promise} Array of available slots
   */
  getAvailableSlots: async (facilityId, floorId) => {
    try {
      const response = await api.get('/api/v1/parking-slots', {
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

export default api;
