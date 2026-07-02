import { useEffect, useMemo, useState } from 'react';
import { getParkingSessions } from '../../../services/staffService';
import { VIETNAM_TIME_ZONE } from '../../../utils/dateTime';

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: VIETNAM_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export default function StaffSessions() {
  const [activities, setActivities] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      setActivities(await getParkingSessions());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sessions = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    return activities.filter((activity) => {
      if (!text) return true;
      return [
        activity.licensePlate,
        activity.orderCode,
        activity.parkingName,
        activity.floorName,
        activity.vehicleType,
        activity.visitorCardCode,
      ].filter(Boolean).some((value) => String(value).toLowerCase().includes(text));
    });
  }, [activities, keyword]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Phiên gửi xe</h1>
          <p className="mt-2 text-sm text-slate-500">Theo dõi dữ liệu xe vào, xe ra trực tiếp từ parking orders.</p>
        </div>
        <button type="button" onClick={fetchData} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold">
          Làm mới
        </button>
      </div>

      <input
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="Tìm biển số, mã lượt gửi, bãi hoặc tầng..."
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
      />

      <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Phương tiện</th>
              <th className="px-4 py-3">Vị trí</th>
              <th className="px-4 py-3">Thời gian</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Phí</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!loading && sessions.length === 0 ? (
              <tr><td colSpan="5" className="px-4 py-10 text-center text-slate-500">Không có phiên gửi xe phù hợp.</td></tr>
            ) : sessions.map((activity) => (
              <tr key={activity.id}>
                <td className="px-4 py-4">
                  <p className="font-black">{activity.licensePlate || '-'}</p>
                  <p className="text-xs text-slate-500">{activity.vehicleType || activity.orderCode || '-'}</p>
                </td>
                <td className="px-4 py-4">{activity.parkingName || '-'} · {activity.floorName || '-'}</td>
                <td className="px-4 py-4">{formatDateTime(activity.entryTime)} → {formatDateTime(activity.exitTime)}</td>
                <td className="px-4 py-4"><span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">{activity.status || '-'}</span></td>
                <td className="px-4 py-4 font-bold">{Number(activity.calculatedFee || 0).toLocaleString('vi-VN')} VNĐ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
