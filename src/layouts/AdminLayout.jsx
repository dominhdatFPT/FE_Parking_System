import React, { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  BellRing,
  Boxes,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Package,
  Users,
} from 'lucide-react';
import { useAuth } from '../contexts/useAuth';
import { ROUTES } from '../constants/routes';
import { STORAGE_KEYS } from '../constants/storageKeys';
import NotificationDropdown from '../components/NotificationDropdown';
import UserProfileDropdown from '../components/UserProfileDropdown';
import Logo from '../components/Logo';

const mainNavigationItems = [
  { icon: LayoutDashboard, label: 'Tổng quan bãi', path: ROUTES.ADMIN.DASHBOARD },
  { icon: ArrowDownToLine, label: 'Xe vào', path: ROUTES.ADMIN.VEHICLE_ENTRY },
  { icon: ArrowUpFromLine, label: 'Xe ra', path: ROUTES.ADMIN.VEHICLE_EXIT },
  { icon: Boxes, label: 'Phiên gửi xe', path: ROUTES.ADMIN.PARKING_SESSIONS },
  { icon: Package, label: 'Quản lý gói', path: ROUTES.STAFF.BOOKINGS },
  { icon: BellRing, label: 'Thông báo', path: ROUTES.ADMIN.NOTIFICATIONS.BASE },
  { icon: Users, label: 'Quản lý tài khoản', path: ROUTES.ADMIN.USERS },
];

const incidentNavigationItem = {
  icon: AlertTriangle,
  label: 'Sự cố & hỗ trợ',
  path: `${ROUTES.ADMIN.AUDIT_LOG}?view=incidents`,
};

const pageTitles = [
  { path: ROUTES.ADMIN.DASHBOARD, title: 'Tổng quan bãi', end: true },
  { path: ROUTES.STAFF.BOOKINGS, title: 'Quản lý gói' },
  { path: ROUTES.ADMIN.VEHICLE_ENTRY, title: 'Xe vào' },
  { path: ROUTES.ADMIN.PARKING_SESSIONS, title: 'Tất cả phiên gửi xe' },
  { path: ROUTES.ADMIN.VEHICLE_EXIT, title: 'Xe ra' },
  { path: `${ROUTES.ADMIN.AUDIT_LOG}?view=incidents`, title: 'Quản lí sự cố và hỗ trợ' },
  { path: ROUTES.ADMIN.NOTIFICATIONS.BASE, title: 'Thông báo' },
  { path: ROUTES.ADMIN.USERS, title: 'Quản lý tài khoản' },
];

function getCurrentPageTitle(pathname, search) {
  const currentUrl = `${pathname}${search}`;
  const current = pageTitles.find((item) =>
    item.end ? currentUrl === item.path : currentUrl.startsWith(item.path),
  );

  return current?.title ?? 'Parking Management';
}

function isNavigationItemActive(pathname, search, itemPath) {
  if (itemPath.includes('?')) {
    return `${pathname}${search}` === itemPath;
  }

  return pathname === itemPath;
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem('smart-parking-user');
    localStorage.removeItem('rememberMe');
    setUser(null);
    navigate(ROUTES.ADMIN_LOGIN, { replace: true });
  }

  const profile = user
    ? {
        name: user.fullName || user.name || user.email || 'Người dùng',
        role: user.role || '',
        email: user.email || '',
        avatar: user.avatarUrl || user.avatar || '',
      }
    : {
        name: 'Người dùng',
        role: '',
        email: '',
        avatar: '',
      };

  const isFullScreenPage =
    location.pathname === ROUTES.ADMIN.VEHICLE_ENTRY ||
    location.pathname === ROUTES.ADMIN.VEHICLE_EXIT;
  const isVehicleEntryPage = isFullScreenPage;
  const pageTitle = useMemo(
    () => getCurrentPageTitle(location.pathname, location.search),
    [location.pathname, location.search],
  );

  return (
    <div
      className={`relative bg-[linear-gradient(135deg,#F8FAFC_0%,#F4F8FC_48%,#EEF5FC_100%)] text-[#0F172A] lg:flex ${
        isVehicleEntryPage ? 'h-screen overflow-hidden' : 'min-h-screen overflow-x-hidden'
      }`}
    >
      <div className="pointer-events-none absolute -right-24 top-0 h-[360px] w-[360px] rounded-full bg-blue-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-[360px] w-[360px] rounded-full bg-sky-300/10 blur-[120px]" />

      <aside
        className={`hidden min-h-screen flex-shrink-0 border-r border-white/10 bg-[linear-gradient(180deg,#06152A_0%,#071A32_55%,#06152A_100%)] text-white shadow-[18px_0_48px_rgba(6,21,42,0.28)] transition-[width] duration-300 ease-out lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:h-screen lg:flex-col ${
          collapsed ? 'w-20' : 'w-[260px]'
        }`}
      >
        <div className="relative flex h-full flex-col overflow-hidden p-4">
          <div className="pointer-events-none absolute inset-x-4 top-0 h-32 rounded-full bg-[#1EA7FF]/10 blur-3xl" />

          <div
            className={`relative flex items-center gap-3 border-b border-white/10 pb-4 ${
              collapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <button
              type="button"
              onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
              className={`flex min-w-0 items-center gap-3 rounded-[22px] text-left transition-all duration-200 hover:scale-[1.01] hover:opacity-95 ${
                collapsed ? 'justify-center' : ''
              }`}
              title="Parking System"
            >
              {collapsed ? (
                <Logo variant="icon-only" theme="dark" size="sm" />
              ) : (
                <Logo variant="horizontal" theme="dark" size="sm" />
              )}
            </button>

            {!collapsed ? (
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/10 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_24px_rgba(2,6,23,0.18)] transition-all duration-200 hover:bg-white/15 hover:text-white active:scale-95"
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
              className="relative mx-auto mt-4 grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/10 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_24px_rgba(2,6,23,0.18)] transition-all duration-200 hover:bg-white/15 hover:text-white active:scale-95"
              aria-label="Mở rộng sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : null}

          <nav className="relative mt-5 flex-1 overflow-y-auto overflow-x-hidden pr-0.5">
            <div className="space-y-1.5">
              {mainNavigationItems.map((item) => {
                const ItemIcon = item.icon;
                const isActive = isNavigationItemActive(location.pathname, location.search, item.path);

                return (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    end={item.path === ROUTES.ADMIN.DASHBOARD}
                    title={collapsed ? item.label : undefined}
                    className={`group relative flex h-11 items-center rounded-[18px] text-sm font-medium transition-all duration-200 ease-out ${
                      collapsed ? 'justify-center px-0' : 'gap-3 px-2.5'
                    } ${
                      isActive
                        ? 'bg-gradient-to-r from-[#1565FF] to-[#1EA7FF] text-white shadow-[0_12px_32px_rgba(29,107,255,0.28)]'
                        : 'text-slate-300 hover:translate-x-0.5 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {isActive ? <span className="absolute left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-white/80" /> : null}
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ring-1 transition-all duration-200 ease-out ${
                        isActive
                          ? 'bg-white/15 text-white ring-white/20'
                          : 'bg-white/5 text-slate-300 ring-white/5 group-hover:bg-white/10 group-hover:text-sky-100'
                      }`}
                    >
                      <ItemIcon className="h-4 w-4 shrink-0" />
                    </span>
                    {!collapsed ? <span className="truncate">{item.label}</span> : null}
                  </NavLink>
                );
              })}
            </div>
          </nav>

          <div className={`relative mt-auto border-t border-white/10 pt-4 ${collapsed ? 'space-y-2' : 'flex gap-2'}`}>
            {(() => {
              const IncidentIcon = incidentNavigationItem.icon;
              const isIncidentActive = isNavigationItemActive(
                location.pathname,
                location.search,
                incidentNavigationItem.path,
              );

              return (
                <NavLink
                  to={incidentNavigationItem.path}
                  title={collapsed ? incidentNavigationItem.label : undefined}
                  className={`group flex h-11 items-center rounded-xl border text-sm font-medium shadow-[0_8px_18px_rgba(2,6,23,0.08)] transition-all duration-200 ease-out active:scale-[0.98] ${
                    collapsed ? 'w-full justify-center px-0' : 'min-w-0 flex-[7] gap-2 px-2.5'
                  } ${
                    isIncidentActive
                      ? 'border-amber-500/20 bg-amber-500/20 text-amber-50'
                      : 'border-amber-500/10 bg-amber-500/5 text-amber-200 hover:bg-amber-500/15'
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 transition-all duration-200 ease-out ${
                      isIncidentActive
                        ? 'bg-amber-500/20 text-amber-50 ring-amber-500/20'
                        : 'bg-amber-500/10 text-amber-200 ring-amber-500/10 group-hover:bg-amber-500/20'
                    }`}
                  >
                    <IncidentIcon className="h-4 w-4 shrink-0" />
                  </span>
                  {!collapsed ? <span className="truncate">{incidentNavigationItem.label}</span> : null}
                </NavLink>
              );
            })()}

            <button
              type="button"
              title="Đăng xuất"
              onClick={handleLogout}
              className={`flex h-11 items-center rounded-xl border border-rose-500/20 bg-rose-500/5 text-sm font-medium text-rose-200 shadow-[0_8px_18px_rgba(2,6,23,0.08)] transition-all duration-200 ease-out hover:bg-rose-500/15 hover:text-white active:scale-[0.98] ${
                collapsed ? 'w-full justify-center px-0' : 'min-w-0 flex-[3] justify-center px-2'
              }`}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-rose-500/10 text-rose-200 ring-1 ring-rose-500/10">
                <LogOut className="h-4 w-4 shrink-0" />
              </span>
              {!collapsed ? <span className="sr-only">Đăng xuất</span> : null}
            </button>
          </div>
        </div>
      </aside>

      <div
        className={`relative z-10 flex min-w-0 flex-1 flex-col transition-[margin] duration-300 ease-out ${
          collapsed ? 'lg:ml-20' : 'lg:ml-[260px]'
        } ${isVehicleEntryPage ? 'h-full overflow-hidden' : ''}`}
      >
        <header className="sticky top-0 z-40 h-[72px] border-b border-slate-200/70 bg-white/80 px-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl lg:px-8">
          <div className="flex h-full min-h-12 items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">
                Parking Management
              </p>
              <h2 className="mt-0.5 truncate text-xl font-bold tracking-tight text-[#0F172A]">
                {pageTitle}
              </h2>
              {location.pathname === ROUTES.ADMIN.PARKING_SESSIONS ? (
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Theo dõi toàn bộ phiên gửi xe trong hệ thống
                </p>
              ) : null}
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
              ? 'min-h-0 min-w-0 flex-1 overflow-hidden px-4 pb-4 pt-2 sm:px-5 sm:pb-5 sm:pt-3 lg:px-6 lg:pb-6 lg:pt-3'
              : 'min-w-0 flex-1 p-4 sm:p-5 lg:p-8'
          }
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
