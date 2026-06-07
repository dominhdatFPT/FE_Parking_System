import { Route, Routes } from 'react-router-dom';
import AccountManagementPage from '../pages/AccountManagementPage';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import { ROUTES } from '../constants/routes';
import MainLayout from '../layouts/MainLayout';
import RolePermissionPage from '../features/admin/role-permissions/pages/RolePermissionPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.ADMIN.DASHBOARD} element={<HomePage />} />
        <Route path={ROUTES.ADMIN.USERS} element={<AccountManagementPage />} />
        <Route path={ROUTES.ADMIN.ROLES} element={<RolePermissionPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
