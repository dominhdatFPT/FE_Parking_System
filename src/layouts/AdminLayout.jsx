import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { STORAGE_KEYS } from '../constants/storageKeys';
import Icon from '../components/Icon';
import NotificationDropdown from '../components/NotificationDropdown';
import SettingsDropdown from '../components/SettingsDropdown';
import { useAuth } from '../contexts/AuthContext';

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
    navigate(ROUTES.LOGIN, { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-100 lg:flex">
      <aside className="w-64 flex-shrink-0 bg-slate-900 text-white shadow-lg lg:sticky lg:top-0 lg:h-screen">
        <div className="flex h-full flex-col p-4">
          <div>
            <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-600">
                <Icon name="local_parking" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Smart Parking AI</h1>
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

          <div className="mt-auto border-t border-slate-700 pt-4 space-y-1">
            <button
              onClick={() => {}}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white"
            >
              <Icon name="help" />
              <span>Hỗ trợ</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-300 hover:bg-slate-800/50 hover:text-rose-100"
            >
              <Icon name="logout" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
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
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white border text-gray-600 hover:bg-gray-50">
                <span className="material-symbols-outlined">notifications</span>
              </button>

              <SettingsDropdown
                trigger={
                  <button className="flex items-center gap-2 rounded-lg p-2 transition hover:bg-gray-100">
                    <span className="text-right">
                      <strong className="block text-sm text-gray-900">{user?.fullName}</strong>
                      <small className="text-xs text-gray-600">Quản trị viên</small>
                    </span>
                    <img
                      alt="User profile"
                      src={user?.avatarUrl}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </button>
                }
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
