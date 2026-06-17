import React, { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  Car,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Package,
  ParkingCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/useAuth';
import { ROUTES } from '../constants/routes';
import { STORAGE_KEYS } from '../constants/storageKeys';
import NotificationDropdown from '../components/NotificationDropdown';
import UserProfileDropdown from '../components/UserProfileDropdown';

const navigationSections = [
  {
    label: 'Dashboard',
    icon: Car,
    items: [
      { icon: LayoutDashboard, label: 'Tổng quan bãi', path: ROUTES.ADMIN.DASHBOARD },
    ],
  },
  {
    label: 'Vận hành',
    icon: ParkingCircle,
    items: [
      { icon: ArrowDownToLine, label: 'Xe vào', path: ROUTES.ADMIN.VEHICLE_ENTRY },
      { icon: ArrowUpFromLine, label: 'Xe ra', path: ROUTES.ADMIN.ROLES },
      { icon: Boxes, label: 'Phiên gửi xe', path: ROUTES.ADMIN.PARKING_SESSIONS },
    ],
  },
  {
    items: [
      { icon: Package, label: 'Quản lý gói', path: `${ROUTES.ADMIN.SYSTEM_CONFIG}?view=packages` },
      { icon: AlertTriangle, label: 'Sự cố', path: `${ROUTES.ADMIN.AUDIT_LOG}?view=incidents` },
    ],
  },
];

const pageTitles = [
  { path: ROUTES.ADMIN.DASHBOARD, title: 'Tổng quan bãi', end: true },
  { path: `${ROUTES.ADMIN.SYSTEM_CONFIG}?view=packages`, title: 'Quản lý gói' },
  { path: ROUTES.ADMIN.VEHICLE_ENTRY, title: 'Vehicle Entry' },
  { path: ROUTES.ADMIN.PARKING_SESSIONS, title: 'Tất cả phiên gửi xe' },
  { path: ROUTES.ADMIN.ROLES, title: 'Xe ra' },
  { path: `${ROUTES.ADMIN.AUDIT_LOG}?view=incidents`, title: 'Sự cố' },
  { path: ROUTES.ADMIN.NOTIFICATIONS.BASE, title: 'Thông báo' },
];

function getCurrentPageTitle(pathname, search) {
  const currentUrl = `${pathname}${search}`;
  const current = pageTitles.find((item) =>
    item.end ? currentUrl === item.path : currentUrl.startsWith(item.path),
  );

  return current?.title ?? 'Parking Management';
}

function isNavigationItemActive(currentUrl, itemPath) {
  return currentUrl === itemPath || (!itemPath.includes('?') && currentUrl.startsWith(itemPath));
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem('smart-parking-user');
    localStorage.removeItem('rememberMe');
    setUser(null);
    navigate(ROUTES.ADMIN_LOGIN, { replace: true });
  }

  const profile = user
    ? {
        name: user.fullName || user.name || 'Demo Admin',
        role: user.role || 'Admin',
        email: user.email || '',
        avatar: user.avatarUrl || user.avatar || '',
      }
    : {
        name: 'Demo Admin',
        role: 'Admin',
        email: '',
        avatar: '',
      };

  const currentUrl = `${location.pathname}${location.search}`;
  const isVehicleEntryPage = location.pathname === ROUTES.ADMIN.VEHICLE_ENTRY;
  const pageTitle = useMemo(
    () => getCurrentPageTitle(location.pathname, location.search),
    [location.pathname, location.search],
  );

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-950 lg:flex">
      <aside
        className={`hidden min-h-screen flex-shrink-0 border-r border-slate-800/80 bg-[#0f172a] text-white shadow-[12px_0_40px_rgba(15,23,42,0.12)] transition-[width] duration-300 ease-out lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col ${
          collapsed ? 'w-20' : 'w-[260px]'
        }`}
      >
        <div className="flex h-full flex-col p-4">
          <div
            className={`flex items-center gap-3 border-b border-white/10 pb-5 ${
              collapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <button
              type="button"
              onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
              className={`flex min-w-0 items-center gap-3 rounded-2xl text-left transition hover:opacity-90 ${
                collapsed ? 'justify-center' : ''
              }`}
              title="Parking System"
            >
              <img
                alt="Parking System Logo"
                className="h-11 w-11 shrink-0 rounded-2xl bg-white object-contain p-1.5"
                src="/parking-system-logo.png"
              />
              {!collapsed ? (
                <div className="min-w-0">
                  <h1 className="truncate text-base font-semibold text-white">Parking System</h1>
                  <p className="mt-0.5 truncate text-xs font-medium text-slate-400">Staff & Admin</p>
                </div>
              ) : null}
            </button>

            {!collapsed ? (
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Thu gọn sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          {collapsed ? (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="mx-auto mt-4 grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Mở rộng sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : null}

          <nav className="mt-5 flex-1 space-y-6 overflow-y-auto overflow-x-hidden pr-0.5">
            {navigationSections.map((section, sectionIndex) => {
              const SectionIcon = section.icon;

              return (
                <div key={section.label ?? `section-${sectionIndex}`} className="space-y-2">
                  {section.label && !collapsed ? (
                    <div className="flex items-center gap-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {SectionIcon ? <SectionIcon className="h-3.5 w-3.5" /> : null}
                      <span>{section.label}</span>
                    </div>
                  ) : null}

                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const ItemIcon = item.icon;

                      return (
                        <NavLink
                          key={`${section.label ?? 'single'}-${item.label}`}
                          to={item.path}
                          end={item.path === ROUTES.ADMIN.DASHBOARD}
                          title={collapsed ? item.label : undefined}
                          className={() => {
                            const isActive = isNavigationItemActive(currentUrl, item.path);
                            return (
                            `group relative flex h-12 items-center rounded-2xl text-sm font-semibold transition-all duration-200 ${
                              collapsed ? 'justify-center px-0' : 'gap-3 px-3'
                            } ${
                              isActive
                                ? 'bg-blue-600 text-white shadow-[0_12px_30px_rgba(37,99,235,0.28)]'
                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`
                            );
                          }}
                        >
                          <ItemIcon className="h-5 w-5 shrink-0" />
                          {!collapsed ? <span className="truncate">{item.label}</span> : null}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="mt-5 border-t border-white/10 pt-5">
            <button
              type="button"
              title="Đăng xuất"
              onClick={handleLogout}
              className={`flex h-12 w-full items-center rounded-2xl border border-rose-400/15 bg-rose-500/10 text-sm font-semibold text-rose-100 transition hover:border-rose-300/30 hover:bg-rose-500/20 hover:text-white ${
                collapsed ? 'justify-center px-0' : 'gap-3 px-3'
              }`}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed ? <span>Đăng xuất</span> : null}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur lg:px-8">
          <div className="flex min-h-14 items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Parking Management
              </p>
              <h2 className="mt-1 truncate text-2xl font-semibold tracking-normal text-slate-950">
                {pageTitle}
              </h2>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <NotificationDropdown />
              <UserProfileDropdown
                profile={profile}
                onViewProfile={() => navigate(ROUTES.SETTINGS.PROFILE)}
                onChangePassword={() => navigate(ROUTES.SETTINGS.PASSWORD)}
              />
            </div>
          </div>
        </header>

        <main
          className={
            isVehicleEntryPage
              ? 'h-[calc(100vh-88px)] overflow-hidden p-4'
              : 'min-w-0 flex-1 p-5 lg:p-8'
          }
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
