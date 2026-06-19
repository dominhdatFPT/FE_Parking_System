import { Navigate, Route, Routes, useLocation } from 'react-router';
import { useAuth } from '../contexts/useAuth';
import { ROUTES } from '../constants/routes';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import DriverLayout from '../layouts/DriverLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import HomePage from '../pages/HomePage';
import ParkingMapPage from '../pages/ParkingMapPage';
import WelcomePage from '../features/auth/pages/WelcomePage';
import AccountRecovery from '../features/auth/pages/AccountRecovery';
import ResetPassword from '../features/auth/pages/ResetPassword';
import SignupPage from '../features/auth/pages/SignupPage';
import DriverDashboard from '../features/driver/pages/DriverDashboard';
import DriverBooking from '../features/driver/pages/DriverBooking';
import DriverPayment from '../features/driver/pages/DriverPayment';
import DriverHistory from '../features/driver/pages/DriverHistory';
import DriverNotifications from '../features/driver/pages/DriverNotifications';
import DriverSupport from '../features/driver/pages/DriverSupport';
import DriverProfile from '../features/driver/pages/DriverProfile/DriverProfile';
import DriverVehicleRegistration from '../features/driver/pages/DriverVehicleRegistration';
import DriverFeePlans from '../features/driver/pages/DriverFeePlans';
import MyParkingOrders from '../pages/MyParkingOrders';
import NotFoundPage from '../pages/NotFoundPage';
import ForbiddenPage from '../pages/ForbiddenPage';
import AccountManagementPage from '../pages/AccountManagementPage';
import SettingsPage from '../pages/SettingsPage';
import NotificationDetailPage from '../pages/NotificationDetailPage';
import NotificationManagement from '../pages/NotificationManagement';
import SystemConfigurationPage from '../pages/SystemConfigurationPage';
import AuditLogPage from '../pages/AuditLogPage';
import StaffDashboard from '../features/staff/pages/StaffDashboard';
import StaffBookingReview from '../features/staff/pages/StaffBookingReview';
import StaffVehicleEntry from '../features/staff/pages/StaffVehicleEntry';
import StaffVehicleExit from '../features/staff/pages/StaffVehicleExit';
import StaffSessions from '../features/staff/pages/StaffSessions';
import StaffExceptions from '../features/staff/pages/StaffExceptions';
import VehicleEntryPage from '../pages/VehicleEntryPage';
import ParkingSessionsPage from '../pages/ParkingSessionsPage';

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}

function RequireBackOfficeRole({ children }) {
  const { role, isAuthenticated } = useAuth();
  const location = useLocation();
  const normalizedRole = role?.toLowerCase();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }

  if (!['admin', 'staff'].includes(normalizedRole)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<WelcomePage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.ADMIN_LOGIN} element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
      <Route path="/recovery" element={<AccountRecovery />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route path="/home" element={
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        }
      />
      <Route path="/parking-map" element={
          <RequireAuth>
            <ParkingMapPage />
          </RequireAuth>
        }
      />

      {/* Driver Portal Routes */}
      <Route element={<DriverLayout />}>
        <Route path={ROUTES.DRIVER.DASHBOARD} element={<DriverDashboard />} />
        <Route path={ROUTES.DRIVER.BOOKING} element={<DriverBooking />} />
        <Route path={ROUTES.DRIVER.HISTORY} element={<DriverHistory />} />
        <Route path={ROUTES.DRIVER.VEHICLE_REGISTRATION} element={<DriverVehicleRegistration />} />
        <Route path={ROUTES.DRIVER.FEE_PLANS} element={<DriverFeePlans />} />
        <Route path={ROUTES.DRIVER.PAYMENT} element={<DriverPayment />} />
        <Route path={ROUTES.DRIVER.NOTIFICATIONS} element={<DriverNotifications />} />
        <Route path={ROUTES.DRIVER.SUPPORT} element={<DriverSupport />} />
        <Route path={ROUTES.DRIVER.PROFILE} element={<DriverProfile />} />
        <Route path={ROUTES.DRIVER.ACTIVE_SESSION} element={<MyParkingOrders />} />
      </Route>
      
      <Route element={<RequireBackOfficeRole><AdminLayout /></RequireBackOfficeRole>}>
        <Route path={ROUTES.ADMIN.DASHBOARD} element={<HomePage />} />
        <Route path={ROUTES.ADMIN.VEHICLE_ENTRY} element={<VehicleEntryPage />} />
        <Route path={ROUTES.ADMIN.PARKING_SESSIONS} element={<ParkingSessionsPage />} />
        <Route path={ROUTES.ADMIN.USERS} element={<AccountManagementPage />} />
        <Route path={ROUTES.ADMIN.VEHICLE_EXIT} element={<StaffVehicleExit />} />
        <Route path={ROUTES.ADMIN.ROLES} element={<Navigate to={ROUTES.ADMIN.VEHICLE_EXIT} replace />} />
        <Route path={ROUTES.ADMIN.SYSTEM_CONFIG} element={<SystemConfigurationPage />} />
        <Route path={ROUTES.ADMIN.AUDIT_LOG} element={<AuditLogPage />} />
        <Route path={ROUTES.ADMIN.NOTIFICATIONS.BASE} element={<NotificationManagement />} />
        <Route path={ROUTES.ADMIN.NOTIFICATIONS.DETAIL} element={<NotificationDetailPage />} />
        <Route path={ROUTES.FORBIDDEN} element={<ForbiddenPage />} />
        <Route path={ROUTES.STAFF.DASHBOARD} element={<StaffDashboard />} />
        <Route path={ROUTES.STAFF.BOOKINGS} element={<StaffBookingReview />} />
        <Route path={ROUTES.STAFF.VEHICLE_ENTRY} element={<StaffVehicleEntry />} />
        <Route path={ROUTES.STAFF.VEHICLE_EXIT} element={<StaffVehicleExit />} />
        <Route path={ROUTES.STAFF.SESSIONS} element={<StaffSessions />} />
        <Route path={ROUTES.STAFF.EXCEPTIONS} element={<StaffExceptions />} />
      </Route>
      
      <Route element={<MainLayout />}>
        <Route path={`${ROUTES.SETTINGS.BASE}/:section`} element={<SettingsPage />}/>
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
