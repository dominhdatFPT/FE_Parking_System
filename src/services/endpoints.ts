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
    REGISTER: '/api/subscriptions/register-stripe',
    INVOICE_STRIPE: (invoiceId: string | number) => `/api/subscriptions/invoices/${invoiceId}/stripe`,
    CANCEL_SUBSCRIPTION: (subscriptionId: string | number) => `/api/subscriptions/${subscriptionId}/cancel`,
  },
  PAYMENTS: {
    STRIPE_ORDER_STATUS: (paymentIntentId: string) => `/api/payments/stripe/orders/${paymentIntentId}/status`,
    STRIPE_ORDER_CONFIRM: (paymentIntentId: string) => `/api/payments/stripe/orders/${paymentIntentId}/confirm`,
  },
  VISITOR_CHECKOUT: {
    LOOKUP: '/api/v1/visitor-checkout/lookup',
    STRIPE: '/api/v1/visitor-checkout/stripe',
    STRIPE_CONFIRM: (paymentIntentId: string) => `/api/v1/visitor-checkout/stripe/${paymentIntentId}/confirm`,
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
  PRICING: {
    PACKAGES: '/api/v1/admin/pricing/packages',
    PACKAGE_PRICE: (feePackageId: string | number) => `/api/v1/admin/pricing/packages/${feePackageId}/price`,
    PACKAGE_TOGGLE: (feePackageId: string | number) => `/api/v1/admin/pricing/packages/${feePackageId}/toggle`,
    VISITOR_RATES: '/api/v1/admin/pricing/visitor-rates',
    VISITOR_RATE: (vehicleTypeId: string | number) => `/api/v1/admin/pricing/visitor-rates/${vehicleTypeId}`,
  },
  NOTIFICATIONS: {
    LIST: '/api/v1/notifications',
    DETAIL: (id: number | string) => `/api/v1/notifications/${id}`,
    REGISTER_TOKEN: '/api/v1/notifications/register-token',
  },
  PROFILE: {
    VERIFY_PASSWORD: '/api/v1/profile/verify-password',
    CHANGE_PASSWORD: '/api/v1/profile/change-password',
  },
} as const;
