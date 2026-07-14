export const ROUTES = {
  HOME: '/',
  WELCOME: '/welcome',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SIGNUP: '/signup',
  ADMIN_LOGIN: '/admin/login',
  FORBIDDEN: '/403',
  VISITOR_CHECKOUT: '/checkout',

  ADMIN: {
    DASHBOARD: '/admin',
    VEHICLE_ENTRY: '/admin/vehicle-entry',
    VEHICLE_EXIT: '/admin/vehicle-exit',
    PARKING_SESSIONS: '/admin/parking-sessions',
    USERS: '/admin/users',
    USER_VEHICLE_REGISTRATION: '/admin/user-vehicle-registration',
    ROLES: '/admin/roles',
    SYSTEM_CONFIG: '/admin/system-configuration',
    AUDIT_LOG: '/admin/audit-log',
    NOTIFICATIONS: {
      BASE: '/admin/notifications',
      DETAIL: '/admin/notifications/:id',
    },
  },

  NOTIFICATIONS: {
    BASE: '/notifications',
    DETAIL: '/notifications/:id',
  },


  STAFF: {
    DASHBOARD: '/staff',
    VEHICLE_REGISTRATIONS: '/staff/vehicle-registrations',
    VEHICLE_ENTRY: '/staff/vehicle-entry',
    VEHICLE_EXIT: '/staff/vehicle-exit',
    SESSIONS: '/staff/sessions',
    EXCEPTIONS: '/staff/exceptions',
    BOOKINGS: '/staff/bookings',
  },

  DRIVER: {
    DASHBOARD: '/driver-dashboard',
    PAYMENT: '/driver-payment',
    NOTIFICATIONS: '/driver-notifications',
    SUPPORT: '/driver-support',
    PROFILE: '/driver-profile',
    VEHICLE_REGISTRATION: '/driver-vehicle-registration',
    FEE_PLANS: '/driver-fee-plans',
  },

  SUBSCRIPTION: {
    RESULT: '/subscription/result',
  },
} as const;
