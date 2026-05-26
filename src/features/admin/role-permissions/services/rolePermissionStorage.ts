import { defaultRolePermissions, defaultRoles, defaultUsers } from '../data';
import type { Role, RolePermissionSet, SecurityLog, UserRoleAssignment } from '../types';

const ROLES_KEY = 'parking_roles';
const PERMISSIONS_KEY = 'parking_role_permissions';
const USERS_KEY = 'parking_user_role_assignments';
const SECURITY_LOG_KEY = 'parking_security_logs';

function readJson<T>(key: string, fallback: T): T {
  const rawValue = window.localStorage.getItem(key);
  return rawValue ? (JSON.parse(rawValue) as T) : fallback;
}

export function getStoredRoles(): Role[] {
  return readJson(ROLES_KEY, defaultRoles);
}

export function getStoredPermissions(): RolePermissionSet {
  return readJson(PERMISSIONS_KEY, defaultRolePermissions);
}

export function getStoredUsers(): UserRoleAssignment[] {
  return readJson(USERS_KEY, defaultUsers);
}

export function getSecurityLogs(): SecurityLog[] {
  return readJson(SECURITY_LOG_KEY, []);
}

export function saveRolePermissionState(
  roles: Role[],
  permissions: RolePermissionSet,
  users: UserRoleAssignment[],
) {
  window.localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
  window.localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function writeSecurityLog(log: Omit<SecurityLog, 'id' | 'createdAt'>) {
  const nextLog: SecurityLog = {
    ...log,
    id: `log-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  window.localStorage.setItem(SECURITY_LOG_KEY, JSON.stringify([nextLog, ...getSecurityLogs()].slice(0, 30)));
}
