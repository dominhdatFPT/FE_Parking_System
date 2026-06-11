import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { ROUTES } from '../constants/routes';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { useAuth } from '../contexts/useAuth';
import Icon from '../components/Icon';
import NotificationDropdown from '../components/NotificationDropdown';
import UserProfileDropdown from '../components/UserProfileDropdown';

const menuItems = [
  { icon: 'dashboard', label: 'Tổng quan', path: ROUTES.ADMIN.DASHBOARD },
  { icon: 'manage_accounts', label: 'Quản lý tài khoản', path: ROUTES.ADMIN.USERS },
  { icon: 'security', label: 'Quyền truy cập', path: ROUTES.ADMIN.ROLES },
  { icon: 'settings', label: 'Cấu hình hệ thống', path: ROUTES.ADMIN.SYSTEM_CONFIG },
  { icon: 'history', label: 'Nhật ký hệ thống', path: ROUTES.ADMIN.AUDIT_LOG },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem('smart-parking-user');
    localStorage.removeItem('rememberMe');
    navigate(ROUTES.LOGIN, { replace: true });
  }

  const profile = user
    ? {
        name: user.fullName || user.name || 'Người dùng',
        role: user.role || 'Người dùng',
        email: user.email || '',
        avatar: user.avatarUrl || user.avatar || '',
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-100 lg:flex">
      <aside className="w-64 flex-shrink-0 bg-slate-900 text-white shadow-lg lg:sticky lg:top-0 lg:h-screen">
        <div className="flex h-full flex-col p-4">
          <div>
            <div 
              className="flex items-center gap-3 border-b border-slate-700 pb-4 cursor-pointer" 
              onClick={() => {
                navigate(ROUTES.ADMIN.DASHBOARD);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              title="Trang chủ quản trị"
            >
              <img
                alt="Parking System Logo"
                className="h-10 w-10 object-contain"
                src="/parking-system-logo.png"
              />
              <div>
                <h1 className="text-lg font-bold">Parking System</h1>
                <p className="text-xs text-slate-400">Hệ thống quản trị</p>
              </div>
            </div>

            <nav className="mt-4 space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === ROUTES.ADMIN.DASHBOARD}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    }`
                  }
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-auto border-t border-slate-700 pt-4 flex items-center gap-3 shrink-0">
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1e3a8a] hover:bg-blue-800 rounded-lg transition-colors text-sm font-semibold shadow-sm">
              <Icon name="help" className="text-white" />
              <span className="text-white">Hỗ trợ</span>
            </button>

            <button
              title="Đăng xuất"
              onClick={handleLogout}
              className="flex-shrink-0 flex items-center justify-center p-2.5 text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-100 rounded-lg transition-all"
            >
              <Icon name="logout" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="relative z-[999] overflow-visible border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input
                  placeholder="Tìm kiếm dữ liệu, biển số xe..."
                  type="search"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NotificationDropdown />

              <UserProfileDropdown
                profile={profile}
                onViewProfile={() => navigate(ROUTES.SETTINGS.PROFILE)}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
