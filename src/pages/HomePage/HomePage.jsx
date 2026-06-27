import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  Building2,
  CarFront,
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  RefreshCw,
  SquareParking,
  Ticket,
} from 'lucide-react';
import SessionDetailDrawer from '../../components/parking/SessionDetailDrawer';
import { getStaffOperationsDashboard } from '../../services/staffService';
import { apiDateTimeMillis, formatVietnamTime } from '../../utils/dateTime';

const emptyDashboardData = {
  entries: 0,
  exits: 0,
  revenue: '0',
  capacity: '0 / 0',
  availableSlots: 0,
  sessions: [],
  completedSessions: [],
  revenueBreakdown: [],
  vehicleBreakdown: [],
  customerBreakdown: [],
  entryBreakdown: [],
  exitBreakdown: [],
  capacityBreakdown: [],
};

const statusClasses = {
  normal: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  danger: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
  done: 'bg-sky-50 text-sky-700 ring-1 ring-sky-100',
};

const paymentClasses = {
  QR: 'bg-sky-50 text-sky-700 ring-1 ring-sky-100',
  'Tiền mặt': 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  'Miễn phí': 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
  Gói: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
};

function Card({ children, className = '', p = 'p-5 sm:p-6' }) {
  return (
    <section className={`rounded-2xl border border-slate-100 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.02)] ${className} ${p}`}>
      {children}
    </section>
  );
}

function SectionTitle({ children }) {
  return <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{children}</h2>;
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function asNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value) {
  const amount = asNumber(value);
  if (amount >= 1000000) {
    return `${(amount / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}K`;
  }
  return amount.toLocaleString('vi-VN');
}

function formatCurrency(value) {
  const amount = asNumber(value);
  if (!amount) return '0đ';
  return `${amount.toLocaleString('vi-VN')}đ`;
}

function formatTime(value) {
  return formatVietnamTime(value) || '--';
}

function formatDuration(entryTime, exitTime) {
  if (!entryTime) return '--';
  const start = apiDateTimeMillis(entryTime);
  const end = exitTime ? apiDateTimeMillis(exitTime) : Date.now();
  const diffMinutes = Math.max(0, Math.floor((end - start) / 60000));
  const days = Math.floor(diffMinutes / 1440);
  const hours = Math.floor((diffMinutes % 1440) / 60);
  const minutes = diffMinutes % 60;

  if (days > 0) return `${days} ngày ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function percent(part, total) {
  if (!total) return '0%';
  return `${Math.round((part / total) * 100)}%`;
}

function parseCapacity(capacity) {
  const [usedRaw, totalRaw] = String(capacity).split('/').map((part) => Number(part.trim()));
  const used = Number.isFinite(usedRaw) ? usedRaw : 0;
  const total = Number.isFinite(totalRaw) && totalRaw > 0 ? totalRaw : 1;
  const percentValue = Math.min(100, Math.round((used / total) * 100));

  return { used, total, percent: percentValue };
}

function mapVehicleType(value) {
  return value === 'MOTORBIKE' ? 'Xe máy' : 'Ô tô';
}

function mapCustomerType(value) {
  return value === 'MONTHLY' ? 'Gói tháng' : 'Vãng lai';
}

function mapStatus(activity) {
  if (activity.exitTime || activity.status === 'COMPLETED') return 'Đã hoàn thành';
  if (!activity.entryTime) return activity.status || 'Bình thường';

  const hours = (Date.now() - apiDateTimeMillis(activity.entryTime)) / 3600000;
  if (hours >= 24 * 7) return 'Quá 7 ngày';
  if (hours >= 24) return 'Quá 24 giờ';
  return 'Bình thường';
}

function mapActivityToSession(activity) {
  const status = mapStatus(activity);
  const isCompleted = status === 'Đã hoàn thành';
  const isMonthly = activity.customerType === 'MONTHLY';
  const fee = activity.calculatedFee ? formatMoney(activity.calculatedFee) : isCompleted ? '0' : 'Đang tính';

  return {
    id: activity.orderCode || `PO-${activity.id}`,
    plate: activity.licensePlate || '--',
    type: mapVehicleType(activity.vehicleType),
    customer: mapCustomerType(activity.customerType),
    cardId: activity.visitorCardCode || '--',
    entry: formatTime(activity.entryTime),
    exit: isCompleted ? formatTime(activity.exitTime) : '--',
    duration: formatDuration(activity.entryTime, activity.exitTime),
    floor: activity.floorName || '--',
    zone: activity.parkingName || '--',
    status,
    fee,
    estimatedFee: fee,
    payment: isMonthly ? 'Gói' : activity.calculatedFee ? 'Tiền mặt' : 'Miễn phí',
  };
}

function buildDashboardData(payload) {
  const metrics = payload?.metrics || {};
  const activities = Array.isArray(payload?.recentVehicleActivities) ? payload.recentVehicleActivities : [];
  const areaOccupancy = Array.isArray(payload?.areaOccupancy) ? payload.areaOccupancy : [];
  const sessions = activities.map(mapActivityToSession);
  const activeSessions = sessions.filter((session) => session.status !== 'Đã hoàn thành');
  const completedSessions = sessions.filter((session) => session.status === 'Đã hoàn thành');
  const vehiclesInParking = asNumber(metrics.vehiclesInParking);
  const totalSlots = asNumber(metrics.totalSlots);
  const availableSlots = asNumber(metrics.availableSlots);
  const activeCars = asNumber(metrics.activeCars);
  const activeMotorbikes = asNumber(metrics.activeMotorbikes);
  const vehiclesInToday = asNumber(metrics.vehiclesInToday);
  const vehiclesOutToday = asNumber(metrics.vehiclesOutToday);
  const revenueToday = asNumber(metrics.revenueToday);

  return {
    entries: vehiclesInToday,
    exits: vehiclesOutToday,
    revenue: formatMoney(revenueToday),
    capacity: `${vehiclesInParking} / ${totalSlots}`,
    availableSlots,
    sessions: activeSessions,
    completedSessions,
    revenueBreakdown: [
      { label: 'Tổng cộng', value: formatCurrency(revenueToday) },
    ],
    vehicleBreakdown: [
      { label: 'Ô tô', value: String(activeCars), percent: percent(activeCars, vehiclesInParking) },
      { label: 'Xe máy', value: String(activeMotorbikes), percent: percent(activeMotorbikes, vehiclesInParking) },
    ],
    customerBreakdown: [
      { label: 'Gói tháng', value: String(sessions.filter((session) => session.customer === 'Gói tháng').length) },
      { label: 'Vãng lai', value: String(sessions.filter((session) => session.customer === 'Vãng lai').length) },
    ],
    entryBreakdown: [
      { label: 'Tổng lượt vào', value: String(vehiclesInToday) },
      { label: 'Ô tô', value: String(asNumber(metrics.vehiclesInTodayCars)) },
      { label: 'Xe máy', value: String(asNumber(metrics.vehiclesInTodayMotorbikes)) },
    ],
    exitBreakdown: [
      { label: 'Tổng lượt ra', value: String(vehiclesOutToday) },
      { label: 'Ô tô', value: String(asNumber(metrics.vehiclesOutTodayCars)) },
      { label: 'Xe máy', value: String(asNumber(metrics.vehiclesOutTodayMotorbikes)) },
    ],
    capacityBreakdown: [
      { label: 'Đang sử dụng', value: String(vehiclesInParking) },
      { label: 'Còn trống', value: String(availableSlots) },
      { label: 'Tổng sức chứa', value: String(totalSlots) },
      { label: 'Tỷ lệ sử dụng', value: `${asNumber(metrics.occupancyRate)}%` },
      ...areaOccupancy.slice(0, 6).map((area) => ({
        label: area.name || 'Khu',
        value: `${asNumber(area.occupied)} / ${asNumber(area.total)}`,
      })),
    ],
  };
}

// Keep all helper methods intact
function getCompletedFee(session) {
  return isMonthlyCustomer(session.customer) ? '-' : session.fee;
}

function getCompletedPayment(session) {
  return isMonthlyCustomer(session.customer) ? 'Gói' : normalizePayment(session.payment);
}

function isMonthlyCustomer(value = '') {
  return value.includes('Gói');
}

function normalizePayment(value = '') {
  if (value === 'QR') return 'QR';
  if (value.includes('Tiền')) return 'Tiền mặt';
  if (value.includes('Miễn')) return 'Miễn phí';
  return value || '-';
}

function getStatusTone(status = '') {
  if (status.includes('7')) return 'danger';
  if (status.includes('24')) return 'warning';
  if (status.includes('hoàn')) return 'done';
  return 'normal';
}

function normalizeStatus(status = '') {
  if (status.includes('7')) return 'Quá 7 ngày';
  if (status.includes('24')) return 'Quá 24 giờ';
  if (status.includes('hoàn')) return 'Đã hoàn thành';
  return 'Bình thường';
}

function StatusBadge({ status }) {
  const tone = getStatusTone(status);

  return (
    <span className={`inline-flex rounded-lg px-2 py-0.5 text-[11px] font-semibold ${statusClasses[tone]}`}>
      {normalizeStatus(status)}
    </span>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <span className="text-xs font-bold text-slate-800">{value}</span>
    </div>
  );
}

function KpiDropdown({ type, data }) {
  const config = {
    activeSessions: {
      title: 'Chi tiết phiên',
      items: data.vehicleBreakdown,
    },
    entries: {
      title: 'Chi tiết xe vào',
      items: [
        { label: 'Ô tô', value: data.entryBreakdown.find((item) => item.label === 'Ô tô')?.value || '0' },
        { label: 'Xe máy', value: data.entryBreakdown.find((item) => item.label === 'Xe máy')?.value || '0' },
      ],
    },
    exits: {
      title: 'Chi tiết xe ra',
      items: [
        { label: 'Ô tô', value: data.exitBreakdown.find((item) => item.label === 'Ô tô')?.value || '0' },
        { label: 'Xe máy', value: data.exitBreakdown.find((item) => item.label === 'Xe máy')?.value || '0' },
      ],
    },
    revenue: {
      title: 'Chi tiết doanh thu',
      items: data.revenueBreakdown,
    },
    capacity: {
      title: 'Chi tiết công suất bãi',
      items: data.capacityBreakdown.filter((item) =>
        ['Đang sử dụng', 'Còn trống', 'Tổng sức chứa', 'Tỷ lệ sử dụng'].includes(item.label),
      ),
    },
    overdue: {
      title: 'Phiên cần chú ý',
      items: [
        { label: 'Quá 24 giờ', value: String(data.sessions.filter((session) => session.status.includes('24')).length) },
        { label: 'Quá 7 ngày', value: String(data.sessions.filter((session) => session.status.includes('7')).length) },
      ],
    },
  }[type];

  if (!config) return null;

  return (
    <div className="absolute left-0 top-full z-50 mt-2.5 w-[280px] rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.08)]">
      <div className="absolute -top-1.5 left-8 h-3 w-3 rotate-45 border-l border-t border-slate-100 bg-white" />
      <div className="relative">
        <h3 className="text-xs font-bold text-slate-800">{config.title}</h3>
        <div className="mt-2.5 space-y-1.5">
          {config.items.map((item) => (
            <DetailItem
              key={item.label}
              label={item.label}
              value={item.percent ? `${item.value} (${item.percent})` : item.value}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function OperationsDock({ stats, capacityPercent, openKpi, onKpiClick, currentData }) {
  const cardIconMap = {
    entries: ArrowDownToLine,
    exits: ArrowUpFromLine,
    revenue: CircleDollarSign,
    capacity: SquareParking,
  };

  return (
    <Card className="overflow-visible" p="p-2">
      <div className="grid grid-cols-1 gap-1 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.35fr]">
        {stats.map((stat, index) => {
          const isCapacity = stat.key === 'capacity';
          const isOpen = openKpi === stat.key;

          return (
            <div
              key={stat.key}
              className={`relative min-w-0 ${index > 0 ? 'xl:border-l xl:border-slate-100' : ''}`}
            >
              <button
                type="button"
                onClick={() => onKpiClick(stat.key)}
                className={`group h-full min-h-[140px] w-full rounded-xl p-4 text-left transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-50 active:scale-[0.98] ${
                  isOpen ? 'bg-slate-50' : 'bg-transparent'
                }`}
              >
                <div className="flex h-full flex-col justify-between gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-400">{stat.label}</p>
                      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-800">{stat.value}</p>
                      <p className="mt-0.5 text-[10px] font-medium text-slate-400">{stat.description}</p>
                    </div>
                    <span className={`grid h-8 min-w-8 place-items-center rounded-lg px-1.5 text-xs font-bold ring-1 transition-all duration-300 ${stat.tone}`}>
                      {stat.icon}
                    </span>
                  </div>

                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                        <span>{capacityPercent}% sử dụng</span>
                        <span>{currentData.availableSlots} trống</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-sky-500 transition-all duration-500" style={{ width: `${capacityPercent}%` }} />
                      </div>
                      <p className="mt-4 text-[16px] font-medium">
                        <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text font-semibold text-transparent">
                          {capacityPercent}%
                        </span>
                        <span className="ml-2 text-[#64748B]">Occupied</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col justify-between gap-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[17px] font-semibold text-[#111827]">{stat.label}</p>
                        <p className="mt-2.5 text-[42px] font-bold leading-none tracking-tight text-[#111827]">{stat.value}</p>
                        <p className="mt-2 text-[15px] font-medium text-[#64748B]">{stat.description}</p>
                      </div>
                      <span className="relative">
                        <span className={`absolute inset-0 rounded-full bg-gradient-to-br opacity-60 blur-md ${iconTone}`} />
                        <span className={`relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br text-white shadow-[0_10px_22px_rgba(15,23,42,0.16)] ${iconTone}`}>
                          <StatIcon className="h-6 w-6" />
                        </span>
                      </span>
                    </div>

                    <div className="flex items-end justify-between gap-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeTone}`}>
                        {stat.key === 'entries' && 'Cập nhật hôm nay'}
                        {stat.key === 'exits' && 'Lượt xe hoàn tất'}
                        {stat.key === 'revenue' && 'Doanh thu trong ngày'}
                      </span>
                    </div>
                  </div>
                )}
              </button>
              {isOpen ? <KpiDropdown type={stat.key} data={stat.data} /> : null}
            </div>
          );
      })}
    </div>
  );
}

function SessionTable({ title, subtitle, sessions, emptyText, onViewAll, onDetail, completed = false }) {
  const isActiveSection = !completed;
  const HeaderIcon = isActiveSection ? Activity : Clock3;

  return (
    <Card p="p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle>{title}</SectionTitle>
        <button
          type="button"
          onClick={onViewAll}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-50 hover:text-slate-800"
        >
          Xem tất cả <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {sessions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-xs font-semibold text-slate-400">
            {emptyText}
          </div>
        ) : (
          sessions.slice(0, 5).map((session) => (
            <div
              key={session.id}
              className={`grid min-h-[96px] gap-4 rounded-2xl border border-slate-200/60 bg-white/60 px-4 py-3 transition hover:bg-sky-50/40 sm:items-center ${
                completed ? 'sm:grid-cols-4' : 'sm:grid-cols-3'
              }`}
            >
              <div className="min-w-0 text-center sm:text-left">
                <p className="truncate font-mono text-sm font-bold tracking-tight text-slate-800">{session.plate}</p>
                <div className="mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  {completed ? (
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${paymentClasses[getCompletedPayment(session)] || 'bg-slate-100 text-slate-700'}`}>
                      {getCompletedPayment(session)}
                    </span>
                  ) : (
                    <StatusBadge status={session.status} />
                  )}
                  {completed ? (
                    <span className="text-[10px] font-bold text-slate-400">{getCompletedFee(session)}</span>
                  ) : null}
                </div>

              <div className="min-w-0 text-center sm:justify-self-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Giờ vào</p>
                <p className="mt-0.5 text-xs font-semibold text-slate-600">{session.entry}</p>
              </div>

              {completed ? (
                <div className="min-w-0 text-center sm:justify-self-center">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Giờ ra</p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-600">{session.exit}</p>
                </div>
              ) : null}

              <div className="flex justify-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => onDetail(session)}
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-50 hover:text-slate-800"
                >
                  Chi tiết
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [dashboardData, setDashboardData] = useState(emptyDashboardData);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [openKpi, setOpenKpi] = useState(null);
  const kpiRowRef = useRef(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await getStaffOperationsDashboard(selectedDate);
      setDashboardData(buildDashboardData(payload));
    } catch (err) {
      setDashboardData(emptyDashboardData);
      setError(err?.response?.data?.message || 'Không thể tải dữ liệu dashboard từ database.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const currentData = dashboardData;
  const capacity = parseCapacity(currentData.capacity);
  const stats = useMemo(
    () => [
      {
        key: 'entries',
        label: 'Xe vào',
        value: loading ? '...' : currentData.entries,
        description: 'Lượt vào trong ngày',
        data: currentData,
      },
      {
        key: 'exits',
        label: 'Xe ra',
        value: loading ? '...' : currentData.exits,
        description: 'Lượt ra trong ngày',
        data: currentData,
      },
      {
        key: 'revenue',
        label: 'Doanh thu',
        value: loading ? '...' : currentData.revenue,
        description: 'Đã thu trong ngày',
        data: currentData,
      },
      {
        key: 'capacity',
        label: 'Công suất bãi',
        value: loading ? '...' : currentData.capacity,
        description: `${currentData.availableSlots} chỗ còn trống`,
        progress: capacity.percent,
        wide: true,
        data: currentData,
      },
    ],
    [capacity.percent, currentData, loading],
  );

  function handleRefresh() {
    setRefreshing(true);
    loadDashboard();
  }

  function openSessionDetail(session) {
    setSelectedSession(session);
    setIsDetailOpen(true);
  }

  function handleKpiClick(key) {
    setOpenKpi(openKpi === key ? null : key);
  }

  useEffect(() => {
    function handleOutsideClick(event) {
      if (openKpi && kpiRowRef.current && !kpiRowRef.current.contains(event.target)) {
        setOpenKpi(null);
      }
    }

    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [openKpi]);

  return (
    <div className="space-y-8 font-[Inter]">
      <section className="relative min-h-[210px] overflow-hidden rounded-[32px] border border-white/90 bg-[linear-gradient(135deg,#ffffff,#eef6ff)] px-6 py-6 shadow-sm lg:px-8">
        <div className="pointer-events-none absolute -left-12 -top-12 h-56 w-56 rounded-full bg-blue-100/80 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-52 w-52 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="pointer-events-none absolute bottom-3 right-8 hidden h-[154px] w-[392px] lg:block">
          <div
            className="absolute inset-0 bg-contain bg-right-bottom bg-no-repeat opacity-95"
            style={{ backgroundImage: "url('/illustrations/parking-hero.svg')" }}
          />
          <div className="absolute inset-x-3 bottom-2 h-5 rounded-full bg-blue-400/25 blur-2xl" />
        </div>

        <div className="absolute right-8 top-6 z-20 hidden items-center gap-3 lg:flex">
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="h-12 rounded-full border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#111827] outline-none transition-all duration-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
          <button
            type="button"
            onClick={() => setSelectedDate(getToday())}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-5 text-sm font-semibold text-[#111827] transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          >
            <CalendarDays className="h-4 w-4 text-blue-600" />
            Hôm nay
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:shadow-[0_0_0_6px_rgba(37,99,235,0.18)]"
          >
            <RefreshCw className={`h-4 w-4 ${(refreshing || loading) ? 'animate-spin' : ''}`} />
            {refreshing || loading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-start gap-4">
            <span className="relative mt-1 grid h-14 w-14 shrink-0 place-items-center rounded-[18px] bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-[0_12px_24px_rgba(37,99,235,0.32)]">
              <SquareParking className="h-7 w-7" />
            </span>
            <div>
              <h1 className="text-[36px] font-bold leading-none tracking-tight text-[#111827] sm:text-[48px]">Tình hình hôm nay</h1>
              <p className="mt-3 max-w-2xl text-[15px] font-medium text-[#64748B]">
                Theo dõi nhanh lượt xe, doanh thu và công suất bãi.
              </p>
              {error ? <p className="mt-2 text-sm font-semibold text-rose-600">{error}</p> : null}
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 lg:mt-12 xl:w-auto xl:justify-end lg:hidden">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="h-12 rounded-full border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#111827] outline-none transition-all duration-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setSelectedDate(getToday())}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-5 text-sm font-semibold text-[#111827] transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
            >
              <CalendarDays className="h-4 w-4 text-blue-600" />
              Hôm nay
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:shadow-[0_0_0_6px_rgba(37,99,235,0.18)]"
            >
              <RefreshCw className={`h-4 w-4 ${(refreshing || loading) ? 'animate-spin' : ''}`} />
              {refreshing || loading ? 'Đang tải...' : 'Làm mới'}
            </button>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-8 hidden items-center gap-3 text-blue-300 opacity-60 lg:flex">
          <CarFront className="h-5 w-5" />
          <Building2 className="h-5 w-5" />
          <SquareParking className="h-5 w-5" />
        </div>
      </section>

      <section ref={kpiRowRef} className="relative z-30">
        <OperationsDock
          stats={stats}
          capacityPercent={capacity.percent}
          openKpi={openKpi}
          onKpiClick={handleKpiClick}
          currentData={currentData}
        />
      </section>
      <section className="relative z-0 grid grid-cols-1 gap-8 2xl:auto-rows-fr 2xl:grid-cols-2">
        <SessionTable
          title="Phiên đang hoạt động"
          subtitle="Theo dõi các phương tiện trong bãi."
          sessions={currentData.sessions}
          emptyText={loading ? 'Đang tải dữ liệu...' : 'Chưa có phiên đang hoạt động.'}
          onViewAll={() => navigate('/admin/parking-sessions')}
          onDetail={openSessionDetail}
        />
        <SessionTable
          title="Phiên gần đây"
          subtitle="Danh sách lượt xe đã hoàn thành gần nhất."
          sessions={currentData.completedSessions}
          emptyText={loading ? 'Đang tải dữ liệu...' : 'Chưa có phiên gần đây.'}
          onViewAll={() => navigate('/admin/parking-sessions')}
          onDetail={openSessionDetail}
          completed
        />
      </section>

      <SessionDetailDrawer open={isDetailOpen} session={selectedSession} onClose={() => setIsDetailOpen(false)} />
    </div>
  );
}
