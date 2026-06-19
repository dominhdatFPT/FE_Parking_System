import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Icon from '../../components/Icon';
import { getDatabaseNotificationById } from '../../services/notificationService';

export default function NotificationDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getDatabaseNotificationById(id).then((item) => { if (active) setNotification(item || null); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  return (
    <div className="space-y-6 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between rounded-[18px] border border-slate-200 bg-white p-6 shadow-sm"><div><p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Thông báo</p><h1 className="mt-3 text-2xl font-semibold text-slate-950">Chi tiết thông báo</h1></div><button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium"><Icon name="arrow_back" />Quay lại</button></div>
      <section className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? <p className="text-slate-500">Đang tải từ database...</p> : notification ? <div><p className="text-sm uppercase tracking-[0.2em] text-slate-500">{notification.type}</p><h2 className="mt-3 text-2xl font-semibold text-slate-950">{notification.title}</h2><p className="mt-5 leading-7 text-slate-700">{notification.message}</p><time className="mt-4 block text-sm text-slate-500">{notification.time}</time></div> : <p className="text-center text-slate-500">Không tìm thấy thông báo trong database.</p>}
      </section>
    </div>
  );
}
