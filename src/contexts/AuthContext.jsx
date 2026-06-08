import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContextCore';

function readInitialUser() {
    if (typeof window === 'undefined')
        return null;
    const stored = window.localStorage.getItem('smart-parking-user');
    if (!stored || stored === 'null' || stored === 'undefined')
        return null;
    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(readInitialUser);

    useEffect(() => {
        if (user) {
            window.localStorage.setItem('smart-parking-user', JSON.stringify(user));
        } else {
            window.localStorage.removeItem('smart-parking-user');
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

