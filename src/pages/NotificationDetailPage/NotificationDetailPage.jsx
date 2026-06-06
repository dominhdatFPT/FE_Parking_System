import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import Icon from '../../components/Icon';
import { useAuth } from '../../contexts/AuthContext';
import { getNotificationById } from '../../features/notifications/notifications';
import { formatDate } from '../../utils/formatDate';

export default function NotificationDetailPage() {
    const { role } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const currentRole = role === 'admin' ? 'admin' : 'staff';
    const notification = useMemo(() => (id ? getNotificationById(id) : undefined), [id]);
    const hasAccess = notification?.roles.includes(currentRole);
    return (
      <div className="space-y-6">
        <div className="page-heading flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2>Chi tiết thông báo</h2>
            <p>Xem nội dung thông báo đầy đủ mà không rời khỏi giao diện quản trị.</p>
          </div>
          <button className="secondary-button" type="button" onClick={() => navigate(-1)}>
            <Icon name="arrow_back" />
            Quay lại
          </button>
        </div>

        <section className="panel notification-detail-panel">
          {notification && hasAccess ? (
            <>
              <div className="notification-detail-header">
                <div>
                  <h3>{notification.title}</h3>
                  <time>{formatDate(notification.createdAt)}</time>
                </div>
                <div className="notification-sender">Gửi bởi: {notification.sender}</div>
              </div>

              <div className="notification-detail-content">
                <p>{notification.content}</p>
              </div>
            </>
          ) : (
            <div className="notification-detail-empty">
              <h3>Không tìm thấy thông báo</h3>
              <p>Thông báo này không tồn tại hoặc bạn không có quyền xem nội dung.</p>
            </div>
          )}
        </section>
      </div>
    );
}
