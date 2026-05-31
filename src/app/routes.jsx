import { Route, Routes } from 'react-router';
import AccountManagementPage from "../features/auth/pages/AccountManagementPage";
import WelcomePage from '../features/auth/pages/WelcomePage';
import NotFoundPage from "../features/auth/pages/NotFoundPage";
import { LoginPage, UserLoginPage, SignupPage } from '../features/auth';
import ResetPassword from '../features/auth/pages/ResetPassword';
import AdminSignup from "../features/auth/pages/AdminSignup";
import AccountRecovery from "../features/auth/pages/AccountRecovery";
import { ROUTES } from '../constants/routes';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<WelcomePage />} />
      <Route path={ROUTES.LOGIN} element={<UserLoginPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
      <Route path={ROUTES.ADMIN_LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.ADMIN.USERS} element={<AccountManagementPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/recovery" element={<AccountRecovery />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
