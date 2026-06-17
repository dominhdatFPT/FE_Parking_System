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

const toneClasses = {
  blue: 'bg-blue-50 text-blue-700 ring-blue-100',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  red: 'bg-red-50 text-red-700 ring-red-100',
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
};

const statusClasses = {
  'Bình thường': 'bg-emerald-50 text-emerald-700',
  'Quá 24 giờ': 'bg-amber-50 text-amber-700',
  'Quá 7 ngày': 'bg-red-50 text-red-700',
  'Đã hoàn thành': 'bg-blue-50 text-blue-700',
};

const paymentClasses = {
  QR: 'bg-blue-50 text-blue-700',
  'Tiền mặt': 'bg-emerald-50 text-emerald-700',
  'Miễn phí': 'bg-slate-100 text-slate-700',
  Gói: 'bg-violet-50 text-violet-700',
};

function getCompletedFee(session) {
  return session.customer === 'Gói tháng' ? '-' : session.fee;
}

function getCompletedPayment(session) {
  return session.customer === 'Gói tháng' ? 'Gói' : session.payment;
}

function SectionTitle({ children }) {
  return <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{children}</h2>;
}

function Card({ children, className = '' }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</section>;
}

function StatusBadge({ status }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[status] || 'bg-slate-100 text-slate-700'}`}>{status}</span>;
}

function DetailItem({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-[#0F172A]">{value}</span>
    </div>
  );
}

function KpiDropdown({ type, data, onNavigate }) {
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
  }[type];

  if (!config) return null;

  const isRightAligned = type === 'capacity';

  return (
    <div
      className={`absolute top-full z-50 mt-3 w-[320px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl ${
        isRightAligned ? 'right-0' : 'left-0'
      }`}
    >
      <div
        className={`absolute -top-2 h-4 w-4 rotate-45 border-l border-t border-slate-200 bg-white ${
          isRightAligned ? 'right-8' : 'left-8'
        }`}
      />
      <div className="relative">
        <h3 className="text-sm font-semibold text-slate-950">{config.title}</h3>
        <div className="mt-3 space-y-2">
          {config.items.map((item) => (
            <DetailItem key={item.label} label={item.label} value={item.percent ? `${item.value} (${item.percent})` : item.value} />
          ))}
        </div>
        {config.action ? (
          <button
            type="button"
            onClick={config.onClick}
            className="mt-3 h-9 rounded-xl bg-blue-600 px-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {config.action}
          </button>
        ) : null}
      </div>
    </div>
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

  const kpis = useMemo(
    () => [
      { key: 'activeSessions', label: 'Phiên đang hoạt động', value: currentData.activeSessions, description: 'Xe đang trong bãi', icon: 'P', tone: 'blue' },
      { key: 'entries', label: 'Xe vào', value: currentData.entries, description: 'Lượt vào trong ngày', icon: 'IN', tone: 'green' },
      { key: 'exits', label: 'Xe ra', value: currentData.exits, description: 'Lượt ra trong ngày', icon: 'OUT', tone: 'slate' },
      { key: 'revenue', label: 'Doanh thu', value: currentData.revenue, description: 'Đã thu trong ngày', icon: '₫', tone: 'amber' },
      { key: 'capacity', label: 'Công suất bãi', value: currentData.capacity, description: `${currentData.availableSlots} chỗ còn trống`, icon: '%', tone: 'red' },
    ],
    [currentData],
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
    <div className="space-y-4 bg-[#F8FAFC]">
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A]">Tổng quan bãi</h1>
            <p className="mt-1 text-sm font-medium text-[#64748B]">Theo dõi phiên gửi xe, doanh thu và công suất bãi</p>
          </div>
          <div className="flex items-center gap-2">
            <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            <button type="button" onClick={() => setSelectedDate(today)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Hôm nay</button>
            <button type="button" onClick={handleRefresh} className="h-10 rounded-xl bg-[#2563EB] px-3 text-sm font-semibold text-white transition hover:bg-blue-700">{refreshing ? 'Đang tải...' : 'Làm mới'}</button>
          </div>
        </div>
      </Card>

      <section ref={kpiRowRef} className="grid grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.key} className="relative">
            <button
              type="button"
              onClick={() => handleKpiClick(kpi.key)}
              className={`w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md ${
                openKpi === kpi.key ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">{kpi.value}</p>
                </div>
                <span className={`grid h-9 min-w-9 place-items-center rounded-xl px-2 text-xs font-bold ring-1 ${toneClasses[kpi.tone]}`}>{kpi.icon}</span>
              </div>
            </button>
            {openKpi === kpi.key && <KpiDropdown type={openKpi} data={currentData} onNavigate={navigate} />}
          </div>
        ))}
      </section>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <SectionTitle>Phiên gửi xe đang hoạt động</SectionTitle>
          <button onClick={() => navigate('/admin/parking-sessions')} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#2563EB] transition hover:bg-blue-50">Xem tất cả phiên gửi xe</button>
        </div>
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-3 py-2.5">Biển số</th>
                <th className="px-3 py-2.5">Loại xe</th>
                <th className="px-3 py-2.5">Loại khách</th>
                <th className="px-3 py-2.5">Giờ vào</th>
                <th className="px-3 py-2.5">Thời gian gửi</th>
                <th className="px-3 py-2.5">Trạng thái</th>
                <th className="px-3 py-2.5 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {currentData.sessions.slice(0, 5).map((session) => (
                <tr key={session.id} className="text-slate-600 transition hover:bg-slate-50">
                  <td className="px-3 py-3 font-semibold text-[#0F172A]">{session.plate}</td>
                  <td className="px-3 py-3">{session.type}</td>
                  <td className="px-3 py-3">{session.customer}</td>
                  <td className="px-3 py-3">{session.entry}</td>
                  <td className="px-3 py-3 font-semibold text-[#0F172A]">{session.duration}</td>
                  <td className="px-3 py-3"><StatusBadge status={session.status} /></td>
                  <td className="px-3 py-3 text-right">
                    <button onClick={() => openSessionDetail(session)} className="rounded-lg px-2 py-1 text-sm font-semibold text-[#2563EB] hover:bg-blue-50">Chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4">
        <SectionTitle>Phiên hoàn thành</SectionTitle>
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-3 py-2.5">Biển số</th>
                <th className="px-3 py-2.5">Loại xe</th>
                <th className="px-3 py-2.5">Loại khách</th>
                <th className="px-3 py-2.5">Giờ vào</th>
                <th className="px-3 py-2.5">Giờ ra</th>
                <th className="px-3 py-2.5">Thời gian gửi</th>
                <th className="px-3 py-2.5">Phí</th>
                <th className="px-3 py-2.5">Thanh toán</th>
                <th className="px-3 py-2.5 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.completedSessions.slice(0, 5).map((session) => (
                <tr key={session.id} className="text-slate-600 hover:bg-slate-50">
                  <td className="px-3 py-3 font-semibold text-[#0F172A]">{session.plate}</td>
                  <td className="px-3 py-3">{session.type}</td>
                  <td className="px-3 py-3">{session.customer}</td>
                  <td className="px-3 py-3">{session.entry}</td>
                  <td className="px-3 py-3">{session.exit}</td>
                  <td className="px-3 py-3">{session.duration}</td>
                  <td className="px-3 py-3 font-semibold text-[#0F172A]">{getCompletedFee(session)}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${paymentClasses[getCompletedPayment(session)] || 'bg-slate-100 text-slate-700'}`}>
                      {getCompletedPayment(session)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openSessionDetail(session)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-[#2563EB] transition hover:bg-blue-50"
                    >
                      <span aria-hidden="true">👁</span>
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <SessionDetailDrawer open={isDetailOpen} session={selectedSession} onClose={() => setIsDetailOpen(false)} />
    </div>
  );
}
