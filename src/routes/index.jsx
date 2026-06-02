import { Navigate, Route, Routes } from 'react-router';
import { ROUTES } from '../constants/routes';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import HomePage from '../pages/HomePage';
import WelcomePage from '../features/auth/pages/WelcomePage';
import AccountRecovery from '../features/auth/pages/AccountRecovery';
import ResetPassword from '../features/auth/pages/ResetPassword';
import SignupPage from '../features/auth/pages/SignupPage';
import AdminSignup from '../features/auth/pages/AdminSignup';
import NotFoundPage from '../pages/NotFoundPage';
import AccountManagementPage from '../pages/AccountManagementPage';
import SettingsPage from '../pages/SettingsPage';
import NotificationDetailPage from '../pages/NotificationDetailPage';
import RolePermissionPage from '../features/admin/role-permissions/pages/RolePermissionPage';
import SystemConfigurationPage from '../pages/SystemConfigurationPage';
import AuditLogPage from '../pages/AuditLogPage';

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
      
      <Route element={<MainLayout />}>
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
        <Route path={ROUTES.ADMIN.USERS} element={<AccountManagementPage />}/>
        <Route path={ROUTES.ADMIN.ROLES} element={<RolePermissionPage />}/>
        <Route path={ROUTES.ADMIN.SYSTEM_CONFIG} element={<SystemConfigurationPage />}/>
        <Route path={ROUTES.ADMIN.AUDIT_LOG} element={<AuditLogPage />}/>
        <Route path={ROUTES.NOTIFICATIONS.DETAIL} element={<NotificationDetailPage />}/>
        <Route path={`${ROUTES.SETTINGS.BASE}/:section`} element={<SettingsPage />}/>
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
