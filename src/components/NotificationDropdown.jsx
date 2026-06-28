import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Icon from './Icon';
import { ROUTES } from '../constants/routes';
import { getDatabaseNotifications } from '../services/notificationService';

const typeStyles = {
  critical: { icon: 'priority_high', badge: 'text-rose-600', ring: 'bg-rose-50 ring-rose-100' },
  warning: { icon: 'warning', badge: 'text-amber-600', ring: 'bg-amber-50 ring-amber-100' },
  success: { icon: 'check_circle', badge: 'text-emerald-600', ring: 'bg-emerald-50 ring-emerald-100' },
};

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [readIds, setReadIds] = useState(new Set());

  useEffect(() => {
    let active = true;
    getDatabaseNotifications().then((data) => { if (active) setItems(data); }).catch(() => { if (active) setItems([]); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const close = (event) => {
      if (visible && panelRef.current && !panelRef.current.contains(event.target) && !buttonRef.current?.contains(event.target)) setVisible(false);
    };
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, [visible]);

  const unreadCount = items.filter((item) => !readIds.has(item.id)).length;
  const handleClick = (id) => {
    setReadIds((current) => new Set([...current, id]));
    setVisible(false);
    navigate(`${ROUTES.ADMIN.NOTIFICATIONS.BASE}/${id}`);
  };

  return (
    <div className="relative">
      <button ref={buttonRef} type="button" onClick={() => setVisible((value) => !value)} aria-label="Thông báo" className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm backdrop-blur transition-all duration-200 hover:scale-105 hover:border-blue-200 hover:text-[#1D6BFF] hover:shadow-md active:scale-[0.98]">
        <Icon name="notifications" />
        {unreadCount > 0 ? <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#F43F5E] px-1.5 text-[11px] font-semibold text-white ring-2 ring-white">{unreadCount}</span> : null}
      </button>
      {visible ? (
        <div ref={panelRef} className="absolute right-0 top-full z-[9999] mt-3 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-[24px] border border-white/70 bg-white/95 shadow-2xl backdrop-blur-2xl">
          <div className="border-b border-slate-100 px-4 py-4"><p className="text-sm font-semibold text-slate-950">Thông báo từ hệ thống</p><p className="mt-1 text-xs text-slate-500">{unreadCount} thông báo chưa đọc</p></div>
          <div className="max-h-[480px] overflow-y-auto">{items.length === 0 ? <div className="p-6 text-center text-sm text-slate-500">Database chưa có thông báo.</div> : items.map((item) => {
            const style = typeStyles[item.type] || typeStyles.warning;
            const unread = !readIds.has(item.id);
            return <button key={item.id} type="button" onClick={() => handleClick(item.id)} className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-4 text-left ${unread ? 'bg-blue-50/70' : 'bg-white'}`}><span className={`mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl ring-1 ${style.ring}`}><span className={`material-symbols-outlined text-[18px] ${style.badge}`}>{style.icon}</span></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-900">{item.title}</p><p className="mt-1 text-sm text-slate-500">{item.message}</p></div><time className="shrink-0 text-xs text-slate-400">{item.time}</time></button>;
          })}</div>
        </div>
      ) : null}
    </div>
  );
}
