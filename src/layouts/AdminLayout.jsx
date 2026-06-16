import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import {
  AlertTriangle,
  Bell,
  BookOpenCheck,
  Building2,
  CarFront,
  ChevronDown,
  CircleParking,
  ClipboardCheck,
  History,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ScanLine,
  Settings,
  UserCog,
} from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { useAuth } from '../contexts/useAuth';
import NotificationDropdown from '../components/NotificationDropdown';
import { getNotificationsForRole, getUnreadCount } from '../features/notifications/notifications';
import { getStaffOperationsDashboard } from '../services/staffService';

const BADGE_LIMIT = 99;
const OPEN_INCIDENTS_STORAGE_KEY = 'parking.staff.openIncidents';
const INCIDENTS_UPDATED_EVENT = 'parking:incidents-updated';

const clampBadge = (value) => {
  const numberValue = Number(value) || 0;
  return numberValue > BADGE_LIMIT ? `${BADGE_LIMIT}+` : numberValue;
};

const readOpenIncidentsCount = () => {
  if (typeof window === 'undefined') return 0;
  const storedValue = window.localStorage.getItem(OPEN_INCIDENTS_STORAGE_KEY);
  return Number(storedValue) || 0;
};

function Badge({ value, tone = 'bg-rose-500 text-white' }) {
  if (!value) return null;

  return (
    <span className={`ml-auto inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-black leading-none ${tone}`}>
      {clampBadge(value)}
    </span>
  );
}

function SidebarItem({ item, collapsed, badge }) {
  const Icon = item.icon;

  return (
    <NavLink
      title={collapsed ? item.label : undefined}
      to={item.path}
      end={item.path === ROUTES.ADMIN.DASHBOARD || item.path === ROUTES.STAFF.DASHBOARD}
      className={({ isActive }) =>
        [
          'group relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold transition-all',
          collapsed ? 'justify-center' : '',
          isActive
            ? 'bg-[#DBEAFE] text-[#1D4ED8] shadow-[0_4px_12px_rgba(37,99,235,0.12)] ring-1 ring-[#93C5FD]'
            : 'text-slate-600 hover:bg-[#EFF6FF] hover:text-slate-950',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          {isActive && !collapsed ? <span className="absolute left-0 top-2 h-7 w-1 rounded-r-full bg-[#2563EB]" /> : null}
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${isActive ? 'bg-white/80 text-[#2563EB] ring-1 ring-[#93C5FD]' : 'bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 group-hover:text-[#2563EB]'}`}>
            <Icon size={18} strokeWidth={2.2} />
          </span>
          {!collapsed && (
            <>
              <span className="truncate">{item.label}</span>
              <Badge value={badge} tone={item.badgeTone} />
            </>
          )}
          {collapsed && badge ? (
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />
          ) : null}
        </>
      )}
    </NavLink>
  );
}

function SidebarGroup({ group, collapsed, expanded, active, onToggle, badges }) {
  const Icon = group.icon;
  const groupBadge = group.items.reduce((total, item) => total + (Number(badges[item.badgeKey]) || 0), 0);

  return (
    <div>
      <button
        type="button"
        title={collapsed ? group.label : undefined}
        onClick={onToggle}
        className={[
          'group relative flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-bold transition-all',
          collapsed ? 'justify-center' : '',
          active
            ? 'bg-[#F8FAFC] text-[#1D4ED8] ring-1 ring-slate-200'
            : expanded
              ? 'bg-[#F8FAFC] text-slate-700 ring-1 ring-slate-200'
            : 'text-slate-600 hover:bg-[#EFF6FF] hover:text-slate-950',
        ].join(' ')}
      >
        {active && !collapsed ? <span className="absolute left-0 top-2 h-7 w-1 rounded-r-full bg-[#2563EB]" /> : null}
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${active ? 'bg-[#DBEAFE] text-[#2563EB] ring-1 ring-[#93C5FD]' : 'bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 group-hover:text-[#2563EB]'}`}>
          <Icon size={18} strokeWidth={2.2} />
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 truncate">{group.label}</span>
            <Badge value={groupBadge} tone="bg-amber-400 text-slate-950" />
            <ChevronDown
              size={16}
              className={`shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            />
          </>
        )}
      </button>

      {!collapsed && (
        <div
          className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out"
          style={{ gridTemplateRows: expanded ? '1fr' : '0fr', opacity: expanded ? 1 : 0 }}
        >
          <div className="min-h-0">
            <div className="ml-7 mt-1 space-y-1 border-l border-slate-200 pl-3">
              {group.items.map((item) => (
                <SidebarItem
                  key={item.path}
                  item={item}
                  collapsed={false}
                  badge={badges[item.badgeKey]}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, setUser } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState({ operations: true, administration: false });
  const [badges, setBadges] = useState({
    pendingBookings: 0,
    openIncidents: readOpenIncidentsCount(),
    unreadNotifications: 0,
  });

  const normalizedRole = role?.toLowerCase() === 'staff' ? 'staff' : 'admin';

  const navigation = useMemo(
    () => [
      {
        type: 'item',
        label: 'Tổng quan',
        path: ROUTES.ADMIN.DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        type: 'group',
        id: 'operations',
        label: 'Vận hành bãi xe',
        icon: Building2,
        items: [
          { label: 'Parking Operations', path: ROUTES.STAFF.DASHBOARD, icon: CircleParking },
          { label: 'Vehicle Check-in', path: ROUTES.STAFF.VEHICLE_ENTRY, icon: ScanLine },
          { label: 'Vehicle Check-out', path: ROUTES.STAFF.VEHICLE_EXIT, icon: CarFront },
          { label: 'Active Vehicles', path: ROUTES.STAFF.SESSIONS, icon: ClipboardCheck },
        ],
      },
      {
        type: 'item',
        label: 'Quản lý booking',
        path: ROUTES.STAFF.BOOKINGS,
        icon: BookOpenCheck,
        badgeKey: 'pendingBookings',
        badgeTone: 'bg-amber-400 text-slate-950',
      },
      {
        type: 'group',
        id: 'administration',
        label: 'Quản trị hệ thống',
        icon: Settings,
        items: [
          { label: 'User Management', path: ROUTES.ADMIN.USERS, icon: UserCog },
          { label: 'System Configuration', path: ROUTES.ADMIN.SYSTEM_CONFIG, icon: Settings },
        ],
      },
      {
        type: 'item',
        label: 'Lịch sử',
        path: ROUTES.ADMIN.AUDIT_LOG,
        icon: History,
      },
    ],
    [],
  );

  useEffect(() => {
    setBadges((current) => ({
      ...current,
      unreadNotifications: getUnreadCount(normalizedRole),
      openIncidents: readOpenIncidentsCount(),
    }));

    let cancelled = false;
    getStaffOperationsDashboard()
      .then((dashboard) => {
        if (!cancelled) {
          setBadges((current) => ({ ...current, pendingBookings: Number(dashboard?.metrics?.pendingBookings) || 0 }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBadges((current) => ({ ...current, pendingBookings: 0 }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedRole]);

  useEffect(() => {
    const syncOpenIncidents = () => {
      setBadges((current) => ({ ...current, openIncidents: readOpenIncidentsCount() }));
    };

    window.addEventListener(INCIDENTS_UPDATED_EVENT, syncOpenIncidents);
    window.addEventListener('storage', syncOpenIncidents);

    return () => {
      window.removeEventListener(INCIDENTS_UPDATED_EVENT, syncOpenIncidents);
      window.removeEventListener('storage', syncOpenIncidents);
    };
  }, []);

  useEffect(() => {
    const activeGroups = navigation
      .filter((item) => item.type === 'group' && item.items.some((child) => location.pathname.startsWith(child.path)))
      .map((item) => item.id);

    if (activeGroups.length) {
      setOpenGroups((current) => ({
        ...current,
        ...Object.fromEntries(activeGroups.map((groupId) => [groupId, true])),
      }));
    }
  }, [location.pathname, navigation]);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const openFirstNotification = () => {
    const notifications = getNotificationsForRole(normalizedRole);
    const notification = notifications.find((item) => item.unread) ?? notifications[0];

    if (notification) {
      navigate(`${ROUTES.ADMIN.NOTIFICATIONS.BASE}/${notification.id}`);
    }
  };

  const isGroupActive = (group) => group.items.some((item) => location.pathname.startsWith(item.path));

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-950 transition-[grid-template-columns] duration-300 lg:grid ${collapsed ? 'lg:grid-cols-[84px_minmax(0,1fr)]' : 'lg:grid-cols-[280px_minmax(0,1fr)]'}`}>
      <aside className="sticky top-0 z-30 hidden h-screen border-r border-slate-200 bg-white/95 shadow-sm backdrop-blur lg:flex lg:flex-col">
        <div className={`flex h-16 items-center border-b border-slate-200 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className={`flex min-w-0 items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <img
              alt="Parking System Logo"
              className="h-10 w-10 shrink-0 object-contain"
              src="/parking-system-logo.png"
            />
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-base font-black tracking-tight text-slate-950">Parking System</p>
                <p className="truncate text-xs font-semibold text-slate-500">Operations Dashboard</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose size={19} />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="mx-auto mt-3 grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen size={19} />
          </button>
        )}

        <nav className={`flex-1 space-y-1 overflow-y-auto px-3 py-4 ${collapsed ? 'px-2' : ''}`}>
          {navigation.map((item) =>
            item.type === 'group' ? (
              <SidebarGroup
                key={item.id}
                group={item}
                collapsed={collapsed}
                expanded={openGroups[item.id]}
                active={isGroupActive(item)}
                badges={badges}
                onToggle={() => setOpenGroups((current) => ({ ...current, [item.id]: !current[item.id] }))}
              />
            ) : (
              <SidebarItem
                key={item.path}
                item={item}
                collapsed={collapsed}
                badge={badges[item.badgeKey]}
              />
            ),
          )}
        </nav>

        <div className="border-t border-slate-200 p-3">
          {!collapsed ? (
            <div className="mb-3 grid gap-2 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
              <button
                type="button"
                onClick={() => navigate(ROUTES.STAFF.EXCEPTIONS)}
                className="flex items-center gap-3 rounded-md px-2 py-2 text-left text-sm font-bold text-slate-700 transition hover:bg-white hover:text-slate-950"
              >
                <AlertTriangle size={17} className="text-rose-500" />
                <span className="min-w-0 flex-1 truncate">Sự cố đang mở</span>
                <Badge value={badges.openIncidents} />
              </button>
              <button
                type="button"
                onClick={openFirstNotification}
                className="flex items-center gap-3 rounded-md px-2 py-2 text-left text-sm font-bold text-slate-700 transition hover:bg-white hover:text-slate-950"
              >
                <Bell size={17} className="text-sky-600" />
                <span className="min-w-0 flex-1 truncate">Thông báo chưa đọc</span>
                <Badge value={badges.unreadNotifications} tone="bg-sky-600 text-white" />
              </button>
            </div>
          ) : (
            <div className="mb-3 grid place-items-center gap-2">
              <button
                type="button"
                title="Sự cố đang mở"
                onClick={() => navigate(ROUTES.STAFF.EXCEPTIONS)}
                className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-rose-600"
              >
                <AlertTriangle size={18} />
                {badges.openIncidents ? <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" /> : null}
              </button>
              <button
                type="button"
                title="Thông báo chưa đọc"
                onClick={openFirstNotification}
                className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-sky-600"
              >
                <Bell size={18} />
                {badges.unreadNotifications ? <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-sky-600" /> : null}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? 'Đăng xuất' : undefined}
            className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-black text-rose-600 transition hover:bg-rose-50 ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={18} />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-6">
          <div>
            <p className="text-sm font-black text-slate-950">Back-office chung</p>
            <p className="text-xs font-semibold text-slate-500">Admin và Staff dùng chung khu vận hành</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(ROUTES.STAFF.BOOKINGS)}
              className="hidden items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-black text-amber-700 ring-1 ring-amber-100 transition hover:bg-amber-100 sm:inline-flex"
            >
              <BookOpenCheck size={17} />
              <span>{clampBadge(badges.pendingBookings)} chờ duyệt</span>
            </button>
            <NotificationDropdown />
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
