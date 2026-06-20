export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    GOOGLE_LOGIN: '/api/v1/auth/google-login',
    REGISTER: '/api/v1/auth/register',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    VERIFY_RESET_OTP: '/api/v1/auth/verify-reset-otp',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
  },
  PARKING: {
    ACTIVE_ORDERS: '/api/customer/parking-orders/active',
    SLOTS: '/api/v1/parking-slots',
  },
  FEE: {
    PACKAGES: '/api/v1/fee-packages',
    MY_VEHICLES: '/api/v1/fee-subscriptions/my-vehicles',
    SUBSCRIPTIONS: '/api/v1/fee-subscriptions',
    MY_INVOICES: '/api/subscriptions/my-invoices',
    REGISTER: '/api/subscriptions/register',
  },
  PAYMENTS: {
    MOMO_ORDER_STATUS: (momoOrderId: string) => `/api/payments/momo-orders/${momoOrderId}/status`,
  },
} as const;
