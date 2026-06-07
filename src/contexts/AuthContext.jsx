import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(undefined);

// Bật cờ này thành true để bỏ qua bước đăng nhập trong quá trình code/test API
const DEV_MODE_BYPASS_AUTH = true;

const DEFAULT_USER = {
    id: 'dev-bypass',
    email: 'dev@parking.ai',
    fullName: 'Developer Mode',
    role: 'admin',
};

function readInitialUser() {
    if (typeof window === 'undefined')
        return DEV_MODE_BYPASS_AUTH ? DEFAULT_USER : null;
    const stored = window.localStorage.getItem('smart-parking-user');
    if (!stored || stored === 'null' || stored === 'undefined')
        return DEV_MODE_BYPASS_AUTH ? DEFAULT_USER : null;
    try {
        const parsed = JSON.parse(stored);
        return parsed ? parsed : (DEV_MODE_BYPASS_AUTH ? DEFAULT_USER : null);
    }
    catch {
        return DEV_MODE_BYPASS_AUTH ? DEFAULT_USER : null;
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
