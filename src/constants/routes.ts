export const ROUTES = {
  HOME: '/',
  WELCOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SIGNUP: '/signup',
  ADMIN_LOGIN: '/admin/login',
  FORBIDDEN: '/403',

  ADMIN: {
    DASHBOARD: '/admin',
    VEHICLE_ENTRY: '/admin/vehicle-entry',
    VEHICLE_EXIT: '/admin/vehicle-exit',
    PARKING_SESSIONS: '/admin/parking-sessions',
    USERS: '/admin/users',
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

  SETTINGS: {
    BASE: '/settings',
    PROFILE: '/settings/profile',
    PASSWORD: '/settings/password',
    NOTIFICATIONS: '/settings/notifications',
    LANGUAGE: '/settings/language',
    SYSTEM: '/settings/system',
    PERMISSIONS: '/settings/permissions',
    SECURITY_LOGS: '/settings/security-logs',
  },

  MANAGER: {
    DASHBOARD: '/manager',
    BUILDINGS: '/manager/buildings',
    VEHICLE_TYPES: '/manager/vehicle-types',
    FLOORS_ZONES: '/manager/floors-zones',
    SLOTS: '/manager/slots',
    PRICING: '/manager/pricing',
    REPORTS: '/manager/reports',
    AI_OPTIMIZATION: '/manager/ai-optimization',
  },

  STAFF: {
    DASHBOARD: '/staff',
    VEHICLE_REGISTRATIONS: '/staff/vehicle-registrations',
    VEHICLE_ENTRY: '/staff/vehicle-entry',
    VEHICLE_EXIT: '/staff/vehicle-exit',
    SESSIONS: '/staff/sessions',
    EXCEPTIONS: '/staff/exceptions',
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
