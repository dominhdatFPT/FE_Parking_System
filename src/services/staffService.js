import { apiClient } from './apiClient';

const unwrapList = (response) => {
  const payload = response.data?.data ?? response.data;
  if (Array.isArray(payload?.content)) return payload.content;
  return Array.isArray(payload) ? payload : [];
};

const unwrapData = (response) => response.data?.data ?? response.data;

export const getVehicleRegistrations = async (status = 'ALL') => {
  const params = { page: 0, size: 10 };
  if (status && status !== 'ALL') params.status = status;

  const response = await apiClient.get('/api/v1/vehicle-registrations', { params });
  return unwrapList(response);
};

export const getVehicleRegistration = async (id) => {
  const response = await apiClient.get(`/api/v1/vehicle-registrations/${id}`);
  return unwrapData(response);
};

export const getPendingVehicleRegistrations = async () => {
  const response = await apiClient.get('/api/v1/vehicle-registrations/pending', {
    params: { page: 0, size: 100 },
  });
  return unwrapList(response);
};

export const reviewVehicleRegistration = async (id, status, rejectReason = '') => {
  const response = await apiClient.put(`/api/v1/vehicle-registrations/${id}/review`, {
    status,
    rejectReason,
  });
  return unwrapData(response);
};

export const deleteVehicleRegistration = async (id) => {
  const response = await apiClient.delete(`/api/v1/vehicle-registrations/${id}`);
  return unwrapData(response);
};

export const getStaffParkingSlots = async () => {
  const response = await apiClient.get('/api/v1/parking-slots');
  return unwrapList(response);
};

export const getStaffParkingOperations = async () => {
  const response = await apiClient.get('/api/v1/staff/parking-operations');
  return response.data?.data ?? response.data ?? { facilities: [], floors: [], slots: [] };
};

export const getStaffOperationsDashboard = async (date) => {
  const response = await apiClient.get('/api/v1/staff/operations-dashboard', {
    params: date ? { date } : undefined,
  });
  return response.data?.data ?? response.data;
};

export const getParkingSessions = async () => {
  const response = await apiClient.get('/api/v1/staff/parking-sessions');
  return unwrapList(response);
};

export const checkParkingEntry = async (licensePlate, vehicleType = null) => {
  const payload = { licensePlate };
  if (vehicleType) payload.vehicleType = vehicleType;
  const response = await apiClient.post('/api/v1/parking-entry/check', payload);
  return unwrapData(response);
};

export const confirmParkingEntry = async (entry) => {
  const response = await apiClient.post('/api/v1/parking-entry/confirm', {
    licensePlate: entry.licensePlate,
    vehicleType: entry.vehicleType,
    visitorCardCode: entry.entryType === 'VISITOR' ? entry.visitorCardCode : null,
  });
  return unwrapData(response);
};

export const checkParkingExit = async (licensePlate) => {
  const response = await apiClient.post('/api/v1/parking-exit/check', { licensePlate });
  return unwrapData(response);
};

export const confirmParkingExit = async (orderId, payload) => {
  const response = await apiClient.post(`/api/v1/parking-exit/${orderId}/confirm`, payload);
  return unwrapData(response);
};

export const updateStaffParkingSlot = async (slot) => {
  const response = await apiClient.put(`/api/v1/parking-slots/${slot.id}`, {
    slotNumber: slot.slotNumber,
    floor: slot.floor,
    status: slot.status,
  });
  return response.data?.data ?? response.data;
};
