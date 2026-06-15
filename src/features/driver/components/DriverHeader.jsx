import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/useAuth';
import { bookingService } from '../../../services/bookingService';
import { ROUTES } from '../../../constants/routes';

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

  const currentLang = i18n.language;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await bookingService.getNotifications();
      if (!cancelled) {
        setNotifications(Array.isArray(data) ? data : []);
        setUnreadCount(Array.isArray(data) ? data.filter((n) => !n.read).length : 0);
      }
    })();
    return () => { cancelled = true; };
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
    await bookingService.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    await bookingService.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const typeIcon = { info: 'info', success: 'check_circle', warning: 'warning', error: 'error' };
  const typeColor = {
    info: 'bg-sky-100 text-sky-600',
    success: 'bg-emerald-100 text-emerald-600',
    warning: 'bg-amber-100 text-amber-600',
    error: 'bg-red-100 text-red-600',
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
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
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-sky-200/40 bg-white/80 px-4 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-sky-500 transition hover:bg-sky-50 lg:hidden"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="relative hidden sm:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('header.searchPlaceholder')}
            className="w-64 rounded-lg border-0 bg-sky-50/50 py-2 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-sky-200 lg:w-80"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <p className="hidden text-sm text-slate-500 md:block">
          {t('header.greeting')}, <span className="font-semibold text-slate-700">{displayName}</span>
        </p>

        {/* Language Switcher */}
        <div ref={langRef} className="relative">
          <button
            type="button"
            onClick={() => setLangOpen((p) => !p)}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-sky-200/60 bg-white px-3 text-sm font-medium text-slate-600 shadow-sm transition-all duration-200 hover:border-sky-300 hover:bg-sky-50/50"
          >
            <span className="text-base">{currentLang === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-sky-100 bg-white shadow-[0_12px_40px_-10px_rgba(14,165,233,0.15)]">
              <button
                type="button"
                onClick={() => switchLang('vi')}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition hover:bg-sky-50 ${currentLang === 'vi' ? 'font-semibold text-sky-600' : 'text-slate-600'}`}
              >
                <span>🇻🇳</span> Tiếng Việt
              </button>
              <button
                type="button"
                onClick={() => switchLang('en')}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition hover:bg-sky-50 ${currentLang === 'en' ? 'font-semibold text-sky-600' : 'text-slate-600'}`}
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
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-sky-200/60 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-sky-300 hover:bg-sky-50/50 hover:text-sky-600"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_20px_60px_-15px_rgba(14,165,233,0.15)]">
              <div className="flex items-center justify-between border-b border-sky-100/60 px-4 py-3">
                <p className="text-sm font-bold text-slate-800">{t('header.notifications')}</p>
                {unreadCount > 0 && (
                  <button type="button" onClick={handleMarkAllRead} className="text-xs font-medium text-sky-600 transition hover:text-sky-700">
                    {t('common.markAllRead')}
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-400">{t('header.noNotifications')}</div>
                ) : (
                  notifications.slice(0, 6).map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => handleMarkRead(n.id)}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-sky-50/50 ${!n.read ? 'bg-sky-50/60' : ''}`}
                    >
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeColor[n.type] || typeColor.info}`}>
                        <span className="material-symbols-outlined text-[16px]">{typeIcon[n.type] || 'info'}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-semibold ${n.read ? 'text-slate-500' : 'text-slate-800'}`}>{n.title}</p>
                        <p className="mt-0.5 text-xs text-slate-400 line-clamp-2">{n.message}</p>
                      </div>
                      <span className="shrink-0 text-[10px] text-slate-400">{timeAgo(n.time)}</span>
                    </button>
                  ))
                )}
              </div>
              <div className="border-t border-sky-100/60 p-2">
                <button
                  type="button"
                  onClick={() => { setNotifOpen(false); navigate(ROUTES.DRIVER.NOTIFICATIONS); }}
                  className="w-full rounded-lg py-2 text-center text-xs font-semibold text-sky-600 transition hover:bg-sky-50"
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
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] text-sm font-bold text-white shadow-md shadow-sky-300/30 transition-all duration-200 hover:shadow-lg hover:shadow-sky-400/40 hover:scale-105"
        >
          {displayName.charAt(0).toUpperCase()}
        </button>
      </div>
    </header>
  );
}
