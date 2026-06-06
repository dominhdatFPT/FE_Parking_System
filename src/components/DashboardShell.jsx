import { NavLink, useNavigate } from 'react-router';
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
    const navigate = useNavigate();
    const handleNavigate = (path) => navigate(path);
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
        <div className="p-4 border-t border-slate-700 flex items-center gap-3 shrink-0 mt-auto bg-slate-900">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#20438e] hover:bg-blue-800 rounded-xl transition-colors text-sm font-semibold shadow-sm text-white">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Hỗ trợ</span>
          </button>
          <button 
            title="Đăng xuất"
            onClick={() => handleNavigate('/login')}
            className="flex-shrink-0 flex items-center justify-center p-2.5 text-red-600 hover:text-white hover:bg-red-600 bg-red-100 rounded-lg transition-all"
          >
            <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
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
