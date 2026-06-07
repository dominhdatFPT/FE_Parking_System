import { useCallback, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { loginApi } from '../services/authApi';

function readStoredUser() {
  const rawUser = localStorage.getItem(STORAGE_KEYS.USER);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem(STORAGE_KEYS.USER);
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError('');

    try {
      const data = await loginApi({ email, password });
      const nextToken = data.token || data.accessToken;
      const nextUser = data.user || { email, fullName: data.fullName || 'Admin' };

      if (!nextToken) {
        throw new Error('Missing access token');
      }

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, nextToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(nextUser));
      setToken(nextToken);
      setUser(nextUser);

      return data;
    } catch (err) {
      setError('Email hoặc mật khẩu không chính xác.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
  }, []);

  return useMemo(
    () => ({
      error,
      isAuthenticated: Boolean(token),
      loading,
      login,
      logout,
      token,
      user,
    }),
    [error, loading, login, logout, token, user],
  );
}
