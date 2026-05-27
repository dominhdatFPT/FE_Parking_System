import { Route, Routes } from 'react-router';
import AccountManagementPage from '../pages/AccountManagementPage';
import WelcomePage from '../features/auth/pages/WelcomePage';
import NotFoundPage from '../pages/NotFoundPage';
import { LoginPage, UserLoginPage, SignupPage } from '../features/auth';
import { ROUTES } from '../constants/routes';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<WelcomePage />} />
      <Route path={ROUTES.LOGIN} element={<UserLoginPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
      <Route path={ROUTES.ADMIN_LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.ADMIN.USERS} element={<AccountManagementPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
