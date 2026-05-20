import type { AuthUser } from '../features/auth';

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
};

export const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
};
