import { NavLink, Outlet, useNavigate } from 'react-router';
import { ROUTES } from '../constants/routes';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { useAuth } from '../contexts/useAuth';
import Logo from '../components/Logo';

const getNavigationItems = (role) => {
  const baseItems = [
    { label: 'Tổng quan', path: ROUTES.DASHBOARD, icon: 'dashboard' },
  ];

  if (role === 'admin') {
    baseItems.push(
      { label: 'Quản lý tài khoản', path: ROUTES.ADMIN.USERS, icon: 'people' },
      { label: 'Cấu hình hệ thống', path: ROUTES.ADMIN.SYSTEM_CONFIG, icon: 'settings' },
      { label: 'Nhật ký hệ thống', path: ROUTES.ADMIN.AUDIT_LOG, icon: 'history' }
    );
  } else if (role === 'staff') {
    baseItems.push(
      { label: 'Phiên gửi xe', path: ROUTES.STAFF.SESSIONS, icon: 'receipt_long' },
      { label: 'Ngoại lệ', path: ROUTES.STAFF.EXCEPTIONS, icon: 'warning' }
    );
  } else if (role === 'manager') {
    baseItems.push(
      { label: 'Chỗ đỗ', path: ROUTES.MANAGER.SLOTS, icon: 'local_parking' },
      { label: 'Báo cáo', path: ROUTES.MANAGER.REPORTS, icon: 'monitoring' },
      { label: 'Tối ưu hóa AI', path: ROUTES.MANAGER.AI_OPTIMIZATION, icon: 'smart_toy' }
    );
  }

  return baseItems;
};

export default function MainLayout() {
  const navigate = useNavigate();
  const { role, setUser } = useAuth();
  const navigationItems = getNavigationItems(role);

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="hidden border-r border-slate-100 bg-white lg:flex lg:flex-col">
        <div className="flex flex-col border-b border-slate-100 px-5 py-4 gap-1">
          <Logo variant="horizontal" size="sm" />
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-[44px]">Workspace</p>
        </div>

        <nav className="grid gap-1 p-3">
          {navigationItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  isActive
                    ? 'bg-sky-50 text-sky-600 shadow-[inset_0_1px_0_rgba(14,165,233,0.05)]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
              key={item.path}
              to={item.path}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-100 p-3">
          <button
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-all duration-300 hover:bg-rose-50"
            type="button"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-100 bg-white px-4 lg:px-6">
          <div>
            <p className="text-sm font-semibold text-slate-800">Dashboard</p>
            <p className="text-[10px] font-medium text-slate-400">Parking operations overview</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-slate-200/60 bg-white text-slate-500 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-slate-300 hover:text-sky-600 active:scale-95">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
