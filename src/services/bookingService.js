import { apiClient } from './apiClient';

let parkingOperationsCache = null;

const unwrap = (response) => response.data?.data ?? response.data;

const apiError = (error) => ({
  data: null,
  error,
  message: error?.response?.data?.message || error?.message || 'Không thể tải dữ liệu từ hệ thống',
});

const normalizeBooking = (booking) => ({
  ...booking,
  id: String(booking.id),
  parkingAreaId: booking.parkingId,
  parkingAreaName: booking.parkingName || '—',
  floorNumber: booking.floorName || booking.floorId || '—',
  vehicleType: String(booking.vehicleTypeName || '').toUpperCase().includes('MOTOR') ? 'MOTORBIKE' : 'CAR',
});

async function getParkingOperations() {
  const response = await apiClient.get('/api/v1/staff/parking-operations');
  parkingOperationsCache = unwrap(response) || { facilities: [], floors: [], slots: [] };
  return parkingOperationsCache;
}

async function getVehicleTypes() {
  const response = await apiClient.get('/api/v1/vehicle-types');
  return unwrap(response) || [];
}

export const bookingService = {
  getParkingAreas: async () => {
    try {
      const operations = await getParkingOperations();
      const areas = (operations.facilities || []).map((facility) => {
        const slots = (operations.slots || []).filter((slot) => slot.facilityId === facility.id);
        const availableSlots = slots.filter((slot) => slot.status === 'AVAILABLE').length;
        return {
          id: facility.id,
          name: facility.name,
          address: '',
          totalSlots: slots.length,
          availableSlots,
          status: availableSlots > 0 ? 'OPEN' : 'FULL',
        };
      });
      return { data: areas, error: null };
    } catch (error) {
      return apiError(error);
    }
  },

  getFloorsByArea: async (areaId) => {
    try {
      const operations = parkingOperationsCache || await getParkingOperations();
      const floors = (operations.floors || [])
        .filter((floor) => floor.facilityId === Number(areaId))
        .map((floor) => {
          const slots = (operations.slots || []).filter((slot) => slot.floorId === floor.id);
          return {
            id: floor.id,
            floorNumber: floor.floorNumber,
            floorName: floor.floorName,
            availableSlots: slots.filter((slot) => slot.status === 'AVAILABLE').length,
            totalSlots: slots.length,
          };
        });
      return { data: floors, error: null };
    } catch (error) {
      return apiError(error);
    }
  },

  getSlotsByFloor: async (areaId, floorNumber) => {
    try {
      const operations = parkingOperationsCache || await getParkingOperations();
      return {
        data: (operations.slots || []).filter(
          (slot) => slot.facilityId === Number(areaId) && slot.floor === Number(floorNumber),
        ),
        error: null,
      };
    } catch (error) {
      return apiError(error);
    }
  },

  createBooking: async (payload) => {
    try {
      const operations = parkingOperationsCache || await getParkingOperations();
      const floor = (operations.floors || []).find(
        (item) => item.facilityId === Number(payload.parkingAreaId)
          && item.floorNumber === Number(payload.floorNumber),
      );
      const types = await getVehicleTypes();
      const vehicleType = types.find((type) =>
        String(type.typeCode || type.typeName || '').toUpperCase().includes(payload.vehicleType),
      );
      if (!floor || !vehicleType) {
        throw new Error('Không tìm thấy tầng hoặc loại xe tương ứng trong database');
      }
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
      const response = await apiClient.post('/api/v1/bookings', {
        parkingId: Number(payload.parkingAreaId),
        floorId: floor.id,
        vehicleTypeId: vehicleType.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });
      return { data: normalizeBooking(unwrap(response)), error: null };
    } catch (error) {
      return apiError(error);
    }
  },

  getMyBookings: async () => {
    try {
      const response = await apiClient.get('/api/v1/bookings/my-bookings');
      return { data: (unwrap(response) || []).map(normalizeBooking), error: null };
    } catch (error) {
      return apiError(error);
    }
  },

  getBookingById: async (id) => {
    try {
      const response = await apiClient.get(`/api/v1/bookings/${id}`);
      return { data: normalizeBooking(unwrap(response)), error: null };
    } catch (error) {
      return apiError(error);
    }
  },

  cancelBooking: async (id) => {
    try {
      await apiClient.delete(`/api/v1/bookings/${id}`);
      return { data: null, error: null };
    } catch (error) {
      return apiError(error);
    }
  },

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

  getPayments: async () => {
    try {
      const { data, error } = await bookingService.getMyBookings();
      if (error) return { data: [], error };
      return {
        data: data.filter((booking) => booking.paymentStatus === 'PAID').map((booking) => ({
          id: `BOOKING-${booking.id}`,
          bookingId: booking.id,
          amount: 0,
          method: 'SYSTEM',
          status: booking.paymentStatus,
          description: booking.parkingAreaName,
          createdAt: booking.paidAt || booking.updatedAt,
        })),
        error: null,
      };
    } catch (error) {
      return apiError(error);
    }
  },

  createPayment: async (payload) => {
    try {
      const response = await apiClient.post(`/api/v1/bookings/${payload.bookingId}/payment`, {
        paymentMethod: payload.method,
      });
      return { data: normalizeBooking(unwrap(response)), error: null };
    } catch (error) {
      return apiError(error);
    }
  },

  getDashboardSummary: async () => {
    try {
      const [{ data: areas, error: areaError }, { data: bookings, error: bookingError }] = await Promise.all([
        bookingService.getParkingAreas(), bookingService.getMyBookings(),
      ]);
      if (areaError || bookingError) throw areaError || bookingError;
      return {
        data: {
          openParkingLots: areas.filter((area) => area.status === 'OPEN').length,
          availableSlots: areas.reduce((sum, area) => sum + area.availableSlots, 0),
          pendingBookings: bookings.filter((booking) => booking.status === 'PENDING').length,
          confirmedBookings: bookings.filter((booking) => booking.status === 'CONFIRMED').length,
        },
        error: null,
      };
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

  registerVehicleCard: async (payload) => {
    try {
      const response = await apiClient.post('/api/v1/vehicle-registrations', payload);
      return { data: unwrap(response), error: null };
    } catch (error) {
      return apiError(error);
    }
  },
};
