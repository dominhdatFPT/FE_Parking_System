import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import SessionDetailDrawer from '../../components/parking/SessionDetailDrawer';
import { getParkingSessions } from '../../services/staffService';
import { apiDateTimeMillis, formatVietnamDateTime } from '../../utils/dateTime';

const tabs = ['Đang hoạt động', 'Đã hoàn thành', 'Tất cả'];
const vehicleTypes = ['Tất cả', 'Ô tô', 'Xe máy'];
const customerTypes = ['Tất cả', 'Gói tháng', 'Vãng lai'];
const statuses = ['Tất cả', 'Bình thường', 'Quá 24 giờ', 'Quá 7 ngày', 'Đã hoàn thành'];

const statusClasses = {
  'Bình thường': 'bg-emerald-50 text-emerald-700',
  'Quá 24 giờ': 'bg-amber-50 text-amber-700',
  'Quá 7 ngày': 'bg-red-50 text-red-700',
  'Đã hoàn thành': 'bg-blue-50 text-blue-700',
};

const normalizeVehicleType = (value) => {
  const normalized = String(value || '').toUpperCase();
  return normalized.includes('MOTOR') || normalized.includes('MÁY') || normalized.includes('MAY')
    ? 'Xe máy'
    : 'Ô tô';
};

const normalizeCustomerType = (value) =>
  String(value || '').toUpperCase().includes('VISITOR') ? 'Vãng lai' : 'Gói tháng';

const formatDateTime = (value) => {
  return formatVietnamDateTime(value, { year: undefined }) || '--';
};

const durationMinutes = (entryTime, exitTime) => {
  if (!entryTime) return 0;
  return Math.max(0, Math.floor((apiDateTimeMillis(exitTime || Date.now()) - apiDateTimeMillis(entryTime)) / 60000));
};

const formatDuration = (minutes) => {
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  if (days) return `${days} ngày ${hours}h`;
  return `${hours}h ${mins}m`;
};

const formatFee = (fee, active) => active
  ? 'Đang tính'
  : `${Number(fee || 0).toLocaleString('vi-VN')} ₫`;

function mapSession(item) {
  const completed = item.status === 'COMPLETED' || Boolean(item.exitTime);
  const minutes = durationMinutes(item.entryTime, item.exitTime);
  const displayStatus = completed
    ? 'Đã hoàn thành'
    : minutes >= 7 * 1440
      ? 'Quá 7 ngày'
      : minutes >= 1440
        ? 'Quá 24 giờ'
        : 'Bình thường';

  return {
    id: item.orderCode || String(item.id),
    rawId: item.id,
    plate: item.licensePlate || '--',
    type: normalizeVehicleType(item.vehicleType),
    customer: normalizeCustomerType(item.customerType),
    cardId: item.visitorCardCode || '--',
    entry: formatDateTime(item.entryTime),
    exit: formatDateTime(item.exitTime),
    duration: formatDuration(minutes),
    durationMinutes: minutes,
    floor: item.floorName || '--',
    zone: item.parkingName || '--',
    status: displayStatus,
    fee: formatFee(item.calculatedFee, !completed),
    estimatedFee: item.calculatedFee == null ? null : formatFee(item.calculatedFee, false),
    entryTime: item.entryTime,
    exitTime: item.exitTime,
    parkingStatus: item.status,
  };
}

function StatusBadge({ status }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[status] || 'bg-slate-100 text-slate-700'}`}>{status}</span>;
}

export default function ParkingSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [vehicleType, setVehicleType] = useState('Tất cả');
  const [customerType, setCustomerType] = useState('Tất cả');
  const [status, setStatus] = useState('Tất cả');
  const [date, setDate] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchSessions = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const items = await getParkingSessions();
      setSessions(items.map(mapSession));
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Không thể tải dữ liệu phiên gửi xe từ database.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();

    const intervalId = window.setInterval(() => fetchSessions({ silent: true }), 15000);
    const handleFocus = () => fetchSessions({ silent: true });
    window.addEventListener('focus', handleFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchSessions]);

  const filteredSessions = useMemo(() => sessions.filter((session) => {
    const completed = session.status === 'Đã hoàn thành';
    const matchesTab = activeTab === 'Tất cả'
      || (activeTab === 'Đang hoạt động' && !completed)
      || (activeTab === 'Đã hoàn thành' && completed);
    const matchesDate = !date || session.entryTime?.slice(0, 10) === date;
    return matchesTab
      && session.plate.toLowerCase().includes(search.trim().toLowerCase())
      && (vehicleType === 'Tất cả' || session.type === vehicleType)
      && (customerType === 'Tất cả' || session.customer === customerType)
      && (status === 'Tất cả' || session.status === status)
      && matchesDate;
  }), [activeTab, customerType, date, search, sessions, status, vehicleType]);

  const openSessionDetail = (session) => {
    setSelectedSession(session);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><h1 className="text-2xl font-semibold tracking-tight text-slate-950">Tất cả phiên gửi xe</h1><p className="mt-1 text-sm font-medium text-slate-500">Dữ liệu trực tiếp từ hệ thống.</p></div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl bg-slate-100 p-1">{tabs.map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${activeTab === tab ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{tab}</button>)}</div>
            <button
              type="button"
              onClick={() => fetchSessions({ silent: true })}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-700"
            >
              <RefreshCw size={16} />
              Làm mới
            </button>
          </div>
        </div>
      </section>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_160px_170px_170px_160px]">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm theo biển số" className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          <select value={vehicleType} onChange={(event) => setVehicleType(event.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-semibold">{vehicleTypes.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={customerType} onChange={(event) => setCustomerType(event.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-semibold">{customerTypes.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-semibold">{statuses.map((item) => <option key={item}>{item}</option>)}</select>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-semibold" />
        </div>
      </section>

      <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[1100px] table-fixed text-left text-sm">
          <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"><tr><th className="px-3 py-2.5">Mã phiên</th><th className="px-3 py-2.5">Biển số</th><th className="px-3 py-2.5">Loại xe</th><th className="px-3 py-2.5">Loại khách</th><th className="px-3 py-2.5">Mã thẻ</th><th className="px-3 py-2.5">Giờ vào</th><th className="px-3 py-2.5">Giờ ra</th><th className="px-3 py-2.5">Thời gian gửi</th><th className="px-3 py-2.5">Phí</th><th className="px-3 py-2.5">Trạng thái</th><th className="px-3 py-2.5 text-right">Chi tiết</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <tr><td colSpan="11" className="px-4 py-12 text-center text-slate-500">Đang tải dữ liệu từ database...</td></tr> : null}
            {!loading && filteredSessions.length === 0 ? <tr><td colSpan="11" className="px-4 py-12 text-center text-slate-500">Không có phiên gửi xe phù hợp.</td></tr> : null}
            {!loading && filteredSessions.map((session) => <tr key={session.id} className="text-slate-600 hover:bg-slate-50"><td className="truncate px-3 py-3 font-semibold text-slate-950">{session.id}</td><td className="px-3 py-3 font-semibold text-slate-950">{session.plate}</td><td className="px-3 py-3">{session.type}</td><td className="px-3 py-3">{session.customer}</td><td className="px-3 py-3">{session.cardId}</td><td className="px-3 py-3">{session.entry}</td><td className="px-3 py-3">{session.exit}</td><td className="px-3 py-3">{session.duration}</td><td className="px-3 py-3">{session.fee}</td><td className="px-3 py-3"><StatusBadge status={session.status} /></td><td className="px-3 py-3 text-right"><button onClick={() => openSessionDetail(session)} className="rounded-lg px-2 py-1 text-sm font-semibold text-blue-700 hover:bg-blue-50">Chi tiết</button></td></tr>)}
          </tbody>
        </table>
      </section>
      <SessionDetailDrawer open={isDetailOpen} session={selectedSession} onClose={() => setIsDetailOpen(false)} />
    </div>
  );
}
