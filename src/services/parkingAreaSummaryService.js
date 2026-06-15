import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const parkingAreaSummaryService = {
  getAreas: async ({ buildingCode, floorNumber } = {}) => {
    const params = {};

    if (buildingCode) {
      params.buildingCode = buildingCode;
    }

    const parsedFloor = Number(floorNumber);
    if (Number.isFinite(parsedFloor)) {
      params.floorNumber = parsedFloor;
    }

    try {
      const response = await api.get('/api/v1/parking-area-summary', { params });
      return {
        data: Array.isArray(response.data) ? response.data : [],
        error: null,
      };
    } catch (error) {
      const url = '/api/v1/parking-area-summary';
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.warn('[parkingAreaSummaryService]', { url, params, status, message: responseData?.message || error.message });
      return { data: [], error };
    }
  },
};
