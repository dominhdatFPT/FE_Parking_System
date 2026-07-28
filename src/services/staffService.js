import { apiClient } from './apiClient';

const unwrapList = (response) => {
  const payload = response.data?.data ?? response.data;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.records)) return payload.records;
  if (Array.isArray(payload?.list)) return payload.list;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.parkingSessions)) return payload.parkingSessions;
  if (Array.isArray(payload?.sessions)) return payload.sessions;
  if (Array.isArray(payload?.orders)) return payload.orders;
  if (Array.isArray(payload?.recentVehicleActivities)) return payload.recentVehicleActivities;
  return Array.isArray(payload) ? payload : [];
};

const unwrapData = (response) => response.data?.data ?? response.data;

const unwrapParkingSessions = (response) => {
  const payload = response.data?.data ?? response.data;
  if (Array.isArray(payload?.recentVehicleActivities)) return payload.recentVehicleActivities;
  return unwrapList(response);
};

const VEHICLE_TYPE_ID = {
  MOTORBIKE: 1,
  CAR: 2,
};

const KNOWN_VEHICLE_CODES = new Map([
  ['MOTORBIKE', 'MOTORBIKE'],
  ['CAR', 'CAR'],
  ['1', 'MOTORBIKE'],
  ['2', 'CAR'],
]);

function normalizeVehicleTypeCode(value) {
  if (value && typeof value === 'object') {
    value = value.code || value.vehicleTypeCode || '';
  }
  const normalized = String(value || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim();

  const known = KNOWN_VEHICLE_CODES.get(normalized);
  if (known) return known;

  if (normalized.includes('AUTO') || normalized.includes('O TO') || normalized.includes('OTO')) {
    return 'CAR';
  }
  if (normalized.includes('MOTOR') || normalized.includes('MOTO') || normalized.includes('BIKE') || normalized.includes('XE MAY')) {
    return 'MOTORBIKE';
  }
  return '';
}

const getVehicleTypeCode = (value) => {
  return normalizeVehicleTypeCode(value);
};

const getVehicleTypeId = (value, vehicleTypeCode) => {
  if (value && typeof value === 'object') {
    const explicitId = Number(value.vehicleTypeId ?? (value.code ? value.id : undefined));
    if (Number.isFinite(explicitId) && explicitId > 0) return explicitId;
  }

  return VEHICLE_TYPE_ID[vehicleTypeCode];
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

export const approveStaffBooking = async (id, staffNote = '') => {
  const response = await apiClient.put(`/api/v1/bookings/${id}/approve`, {
    staffNote,
  });
  return unwrapData(response);
};

export const rejectStaffBooking = async (id, staffNote = '') => {
  const response = await apiClient.put(`/api/v1/bookings/${id}/reject`, {
    staffNote,
    rejectReason: staffNote,
  });
  return unwrapData(response);
};

export const deleteVehicleRegistration = async (id) => {
  const requests = [
    () => apiClient.delete(`/api/v1/vehicle-registrations/${id}`),
    () => apiClient.delete(`/api/v1/admin/vehicle-registrations/${id}`),
    () => apiClient.patch(`/api/v1/vehicle-registrations/${id}/soft-delete`),
    () => apiClient.patch(`/api/v1/admin/vehicle-registrations/${id}/soft-delete`),
  ];

  let lastError = null;
  for (const request of requests) {
    try {
      const response = await request();
      return unwrapData(response);
    } catch (error) {
      lastError = error;
      const status = error.response?.status;
      if (![403, 404, 405].includes(status)) throw error;
    }
  }

  throw lastError;
};

export const cancelVehicleSubscription = async (subscriptionId) => {
  const requests = [
    () => apiClient.patch(`/api/v1/admin/accounts/subscriptions/${subscriptionId}/cancel`),
    () => apiClient.patch(`/api/subscriptions/${subscriptionId}/cancel`),
    () => apiClient.patch(`/api/v1/fee-subscriptions/${subscriptionId}/cancel`),
  ];

  let lastError = null;
  for (const request of requests) {
    try {
      const response = await request();
      return unwrapData(response);
    } catch (error) {
      lastError = error;
      const status = error.response?.status;
      if (![403, 404, 405].includes(status)) throw error;
    }
  }

  throw lastError;
};

export const deleteRegisteredVehicle = async (vehicleId) => {
  const requests = [
    () => apiClient.delete(`/api/v1/vehicles/${vehicleId}`),
    () => apiClient.delete(`/api/v1/admin/vehicles/${vehicleId}`),
    () => apiClient.delete(`/api/v1/admin/accounts/vehicles/${vehicleId}`),
  ];

  let lastError = null;
  for (const request of requests) {
    try {
      const response = await request();
      return unwrapData(response);
    } catch (error) {
      lastError = error;
      const status = error.response?.status;
      if (![403, 404, 405].includes(status)) throw error;
    }
  }

  throw lastError;
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
  const requests = [
    () => apiClient.get('/api/v1/staff/parking-sessions', { params }).then(unwrapParkingSessions),
    () => apiClient.get('/api/v1/staff/operations-dashboard').then(unwrapParkingSessions),
    () => apiClient.get('/api/v1/parking-orders/active', { params }).then(unwrapParkingSessions),
    () => apiClient.get('/api/customer/parking-orders/active', { params }).then(unwrapParkingSessions),
  ];

  let lastError = null;
  let hasSuccessfulRequest = false;
  for (const request of requests) {
    try {
      const items = await request();
      hasSuccessfulRequest = true;
      if (items.length > 0) return items;
    } catch (error) {
      lastError = error;
    }
  }

  if (!hasSuccessfulRequest && lastError) throw lastError;
  return [];
};

export const checkParkingEntry = async (licensePlate, vehicleType = null) => {
  const payload = { licensePlate };
  if (vehicleType) {
    const vehicleTypeCode = getVehicleTypeCode(vehicleType);
    if (vehicleTypeCode) {
      payload.vehicleType = vehicleTypeCode;
      payload.vehicleTypeCode = vehicleTypeCode;
      payload.vehicleTypeId = getVehicleTypeId(vehicleType, vehicleTypeCode);
    }
  }
  console.log('[HTTP check] sending payload:', JSON.stringify(payload));
  const response = await apiClient.post('/api/v1/parking-entry/check', payload);
  return unwrapData(response);
};

export const confirmParkingEntry = async (entry) => {
  const vehicleTypeCode = getVehicleTypeCode(entry);
  const response = await apiClient.post('/api/v1/parking-entry/confirm', {
    licensePlate: entry.licensePlate,
    vehicleType: vehicleTypeCode,
    vehicleTypeCode,
    vehicleTypeId: getVehicleTypeId(entry, vehicleTypeCode),
    visitorCardCode: entry.entryType === 'VISITOR' ? entry.visitorCardCode : null,
    entryImage: entry.entryImage || null,
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
