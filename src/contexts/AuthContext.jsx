import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContextCore';

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

    useEffect(() => {
        const rememberMe = window.localStorage.getItem('rememberMe') === 'true';
        
        if (user) {
            if (rememberMe) {
                window.localStorage.setItem('smart-parking-user', JSON.stringify(user));
                window.sessionStorage.removeItem('smart-parking-user');
            } else {
                window.sessionStorage.setItem('smart-parking-user', JSON.stringify(user));
                window.localStorage.removeItem('smart-parking-user');
            }
        } else {
            window.localStorage.removeItem('smart-parking-user');
            window.sessionStorage.removeItem('smart-parking-user');
            window.localStorage.removeItem('rememberMe');
        }
    }, [user]);

    const setRole = useCallback((nextRole) => {
        if (!user) return;
        setUser((currentUser) => ({ ...currentUser, role: nextRole }));
    }, [user]);

    const value = useMemo(() => ({ 
        user, 
        role: user?.role, 
        setUser, 
        setRole,
        isAuthenticated: !!user 
    }), [user, setRole]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

