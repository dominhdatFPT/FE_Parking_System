import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bookingService } from '../../../../services/bookingService';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import NotificationDetailModal from '../../components/NotificationDetailModal';
import { apiDateTimeMillis, vietnamDayjs } from '../../../../utils/dateTime';

const INITIAL_VISIBLE_COUNT = 8;

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
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const loadNotifications = async () => {
      const { data } = await bookingService.getNotifications();
      if (!cancelled) {
        setNotifications(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    };
    loadNotifications();
    const intervalId = window.setInterval(loadNotifications, 10000);
    return () => { cancelled = true; window.clearInterval(intervalId); };
  }, []);

  const handleMarkRead = async (id) => {
    await bookingService.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllRead = async () => {
    await bookingService.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const openNotification = async (notification) => {
    setSelectedNotification({ ...notification, read: true });
    if (!notification.read) await handleMarkRead(notification.id);
  };

  const filtered = notifications.filter((n) => {
    const matchesReadState = filter === 'ALL' || !n.read;
    const matchesType = typeFilter === 'ALL' || n.type === typeFilter;
    return matchesReadState && matchesType;
  });

  const visibleNotifications = filtered.slice(0, visibleCount);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filters = [
    { key: 'ALL', label: t('notifications.all') },
    { key: 'UNREAD', label: t('notifications.unread') },
  ];

  const typeFilters = [
    { key: 'ALL', label: t('notifications.allTypes') },
    { key: 'info', label: t('notifications.info') },
    { key: 'success', label: t('notifications.success') },
    { key: 'warning', label: t('notifications.warning') },
    { key: 'error', label: t('notifications.error') },
  ];

  const relativeTime = (value) => {
    const timestamp = apiDateTimeMillis(value);
    if (!Number.isFinite(timestamp)) return '';

    const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
    if (minutes < 1) return t('time.justNow');
    if (minutes < 60) return t('time.minutesAgo', { count: minutes });

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t('time.hoursAgo', { count: hours });

    return t('time.daysAgo', { count: Math.floor(hours / 24) });
  };

  return (
    <div className="space-y-4 pb-24">
      <PageHeader
        title={t('notifications.title')}
        subtitle={unreadCount > 0 ? t('notifications.unreadCount', { count: unreadCount }) : t('notifications.allRead')}
        icon="notifications" variant="banner"
        compact
        actions={
          unreadCount > 0 ? (
            <Button variant="secondary" size="md" icon="done_all" onClick={handleMarkAllRead}>
              {t('common.markAllRead')}
            </Button>
          ) : null
        }
      />

      <div className="flex flex-col gap-3 rounded-2xl bg-white/80 p-2.5 shadow-[0_12px_32px_rgba(15,23,42,0.04)] ring-1 ring-slate-900/[0.05] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-xl bg-slate-100/80 p-1">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => { setFilter(f.key); setVisibleCount(INITIAL_VISIBLE_COUNT); }}
              className={`flex min-h-9 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 text-xs font-semibold transition-all duration-300 sm:flex-none ${
                filter === f.key
                  ? 'bg-white text-slate-900 shadow-[0_6px_16px_rgba(15,23,42,0.07)]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {f.label}
              {f.key === 'UNREAD' && unreadCount > 0 ? (
                <span className="grid min-w-5 place-items-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        <label className="relative flex items-center gap-2 px-1 sm:px-0">
          <span className="material-symbols-outlined pointer-events-none absolute left-3 text-[17px] text-slate-400 sm:left-2">filter_list</span>
          <span className="sr-only">{t('notifications.filterByType')}</span>
          <select
            value={typeFilter}
            onChange={(event) => { setTypeFilter(event.target.value); setVisibleCount(INITIAL_VISIBLE_COUNT); }}
            className="h-9 w-full appearance-none rounded-xl bg-white py-0 pl-9 pr-9 text-xs font-semibold text-slate-600 outline-none ring-1 ring-slate-200 transition-all focus:ring-2 focus:ring-sky-300 sm:w-44"
          >
            {typeFilters.map((option) => (
              <option key={option.key} value={option.key}>{option.label}</option>
            ))}
          </select>
          <span className="material-symbols-outlined pointer-events-none absolute right-3 text-[17px] text-slate-400 sm:right-2">expand_more</span>
        </label>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[88px] animate-pulse rounded-2xl bg-white/80 shadow-sm" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="notifications_off"
          title={t('notifications.noNotifications')}
          description={filter !== 'ALL' || typeFilter !== 'ALL' ? t('notifications.tryFilter') : t('notifications.noNotificationsDesc')}
        />
      ) : (
        <div className="overflow-hidden rounded-[22px] bg-white/70 shadow-[0_18px_46px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.05]">
          {visibleNotifications.map((n, index) => (
            <article
              key={n.id}
              className={`group relative flex min-h-[88px] items-stretch transition-colors duration-300 ${
                n.read ? 'bg-white/80 hover:bg-slate-50' : 'bg-sky-50/75 hover:bg-sky-50'
              } ${index > 0 ? 'border-t border-slate-100' : ''}`}
            >
              {!n.read ? <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-sky-500" aria-hidden="true" /> : null}
              <button
                type="button"
                onClick={() => openNotification(n)}
                className="flex min-w-0 flex-1 items-start gap-3 px-4 py-3.5 text-left outline-none transition-all focus-visible:bg-sky-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-300 sm:items-center sm:gap-4 sm:px-5"
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${typeColor[n.type] || typeColor.info}`}>
                  <span className="material-symbols-outlined text-[19px]">{typeIcon[n.type] || 'info'}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <strong className={`truncate text-sm ${n.read ? 'font-semibold text-slate-600' : 'font-bold text-slate-900'}`}>
                      {n.title}
                    </strong>
                    <time
                      dateTime={n.time}
                      title={vietnamDayjs(n.time).format('HH:mm DD/MM/YYYY')}
                      className="shrink-0 text-[11px] font-medium tabular-nums text-slate-400"
                    >
                      {relativeTime(n.time)}
                    </time>
                  </span>
                  <span className={`mt-1 block truncate text-sm leading-5 ${n.read ? 'text-slate-400' : 'text-slate-600'}`}>
                    {n.message}
                  </span>
                </span>
              </button>
              {!n.read ? (
                <button
                  type="button"
                  onClick={() => handleMarkRead(n.id)}
                  title={t('common.markRead')}
                  aria-label={t('common.markRead')}
                  className="mr-3 self-center grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sky-600 opacity-100 outline-none transition-all duration-300 hover:bg-sky-100 active:scale-95 focus-visible:ring-2 focus-visible:ring-sky-300 sm:mr-4 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                >
                  <span className="material-symbols-outlined text-[19px]">done</span>
                </button>
              ) : null}
            </article>
          ))}

          {visibleCount < filtered.length ? (
            <div className="border-t border-slate-100 bg-white/80 p-3 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + INITIAL_VISIBLE_COUNT)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-sky-600 outline-none transition-all duration-300 hover:bg-sky-50 hover:text-sky-700 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-300"
              >
                {t('notifications.showMore', { count: filtered.length - visibleCount })}
              </button>
            </div>
          ) : null}
        </div>
      )}
      <NotificationDetailModal notification={selectedNotification} onClose={() => setSelectedNotification(null)} />
    </div>
  );
}
