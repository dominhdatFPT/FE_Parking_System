import React, { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Package,
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
  { icon: ArrowUpFromLine, label: 'Xe ra', path: ROUTES.ADMIN.ROLES },
  { icon: Boxes, label: 'Phiên gửi xe', path: ROUTES.ADMIN.PARKING_SESSIONS },
  { icon: Package, label: 'Quản lý gói', path: ROUTES.STAFF.BOOKINGS },
];

const incidentNavigationItem = {
  icon: AlertTriangle,
  label: 'Sự cố',
  path: `${ROUTES.ADMIN.AUDIT_LOG}?view=incidents`,
};

const pageTitles = [
  { path: ROUTES.ADMIN.DASHBOARD, title: 'Tổng quan bãi', end: true },
  { path: ROUTES.STAFF.BOOKINGS, title: 'Quản lý gói' },
  { path: ROUTES.ADMIN.VEHICLE_ENTRY, title: 'Xe vào' },
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

  const isVehicleEntryPage = location.pathname === ROUTES.ADMIN.VEHICLE_ENTRY;
  const pageTitle = useMemo(
    () => getCurrentPageTitle(location.pathname, location.search),
    [location.pathname, location.search],
  );

  return (
    <div
      className={`relative bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#eef6fb_46%,#f8fafc_100%)] text-slate-950 lg:flex ${
        isVehicleEntryPage ? 'h-screen overflow-hidden' : 'min-h-screen overflow-x-hidden'
      }`}
    >
      <div className="pointer-events-none fixed -left-24 top-24 h-72 w-72 rounded-full bg-sky-200/35 blur-3xl" />
      <div className="pointer-events-none fixed right-0 top-1/3 h-80 w-80 rounded-full bg-slate-300/25 blur-3xl" />
      <aside
        className={`hidden min-h-screen flex-shrink-0 border-r border-white/10 bg-slate-950/90 text-white shadow-[18px_0_48px_rgba(15,23,42,0.22)] backdrop-blur-2xl transition-[width] duration-300 ease-out lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:h-screen lg:flex-col ${
          collapsed ? 'w-20' : 'w-[260px]'
        }`}
      >
        <div className="relative flex h-full flex-col overflow-hidden bg-[radial-gradient(circle_at_20%_0%,rgba(14,165,233,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.015)_42%,rgba(15,23,42,0))] p-4">
          <div className="pointer-events-none absolute -left-20 top-10 h-44 w-44 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-20 h-56 w-56 rounded-full bg-slate-400/10 blur-3xl" />
          <div
            className={`relative flex items-center gap-3 border-b border-white/10 pb-4 ${
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
                className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/10 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_24px_rgba(2,6,23,0.18)] transition hover:bg-white/15 hover:text-white active:scale-95"
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
              className="relative mx-auto mt-4 grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/10 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_24px_rgba(2,6,23,0.18)] transition hover:bg-white/15 hover:text-white active:scale-95"
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
                    className={`group relative flex h-12 items-center rounded-2xl text-sm font-semibold transition-all duration-200 ${
                      collapsed ? 'justify-center px-0' : 'gap-3 px-2'
                    } ${
                      isActive
                        ? 'border border-sky-300/20 bg-sky-500/85 text-white shadow-[0_14px_34px_rgba(14,165,233,0.24)]'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 transition ${
                        isActive
                          ? 'bg-white/15 text-white ring-white/10'
                          : 'bg-white/5 text-slate-300 ring-white/5 group-hover:bg-white/10 group-hover:text-white'
                      }`}
                    >
                      <ItemIcon className="h-[18px] w-[18px] shrink-0" />
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
                  className={`group flex h-12 items-center rounded-2xl border text-sm font-semibold shadow-[0_12px_28px_rgba(245,158,11,0.10),inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:bg-amber-500/20 hover:text-white active:scale-[0.98] ${
                    collapsed ? 'w-full justify-center px-0' : 'min-w-0 flex-[7] gap-2 px-2'
                  } ${
                    isIncidentActive
                      ? 'border-amber-300/30 bg-amber-500/20 text-amber-50'
                      : 'border-amber-400/20 bg-amber-500/10 text-amber-100'
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 transition ${
                      isIncidentActive
                        ? 'bg-amber-300/20 text-amber-50 ring-amber-200/20'
                        : 'bg-amber-400/15 text-amber-100 ring-amber-300/10 group-hover:bg-amber-400/20'
                    }`}
                  >
                    <IncidentIcon className="h-[18px] w-[18px] shrink-0" />
                  </span>
                  {!collapsed ? <span className="truncate">{incidentNavigationItem.label}</span> : null}
                </NavLink>
              );
            })()}

            <button
              type="button"
              title="Đăng xuất"
              onClick={handleLogout}
              className={`flex h-12 items-center rounded-2xl border border-rose-400/20 bg-rose-500/10 text-sm font-semibold text-rose-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-rose-300/30 hover:bg-rose-500/20 hover:text-white active:scale-[0.98] ${
                collapsed ? 'w-full justify-center px-0' : 'min-w-0 flex-[3] justify-center px-2'
              }`}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-500/10 text-rose-100 ring-1 ring-rose-300/10">
                <LogOut className="h-[18px] w-[18px] shrink-0" />
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
        <header className="sticky top-0 z-40 border-b border-white/70 bg-white/60 px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-2xl lg:px-8">
          <div className="flex min-h-14 items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600/80">
                Parking Management
              </p>
              <h2 className="mt-1 truncate text-2xl font-semibold tracking-normal text-slate-950">
                {pageTitle}
              </h2>
              {location.pathname === ROUTES.ADMIN.PARKING_SESSIONS ? (
                <p className="mt-1 text-sm font-medium text-slate-500">
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
              ? 'min-h-0 min-w-0 flex-1 overflow-hidden p-4 sm:p-5 lg:p-6'
              : 'min-w-0 flex-1 p-4 sm:p-5 lg:p-8'
          }
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
