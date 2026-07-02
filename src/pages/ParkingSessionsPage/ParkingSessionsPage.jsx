import React, { useEffect, useMemo, useState } from 'react';
import {
  Bike,
  CarFront,
  CheckCircle2,
  Clock3,
  ListFilter,
  Search,
  TimerReset,
  WalletCards,
} from 'lucide-react';
import SessionDetailDrawer from '../../components/parking/SessionDetailDrawer';
import { getParkingSessions } from '../../services/staffService';
import { apiDateTimeMillis, formatVietnamDateTime } from '../../utils/dateTime';

const tabs = ['Đang hoạt động', 'Đã hoàn thành', 'Tất cả'];
const vehicleTypes = ['Tất cả', 'Ô tô', 'Xe máy'];
const customerTypes = ['Tất cả', 'Gói tháng', 'Vãng lai'];
const statuses = ['Tất cả', 'Bình thường', 'Quá 24 giờ', 'Quá 7 ngày', 'Đã hoàn thành'];

const statusClasses = {
  'Bình thường': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'Quá 24 giờ': 'border-orange-200 bg-orange-50 text-orange-700',
  'Quá 7 ngày': 'border-red-200 bg-red-50 text-red-700',
  'Đã hoàn thành': 'border-blue-200 bg-blue-50 text-blue-700',
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
  return formatVietnamDateTime(value, { year: undefined, day: undefined, month: undefined }) || '--';
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
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${statusClasses[status] || 'border-slate-200 bg-slate-100 text-slate-700'}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function KpiCard({ icon: Icon, label, value, hint, tone }) {
  const toneClasses = {
    blue: 'bg-blue-50 text-blue-600 ring-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    orange: 'bg-orange-50 text-orange-600 ring-orange-100',
    violet: 'bg-violet-50 text-violet-600 ring-violet-100',
  };

  return (
    <article className="flex min-h-[88px] items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ring-1 ${toneClasses[tone] || toneClasses.blue}`}>
        <Icon className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-black leading-none tracking-tight text-slate-950 tabular-nums">{value}</p>
        {hint ? <p className="mt-1 truncate text-[11px] font-medium text-slate-400">{hint}</p> : null}
      </div>
    </article>
  );
}

export default function ParkingSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Đang hoạt động');
  const [search, setSearch] = useState('');
  const [vehicleType, setVehicleType] = useState('Tất cả');
  const [customerType, setCustomerType] = useState('Tất cả');
  const [status, setStatus] = useState('Tất cả');
  const [date, setDate] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getParkingSessions()
      .then((items) => {
        if (active) setSessions(items.map(mapSession));
      })
      .catch((requestError) => {
        if (active) setError(requestError?.response?.data?.message || 'Không thể tải dữ liệu phiên gửi xe từ database.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filteredSessions = useMemo(() => sessions.filter((session) => {
    const completed = session.status === 'Đã hoàn thành';
    const matchesTab = activeTab === 'Tất cả'
      || (activeTab === 'Đang hoạt động' && !completed)
      || (activeTab === 'Đã hoàn thành' && completed);
    const matchesDate = !date || session.entryTime?.slice(0, 10) === date;
    const keyword = search.trim().toLowerCase();
    return matchesTab
      && (!keyword || session.plate.toLowerCase().includes(keyword) || session.id.toLowerCase().includes(keyword))
      && (vehicleType === 'Tất cả' || session.type === vehicleType)
      && (customerType === 'Tất cả' || session.customer === customerType)
      && (status === 'Tất cả' || session.status === status)
      && matchesDate;
  }), [activeTab, customerType, date, search, sessions, status, vehicleType]);

  const kpis = useMemo(() => {
    const activeSessions = sessions.filter((session) => session.status !== 'Đã hoàn thành');
    const completedSessions = sessions.filter((session) => session.status === 'Đã hoàn thành');
    const over24Hours = sessions.filter((session) => session.durationMinutes >= 1440 && session.status !== 'Đã hoàn thành');
    const estimatedRevenue = sessions.reduce((total, session) => {
      const amount = Number(session.estimatedFee?.replace(/[^\d]/g, '') || 0);
      return total + amount;
    }, 0);

    return [
      { icon: CarFront, label: 'Đang hoạt động', value: activeSessions.length, hint: 'Phiên chưa xe ra', tone: 'blue' },
      { icon: CheckCircle2, label: 'Đã hoàn thành', value: completedSessions.length, hint: 'Phiên đã kết thúc', tone: 'emerald' },
      { icon: Clock3, label: 'Quá 24 giờ', value: over24Hours.length, hint: 'Cần theo dõi', tone: 'orange' },
      { icon: WalletCards, label: 'Phí đang tính', value: `${estimatedRevenue.toLocaleString('vi-VN')} đ`, hint: 'Tạm tính từ dữ liệu', tone: 'violet' },
    ];
  }, [sessions]);

  const openSessionDetail = (session) => {
    setSelectedSession(session);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => <KpiCard key={item.label} {...item} />)}
        </div>
      </section>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}

      <section className="flex flex-col gap-4">
        <div className="inline-flex w-full rounded-2xl border border-slate-200 bg-slate-100/80 p-1 shadow-sm sm:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-all sm:flex-none ${
                activeTab === tab
                  ? 'bg-white text-blue-700 shadow-[0_6px_18px_rgba(15,23,42,0.08)]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className={`h-2 w-2 rounded-full border ${activeTab === tab ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'}`} />
              {tab}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_150px_160px_170px_160px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2.25} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo biển số, mã phiên..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-sm font-semibold text-slate-800 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <select value={vehicleType} onChange={(event) => setVehicleType(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100">{vehicleTypes.map((item) => <option key={item}>{item}</option>)}</select>
            <select value={customerType} onChange={(event) => setCustomerType(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100">{customerTypes.map((item) => <option key={item}>{item}</option>)}</select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100">{statuses.map((item) => <option key={item}>{item}</option>)}</select>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <ListFilter className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <div>
              <h2 className="text-sm font-black text-slate-950">Danh sách phiên gửi xe</h2>
              <p className="text-xs font-medium text-slate-400">Hiển thị {filteredSessions.length.toLocaleString('vi-VN')} phiên</p>
            </div>
          </div>
        </div>

        <div className="max-h-[560px] overflow-auto">
          <table className="w-full min-w-[1060px] table-fixed text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/95 text-[11px] font-black uppercase tracking-[0.12em] text-slate-500 backdrop-blur">
              <tr>
                <th className="w-[145px] px-4 py-3">Biển số</th>
                <th className="w-[120px] px-4 py-3">Loại khách</th>
                <th className="w-[100px] px-4 py-3">Mã thẻ</th>
                <th className="w-[135px] px-4 py-3">Giờ vào</th>
                <th className="w-[120px] px-4 py-3">Giờ ra</th>
                <th className="w-[125px] px-4 py-3">Thời gian gửi</th>
                <th className="w-[120px] px-4 py-3">Phí</th>
                <th className="w-[145px] px-4 py-3">Trạng thái</th>
                <th className="w-[100px] px-4 py-3 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-4 py-16 text-center text-sm font-semibold text-slate-500">
                    Đang tải dữ liệu từ database...
                  </td>
                </tr>
              ) : null}
              {!loading && filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-16 text-center text-sm font-semibold text-slate-500">
                    Không có phiên gửi xe phù hợp.
                  </td>
                </tr>
              ) : null}
              {!loading && filteredSessions.map((session) => (
                <tr key={session.id} className="h-16 text-slate-600 transition-colors hover:bg-blue-50/40">
                  <td className="px-4 py-3">
                    <span className="inline-flex max-w-[130px] items-center gap-1.5 rounded-xl bg-blue-50 px-2.5 py-1 font-black text-slate-950">
                      {session.type === 'Xe máy'
                        ? <Bike className="h-3.5 w-3.5 shrink-0 text-blue-600" strokeWidth={2.25} />
                        : <CarFront className="h-3.5 w-3.5 shrink-0 text-blue-600" strokeWidth={2.25} />
                      }
                      <span className="truncate">{session.plate}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{session.customer}</td>
                  <td className="px-4 py-3 font-semibold text-slate-600">{session.cardId}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{session.entry}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{session.exit}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <TimerReset className="h-3.5 w-3.5 text-slate-400" strokeWidth={2.25} />
                      {session.duration}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-bold ${
                      session.status === 'Đã hoàn thành'
                        ? 'border-slate-200 bg-slate-50 text-slate-700'
                        : 'border-blue-200 bg-blue-50 text-blue-700'
                    }`}>
                      {session.fee}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={session.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openSessionDetail(session)}
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-blue-200 bg-white px-3 text-sm font-bold text-blue-600 transition-all hover:border-blue-300 hover:bg-blue-50 active:scale-[0.98]"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <SessionDetailDrawer open={isDetailOpen} session={selectedSession} onClose={() => setIsDetailOpen(false)} />
    </div>
  );
}
