import React, { useEffect, useMemo, useState } from 'react';
import {
  Bike,
  CarFront,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ListFilter,
  RotateCcw,
  Search,
  TimerReset,
  TriangleAlert,
  Users,
} from 'lucide-react';
import SessionDetailDrawer from '../../components/parking/SessionDetailDrawer';
import { getParkingSessions } from '../../services/staffService';
import { apiDateTimeMillis, formatVietnamDateTime } from '../../utils/dateTime';
import { getRememberedVehicleType, normalizeVehicleTypeCode } from '../../utils/vehicleTypeMemory';

const tabs = ['Đang hoạt động', 'Đã hoàn thành', 'Tất cả'];
const vehicleTypes = ['Tất cả', 'Ô tô', 'Xe máy'];
const customerTypes = ['Tất cả', 'Gói tháng', 'Vãng lai'];
const warningFilters = ['Tất cả cảnh báo', 'Bình thường', 'Quá 24 giờ', 'Quá 7 ngày'];
const PAGE_SIZE = 10;

const statusClasses = {
  'Bình thường': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'Quá 24 giờ': 'border-orange-200 bg-orange-50 text-orange-700',
  'Quá 7 ngày': 'border-red-200 bg-red-50 text-red-700',
  'Đã hoàn thành': 'border-blue-200 bg-blue-50 text-blue-700',
};

const normalizeVehicleType = (item) => {
  if (typeof item !== 'object' || item === null) return 'Ô tô';

  const rawValue = item.vehicleTypeCode || item.vehicleType || item.vehicleTypeName || item.vehicleTypeId;
  const normalized = normalizeVehicleTypeCode(rawValue);
  if (normalized === 'MOTORBIKE') return 'Xe máy';
  if (normalized === 'CAR') return 'Ô tô';

  const rememberedType = getRememberedVehicleType(item.licensePlate);
  const rememberedCode = normalizeVehicleTypeCode(rememberedType);
  if (rememberedCode === 'MOTORBIKE') return 'Xe máy';
  if (rememberedCode === 'CAR') return 'Ô tô';

  const cardCode = String(item.visitorCardCode || item.cardId || '').toUpperCase();
  if (cardCode.startsWith('MOTO') || cardCode.startsWith('BIKE')) return 'Xe máy';

  return 'Ô tô';
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
    type: normalizeVehicleType(item),
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

function FilterField({ icon: Icon, label, hasChevron = false, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="pl-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
      </span>
      <label className="group flex h-14 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
        <Icon className="h-4 w-4 shrink-0 text-slate-400 transition group-focus-within:text-blue-500" strokeWidth={2.25} />
        <div className="min-w-0 flex-1">
          {children}
        </div>
        {hasChevron && (
          <ChevronDown className="pointer-events-none h-3.5 w-3.5 shrink-0 text-slate-400" strokeWidth={2.25} />
        )}
      </label>
    </div>
  );
}

function FilterSelect({ icon, label, value, onChange, options, getOptionLabel = (option) => option }) {
  return (
    <FilterField icon={icon} label={label} hasChevron>
      <select
        value={value}
        onChange={onChange}
        className="w-full cursor-pointer appearance-none bg-transparent text-sm font-bold text-slate-800 outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {getOptionLabel(option)}
          </option>
        ))}
      </select>
    </FilterField>
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
  const [selectedWarning, setSelectedWarning] = useState('Tất cả cảnh báo');
  const [date, setDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getParkingSessions({ page: 0, size: 200 })
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
    const matchesWarning = selectedWarning === 'Tất cả cảnh báo' || session.status === selectedWarning;
    return matchesTab
      && (!keyword || session.plate.toLowerCase().includes(keyword) || session.id.toLowerCase().includes(keyword))
      && (vehicleType === 'Tất cả' || session.type === vehicleType)
      && (customerType === 'Tất cả' || session.customer === customerType)
      && matchesWarning
      && matchesDate;
  }).sort((a, b) => (apiDateTimeMillis(b.entryTime) || 0) - (apiDateTimeMillis(a.entryTime) || 0)), [activeTab, customerType, date, search, selectedWarning, sessions, vehicleType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, customerType, date, search, selectedWarning, vehicleType]);

  const pageCount = Math.max(1, Math.ceil(filteredSessions.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);

  useEffect(() => {
    if (currentPage > pageCount) setCurrentPage(pageCount);
  }, [currentPage, pageCount]);

  const visibleSessions = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredSessions.slice(start, start + PAGE_SIZE);
  }, [filteredSessions, safePage]);

  const rangeStart = filteredSessions.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, filteredSessions.length);

  const kpis = useMemo(() => {
    const activeSessions = sessions.filter((session) => session.status !== 'Đã hoàn thành');
    const completedSessions = sessions.filter((session) => session.status === 'Đã hoàn thành');
    const over24Hours = sessions.filter((session) => session.durationMinutes >= 1440 && session.status !== 'Đã hoàn thành');

    return [
      { icon: CarFront, label: 'Đang hoạt động', value: activeSessions.length, hint: 'Phiên chưa xe ra', tone: 'blue' },
      { icon: CheckCircle2, label: 'Đã hoàn thành', value: completedSessions.length, hint: 'Phiên đã kết thúc', tone: 'emerald' },
      { icon: Clock3, label: 'Quá 24 giờ', value: over24Hours.length, hint: 'Cần theo dõi', tone: 'orange' },
    ];
  }, [sessions]);

  const openSessionDetail = (session) => {
    setSelectedSession(session);
    setIsDetailOpen(true);
  };

  const resetFilters = () => {
    setSearch('');
    setVehicleType('Tất cả');
    setCustomerType('Tất cả');
    setSelectedWarning('Tất cả cảnh báo');
    setDate('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[minmax(250px,1.6fr)_160px_180px_195px_175px_56px]">
            <FilterField icon={Search} label="Tìm kiếm">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Biển số, mã phiên..."
                className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:font-semibold placeholder:text-slate-400"
              />
            </FilterField>
            <FilterSelect
              icon={CarFront}
              label="Loại xe"
              value={vehicleType}
              onChange={(event) => setVehicleType(event.target.value)}
              options={vehicleTypes}
            />
            <FilterSelect
              icon={Users}
              label="Loại khách"
              value={customerType}
              onChange={(event) => setCustomerType(event.target.value)}
              options={customerTypes}
            />
            <FilterSelect
              icon={TriangleAlert}
              label="Cảnh báo"
              value={selectedWarning}
              onChange={(event) => setSelectedWarning(event.target.value)}
              options={warningFilters}
              getOptionLabel={(item) => (item === warningFilters[0] ? vehicleTypes[0] : item)}
            />
            <FilterField icon={CalendarDays} label="Ngày vào">
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full cursor-pointer bg-transparent text-sm font-bold text-slate-800 outline-none"
              />
            </FilterField>
            <div className="flex flex-col gap-1.5">
              <span className="select-none pl-1 text-[10px] font-black uppercase tracking-[0.12em] text-transparent" aria-hidden="true">_</span>
              <button
                type="button"
                onClick={resetFilters}
                title="Làm mới bộ lọc"
                aria-label="Làm mới bộ lọc"
                className="inline-flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 active:scale-[0.98]"
              >
                <RotateCcw className="h-4 w-4 shrink-0" strokeWidth={2.25} />
              </button>
            </div>
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
              <p className="text-xs font-medium text-slate-400">
                {filteredSessions.length
                  ? `Hiển thị ${rangeStart}-${rangeEnd} / ${filteredSessions.length.toLocaleString('vi-VN')} phiên`
                  : 'Không có phiên phù hợp'}
              </p>
            </div>
          </div>
          <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500 sm:inline-flex">
            {PAGE_SIZE} phiên / trang
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] table-fixed text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/95 text-[11px] font-black uppercase tracking-[0.12em] text-slate-500 backdrop-blur">
              <tr>
                <th className="w-[145px] px-4 py-3">Biển số</th>
                <th className="w-[120px] px-4 py-3">Loại khách</th>
                <th className="w-[100px] px-4 py-3">Mã thẻ</th>
                <th className="w-[135px] px-4 py-3">Giờ vào</th>
                <th className="w-[120px] px-4 py-3">Giờ ra</th>
                <th className="w-[125px] px-4 py-3">Thời gian gửi</th>
                <th className="w-[145px] px-4 py-3">Trạng thái</th>
                <th className="w-[100px] px-4 py-3 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-16 text-center text-sm font-semibold text-slate-500">
                    Đang tải dữ liệu từ database...
                  </td>
                </tr>
              ) : null}
              {!loading && filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-16 text-center text-sm font-semibold text-slate-500">
                    Không có phiên gửi xe phù hợp.
                  </td>
                </tr>
              ) : null}
              {!loading && visibleSessions.map((session) => (
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

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-slate-500">
            {filteredSessions.length
              ? `Trang ${safePage} / ${pageCount}`
              : 'Chưa có dữ liệu để phân trang'}
          </p>
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safePage <= 1}
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Trước
            </button>
            <span className="min-w-16 rounded-xl bg-slate-100 px-3 py-2 text-center text-xs font-black text-slate-700">
              {safePage}/{pageCount}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
              disabled={safePage >= pageCount}
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Sau
            </button>
          </div>
        </div>
      </section>
      <SessionDetailDrawer open={isDetailOpen} session={selectedSession} onClose={() => setIsDetailOpen(false)} />
    </div>
  );
}
