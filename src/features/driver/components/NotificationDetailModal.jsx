import { vietnamDayjs } from '../../../utils/dateTime';

const TYPE_LABELS = {
  info: 'Thông tin',
  success: 'Thành công',
  warning: 'Cảnh báo',
  error: 'Phản hồi sự cố',
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
  if (!notification) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]">
      <button type="button" aria-label="Đóng chi tiết thông báo" className="absolute inset-0" onClick={onClose} />
      <section className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-[0_30px_90px_rgba(15,23,42,0.3)]">
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${TYPE_STYLES[notification.type] || TYPE_STYLES.info}`}>
              <span className="material-symbols-outlined">{TYPE_ICONS[notification.type] || TYPE_ICONS.info}</span>
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{TYPE_LABELS[notification.type] || TYPE_LABELS.info}</p>
              <h2 className="mt-1 text-xl font-extrabold leading-7 text-slate-900">{notification.title}</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="space-y-5 px-6 py-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Nội dung phản hồi</p>
            <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700 ring-1 ring-slate-100">
              {notification.content || notification.message || 'Không có nội dung.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span className="font-semibold">Người gửi: Staff/Admin Smart Parking</span>
            <time>{vietnamDayjs(notification.time).format('HH:mm DD/MM/YYYY')}</time>
          </div>
        </div>

        <footer className="flex justify-end border-t border-slate-100 bg-slate-50/70 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-sky-700">Đã hiểu</button>
        </footer>
      </section>
    </div>
  );
}
