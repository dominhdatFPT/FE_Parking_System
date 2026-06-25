import { apiClient } from './apiClient';

const unwrapList = (response) => {
  const payload = response.data?.data ?? response.data;
  if (Array.isArray(payload?.content)) return payload.content;
  return Array.isArray(payload) ? payload : [];
};

const unwrapData = (response) => response.data?.data ?? response.data;

export const getStaffBookings = async () => {
  const response = await apiClient.get('/api/v1/bookings');
  return unwrapList(response);
};

export const getPendingStaffBookings = async () => {
  const response = await apiClient.get('/api/v1/staff/bookings/pending');
  return unwrapList(response);
};

export const approveStaffBooking = async (id, note = '') => {
  const response = await apiClient.patch(`/api/v1/staff/bookings/${id}/approve`, { note });
  return response.data?.data ?? response.data;
};

export const rejectStaffBooking = async (id, note = '') => {
  const response = await apiClient.patch(`/api/v1/staff/bookings/${id}/reject`, { note });
  return response.data?.data ?? response.data;
};

export const getVehicleRegistrations = async (status = 'ALL') => {
  const params = { page: 0, size: 100 };
  if (status && status !== 'ALL') params.status = status;

  const response = await apiClient.get('/api/v1/vehicle-registrations', { params });
  return unwrapList(response);
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
  return response.data?.data ?? response.data;
};

export const getStaffParkingSlots = async () => {
  const response = await apiClient.get('/api/v1/parking-slots');
  return unwrapList(response);
};

export const getStaffParkingOperations = async () => {
  const response = await apiClient.get('/api/v1/staff/parking-operations');
  return response.data?.data ?? response.data ?? { facilities: [], floors: [], slots: [] };
};

export const getStaffOperationsDashboard = async () => {
  const response = await apiClient.get('/api/v1/staff/operations-dashboard');
  return response.data?.data ?? response.data;
};

export const updateStaffParkingSlot = async (slot) => {
  const response = await apiClient.put(`/api/v1/parking-slots/${slot.id}`, {
    slotNumber: slot.slotNumber,
    floor: slot.floor,
    status: slot.status,
  });
  return response.data?.data ?? response.data;
};

export const getStaffDashboardData = async () => {
  const [bookingsResult, pendingResult, slotsResult] = await Promise.allSettled([
    getStaffBookings(),
    getPendingStaffBookings(),
    getStaffParkingSlots(),
  ]);

  return {
    bookings: bookingsResult.status === 'fulfilled' ? bookingsResult.value : [],
    pendingBookings: pendingResult.status === 'fulfilled' ? pendingResult.value : [],
    slots: slotsResult.status === 'fulfilled' ? slotsResult.value : [],
    errors: {
      bookings: bookingsResult.status === 'rejected' ? bookingsResult.reason : null,
      pendingBookings: pendingResult.status === 'rejected' ? pendingResult.reason : null,
      slots: slotsResult.status === 'rejected' ? slotsResult.reason : null,
    },
  };
};
