import { useEffect, useMemo, useState } from 'react';
import { getParkingSessions } from '../../../services/staffService';
import { VIETNAM_TIME_ZONE } from '../../../utils/dateTime';
import ImageLightbox from '../../../components/parking/ImageLightbox';

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

const pickFirstDefined = (item, keys) => {
  for (const key of keys) {
    const value = item?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
};

const normalizeSession = (item) => ({
  id: pickFirstDefined(item, ['id', 'orderId', 'sessionId', 'parkingSessionId', 'orderCode', 'sessionCode']),
  licensePlate: pickFirstDefined(item, ['licensePlate', 'plateNumber', 'plate', 'vehiclePlate', 'licensePlateNumber']),
  orderCode: pickFirstDefined(item, ['orderCode', 'sessionCode', 'parkingSessionCode', 'code']),
  parkingName: pickFirstDefined(item, ['parkingName', 'parkingAreaName', 'areaName', 'zoneName', 'zone']),
  floorName: pickFirstDefined(item, ['floorName', 'floor', 'floorCode']),
  vehicleType: pickFirstDefined(item, ['vehicleType', 'vehicleTypeName', 'vehicleTypeCode', 'type']),
  visitorCardCode: pickFirstDefined(item, ['visitorCardCode', 'cardCode', 'cardId', 'parkingCardCode', 'ticketCode']),
  entryTime: pickFirstDefined(item, ['entryTime', 'checkInTime', 'checkinTime', 'timeIn', 'inTime', 'startTime', 'createdAt']),
  exitTime: pickFirstDefined(item, ['exitTime', 'checkOutTime', 'checkoutTime', 'timeOut', 'outTime', 'endTime', 'completedAt']),
  status: pickFirstDefined(item, ['status', 'sessionStatus', 'parkingStatus', 'orderStatus']),
  calculatedFee: pickFirstDefined(item, ['calculatedFee', 'fee', 'totalFee', 'amount', 'totalAmount']),
  entryImage: pickFirstDefined(item, ['entryImage', 'entry_image']),
  exitImage: pickFirstDefined(item, ['exitImage', 'exit_image']),
});

export default function StaffSessions() {
  const [activities, setActivities] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const items = await getParkingSessions();
      setActivities(items.map(normalizeSession));
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
              <th className="px-4 py-3">Ảnh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!loading && sessions.length === 0 ? (
              <tr><td colSpan="6" className="px-4 py-10 text-center text-slate-500">Không có phiên gửi xe phù hợp.</td></tr>
            ) : sessions.map((activity, index) => (
              <tr key={activity.id || activity.orderCode || index}>
                <td className="px-4 py-4">
                  <p className="font-black">{activity.licensePlate || '-'}</p>
                  <p className="text-xs text-slate-500">{activity.vehicleType || activity.orderCode || '-'}</p>
                </td>
                <td className="px-4 py-4">{activity.parkingName || '-'} · {activity.floorName || '-'}</td>
                <td className="px-4 py-4">{formatDateTime(activity.entryTime)} → {formatDateTime(activity.exitTime)}</td>
                <td className="px-4 py-4"><span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">{activity.status || '-'}</span></td>
                <td className="px-4 py-4 font-bold">{Number(activity.calculatedFee || 0).toLocaleString('vi-VN')} VNĐ</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    {activity.entryImage ? (
                      <button
                        type="button"
                        onClick={() => setLightboxImage({ src: activity.entryImage, title: `Xe vào · ${activity.licensePlate || ''}` })}
                        title="Xem ảnh lúc vào"
                      >
                        <img src={activity.entryImage} alt="Ảnh lúc vào" className="h-10 w-14 rounded-lg border border-slate-200 object-cover transition hover:opacity-80" />
                      </button>
                    ) : (
                      <span className="grid h-10 w-14 place-items-center rounded-lg border border-dashed border-slate-200 text-[9px] font-semibold text-slate-300">Vào</span>
                    )}
                    {activity.exitImage ? (
                      <button
                        type="button"
                        onClick={() => setLightboxImage({ src: activity.exitImage, title: `Xe ra · ${activity.licensePlate || ''}` })}
                        title="Xem ảnh lúc ra"
                      >
                        <img src={activity.exitImage} alt="Ảnh lúc ra" className="h-10 w-14 rounded-lg border border-slate-200 object-cover transition hover:opacity-80" />
                      </button>
                    ) : (
                      <span className="grid h-10 w-14 place-items-center rounded-lg border border-dashed border-slate-200 text-[9px] font-semibold text-slate-300">Ra</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <ImageLightbox src={lightboxImage?.src} title={lightboxImage?.title} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
