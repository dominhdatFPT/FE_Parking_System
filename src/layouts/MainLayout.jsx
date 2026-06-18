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
      { label: 'Quyền truy cập', path: ROUTES.ADMIN.ROLES, icon: 'security' },
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
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#172033] lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
      <aside className="hidden border-r border-[#d9e2ee] bg-white lg:flex lg:flex-col">
        <div className="flex flex-col border-b border-[#e4eaf2] px-5 py-3 gap-1">
          <Logo variant="horizontal" size="sm" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#667085] ml-[44px]">Admin workspace</p>
        </div>

        <nav className="grid gap-1 p-3">
          {navigationItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#eaf2ff] text-[#0051d5]'
                    : 'text-[#475467] hover:bg-[#f2f5f9] hover:text-[#101828]'
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

        <div className="mt-auto border-t border-[#e4eaf2] p-4">
          <button
            className="flex w-full cursor-pointer items-center gap-3 rounded px-3 py-2.5 text-sm font-semibold text-[#b42318] hover:bg-[#fff1f1]"
            type="button"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#d9e2ee] bg-white/95 px-4 backdrop-blur lg:px-6">
          <div>
            <p className="text-sm font-semibold text-[#101828]">Dashboard</p>
            <p className="text-xs text-[#667085]">Parking operations overview</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="grid h-10 w-10 cursor-pointer place-items-center rounded border border-[#d9e2ee] bg-white text-[#475467] hover:text-[#0051d5]">
              <span className="material-symbols-outlined">notifications</span>
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
