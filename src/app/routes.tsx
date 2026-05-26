import { Route, Routes } from 'react-router-dom';
import AccountManagementPage from '../pages/AccountManagementPage';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import { ROUTES } from '../constants/routes';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.ADMIN.USERS} element={<AccountManagementPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
