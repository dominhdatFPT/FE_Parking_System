import { NavLink } from 'react-router';
import Icon from './Icon';
import NotificationDropdown from './NotificationDropdown';
import SettingsDropdown from './SettingsDropdown';
import { ROUTES } from '../constants/routes';
const menuItems = [
    { icon: 'dashboard', label: 'Tổng quan', href: ROUTES.HOME },
    { icon: 'manage_accounts', label: 'Quản lý tài khoản', href: ROUTES.ADMIN.USERS },
    { icon: 'security', label: 'Quyền truy cập', href: ROUTES.ADMIN.ROLES },
    { icon: 'settings', label: 'Cấu hình hệ thống', href: ROUTES.ADMIN.SYSTEM_CONFIG },
    { icon: 'history', label: 'Nhật ký hệ thống', href: ROUTES.ADMIN.AUDIT_LOG },
];
import { useAuth } from '../contexts/AuthContext';
export default function DashboardShell({ title, description, children }) {
    const { user, role } = useAuth();
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-900 text-white shadow-xl flex flex-col" aria-label="Điều hướng chính">
        <div className="flex-1 space-y-6 p-4">
          {/* Brand */}
          <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-600">
              <Icon name="local_parking" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Smart Parking AI</h1>
              <p className="text-xs text-slate-400">Hệ thống quản trị</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                end={item.href === ROUTES.HOME}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`
                }
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="space-y-1 border-t border-slate-700 p-4">
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800/50 hover:text-white"
          >
            <Icon name="help" />
            <span>Hỗ trợ</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-300 transition hover:bg-slate-800/50 hover:text-rose-100"
          >
            <Icon name="logout" />
            <span>Đăng xuất</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <label className="flex flex-1 max-w-xl items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-600 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-200">
              <Icon name="search" />
              <input
                placeholder="Tìm kiếm dữ liệu, cấu hình..."
                type="search"
                className="flex-1 bg-transparent outline-none"
              />
            </label>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <NotificationDropdown />
              <div className="h-6 w-px bg-gray-300" />
              <SettingsDropdown
                trigger={
                  <button className="flex items-center gap-2 rounded-lg hover:bg-gray-100 p-2 transition" type="button">
                    <span className="text-right hidden sm:block">
                      <small className="block text-xs text-gray-500">{role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</small>
                      <strong className="block text-sm font-bold text-gray-900">{user.fullName}</strong>
                    </span>
                    <img
                      alt="User profile"
                      className="h-9 w-9 rounded-full object-cover shadow-sm"
                      src={user.avatarUrl ?? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=96&q=80'}
                    />
                  </button>
                }
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <section className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
          </div>

          {children}
        </section>
      </main>
    </div>
  );
}
