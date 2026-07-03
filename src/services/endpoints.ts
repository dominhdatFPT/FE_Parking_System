export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    GOOGLE_LOGIN: '/api/v1/auth/google-login',
    REGISTER: '/api/v1/auth/register',
    REFRESH_TOKEN: '/api/v1/auth/refresh-token',
    LOGOUT: '/api/v1/auth/logout',
  },
  PARKING: {
    SLOTS: '/api/v1/parking-slots',
  },
  FEE: {
    PACKAGES: '/api/v1/fee-packages',
    MY_VEHICLES: '/api/v1/fee-subscriptions/my-vehicles',
    SUBSCRIPTIONS: '/api/v1/fee-subscriptions',
    MY_SUBSCRIPTIONS: '/api/subscriptions/my',
    MY_INVOICES: '/api/subscriptions/my-invoices',
    REGISTER: '/api/subscriptions/register',
  },
  PAYMENTS: {
    VNPAY_ORDER_STATUS: (txnRef: string) => `/api/payments/vnpay/orders/${txnRef}/status`,
    VNPAY_CANCEL: (txnRef: string) => `/api/payments/vnpay/orders/${txnRef}/cancel`,
  },
  ADMIN_NOTIFICATIONS: {
    BASE: '/api/v1/admin/notifications',
    SEND: (id: string | number) => `/api/v1/admin/notifications/${id}/send`,
    DETAIL: (id: string | number) => `/api/v1/admin/notifications/${id}`,
  },
  ACCOUNTS: {
    USERS: '/api/v1/admin/accounts/users',
    EMPLOYEES: '/api/v1/admin/accounts/employees',
    USER_STATUS: (userId: string | number) => `/api/v1/admin/accounts/users/${userId}/status`,
    USER_ROLE: (userId: string | number) => `/api/v1/admin/accounts/users/${userId}/role`,
  },
  VEHICLE_REGISTRATIONS: {
    CREATE_FOR_USER: (userId: string | number) => `/api/v1/vehicle-registrations/users/${userId}`,
  },
  NOTIFICATIONS: {
    LIST: '/api/v1/notifications',
    DETAIL: (id: number | string) => `/api/v1/notifications/${id}`,
    REGISTER_TOKEN: '/api/v1/notifications/register-token',
  },
} as const;
