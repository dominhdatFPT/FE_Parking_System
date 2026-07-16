import { AuthProvider } from '../contexts/AuthContext';
import { SystemRulesProvider } from '../contexts/SystemRulesContext';
import { ThemeProvider } from '../contexts/ThemeContext';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SystemRulesProvider>{children}</SystemRulesProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
