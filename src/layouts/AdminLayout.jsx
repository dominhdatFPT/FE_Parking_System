import { useState } from 'react';
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
  Shield,
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
  { icon: Package, label: 'Quản lý đăng ký xe', path: ROUTES.STAFF.VEHICLE_REGISTRATIONS },
  { icon: BellRing, label: 'Thông báo', path: ROUTES.ADMIN.NOTIFICATIONS.BASE },
  { icon: Users, label: 'Quản lý tài khoản', path: ROUTES.ADMIN.USERS },
  { icon: Shield, label: 'Phân quyền', path: ROUTES.ADMIN.PERMISSIONS },
];

const incidentNavigationItem = {
  icon: AlertTriangle,
  label: 'Sự cố & hỗ trợ',
  path: `${ROUTES.ADMIN.AUDIT_LOG}?view=incidents`,
};
function isNavigationItemActive(pathname, search, itemPath) {
  if (itemPath.includes('?')) {
    return `${pathname}${search}` === itemPath;
  }

  return pathname === itemPath;
}

function getNavigationLabel(item) {
  if (item.path === ROUTES.ADMIN.VEHICLE_ENTRY) return 'Xe vào';
  if (item.path === ROUTES.ADMIN.DASHBOARD) return 'Tổng quan bãi';
  if (item.path === ROUTES.ADMIN.VEHICLE_EXIT) return 'Xe ra';
  if (item.path === ROUTES.ADMIN.PARKING_SESSIONS) return 'Phiên gửi xe';
  if (item.path === ROUTES.STAFF.VEHICLE_REGISTRATIONS) return 'Quản lý đăng ký xe';
  if (item.path === ROUTES.ADMIN.NOTIFICATIONS.BASE) return 'Thông báo';
  if (item.path === ROUTES.ADMIN.USERS) return 'Quản lý tài khoản';
  if (item.path === ROUTES.ADMIN.PERMISSIONS) return 'Phân quyền';
  if (item.path === incidentNavigationItem.path) return 'Sự cố & hỗ trợ';
  return item.label;
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

  const isVehicleEntryPage = location.pathname === ROUTES.ADMIN.VEHICLE_ENTRY;
  return (
    <div
      className={`relative bg-[#F6F8FC] text-slate-900 lg:flex ${
        isVehicleEntryPage ? 'h-screen overflow-hidden' : 'min-h-screen overflow-x-hidden'
      }`}
    >
      <div className="pointer-events-none absolute -right-24 -top-20 h-[360px] w-[360px] rounded-full bg-blue-500 opacity-10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-[340px] w-[340px] rounded-full bg-cyan-300 opacity-10 blur-[120px]" />

      <aside
        className={`hidden min-h-screen flex-shrink-0 border-r border-white/[0.06] bg-gradient-to-b from-[#07142A] via-[#0A1F3D] to-[#10284B] font-[Inter] text-white shadow-[16px_0_46px_rgba(2,12,30,0.35)] transition-[width] duration-300 ease-out lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:h-screen lg:flex-col ${
          collapsed ? 'w-20' : 'w-[280px]'
        }`}
      >
        <div className="relative flex h-full flex-col overflow-hidden p-4">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-500/25 blur-[86px]" />
          <div className="pointer-events-none absolute -bottom-16 right-0 h-52 w-52 rounded-full bg-cyan-300/15 blur-[90px]" />

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
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#38BDF8] shadow-[0_10px_24px_rgba(37,99,235,0.35)]">
                  <Logo variant="icon-only" theme="dark" size="sm" />
                </div>
              ) : (
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#38BDF8] shadow-[0_10px_24px_rgba(37,99,235,0.35)]">
                    <Logo variant="icon-only" theme="dark" size="sm" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">Parking System</p>
                    <p className="truncate text-xs font-medium text-[#94A3B8]">Smart Parking</p>
                  </div>
                </div>
              )}
            </button>

            {!collapsed ? (
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_10px_22px_rgba(2,6,23,0.35)] transition hover:bg-white/15 hover:text-white active:scale-95"
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
              className="relative mx-auto mt-4 grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-white/10 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_10px_22px_rgba(2,6,23,0.35)] transition hover:bg-white/15 hover:text-white active:scale-95"
              aria-label="Mở rộng sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : null}

          <nav className="relative z-10 mt-5 flex-1 overflow-y-auto overflow-x-hidden pr-0.5 pb-44">
            <div className="space-y-2">
              {mainNavigationItems.map((item) => {
                const ItemIcon = item.icon;
                const isActive = isNavigationItemActive(location.pathname, location.search, item.path);
                const label = getNavigationLabel(item);

                return (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    end={item.path === ROUTES.ADMIN.DASHBOARD}
                    title={collapsed ? label : undefined}
                    className={`group relative flex min-h-12 items-center rounded-[18px] text-[14px] font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      collapsed ? 'justify-center px-0 py-[14px]' : 'gap-3 px-4 py-[14px]'
                    } ${
                      isActive
                        ? 'bg-gradient-to-r from-[#2563EB] to-[#38BDF8] text-white shadow-[0_12px_30px_rgba(37,99,235,0.35)]'
                        : 'text-[#CBD5E1] hover:translate-x-1 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    {isActive ? (
                      <span className="absolute left-1.5 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-white to-sky-200" />
                    ) : null}
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                        isActive
                          ? 'bg-white/[0.18] text-white ring-white/20'
                          : 'bg-white/10 text-[#CBD5E1] ring-white/10 group-hover:bg-white/15 group-hover:text-white'
                      }`}
                    >
                      <ItemIcon className="h-4 w-4 shrink-0" />
                    </span>
                    {!collapsed ? <span className="truncate">{label}</span> : null}
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {!collapsed ? (
            <div className="pointer-events-none absolute bottom-[128px] left-5 right-5 z-0 opacity-[0.2]">
              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-95"
                style={{ backgroundImage: "url('/illustrations/parking-sidebar.svg')" }}
              />
            </div>
          ) : null}

          <div className={`absolute bottom-6 left-4 right-4 z-10 border-t border-white/10 pt-4 ${collapsed ? 'space-y-2' : 'flex gap-2'}`}>
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
                  title={collapsed ? getNavigationLabel(incidentNavigationItem) : undefined}
                  className={`group flex h-12 items-center rounded-[18px] border text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] ${
                    collapsed ? 'w-full justify-center px-0' : 'min-w-0 flex-[7] gap-2 px-2.5'
                  } ${
                    isIncidentActive
                      ? 'border-blue-300/30 bg-gradient-to-r from-[#2563EB] to-[#38BDF8] text-white shadow-[0_12px_30px_rgba(37,99,235,0.35)]'
                      : 'border-white/[0.08] bg-white/[0.06] text-[#CBD5E1] hover:translate-x-1 hover:bg-white/[0.1] hover:text-white'
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      isIncidentActive
                        ? 'bg-blue-500/25 text-blue-50 ring-blue-400/30'
                        : 'bg-blue-500/15 text-blue-200 ring-blue-400/20 group-hover:bg-blue-500/25'
                    }`}
                  >
                    <IncidentIcon className="h-4 w-4 shrink-0" />
                  </span>
                  {!collapsed ? <span className="truncate">{getNavigationLabel(incidentNavigationItem)}</span> : null}
                </NavLink>
              );
            })()}

            <button
              type="button"
              title="Đăng xuất"
              onClick={handleLogout}
              className={`flex h-12 items-center rounded-[18px] border border-rose-400/30 bg-[rgba(239,68,68,0.12)] text-sm font-medium text-[#F87171] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:translate-x-1 hover:bg-[#EF4444] hover:text-white active:scale-[0.98] ${
                collapsed ? 'w-full justify-center px-0' : 'min-w-0 flex-[3] justify-center px-2'
              }`}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-rose-500/20 text-current ring-1 ring-rose-400/20">
                <LogOut className="h-4 w-4 shrink-0" />
              </span>
              {!collapsed ? <span className="sr-only">Đăng xuất</span> : null}
            </button>
          </div>
        </div>
      </aside>


      <div
        className={`relative z-10 flex min-w-0 flex-1 flex-col transition-[margin] duration-300 ease-out ${
          collapsed ? 'lg:ml-20' : 'lg:ml-[280px]'
        } ${isVehicleEntryPage ? 'h-full overflow-hidden' : ''}`}
      >
        <header className="sticky top-0 z-40 h-[72px] border-b border-black/5 bg-white px-5 lg:px-8">
          <div className="flex h-full items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Parking Management
              </p>
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
              ? 'min-h-0 min-w-0 flex-1 overflow-hidden p-3 sm:p-4'
              : 'min-w-0 flex-1 p-6 sm:p-7 lg:p-8'
          }
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
