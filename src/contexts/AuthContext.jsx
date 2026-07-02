import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContextCore';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { clearAuthStorage } from '../services/apiClient';
import { logoutSession, refreshSession } from '../services/modules/authService';
import { registerDeviceTokenForCurrentUser } from '../utils/deviceTokenRegistration';

function readInitialUser() {
    if (typeof window === 'undefined') return null;

    const sessionStored = window.sessionStorage.getItem('smart-parking-user');
    if (sessionStored && sessionStored !== 'null' && sessionStored !== 'undefined') {
        try {
            return JSON.parse(sessionStored);
        } catch {
            window.sessionStorage.removeItem('smart-parking-user');
        }
    }

    const localStored = window.localStorage.getItem('smart-parking-user');
    if (localStored && localStored !== 'null' && localStored !== 'undefined') {
        try {
            return JSON.parse(localStored);
        } catch {
            window.localStorage.removeItem('smart-parking-user');
        }
    }

    return null;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(readInitialUser);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function restoreSessionFromCookie() {
            if (readInitialUser()) {
                setAuthReady(true);
                return;
            }

            try {
                const response = await refreshSession();
                if (cancelled || !response?.token) return;

                const restoredUser = {
                    id: response.user?.id ?? response.userId,
                    fullName: response.user?.fullName ?? response.fullName ?? response.user?.name ?? 'Người dùng',
                    email: response.user?.email ?? response.email ?? '',
                    role: response.user?.role ?? response.role ?? 'driver',
                    avatarUrl: response.user?.avatarUrl ?? response.avatarUrl ?? '',
                };

                window.sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);
                window.sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(restoredUser));
                window.sessionStorage.setItem('smart-parking-user', JSON.stringify(restoredUser));
                window.localStorage.setItem('rememberMe', 'true');
                window.localStorage.setItem('smart-parking-user', JSON.stringify(restoredUser));
                setUser(restoredUser);
            } catch {
                clearAuthStorage();
            } finally {
                if (!cancelled) {
                    setAuthReady(true);
                }
            }
        }

        restoreSessionFromCookie();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const rememberMe = window.localStorage.getItem('rememberMe') === 'true';

        if (user) {
            window.sessionStorage.setItem('smart-parking-user', JSON.stringify(user));
            if (rememberMe) {
                window.localStorage.setItem('smart-parking-user', JSON.stringify(user));
            } else {
                window.localStorage.removeItem('smart-parking-user');
            }
            registerDeviceTokenForCurrentUser();
        }
    }, [user]);

    const logout = useCallback(async () => {
        try {
            await logoutSession();
        } catch {
            // Local cleanup still needs to happen if the server session already expired.
        } finally {
            clearAuthStorage();
            setUser(null);
        }
    }, []);

    const setRole = useCallback((nextRole) => {
        if (!user) return;
        setUser((currentUser) => ({ ...currentUser, role: nextRole }));
    }, [user]);

    const value = useMemo(() => ({ 
        user, 
        role: user?.role, 
        setUser, 
        setRole,
        logout,
        isAuthenticated: !!user,
        isAuthLoading: !authReady,
    }), [user, setRole, logout, authReady]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
