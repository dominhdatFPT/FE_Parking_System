import { apiClient } from './apiClient';

const STORAGE_KEYS = {
  BOOKINGS: 'sp_driver_bookings',
  PAYMENTS: 'sp_driver_payments',
  NOTIFICATIONS: 'sp_driver_notifications',
};

const MOCK_PARKING_AREAS = [
  {
    id: 'PA001',
    name: 'SmartParking Nguyễn Văn Linh',
    address: '123 Nguyễn Văn Linh, Q.7, TP.HCM',
    totalFloors: 4,
    totalSlots: 200,
    availableSlots: 67,
    status: 'OPEN',
    image: null,
    floors: [
      { floorNumber: 1, totalSlots: 50, availableSlots: 12 },
      { floorNumber: 2, totalSlots: 50, availableSlots: 18 },
      { floorNumber: 3, totalSlots: 50, availableSlots: 22 },
      { floorNumber: 4, totalSlots: 50, availableSlots: 15 },
    ],
  },
  {
    id: 'PA002',
    name: 'SmartParking Lê Văn Sỹ',
    address: '456 Lê Văn Sỹ, Q.3, TP.HCM',
    totalFloors: 3,
    totalSlots: 150,
    availableSlots: 0,
    status: 'FULL',
    image: null,
    floors: [
      { floorNumber: 1, totalSlots: 50, availableSlots: 0 },
      { floorNumber: 2, totalSlots: 50, availableSlots: 0 },
      { floorNumber: 3, totalSlots: 50, availableSlots: 0 },
    ],
  },
  {
    id: 'PA003',
    name: 'SmartParking Phạm Văn Đồng',
    address: '789 Phạm Văn Đồng, Q. Bình Thạnh, TP.HCM',
    totalFloors: 5,
    totalSlots: 300,
    availableSlots: 124,
    status: 'OPEN',
    image: null,
    floors: [
      { floorNumber: 1, totalSlots: 60, availableSlots: 30 },
      { floorNumber: 2, totalSlots: 60, availableSlots: 25 },
      { floorNumber: 3, totalSlots: 60, availableSlots: 28 },
      { floorNumber: 4, totalSlots: 60, availableSlots: 21 },
      { floorNumber: 5, totalSlots: 60, availableSlots: 20 },
    ],
  },
];

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

function getInitialBookings() {
  const stored = loadFromStorage(STORAGE_KEYS.BOOKINGS, null);
  if (stored && stored.length > 0) return stored;

  const now = Date.now();
  return [
    {
      id: 'BK0001',
      vehicleType: 'CAR',
      parkingAreaId: 'PA001',
      parkingAreaName: 'SmartParking Nguyễn Văn Linh',
      floorNumber: 2,
      status: 'CONFIRMED',
      createdAt: new Date(now - 86400000 * 2).toISOString(),
      updatedAt: new Date(now - 86400000 * 1).toISOString(),
    },
    {
      id: 'BK0002',
      vehicleType: 'MOTORBIKE',
      parkingAreaId: 'PA003',
      parkingAreaName: 'SmartParking Phạm Văn Đồng',
      floorNumber: 3,
      status: 'PENDING',
      createdAt: new Date(now - 3600000).toISOString(),
      updatedAt: new Date(now - 3600000).toISOString(),
    },
    {
      id: 'BK0003',
      vehicleType: 'CAR',
      parkingAreaId: 'PA001',
      parkingAreaName: 'SmartParking Nguyễn Văn Linh',
      floorNumber: 1,
      status: 'REJECTED',
      createdAt: new Date(now - 86400000 * 5).toISOString(),
      updatedAt: new Date(now - 86400000 * 4).toISOString(),
    },
  ];
}

function getInitialPayments() {
  const stored = loadFromStorage(STORAGE_KEYS.PAYMENTS, null);
  if (stored && stored.length > 0) return stored;

  const now = Date.now();
  return [
    {
      id: 'PAY0001',
      bookingId: 'BK0001',
      amount: 45000,
      method: 'MoMo',
      status: 'PAID',
      description: 'Phí gửi xe - SmartParking Nguyễn Văn Linh',
      createdAt: new Date(now - 86400000 * 1).toISOString(),
    },
    {
      id: 'PAY0002',
      bookingId: 'BK0003',
      amount: 30000,
      method: 'VNPay',
      status: 'FAILED',
      description: 'Phí gửi xe - SmartParking Nguyễn Văn Linh',
      createdAt: new Date(now - 86400000 * 4).toISOString(),
    },
  ];
}

function getInitialNotifications() {
  const stored = loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, null);
  if (stored && stored.length > 0) return stored;

  const now = Date.now();
  return [
    {
      id: 'N001',
      type: 'success',
      title: 'Chào mừng đến SmartParking',
      message: 'Hệ thống sẵn sàng phục vụ. Bạn có thể bắt đầu đặt chỗ ngay!',
      time: new Date(now - 86400000 * 3).toISOString(),
      read: true,
    },
    {
      id: 'N002',
      type: 'info',
      title: 'Booking đã được xác nhận',
      message: 'Booking #BK0001 tại SmartParking Nguyễn Văn Linh đã được staff xác nhận.',
      time: new Date(now - 86400000 * 1).toISOString(),
      read: true,
    },
    {
      id: 'N003',
      type: 'warning',
      title: 'Nhắc nhở thanh toán',
      message: 'Vui lòng hoàn tất thanh toán cho booking #BK0002 trước khi check-in.',
      time: new Date(now - 7200000).toISOString(),
      read: false,
    },
    {
      id: 'N004',
      type: 'error',
      title: 'Booking bị từ chối',
      message: 'Booking #BK0003 đã bị từ chối. Vui lòng chọn bãi xe khác.',
      time: new Date(now - 86400000 * 4).toISOString(),
      read: false,
    },
  ];
}

let bookings = getInitialBookings();
let payments = getInitialPayments();
let notifications = getInitialNotifications();
let bookingCounter = bookings.length + 1;
let notifCounter = notifications.length + 1;

function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function addNotification(type, title, message) {
  const notif = {
    id: `N${String(notifCounter++).padStart(3, '0')}`,
    type,
    title,
    message,
    time: new Date().toISOString(),
    read: false,
  };
  notifications = [notif, ...notifications];
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  return notif;
}

export const bookingService = {
  getParkingAreas: async () => {
    try {
      const response = await apiClient.get('/api/v1/parking-area-summary');
      return { data: response.data?.data || response.data || [], error: null };
    } catch {
      await delay(300);
      return { data: MOCK_PARKING_AREAS, error: null };
    }
  },

  getFloorsByArea: async (areaId) => {
    try {
      const response = await apiClient.get(`/api/v1/parking-area-summary/${areaId}/floors`);
      return { data: response.data?.data || [], error: null };
    } catch {
      await delay(200);
      const area = MOCK_PARKING_AREAS.find((a) => a.id === areaId);
      return { data: area?.floors || [], error: null };
    }
  },

  getSlotsByFloor: async (areaId, floorNumber) => {
    try {
      const response = await apiClient.get('/api/v1/parking-slots', {
        params: { buildingCode: areaId, floorNumber },
      });
      return { data: response.data?.data || [], error: null };
    } catch {
      await delay(300);
      const area = MOCK_PARKING_AREAS.find((a) => a.id === areaId);
      const floor = area?.floors.find((f) => f.floorNumber === floorNumber);
      const slots = [];
      if (floor) {
        for (let i = 1; i <= Math.min(floor.totalSlots, 24); i++) {
          slots.push({
            slotId: `${areaId}-F${floorNumber}-S${String(i).padStart(3, '0')}`,
            slotCode: `${String.fromCharCode(64 + ((i - 1) % 4) + 1)}${String(Math.ceil(i / 4)).padStart(2, '0')}`,
            floor: floorNumber,
            status: i <= floor.availableSlots ? 'AVAILABLE' : 'OCCUPIED',
          });
        }
      }
      return { data: slots, error: null };
    }
  },

  createBooking: async (payload) => {
    try {
      const response = await apiClient.post('/api/customer/bookings', payload);
      return { data: response.data?.data || response.data, error: null };
    } catch {
      await delay(700);
      const area = MOCK_PARKING_AREAS.find((a) => a.id === payload.parkingAreaId);
      const newBooking = {
        id: `BK${String(bookingCounter++).padStart(4, '0')}`,
        vehicleType: payload.vehicleType,
        parkingAreaId: payload.parkingAreaId,
        parkingAreaName: area?.name || 'Bãi xe',
        floorNumber: payload.floorNumber,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      bookings = [newBooking, ...bookings];
      saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);

      addNotification(
        'info',
        'Booking request đã gửi',
        `Yêu cầu đặt chỗ tại ${newBooking.parkingAreaName} tầng ${newBooking.floorNumber} đang chờ nhân viên xác nhận.`
      );

      return { data: newBooking, error: null };
    }
  },

  getMyBookings: async () => {
    try {
      const response = await apiClient.get('/api/customer/bookings');
      return { data: response.data?.data || [], error: null };
    } catch {
      await delay(300);
      return { data: [...bookings], error: null };
    }
  },

  getBookingById: async (id) => {
    await delay(200);
    const booking = bookings.find((b) => b.id === id);
    return { data: booking || null, error: booking ? null : 'Not found' };
  },

  cancelBooking: async (id) => {
    await delay(400);
    bookings = bookings.map((b) =>
      b.id === id ? { ...b, status: 'CANCELLED', updatedAt: new Date().toISOString() } : b
    );
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    addNotification('warning', 'Booking đã hủy', `Booking #${id} đã được hủy.`);
    return { data: bookings.find((b) => b.id === id), error: null };
  },

  getNotifications: async () => {
    try {
      const response = await apiClient.get('/api/customer/notifications');
      return { data: response.data?.data || [], error: null };
    } catch {
      await delay(200);
      return { data: [...notifications], error: null };
    }
  },

  markNotificationRead: async (id) => {
    await delay(100);
    notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return { data: null, error: null };
  },

  markAllNotificationsRead: async () => {
    await delay(100);
    notifications = notifications.map((n) => ({ ...n, read: true }));
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return { data: null, error: null };
  },

  getPayments: async () => {
    try {
      const response = await apiClient.get('/api/customer/payments');
      return { data: response.data?.data || [], error: null };
    } catch {
      await delay(300);
      return { data: [...payments], error: null };
    }
  },

  createPayment: async (payload) => {
    await delay(600);
    const newPayment = {
      id: `PAY${String(payments.length + 1).padStart(4, '0')}`,
      bookingId: payload.bookingId,
      amount: payload.amount,
      method: payload.method || 'MoMo',
      status: 'PAID',
      description: payload.description || 'Thanh toán booking',
      createdAt: new Date().toISOString(),
    };
    payments = [newPayment, ...payments];
    saveToStorage(STORAGE_KEYS.PAYMENTS, payments);

    addNotification('success', 'Thanh toán thành công', `Đã thanh toán ${newPayment.amount.toLocaleString('vi-VN')} VNĐ cho booking #${newPayment.bookingId}.`);

    return { data: newPayment, error: null };
  },

  getDashboardSummary: async () => {
    try {
      const response = await apiClient.get('/api/customer/dashboard/summary');
      return { data: response.data?.data || {}, error: null };
    } catch {
      await delay(300);
      return {
        data: {
          openParkingLots: MOCK_PARKING_AREAS.filter((a) => a.status === 'OPEN').length,
          availableSlots: MOCK_PARKING_AREAS.reduce((sum, a) => sum + a.availableSlots, 0),
          pendingBookings: bookings.filter((b) => b.status === 'PENDING').length,
          confirmedBookings: bookings.filter((b) => b.status === 'CONFIRMED').length,
        },
        error: null,
      };
    }
  },

  submitSupport: async (payload) => {
    await delay(600);
    addNotification('info', 'Yêu cầu hỗ trợ đã gửi', `Chủ đề: ${payload.subject}. Đội ngũ hỗ trợ sẽ phản hồi trong 24h.`);
    return { data: { id: 'SUP001', ...payload, status: 'SUBMITTED', createdAt: new Date().toISOString() }, error: null };
  },

  resetData: () => {
    bookings = getInitialBookings();
    payments = getInitialPayments();
    notifications = getInitialNotifications();
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    saveToStorage(STORAGE_KEYS.PAYMENTS, payments);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },
};
