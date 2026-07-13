import React, { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  BellRing,
  Boxes,
  CarFront,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Package,
  Users,
} from 'lucide-react';
import { useAuth } from '../contexts/useAuth';
import { useSystemRules } from '../contexts/useSystemRules';
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
  { icon: Package, label: 'Quản lý đăng ký xe', path: ROUTES.STAFF.VEHICLE_REGISTRATIONS },
  { icon: CarFront, label: 'Đăng kí xe cho người dùng', path: ROUTES.ADMIN.USER_VEHICLE_REGISTRATION },
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
  { path: ROUTES.STAFF.VEHICLE_REGISTRATIONS, title: 'Quản lý đăng ký xe' },
  { path: ROUTES.ADMIN.USER_VEHICLE_REGISTRATION, title: 'Đăng kí xe cho người dùng' },
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
  const { openRules } = useSystemRules();
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

  const isFixedCanvasPage = [
    ROUTES.ADMIN.VEHICLE_ENTRY,
    ROUTES.ADMIN.VEHICLE_EXIT,
    ROUTES.STAFF.VEHICLE_ENTRY,
    ROUTES.STAFF.VEHICLE_EXIT,
    ROUTES.STAFF.VEHICLE_REGISTRATIONS,
  ].includes(location.pathname);
  const pageTitle = useMemo(
    () => getCurrentPageTitle(location.pathname, location.search),
    [location.pathname, location.search],
  );

  return (
    <div className="relative flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#eef6fb_46%,#f8fafc_100%)] text-slate-950">
      <aside
        className={`hidden h-full min-h-0 flex-shrink-0 border-r border-white/[0.07] bg-gradient-to-b from-[#08203D] via-[#071A32] to-[#020B18] text-white shadow-[8px_0_32px_rgba(2,11,24,0.55)] transition-[width] duration-300 ease-out lg:z-30 lg:flex lg:flex-col ${
          collapsed ? 'w-20' : 'w-[276px]'
        }`}
      >
        <div className="relative flex h-full flex-col overflow-hidden p-4">
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
                const canWrapLabel = item.path === ROUTES.ADMIN.USER_VEHICLE_REGISTRATION;

                return (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    end={item.path === ROUTES.ADMIN.DASHBOARD}
                    title={collapsed ? item.label : undefined}
                    className={`group relative flex items-center rounded-xl text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      canWrapLabel && !collapsed ? 'min-h-11 py-2' : 'h-11'
                    } ${
                      collapsed ? 'justify-center px-0' : 'gap-3 px-2.5'
                    } ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-300/90 hover:bg-sky-400/[0.08] hover:text-white'
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                        isActive
                          ? 'bg-white/20 text-white ring-white/20'
                          : 'bg-white/[0.06] text-slate-400 ring-white/[0.06] group-hover:bg-sky-400/20 group-hover:text-sky-300 group-hover:ring-sky-400/20'
                      }`}
                    >
                      <ItemIcon className="h-4 w-4 shrink-0" />
                    </span>
                    {!collapsed ? (
                      <span className={canWrapLabel ? 'min-w-0 flex-1 whitespace-normal break-words leading-tight' : 'truncate'}>
                        {item.label}
                      </span>
                    ) : null}
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
                  className={`group flex h-11 items-center rounded-xl border text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] ${
                    collapsed ? 'w-full justify-center px-0' : 'min-w-0 flex-[7] gap-2 px-2.5'
                  } ${
                    isIncidentActive
                      ? 'border-amber-400/25 bg-amber-500/20 text-amber-50'
                      : 'border-amber-400/[0.12] bg-amber-400/[0.06] text-amber-200/80 hover:bg-amber-400/15 hover:text-amber-100'
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      isIncidentActive
                        ? 'bg-amber-400/25 text-amber-50 ring-amber-400/25'
                        : 'bg-amber-400/[0.08] text-amber-300/80 ring-amber-400/[0.08] group-hover:bg-amber-400/20 group-hover:text-amber-100'
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
              className={`flex h-11 items-center rounded-xl border border-rose-400/[0.15] bg-rose-400/[0.06] text-sm font-medium text-rose-300/80 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-rose-400/15 hover:text-rose-100 active:scale-[0.98] ${
                collapsed ? 'w-full justify-center px-0' : 'min-w-0 flex-[3] justify-center px-2'
              }`}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-rose-400/[0.08] text-rose-300/80 ring-1 ring-rose-400/[0.08]">
                <LogOut className="h-4 w-4 shrink-0" />
              </span>
              {!collapsed ? <span className="sr-only">Đăng xuất</span> : null}
            </button>
          </div>
        </div>
      </aside>

      <div className="relative z-40 flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-40 shrink-0 border-b border-slate-100 bg-white px-5 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)] lg:px-8">
          <div className="flex min-h-12 items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Parking Management
              </p>
              <h2 className="mt-0.5 truncate text-xl font-bold tracking-tight text-slate-950">
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
                onViewNotifications={() => navigate(ROUTES.ADMIN.NOTIFICATIONS.BASE)}
                onViewRules={openRules}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </header>

        <main
          className={
            isFixedCanvasPage
              ? 'min-h-0 min-w-0 flex-1 overflow-hidden p-3 sm:p-4'
              : 'min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 lg:p-8'
          }
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
