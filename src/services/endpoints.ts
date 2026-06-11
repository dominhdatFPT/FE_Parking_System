export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    GOOGLE_LOGIN: '/api/v1/auth/google-login',
    REGISTER: '/api/v1/auth/register',
  },
  PARKING: {
    ACTIVE_ORDERS: '/api/customer/parking-orders/active',
    SLOTS: '/api/v1/parking-slots',
  },
} as const;
