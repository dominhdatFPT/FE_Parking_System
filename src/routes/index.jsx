import { Route, Routes } from 'react-router-dom';
import AccountManagementPage from '../pages/AccountManagementPage';
import HomePage from '../pages/HomePage';
import SettingsPage from '../pages/SettingsPage';
import NotificationDetailPage from '../pages/NotificationDetailPage';
import NotFoundPage from '../pages/NotFoundPage';
import { ROUTES } from '../constants/routes';
import MainLayout from '../layouts/MainLayout';
import RolePermissionPage from '../features/admin/role-permissions/pages/RolePermissionPage';
import SystemConfigurationPage from '../pages/SystemConfigurationPage';
import AuditLogPage from '../pages/AuditLogPage';
import LoginPage from '../features/auth/pages/LoginPage';
export function AppRoutes() {
    return (<Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />}/>
        <Route path={ROUTES.LOGIN} element={<LoginPage />}/>
        <Route path={ROUTES.ADMIN.USERS} element={<AccountManagementPage />}/>
        <Route path={ROUTES.ADMIN.ROLES} element={<RolePermissionPage />}/>
        <Route path={ROUTES.ADMIN.SYSTEM_CONFIG} element={<SystemConfigurationPage />}/>
        <Route path={ROUTES.ADMIN.AUDIT_LOG} element={<AuditLogPage />}/>
        <Route path={ROUTES.NOTIFICATIONS.DETAIL} element={<NotificationDetailPage />}/>
        <Route path={`${ROUTES.SETTINGS.BASE}/:section`} element={<SettingsPage />}/>
      </Route>
      <Route path="*" element={<NotFoundPage />}/>
    </Routes>);
}
