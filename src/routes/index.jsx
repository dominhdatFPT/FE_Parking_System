import { Navigate, Route, Routes } from 'react-router';
import { ROUTES } from '../constants/routes';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import WelcomePage from '../features/auth/pages/WelcomePage';
import AccountRecovery from '../features/auth/pages/AccountRecovery';
import ResetPassword from '../features/auth/pages/ResetPassword';
import SignupPage from '../features/auth/pages/SignupPage';
import AdminSignup from '../features/auth/pages/AdminSignup';
import NotFoundPage from '../features/auth/pages/NotFoundPage';

function RequireAuth({ children }) {
  const token = localStorage.getItem('access_token');

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<WelcomePage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.ADMIN_LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/recovery" element={<AccountRecovery />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.ADMIN.DASHBOARD}
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
