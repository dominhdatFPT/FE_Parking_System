import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { bookingService } from '../../../../services/bookingService';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';

const typeIcon = { info: 'info', success: 'check_circle', warning: 'warning', error: 'error' };
const typeColor = {
  info: 'bg-sky-100 text-sky-600',
  success: 'bg-emerald-100 text-emerald-600',
  warning: 'bg-amber-100 text-amber-600',
  error: 'bg-red-100 text-red-600',
};

export default function DriverNotifications() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await bookingService.getNotifications();
      if (!cancelled) {
        setNotifications(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleMarkRead = async (id) => {
    await bookingService.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllRead = async () => {
    await bookingService.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'ALL') return true;
    if (filter === 'UNREAD') return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filters = [
    { key: 'ALL', label: t('notifications.all') },
    { key: 'UNREAD', label: t('notifications.unread') },
    { key: 'info', label: t('notifications.info') },
    { key: 'success', label: t('notifications.success') },
    { key: 'warning', label: t('notifications.warning') },
    { key: 'error', label: t('notifications.error') },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('notifications.title')}
        subtitle={unreadCount > 0 ? t('notifications.unreadCount', { count: unreadCount }) : t('dashboard.confirmedBookings')}
        icon="notifications"
        actions={
          unreadCount > 0 ? (
            <Button variant="secondary" size="md" icon="done_all" onClick={handleMarkAllRead}>
              {t('common.markAllRead')}
            </Button>
          ) : null
        }
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              filter === f.key ? 'bg-sky-50 text-sky-600 ring-1 ring-sky-200' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {f.label}
            {f.key === 'UNREAD' && unreadCount > 0 && (
              <span className="ml-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white shadow-sm" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="notifications_off"
          title={t('notifications.noNotifications')}
          description={filter !== 'ALL' ? t('notifications.tryFilter') : t('notifications.noNotificationsDesc')}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`group flex items-start gap-4 rounded-2xl border p-4 transition-all duration-200 ${
                n.read
                  ? 'border-slate-100/80 bg-white'
                  : 'border-sky-100 bg-sky-50/40 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
              } hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${typeColor[n.type] || typeColor.info}`}>
                <span className="material-symbols-outlined text-[20px]">{typeIcon[n.type] || 'info'}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-bold ${n.read ? 'text-slate-600' : 'text-slate-800'}`}>{n.title}</p>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-sky-500" />}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{n.message}</p>
                <p className="mt-2 text-xs text-slate-400">{dayjs(n.time).format('HH:mm DD/MM/YYYY')}</p>
              </div>
              {!n.read && (
                <button
                  type="button"
                  onClick={() => handleMarkRead(n.id)}
                  className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-sky-600 opacity-0 transition-all hover:bg-sky-100 group-hover:opacity-100"
                >
                  {t('common.markRead')}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
