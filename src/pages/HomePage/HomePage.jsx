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

function Card({ children, className = '' }) {
  return (
    <section className={`rounded-[28px] border border-white/60 bg-white/70 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-xl ${className}`}>
      {children}
    </section>
  );
}

function SectionTitle({ children }) {
  return <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{children}</h2>;
}

function parseCapacity(capacity) {
  const [usedRaw, totalRaw] = String(capacity).split('/').map((part) => Number(part.trim()));
  const used = Number.isFinite(usedRaw) ? usedRaw : 0;
  const total = Number.isFinite(totalRaw) && totalRaw > 0 ? totalRaw : 1;
  const percent = Math.min(100, Math.round((used / total) * 100));

  return { used, total, percent };
}

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
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[tone]}`}>
      {normalizeStatus(status)}
    </span>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50/90 px-3 py-2 ring-1 ring-slate-100">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-950">{value}</span>
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
    <div className="absolute left-0 top-full z-[100] mt-3 w-[300px] rounded-[22px] border border-white/70 bg-white/95 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.16)] backdrop-blur-xl">
      <div className="absolute -top-2 left-8 h-4 w-4 rotate-45 border-l border-t border-white/70 bg-white/95" />
      <div className="relative">
        <h3 className="text-sm font-semibold text-slate-950">{config.title}</h3>
        <div className="mt-3 space-y-2">
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
    <Card className="overflow-visible p-3 sm:p-4">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.35fr]">
        {stats.map((stat, index) => {
          const isCapacity = stat.key === 'capacity';
          const isOpen = openKpi === stat.key;

          return (
            <div
              key={stat.key}
              className={`relative min-w-0 ${index > 0 ? 'xl:border-l xl:border-slate-200/60' : ''}`}
            >
              <button
                type="button"
                onClick={() => onKpiClick(stat.key)}
                className={`group h-full min-h-[150px] w-full rounded-[24px] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-md ${
                  isOpen ? 'bg-white/85 ring-2 ring-sky-100' : 'bg-transparent'
                }`}
              >
                <div className="flex h-full flex-col justify-between gap-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
                      <p className="mt-1 text-xs font-medium text-slate-400">{stat.description}</p>
                    </div>
                    <span className={`grid h-10 min-w-10 place-items-center rounded-2xl px-2 text-xs font-bold ring-1 ${stat.tone}`}>
                      {stat.icon}
                    </span>
                  </div>

                  {isCapacity ? (
                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>{capacityPercent}% sử dụng</span>
                        <span>{currentData.availableSlots} trống</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 shadow-inner">
                        <div className="h-full rounded-full bg-sky-500" style={{ width: `${capacityPercent}%` }} />
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
    <Card className="p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle>{title}</SectionTitle>
        <button
          type="button"
          onClick={onViewAll}
          className="rounded-xl border border-sky-100 bg-sky-50/80 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
        >
          Xem tất cả
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {sessions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/60 bg-white/60 px-4 py-8 text-center text-sm font-medium text-slate-400">
            {emptyText}
          </div>
        ) : (
          sessions.slice(0, 5).map((session) => (
            <div
              key={session.id}
              className={`grid min-h-[96px] gap-4 rounded-2xl border border-slate-200/60 bg-white/60 px-4 py-3 transition hover:bg-sky-50/40 sm:items-center ${
                completed
                  ? 'sm:grid-cols-4'
                  : 'sm:grid-cols-3'
              }`}
            >
              <div className="min-w-0 text-center sm:justify-self-center">
                <p className="truncate text-base font-bold text-slate-950">{session.plate}</p>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
                  {completed ? (
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${paymentClasses[getCompletedPayment(session)] || 'bg-slate-100 text-slate-700'}`}>
                      {getCompletedPayment(session)}
                    </span>
                  ) : (
                    <StatusBadge status={session.status} />
                  )}
                  {completed ? (
                    <span className="text-xs font-semibold text-slate-400">{getCompletedFee(session)}</span>
                  ) : null}
                </div>
              </div>

              <div className="min-w-0 text-center sm:justify-self-center">
                <p className="text-xs font-medium text-slate-400">Giờ vào</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">{session.entry}</p>
              </div>

              {completed ? (
                <div className="min-w-0 text-center sm:justify-self-center">
                  <p className="text-xs font-medium text-slate-400">Giờ ra</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{session.exit}</p>
                </div>
              ) : null}

              <div className="flex justify-center sm:justify-self-center">
                <button
                  type="button"
                  onClick={() => onDetail(session)}
                  className="inline-flex h-9 w-20 items-center justify-center rounded-xl px-3 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 hover:text-sky-700"
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
