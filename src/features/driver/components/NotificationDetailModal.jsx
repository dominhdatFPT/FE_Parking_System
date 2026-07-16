import { useTranslation } from 'react-i18next';
import { vietnamDayjs } from '../../../utils/dateTime';
import { translateNotificationText } from '../../../utils/notificationText';

const TYPE_LABEL_KEYS = {
  info: 'notifications.info',
  success: 'notifications.success',
  warning: 'notifications.warning',
  error: 'notifications.error',
};

const TYPE_STYLES = {
  info: 'bg-sky-100 text-sky-600',
  success: 'bg-emerald-100 text-emerald-600',
  warning: 'bg-amber-100 text-amber-600',
  error: 'bg-rose-100 text-rose-600',
};

const TYPE_ICONS = {
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  error: 'support_agent',
};

export default function NotificationDetailModal({ notification, onClose }) {
  const { t, i18n } = useTranslation();

  if (!notification) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]">
      <button type="button" aria-label={t('notifications.closeDetail')} className="absolute inset-0" onClick={onClose} />
      <section className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-[0_30px_90px_rgba(15,23,42,0.3)]">
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${TYPE_STYLES[notification.type] || TYPE_STYLES.info}`}>
              <span className="material-symbols-outlined">{TYPE_ICONS[notification.type] || TYPE_ICONS.info}</span>
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t(TYPE_LABEL_KEYS[notification.type] || TYPE_LABEL_KEYS.info)}
              </p>
              <h2 className="mt-1 text-xl font-extrabold leading-7 text-slate-900">
                {translateNotificationText(notification.title, i18n.language)}
              </h2>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label={t('notifications.closeDetail')} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="space-y-5 px-6 py-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('notifications.contentLabel')}</p>
            <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700 ring-1 ring-slate-100">
              {translateNotificationText(notification.content || notification.message, i18n.language) || t('notifications.noContent')}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span className="font-semibold">{t('notifications.sender')}: Staff/Admin Smart Parking</span>
            <time>{vietnamDayjs(notification.time).format('HH:mm DD/MM/YYYY')}</time>
          </div>
        </div>

        <footer className="flex justify-end border-t border-slate-100 bg-slate-50/70 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-xl bg-[#0EA5E9] px-6 py-2.5 text-sm font-bold !text-white transition hover:bg-[#0284c7]">
            {t('notifications.understood')}
          </button>
        </footer>
      </section>
    </div>
  );
}
