import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import SessionDetailDrawer from '../../components/parking/SessionDetailDrawer';
import { activeParkingSessions, completedParkingSessions } from '../../data/parkingSessions';

const today = '2026-06-17';

const emptyDashboardData = {
  activeSessions: 0,
  entries: 0,
  exits: 0,
  revenue: '0',
  capacity: '0 / 600',
  availableSlots: 600,
  sessions: [],
  completedSessions: [],
  revenueBreakdown: [],
  vehicleBreakdown: [],
  customerBreakdown: [],
  entryBreakdown: [],
  exitBreakdown: [],
  capacityBreakdown: [],
};

const dashboardDataByDate = {
  '2026-06-17': {
    activeSessions: 428,
    entries: 632,
    exits: 584,
    revenue: '18.4M',
    capacity: '428 / 600',
    availableSlots: 172,
    sessions: activeParkingSessions,
    completedSessions: completedParkingSessions,
    revenueBreakdown: [
      { label: 'Khách vãng lai', value: '5.2M' },
      { label: 'Khách gói', value: '12M' },
      { label: 'Phí phát sinh', value: '1.2M' },
      { label: 'Tổng cộng', value: '18.4M' },
    ],
    vehicleBreakdown: [
      { label: 'Ô tô', value: '186', percent: '43%' },
      { label: 'Xe máy', value: '242', percent: '57%' },
    ],
    customerBreakdown: [
      { label: 'Khách gói', value: '296', percent: '69%' },
      { label: 'Khách vãng lai', value: '132', percent: '31%' },
    ],
    entryBreakdown: [
      { label: 'Tổng lượt vào', value: '632' },
      { label: 'Khách gói', value: '430' },
      { label: 'Khách vãng lai', value: '202' },
      { label: 'Ô tô', value: '280' },
      { label: 'Xe máy', value: '352' },
    ],
    exitBreakdown: [
      { label: 'Tổng lượt ra', value: '584' },
      { label: 'Khách gói', value: '390' },
      { label: 'Khách vãng lai', value: '194' },
      { label: 'Ô tô', value: '255' },
      { label: 'Xe máy', value: '329' },
      { label: 'QR', value: '220' },
      { label: 'Tiền mặt', value: '160' },
      { label: 'Miễn phí', value: '204' },
    ],
    capacityBreakdown: [
      { label: 'Đang sử dụng', value: '428' },
      { label: 'Còn trống', value: '172' },
      { label: 'Tổng sức chứa', value: '600' },
      { label: 'Tỷ lệ sử dụng', value: '71%' },
      { label: 'Floor 1', value: '120 / 200' },
      { label: 'Floor 2', value: '180 / 200' },
      { label: 'Floor 3', value: '128 / 200' },
    ],
  },
  '2026-06-16': {
    activeSessions: 390,
    entries: 580,
    exits: 540,
    revenue: '16.2M',
    capacity: '390 / 600',
    availableSlots: 210,
    sessions: activeParkingSessions.map((session, index) => ({
      ...session,
      id: `PS-20260616-00${index + 1}`,
      entry: ['08:02', '12:15', '10:35', '07:40', '10/06 08:20'][index],
    })),
    completedSessions: completedParkingSessions.map((session, index) => ({
      ...session,
      id: `PS-20260616-10${index + 1}`,
      fee: ['65K', '10K', '0K', '12K', '35K'][index],
    })),
    revenueBreakdown: [
      { label: 'Khách vãng lai', value: '4.4M' },
      { label: 'Khách gói', value: '10.7M' },
      { label: 'Phí phát sinh', value: '1.1M' },
      { label: 'Tổng cộng', value: '16.2M' },
    ],
    vehicleBreakdown: [
      { label: 'Ô tô', value: '248', percent: '44%' },
      { label: 'Xe máy', value: '312', percent: '56%' },
    ],
    customerBreakdown: [
      { label: 'Khách gói', value: '360', percent: '64%' },
      { label: 'Khách vãng lai', value: '200', percent: '36%' },
    ],
    entryBreakdown: [
      { label: 'Tổng lượt vào', value: '580' },
      { label: 'Khách gói', value: '380' },
      { label: 'Khách vãng lai', value: '200' },
      { label: 'Ô tô', value: '250' },
      { label: 'Xe máy', value: '330' },
    ],
    exitBreakdown: [
      { label: 'Tổng lượt ra', value: '540' },
      { label: 'Khách gói', value: '355' },
      { label: 'Khách vãng lai', value: '185' },
      { label: 'Ô tô', value: '230' },
      { label: 'Xe máy', value: '310' },
      { label: 'QR', value: '205' },
      { label: 'Tiền mặt', value: '145' },
      { label: 'Miễn phí', value: '190' },
    ],
    capacityBreakdown: [
      { label: 'Đang sử dụng', value: '390' },
      { label: 'Còn trống', value: '210' },
      { label: 'Tổng sức chứa', value: '600' },
      { label: 'Tỷ lệ sử dụng', value: '65%' },
      { label: 'Floor 1', value: '110 / 200' },
      { label: 'Floor 2', value: '165 / 200' },
      { label: 'Floor 3', value: '115 / 200' },
    ],
  },
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

function parseCapacity(capacity) {
  const [usedRaw, totalRaw] = String(capacity).split('/').map((part) => Number(part.trim()));
  const used = Number.isFinite(usedRaw) ? usedRaw : 0;
  const total = Number.isFinite(totalRaw) && totalRaw > 0 ? totalRaw : 1;
  const percent = Math.min(100, Math.round((used / total) * 100));

  return { used, total, percent };
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

                  {isCapacity ? (
                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                        <span>{capacityPercent}% sử dụng</span>
                        <span>{currentData.availableSlots} trống</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-sky-500 transition-all duration-500" style={{ width: `${capacityPercent}%` }} />
                      </div>
                    </div>
                  ) : null}
                </div>
              </button>
              {isOpen ? <KpiDropdown type={stat.key} data={stat.data} /> : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function SessionTable({ title, sessions, emptyText, onViewAll, onDetail, completed = false }) {
  return (
    <Card p="p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle>{title}</SectionTitle>
        <button
          type="button"
          onClick={onViewAll}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-50 hover:text-slate-800"
        >
          Xem tất cả
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
              className={`grid min-h-[72px] gap-4 rounded-xl border border-slate-100 bg-slate-50/30 px-4 py-3 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-50 sm:items-center ${
                completed
                  ? 'sm:grid-cols-4'
                  : 'sm:grid-cols-3'
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
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(today);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [openKpi, setOpenKpi] = useState(null);
  const kpiRowRef = useRef(null);

  const currentData = dashboardDataByDate[selectedDate] || emptyDashboardData;
  const capacity = parseCapacity(currentData.capacity);
  const stats = useMemo(
    () => [
      {
        key: 'entries',
        label: 'Xe vào',
        value: currentData.entries,
        description: 'Lượt vào trong ngày',
        icon: 'IN',
        tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
        data: currentData,
      },
      {
        key: 'exits',
        label: 'Xe ra',
        value: currentData.exits,
        description: 'Lượt ra trong ngày',
        icon: 'OUT',
        tone: 'bg-slate-100 text-slate-700 ring-slate-200',
        data: currentData,
      },
      {
        key: 'revenue',
        label: 'Doanh thu',
        value: currentData.revenue,
        description: 'Đã thu trong ngày',
        icon: '₫',
        tone: 'bg-amber-50 text-amber-700 ring-amber-100',
        data: currentData,
      },
      {
        key: 'capacity',
        label: 'Công suất bãi',
        value: currentData.capacity,
        description: `${currentData.availableSlots} chỗ còn trống`,
        icon: '%',
        tone: 'bg-sky-50 text-sky-700 ring-sky-100',
        progress: capacity.percent,
        wide: true,
        data: currentData,
      },
    ],
    [capacity.percent, currentData],
  );
  function handleRefresh() {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 450);
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
    <div className="space-y-6">
      <Card className="relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Tình hình hôm nay</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">
              Theo dõi nhanh lượt xe, doanh thu và công suất bãi
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 xl:w-auto xl:justify-end">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="h-10 rounded-2xl border border-white/80 bg-white/80 px-3 text-sm font-semibold text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
            <button
              type="button"
              onClick={() => setSelectedDate(today)}
              className="h-10 rounded-2xl border border-white/80 bg-white/80 px-4 text-sm font-semibold text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.05)] transition hover:bg-white active:scale-[0.98]"
            >
              Hôm nay
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="h-10 rounded-2xl bg-sky-500 px-4 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(14,165,233,0.24)] transition hover:bg-sky-600 active:scale-[0.98]"
            >
              {refreshing ? 'Đang tải...' : 'Làm mới'}
            </button>
          </div>
        </div>
      </Card>

      <section ref={kpiRowRef} className="relative z-30">
        <OperationsDock
          stats={stats}
          capacityPercent={capacity.percent}
          openKpi={openKpi}
          onKpiClick={handleKpiClick}
          currentData={currentData}
        />
      </section>
      <section className="relative z-0 grid grid-cols-1 gap-4 2xl:grid-cols-2">
        <SessionTable
          title="Phiên đang hoạt động"
          sessions={currentData.sessions}
          emptyText="Chưa có phiên đang hoạt động."
          onViewAll={() => navigate('/admin/parking-sessions')}
          onDetail={openSessionDetail}
        />
        <SessionTable
          title="Phiên gần đây"
          sessions={currentData.completedSessions}
          emptyText="Chưa có phiên gần đây."
          onViewAll={() => navigate('/admin/parking-sessions')}
          onDetail={openSessionDetail}
          completed
        />
      </section>

      <SessionDetailDrawer open={isDetailOpen} session={selectedSession} onClose={() => setIsDetailOpen(false)} />
    </div>
  );
}
