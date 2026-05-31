export const ROUTES = {
  HOME: '/',
  WELCOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ADMIN_LOGIN: '/admin/login',
  FORBIDDEN: '/403',

  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    ROLES: '/admin/roles',
    SYSTEM_CONFIG: '/admin/system-configuration',
    AUDIT_LOG: '/admin/audit-log',
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
    VEHICLE_ENTRY: '/staff/vehicle-entry',
    VEHICLE_EXIT: '/staff/vehicle-exit',
    SESSIONS: '/staff/sessions',
    EXCEPTIONS: '/staff/exceptions',
  },

  DRIVER: {
    HOME: '/driver',
    PARKING_INFO: '/driver/parking-info',
    RESERVATIONS: '/driver/reservations',
    ACTIVE_SESSION: '/driver/active-session',
    PAYMENTS: '/driver/payments',
    HISTORY: '/driver/history',
    PROFILE: '/driver/profile',
    SUPPORT: '/driver/support',
  },
} as const;
