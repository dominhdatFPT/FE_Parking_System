import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
const AuthContext = createContext(undefined);
const DEFAULT_USER = {
    id: 'u-001',
    fullName: 'Gia Võ',
    email: 'gia.vo@example.com',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=96&q=80',
};
function readInitialUser() {
    if (typeof window === 'undefined')
        return DEFAULT_USER;
    const stored = window.localStorage.getItem('smart-parking-user');
    if (!stored)
        return DEFAULT_USER;
    try {
        const parsed = JSON.parse(stored);
        return {
            ...DEFAULT_USER,
            ...parsed,
        };
    }
    catch {
        return DEFAULT_USER;
    }
}
export function AuthProvider({ children }) {
    const [user, setUser] = useState(readInitialUser);
    useEffect(() => {
        window.localStorage.setItem('smart-parking-user', JSON.stringify(user));
    }, [user]);
    const setRole = (nextRole) => {
        setUser((currentUser) => ({ ...currentUser, role: nextRole }));
    };
    const value = useMemo(() => ({ user, role: user.role, setUser, setRole }), [user]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
