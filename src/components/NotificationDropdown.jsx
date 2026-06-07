import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Icon from './Icon';
import { ROUTES } from '../constants/routes';
import { getNotificationsForRole, getUnreadCount, markNotificationAsRead } from '../features/notifications/notifications';
import { useAuth } from '../contexts/AuthContext';

const typeStyles = {
  critical: {
    icon: 'priority_high',
    badge: 'bg-red-500 text-white',
    ring: 'ring-red-100',
  },
  warning: {
    icon: 'warning',
    badge: 'bg-amber-500 text-white',
    ring: 'ring-amber-100',
  },
  success: {
    icon: 'check_circle',
    badge: 'bg-emerald-500 text-white',
    ring: 'ring-emerald-100',
  },
};

export default function NotificationDropdown() {
  const { role } = useAuth();
  const notificationRole = role === 'admin' ? 'admin' : 'staff';
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState(() => getNotificationsForRole(notificationRole));

  useEffect(() => {
    setItems(getNotificationsForRole(notificationRole));
  }, [notificationRole]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        visible &&
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        !buttonRef.current?.contains(event.target)
      ) {
        setVisible(false);
      }
    }

    function handleEscape(event) {
      if (visible && event.key === 'Escape') {
        setVisible(false);
        buttonRef.current?.focus();
      }
    }

    window.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [visible]);

  const unreadCount = getUnreadCount(notificationRole);

  function handleNotificationClick(id) {
    markNotificationAsRead(id);
    setItems(getNotificationsForRole(notificationRole));
    setVisible(false);
    navigate(`${ROUTES.ADMIN.NOTIFICATIONS.BASE}/${id}`);
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        aria-haspopup="dialog"
        aria-controls="notification-popup"
        aria-expanded={visible}
        aria-label="Thông báo"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <Icon name="notifications" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white leading-none">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {visible ? (
        <div
          ref={panelRef}
          id="notification-popup"
          role="dialog"
          aria-label="Danh sách thông báo"
          className="absolute right-0 top-full z-[9999] mt-3 w-[380px] overflow-hidden rounded-[18px] border border-[#E5E7EB] bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)]"
        >
          <div className="border-b border-slate-200 px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">Thông báo</p>
                <p className="mt-1 text-xs text-slate-500">Bạn có {unreadCount} thông báo chưa đọc</p>
              </div>
              <button
                type="button"
                onClick={() => setVisible(false)}
                className="rounded-full px-3 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                Đóng
              </button>
            </div>
          </div>

          <div className="max-h-[480px] overflow-y-auto bg-white">
            {items.length === 0 ? (
              <div className="p-4 text-sm text-slate-500">Không có thông báo.</div>
            ) : (
              items.map((item) => {
                const typeStyle = typeStyles[item.type] ?? typeStyles.warning;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNotificationClick(item.id)}
                    className={`group flex w-full items-start gap-3 border-b border-slate-100 px-4 py-4 text-left transition ${
                      item.unread ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className={`mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl ${typeStyle.ring} ring-1`}>
                      <span className={`material-symbols-outlined text-[18px] ${typeStyle.badge}`}>{typeStyle.icon}</span>
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={`min-w-0 text-sm ${item.unread ? 'font-semibold text-slate-950' : 'text-slate-800'}`}>
                          {item.title}
                        </p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            item.unread ? 'bg-blue-500/10 text-blue-700' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {item.unread ? 'Chưa đọc' : 'Đã đọc'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{item.message}</p>
                    </div>

                    <time className="shrink-0 text-xs text-slate-400">{item.time}</time>
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
