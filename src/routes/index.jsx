import { Navigate, Route, Routes } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import UserLoginPage from '../features/auth/pages/UserLoginPage/UserLoginPage';
import DashboardPage from '../pages/DashboardPage';
import HomePage from '../pages/HomePage';
import WelcomePage from '../features/auth/pages/WelcomePage';
import AccountRecovery from '../features/auth/pages/AccountRecovery';
import ResetPassword from '../features/auth/pages/ResetPassword';
import SignupPage from '../features/auth/pages/SignupPage';
import AdminSignup from '../features/auth/pages/AdminSignup';
import DriverDashboard from '../features/driver/pages/DriverDashboard';
import DriverBooking from '../features/driver/pages/DriverBooking';
import DriverPayment from '../features/driver/pages/DriverPayment';
import DriverHistory from '../features/driver/pages/DriverHistory';
import DriverProfile from '../features/driver/pages/DriverProfile/DriverProfile';
import NotFoundPage from '../pages/NotFoundPage';
import ForbiddenPage from '../pages/ForbiddenPage';
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

function RequireAdminRole({ children }) {
  const { role } = useAuth();
  const token = localStorage.getItem('access_token');

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (role !== 'admin') {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<WelcomePage />} />
      <Route path={ROUTES.LOGIN} element={<UserLoginPage />} />
      <Route path={ROUTES.ADMIN_LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/recovery" element={<AccountRecovery />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route
        path="/home"
        element={
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        }
      />
      <Route path="/driver-dashboard" element={<DriverDashboard />} />
      <Route path="/driver-booking" element={<DriverBooking />} />
      <Route path="/driver-payment" element={<DriverPayment />} />
      <Route path="/driver-history" element={<DriverHistory />} />
      <Route path="/driver-profile" element={<DriverProfile />} />
      
      <Route
        path={ROUTES.ADMIN.USERS}
        element={
          <RequireAdminRole>
            <AccountManagementPage />
          </RequireAdminRole>
        }
      />
      <Route
        path={ROUTES.ADMIN.ROLES}
        element={
          <RequireAdminRole>
            <RolePermissionPage />
          </RequireAdminRole>
        }
      />
      <Route
        path={ROUTES.ADMIN.SYSTEM_CONFIG}
        element={
          <RequireAdminRole>
            <SystemConfigurationPage />
          </RequireAdminRole>
        }
      />
      <Route
        path={ROUTES.ADMIN.AUDIT_LOG}
        element={
          <RequireAdminRole>
            <AuditLogPage />
          </RequireAdminRole>
        }
      />
      
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
        <Route path={ROUTES.NOTIFICATIONS.DETAIL} element={<NotificationDetailPage />}/>
        <Route path={`${ROUTES.SETTINGS.BASE}/:section`} element={<SettingsPage />}/>
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
