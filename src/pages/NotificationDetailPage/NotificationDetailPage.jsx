import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Icon from '../../components/Icon';
import { useAuth } from '../../contexts/AuthContext';
import { getNotificationById, markNotificationAsUnread } from '../../features/notifications/notifications';

const formatTypeLabel = (type) => {
  if (type === 'critical') return 'Nhiệm vụ khẩn cấp';
  if (type === 'warning') return 'Cảnh báo';
  return 'Thành công';
};

export default function NotificationDetailPage() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const currentRole = role === 'admin' ? 'admin' : 'staff';
  const notification = useMemo(() => (id ? getNotificationById(id) : undefined), [id]);
  const [isRead, setIsRead] = useState(notification?.isRead ?? true);

  useEffect(() => {
    setIsRead(notification?.isRead ?? true);
  }, [notification]);

  const hasAccess = !!notification && notification.roles.includes(currentRole);

  const handleMarkUnread = () => {
    if (!notification) return;
    markNotificationAsUnread(notification.id);
    setIsRead(false);
  };

  return (
    <div className="space-y-6 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Thông báo</p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-950">Chi tiết thông báo</h1>
          <p className="mt-2 text-sm text-slate-500">Xem nội dung thông báo đầy đủ và trạng thái chưa đọc.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Icon name="arrow_back" />
            Quay lại
          </button>
          {hasAccess && isRead ? (
            <button
              type="button"
              onClick={handleMarkUnread}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Đánh dấu chưa đọc
            </button>
          ) : null}
        </div>
      </div>

      <section className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-sm">
        {notification && hasAccess ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{formatTypeLabel(notification.type)}</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">{notification.title}</h2>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span>Loại: <span className="font-medium text-slate-700">{notification.type}</span></span>
                  <span>Thời gian: <span className="font-medium text-slate-700">{notification.time}</span></span>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${isRead ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-700'}`}>
                    {isRead ? 'Đã đọc' : 'Chưa đọc'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm leading-7 text-slate-700">
              <p>{notification.message}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">Không tìm thấy thông báo</h3>
            <p>Thông báo này không tồn tại hoặc bạn không có quyền xem nội dung.</p>
          </div>
        )}
      </section>
    </div>
  );
}
