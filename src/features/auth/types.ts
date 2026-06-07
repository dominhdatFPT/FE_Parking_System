export type AuthUserRole = 'admin' | 'staff' | 'manager' | 'driver';

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: AuthUserRole;
  avatarUrl?: string;
};
