export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/users/me',
    CHANGE_PASSWORD: '/users/me/change-password',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
    REACTIVATE: (id: string) => `/users/${id}/reactivate`,
    RESET_PASSWORD: (id: string) => `/users/${id}/reset-password`,
  },
  SECTORS: {
    BASE: '/sectors',
    BY_ID: (id: string) => `/sectors/${id}`,
  },
  TYPES: {
    BASE: '/types',
    BY_ID: (id: string) => `/types/${id}`,
  },
  ADMINISTRATIVE_LEVELS: {
    BASE: '/administrative-levels',
    BY_ID: (id: string) => `/administrative-levels/${id}`,
  },
  FREQUENCIES: {
    BASE: '/frequencies',
    BY_ID: (id: string) => `/frequencies/${id}`,
  },
  GENDERS: {
    BASE: '/genders',
    BY_ID: (id: string) => `/genders/${id}`,
  },
  AGE_GROUPS: {
    BASE: '/age-groups',
    BY_ID: (id: string) => `/age-groups/${id}`,
  },
  MSNP_INDICATORS: {
    BASE: '/msnp-indicators',
    BY_ID: (id: string) => `/msnp-indicators/${id}`,
  },
  ROLES: {
    BASE: '/roles',
    BY_ID: (id: string) => `/roles/${id}`,
  },
  PERMISSIONS: {
    BASE: '/permissions',
  },
  AUDIT_LOGS: {
    BASE: '/audit-logs',
    BY_ID: (id: string) => `/audit-logs/${id}`,
    METADATA: '/audit-logs/filters/metadata',
  },
} as const;
