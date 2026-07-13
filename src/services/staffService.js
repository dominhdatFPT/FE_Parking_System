import { apiClient } from './apiClient';

const unwrapList = (response) => {
  const payload = response.data?.data ?? response.data;
  if (Array.isArray(payload?.content)) return payload.content;
  return Array.isArray(payload) ? payload : [];
};

const unwrapData = (response) => response.data?.data ?? response.data;

const VEHICLE_TYPE_ID = {
  MOTORBIKE: 1,
  CAR: 2,
};

const normalizeVehicleTypeCode = (value) => {
  const normalized = String(value || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim();

  if (normalized === '2') return 'CAR';
  if (normalized === '1') return 'MOTORBIKE';
  if (
    normalized === 'CAR'
    || normalized.includes('AUTO')
    || normalized.includes('O TO')
    || normalized.includes('OTO')
  ) {
    return 'CAR';
  }
  if (
    normalized === 'MOTORBIKE'
    || normalized.includes('MOTOR')
    || normalized.includes('MOTO')
    || normalized.includes('BIKE')
    || normalized.includes('XE MAY')
  ) {
    return 'MOTORBIKE';
  }

  return 'CAR';
};

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

export const getParkingSessions = async (params = {}) => {
  const response = await apiClient.get('/api/v1/staff/parking-sessions', { params });
  return unwrapList(response);
};

export const checkParkingEntry = async (licensePlate, vehicleType = null) => {
  const payload = { licensePlate };
  if (vehicleType) {
    const vehicleTypeCode = normalizeVehicleTypeCode(vehicleType);
    payload.vehicleType = vehicleTypeCode;
    payload.vehicleTypeCode = vehicleTypeCode;
    payload.vehicleTypeId = VEHICLE_TYPE_ID[vehicleTypeCode];
  }
  const response = await apiClient.post('/api/v1/parking-entry/check', payload);
  return unwrapData(response);
};

export const confirmParkingEntry = async (entry) => {
  const vehicleTypeCode = normalizeVehicleTypeCode(
    entry.vehicleTypeCode || entry.vehicleType || entry.vehicleTypeId,
  );
  const response = await apiClient.post('/api/v1/parking-entry/confirm', {
    licensePlate: entry.licensePlate,
    vehicleType: vehicleTypeCode,
    vehicleTypeCode,
    vehicleTypeId: VEHICLE_TYPE_ID[vehicleTypeCode],
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
