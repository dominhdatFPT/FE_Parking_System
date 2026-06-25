import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { customerService } from '../../../services/customerService';
import { ROUTES } from '../../../constants/routes';
import { apiDateTimeMillis } from '../../../utils/dateTime';

const typeIcon = { info: 'info', success: 'check_circle', warning: 'warning', error: 'error' };
const typeColor = {
  info: 'bg-sky-100 text-sky-600',
  success: 'bg-emerald-100 text-emerald-600',
  warning: 'bg-amber-100 text-amber-600',
  error: 'bg-red-100 text-red-600',
};

function timeAgo(dateStr, t) {
  const diff = Date.now() - apiDateTimeMillis(dateStr);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t('time.justNow');
  if (mins < 60) return t('time.minutesAgo', { count: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t('time.hoursAgo', { count: hours });
  const days = Math.floor(hours / 24);
  return t('time.daysAgo', { count: days });
}

export default function NotificationPanel() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await customerService.getNotifications();
      if (!cancelled) {
        setNotifications(Array.isArray(data) ? data.slice(0, 4) : []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] text-white shadow-sm">
            <span className="material-symbols-outlined text-[16px]">notifications</span>
          </span>
          {t('header.notifications')}
        </h3>
        <button
          type="button"
          onClick={() => navigate(ROUTES.DRIVER.NOTIFICATIONS)}
          className="text-xs font-semibold text-sky-600 transition hover:text-sky-700"
        >
          {t('common.viewAll')}
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-50" />
          ))
        ) : notifications.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-400">{t('header.noNotifications')}</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 rounded-xl p-3 transition-colors ${n.read ? 'bg-white' : 'bg-sky-50/60'}`}
            >
              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeColor[n.type] || typeColor.info}`}>
                <span className="material-symbols-outlined text-[16px]">{typeIcon[n.type] || 'info'}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className={`text-xs font-semibold ${n.read ? 'text-slate-500' : 'text-slate-700'}`}>{n.title}</p>
                  {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />}
                </div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400 line-clamp-2">{n.message}</p>
              </div>
              <span className="shrink-0 text-[10px] text-slate-400">{timeAgo(n.time, t)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
