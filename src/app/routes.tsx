import { Route, Routes } from 'react-router-dom';
import RolePermissionPage from '../features/admin/role-permissions/pages/RolePermissionPage';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import { ROUTES } from '../constants/routes';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.ADMIN.DASHBOARD} element={<HomePage />} />
      <Route path={ROUTES.ADMIN.ROLES} element={<RolePermissionPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
