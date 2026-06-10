import React, { useEffect, useMemo, useState } from 'react';
import { ThemeContext } from './ThemeContextCore';
function getInitialTheme() {
    if (typeof window === 'undefined')
        return 'light';
    const stored = window.localStorage.getItem('smart-parking-theme');
    if (stored === 'dark' || stored === 'light')
        return stored;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);
    useEffect(() => {
        if (typeof document === 'undefined')
            return;
        document.documentElement.classList.toggle('dark', theme === 'dark');
        window.localStorage.setItem('smart-parking-theme', theme);
    }, [theme]);
    const value = useMemo(() => ({
        theme,
        toggleTheme: () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
        setTheme,
    }), [theme]);
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
