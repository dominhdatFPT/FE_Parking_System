import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(undefined);

function readInitialUser() {
    if (typeof window === 'undefined')
        return null;
    const stored = window.localStorage.getItem('smart-parking-user');
    if (!stored)
        return null;
    try {
        return JSON.parse(stored);
    }
    catch {
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

    const setRole = (nextRole) => {
        if (!user) return;
        setUser((currentUser) => ({ ...currentUser, role: nextRole }));
    };

    const value = useMemo(() => ({ 
        user, 
        role: user?.role, 
        setUser, 
        setRole,
        isAuthenticated: !!user 
    }), [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
