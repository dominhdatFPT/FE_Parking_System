import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import dayjs from 'dayjs';
import Icon from '../../components/Icon';
import {
  notificationService,
  getCategoryToneClass,
  getCategoryLabel,
} from '../../services/notificationService';

export default function NotificationDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return;
      setLoading(true);
      setNotFound(false);
      const { data, error } = await notificationService.getNotificationDetail(id);
      if (cancelled) return;
      if (error?.response?.status === 404 || !data) {
        setNotFound(true);
      } else {
        setNotification(data);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id]);

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = dayjs(iso);
    return d.isValid() ? d.format('HH:mm DD/MM/YYYY') : '';
  };

  return (
    <div className="space-y-6 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Thông báo</p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-950">Chi tiết thông báo</h1>
          <p className="mt-2 text-sm text-slate-500">Xem nội dung thông báo đầy đủ.</p>
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
        </div>
      </div>

      <section className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-6 w-3/4 bg-slate-200 rounded" />
            <div className="h-3 w-full bg-slate-100 rounded" />
            <div className="h-3 w-5/6 bg-slate-100 rounded" />
            <div className="h-3 w-4/6 bg-slate-100 rounded" />
          </div>
        ) : notFound || !notification ? (
          <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">Không tìm thấy thông báo</h3>
            <p>Thông báo này không tồn tại hoặc đã bị ẩn.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-lg border ${getCategoryToneClass(notification.category)} uppercase tracking-wider`}>
                  {getCategoryLabel(notification.category)}
                </span>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">{notification.title}</h2>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span>Thởi gian: <span className="font-medium text-slate-700">{formatDate(notification.publishedAt)}</span></span>
                </div>
              </div>
            </div>

            {notification.summary && (
              <p className="text-sm font-semibold text-slate-700 border-l-4 border-sky-400 pl-3">
                {notification.summary}
              </p>
            )}

            <div className="space-y-4 text-sm leading-7 text-slate-700 whitespace-pre-wrap">
              {notification.content || 'Chưa có nội dung chi tiết.'}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
