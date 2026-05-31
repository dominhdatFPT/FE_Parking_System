import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { ROUTES } from '../constants/routes';
import { getNotificationsForRole, getUnreadCount, markNotificationAsRead, } from '../features/notifications/notifications';
import { useAuth } from '../contexts/AuthContext';
export default function NotificationDropdown() {
    const { role } = useAuth();
    const notificationRole = role === 'admin' ? 'admin' : 'staff';
    const navigate = useNavigate();
    const buttonRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [items, setItems] = useState(() => getNotificationsForRole(notificationRole));
    const ref = useRef(null);
    useEffect(() => {
        setItems(getNotificationsForRole(notificationRole));
    }, [notificationRole]);
    useEffect(() => {
        function handleOutsideClick(event) {
            if (visible && ref.current && !ref.current.contains(event.target)) {
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
    useEffect(() => {
        if (!visible)
            return;
        if (ref.current) {
            const firstButton = ref.current.querySelector('.notification-item');
            firstButton?.focus();
        }
    }, [visible]);
    function handleSelect(id) {
        markNotificationAsRead(id);
        setItems(getNotificationsForRole(notificationRole));
        setVisible(false);
        navigate(`${ROUTES.NOTIFICATIONS.BASE}/${id}`);
    }
    return (<div className="notification-trigger" ref={ref}>
      <button ref={buttonRef} type="button" className="icon-button notification-button" aria-haspopup="dialog" aria-controls="notification-menu" aria-expanded={visible} aria-label="Thông báo" onClick={() => setVisible((value) => !value)}>
        <Icon name="notifications"/>
        {unreadCount > 0 ? <span className="notification-badge">{unreadCount}</span> : null}
      </button>

      {visible ? (<div id="notification-menu" className="notification-popup" role="dialog" aria-label="Danh sách thông báo" tabIndex={-1}>
          <div className="notification-popup-header">
            <div>
              <h4>Thông báo mới</h4>
              <p>{unreadCount} thông báo chưa đọc</p>
            </div>
            <button type="button" className="view-all-button" onClick={() => setVisible(false)}>
              Đóng
            </button>
          </div>

          <div className="notification-list">
            {items.length === 0 ? (<div className="notification-empty">Không có thông báo mới.</div>) : (items.map((item) => (<button key={item.id} className={`notification-item ${item.unread ? 'unread' : ''}`} type="button" onClick={() => handleSelect(item.id)}>
                  <div className="notification-item-title">
                    <strong>{item.title}</strong>
                    {item.unread ? <span className="notification-dot">Chưa đọc</span> : null}
                  </div>
                  <p>{item.preview}</p>
                  <time>{new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.createdAt))}</time>
                </button>)))}
          </div>
        </div>) : null}
    </div>);
}
