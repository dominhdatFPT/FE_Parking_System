import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/useAuth';
import { customerService } from '../../../services/customerService';
import { ROUTES } from '../../../constants/routes';
import NotificationDetailModal from './NotificationDetailModal';
import { apiDateTimeMillis } from '../../../utils/dateTime';

export default function DriverHeader({ onToggleSidebar }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const displayName = user?.fullName || user?.name || 'Driver';
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);
  const langRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);

  const currentLang = i18n.language;

  useEffect(() => {
    let cancelled = false;
    const loadNotifications = async () => {
      const { data } = await customerService.getNotifications();
      if (!cancelled) {
        setNotifications(Array.isArray(data) ? data : []);
        setUnreadCount(Array.isArray(data) ? data.filter((n) => !n.read).length : 0);
      }
    };
    loadNotifications();
    const intervalId = window.setInterval(loadNotifications, 10000);
    return () => { cancelled = true; window.clearInterval(intervalId); };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id) => {
    await customerService.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    await customerService.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const openNotification = async (notification) => {
    setNotifOpen(false);
    setSelectedNotification({ ...notification, read: true });
    if (!notification.read) await handleMarkRead(notification.id);
  };

  const typeIcon = { info: 'info', success: 'check_circle', warning: 'warning', error: 'error' };
  const typeColor = {
    info: 'bg-sky-100 text-sky-600',
    success: 'bg-emerald-100 text-emerald-600',
    warning: 'bg-amber-100 text-amber-600',
    error: 'bg-red-100 text-red-600',
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - apiDateTimeMillis(dateStr);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('time.justNow');
    if (mins < 60) return t('time.minutesAgo', { count: mins });
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t('time.hoursAgo', { count: hours });
    const days = Math.floor(hours / 24);
    return t('time.daysAgo', { count: days });
  };

  const switchLang = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  return (
    <>
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 transition-all duration-300 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all duration-300 hover:bg-slate-50 active:scale-95 lg:hidden"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <p className="hidden text-sm text-slate-500 md:block">
          {t('header.greeting')}, <span className="font-semibold text-slate-800">{displayName}</span>
        </p>

        {/* Language Switcher */}
        <div ref={langRef} className="relative">
          <button
            type="button"
            onClick={() => setLangOpen((p) => !p)}
            className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200/60 bg-white px-3 text-sm font-medium text-slate-600 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-slate-300 hover:bg-slate-50 active:scale-95"
          >
            <span className="text-sm">{currentLang === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
            <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-slate-100 bg-white p-1 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.08)]">
              <button
                type="button"
                onClick={() => switchLang('vi')}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-300 hover:bg-slate-50 ${currentLang === 'vi' ? 'font-semibold text-sky-600' : 'text-slate-600'}`}
              >
                <span>🇻🇳</span> Tiếng Việt
              </button>
              <button
                type="button"
                onClick={() => switchLang('en')}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-300 hover:bg-slate-50 ${currentLang === 'en' ? 'font-semibold text-sky-600' : 'text-slate-600'}`}
              >
                <span>🇺🇸</span> English
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((p) => !p)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/60 bg-white text-slate-500 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">{t('header.notifications')}</p>
                {unreadCount > 0 && (
                  <button type="button" onClick={handleMarkAllRead} className="text-xs font-semibold text-sky-600 transition-all duration-300 hover:text-sky-700">
                    {t('common.markAllRead')}
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 font-medium">{t('header.noNotifications')}</div>
                ) : (
                  notifications.slice(0, 6).map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => openNotification(n)}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-all duration-300 hover:bg-slate-50/50 ${!n.read ? 'bg-sky-50/20' : ''}`}
                    >
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeColor[n.type] || typeColor.info}`}>
                        <span className="material-symbols-outlined text-[16px]">{typeIcon[n.type] || 'info'}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-semibold ${n.read ? 'text-slate-500' : 'text-slate-800'}`}>{n.title}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{n.message}</p>
                      </div>
                      <span className="shrink-0 text-[10px] text-slate-400">{timeAgo(n.time)}</span>
                    </button>
                  ))
                )}
              </div>
              <div className="border-t border-slate-100 p-2">
                <button
                  type="button"
                  onClick={() => { setNotifOpen(false); navigate(ROUTES.DRIVER.NOTIFICATIONS); }}
                  className="w-full rounded-xl py-2 text-center text-xs font-semibold text-sky-600 transition-all duration-300 hover:bg-slate-50"
                >
                  {t('header.viewAllNotifications')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <button
          type="button"
          onClick={() => navigate(ROUTES.DRIVER.PROFILE)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white transition-all duration-300 hover:bg-slate-700 active:scale-95 shadow-sm"
        >
          {displayName.charAt(0).toUpperCase()}
        </button>
      </div>
    </header>
    <NotificationDetailModal notification={selectedNotification} onClose={() => setSelectedNotification(null)} />
    </>
  );
}
