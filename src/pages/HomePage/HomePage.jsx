import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  Bike,
  Building2,
  CarFront,
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  Download,
  RefreshCw,
  SquareParking,
} from 'lucide-react';
import SessionDetailDrawer from '../../components/parking/SessionDetailDrawer';
import { getStaffOperationsDashboard } from '../../services/staffService';
import { apiDateTimeMillis, formatVietnamTime } from '../../utils/dateTime';
import { exportParkingDashboardReport } from '../../utils/parkingDashboardReport';
import { getRememberedVehicleType, normalizeVehicleTypeCode } from '../../utils/vehicleTypeMemory';

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
  done: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
};

const paymentClasses = {
  QR: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
  'Tiền mặt': 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  'Miễn phí': 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
  Gói: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
};

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
    return `${(amount / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} triệu`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} nghìn`;
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

function mapVehicleType(activity) {
  const rememberedType = getRememberedVehicleType(activity?.licensePlate);
  const cardCode = String(activity?.visitorCardCode || '').toUpperCase();
  if (normalizeVehicleTypeCode(rememberedType) === 'MOTORBIKE') return 'Xe máy';
  if (normalizeVehicleTypeCode(rememberedType) === 'CAR') return 'Ô tô';
  if (cardCode.startsWith('CAR')) return 'Ô tô';
  if (cardCode.startsWith('VIS') || cardCode.startsWith('MOTO') || cardCode.startsWith('BIKE')) return 'Xe máy';
  return normalizeVehicleTypeCode(activity?.vehicleType) === 'MOTORBIKE' ? 'Xe máy' : 'Ô tô';
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
    type: mapVehicleType(activity),
    customer: mapCustomerType(activity.customerType),
    cardId: activity.visitorCardCode || '--',
    entry: formatTime(activity.entryTime),
    exit: isCompleted ? formatTime(activity.exitTime) : '--',
    entryTime: activity.entryTime || null,
    exitTime: activity.exitTime || null,
    calculatedFee: activity.calculatedFee ?? null,
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
  const completedActivities = activities.filter((activity) => activity.exitTime || activity.status === 'COMPLETED');
  const fallbackVisitorRevenue = completedActivities
    .filter((activity) => activity.customerType !== 'MONTHLY')
    .reduce((sum, activity) => sum + asNumber(activity.calculatedFee), 0);
  const visitorRevenueToday = asNumber(metrics.visitorRevenueToday) || fallbackVisitorRevenue;
  const subscriptionRevenueToday = asNumber(metrics.subscriptionRevenueToday)
    || Math.max(0, revenueToday - visitorRevenueToday);

  return {
    entries: vehiclesInToday,
    exits: vehiclesOutToday,
    revenue: formatMoney(revenueToday),
    capacity: `${vehiclesInParking} / ${totalSlots}`,
    availableSlots,
    sessions: activeSessions,
    completedSessions,
    revenueBreakdown: [
      { label: 'Tổng doanh thu', value: formatCurrency(revenueToday) },
      { label: 'Doanh thu xe gói', value: formatCurrency(subscriptionRevenueToday) },
      { label: 'Doanh thu xe vãng lai', value: formatCurrency(visitorRevenueToday) },
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
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${statusClasses[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
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
    <div className="absolute left-0 top-full z-50 mt-3 w-[280px] rounded-[22px] border border-[#E6EDF5] bg-white/95 p-4 shadow-[0_18px_42px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <div className="absolute -top-1.5 left-8 h-3 w-3 rotate-45 border-l border-t border-[#E6EDF5] bg-white" />
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

  const decorativeIconMap = {
    entries: CarFront,
    exits: CarFront,
    revenue: CircleDollarSign,
    capacity: Building2,
  };

  const badgeTextMap = {
    entries: 'Hôm nay',
    exits: 'Hôm nay',
    revenue: 'Hôm nay',
    capacity: 'Hiện tại',
  };

  const badgeToneMap = {
    entries: 'bg-blue-50 text-blue-600',
    exits: 'bg-emerald-50 text-emerald-600',
    revenue: 'bg-orange-50 text-orange-600',
    capacity: 'bg-indigo-50 text-indigo-600',
  };

  const numberToneMap = {
    entries: 'text-blue-600',
    exits: 'text-emerald-600',
    revenue: 'text-orange-500',
    capacity: 'text-indigo-600',
  };

  const toneMap = {
    entries: 'from-blue-500 to-cyan-400',
    exits: 'from-emerald-500 to-teal-400',
    revenue: 'from-orange-400 to-amber-500',
    capacity: 'from-indigo-500 to-violet-500',
  };

  const lineToneMap = {
    entries: 'from-blue-500 to-cyan-300',
    exits: 'from-emerald-500 to-teal-300',
    revenue: 'from-orange-500 to-amber-300',
    capacity: 'from-indigo-500 to-violet-300',
  };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.25fr]">
      {stats.map((stat) => {
        const isOpen = openKpi === stat.key;
        const isCapacity = stat.key === 'capacity';
        const StatIcon = cardIconMap[stat.key] || Activity;
        const DecorativeIcon = decorativeIconMap[stat.key] || Activity;
        const iconTone = toneMap[stat.key] || 'from-slate-500 to-slate-600';
        const badgeTone = badgeToneMap[stat.key] || 'bg-slate-100 text-slate-600';
        const numberTone = numberToneMap[stat.key] || 'text-slate-800';
        const lineTone = lineToneMap[stat.key] || 'from-slate-500 to-slate-300';
        const badgeText = badgeTextMap[stat.key] || 'Hôm nay';

        return (
          <div
            key={stat.key}
            className="relative min-w-0"
          >
              <button
                type="button"
                onClick={() => onKpiClick(stat.key)}
                className={`group relative h-full min-h-[198px] w-full overflow-hidden rounded-[24px] border border-slate-200/70 bg-white p-6 text-left shadow-[0_12px_35px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isOpen ? 'ring-1 ring-slate-300' : ''
                }`}
              >
                <div className="pointer-events-none absolute bottom-4 right-6 opacity-10">
                  <DecorativeIcon className="h-16 w-16 text-slate-500" />
                </div>
                <div className={`pointer-events-none absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r ${lineTone}`} />

                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 pr-16">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${badgeTone}`}>
                        {badgeText}
                      </span>
                      <p className="mt-4 text-[18px] font-semibold text-slate-700">{stat.label}</p>
                    </div>
                    <span className={`absolute right-6 top-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${iconTone}`}>
                      <StatIcon className="h-6 w-6" />
                    </span>
                  </div>

                  {isCapacity ? (
                    <div className="mt-5 flex flex-1 flex-col">
                      <p className={`text-5xl font-bold tracking-tight leading-none ${numberTone}`}>{stat.value}</p>

                      <div className="mt-4">
                        <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                          <span>{capacityPercent}% sử dụng</span>
                          <span>{currentData.availableSlots} chỗ trống</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700 ease-out" style={{ width: `${capacityPercent}%` }} />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          Available
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 flex flex-1 flex-col justify-end">
                      <p className={`text-5xl font-bold tracking-tight leading-none ${numberTone}`}>{stat.value}</p>
                      <p className="mt-2 text-sm text-slate-500">{stat.description}</p>
                    </div>
                  )}
                </div>
              </button>
              {isOpen ? <KpiDropdown type={stat.key} data={stat.data} /> : null}
          </div>
        );
      })}
    </div>
  );
}

function SessionTable({ title, subtitle, sessions, emptyText, onViewAll, onDetail, completed = false }) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-[#DCE7F5] bg-white p-8 shadow-[0_12px_40px_rgba(30,64,175,0.06)]">
      {/* Decoration: top-left gradient blob */}
      <div className="pointer-events-none absolute -left-14 -top-14 h-52 w-52 rounded-full bg-gradient-to-br from-blue-100/60 to-sky-50/30 blur-3xl" />
      {/* Decoration: top-right dot matrix */}
      <div className="pointer-events-none absolute right-8 top-7 grid grid-cols-3 gap-[5px] opacity-[0.22]">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="h-[5px] w-[5px] rounded-full bg-[#1D6BFF]" />
        ))}
      </div>
      {/* Decoration: bottom-right curved lines */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-28 w-28 opacity-[0.10]">
        <svg viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <path d="M112 112 Q56 112 0 56" stroke="#1D6BFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M112 80 Q72 80 32 40" stroke="#1D6BFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M112 52 Q88 52 64 28" stroke="#1D6BFF" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      {/* Header */}
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[24px] font-bold tracking-tight text-slate-900">{title}</h2>
            <span className="inline-flex h-9 min-w-[36px] items-center justify-center rounded-full bg-[#EAF3FF] px-3 text-sm font-bold text-[#1D6BFF]">
              {sessions.length}
            </span>
          </div>
          <p className="mt-3 text-[15px] text-[#64748B]">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 text-base font-semibold text-blue-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 active:scale-[0.98]"
        >
          Xem tất cả <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Session list */}
      <div className="relative mt-6 space-y-3">
        {sessions.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#DCE7F5] bg-[#F5F9FF] px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#EAF3FF] text-[#1D6BFF]">
              <ClipboardList className="h-7 w-7" />
            </div>
            <p className="mt-4 text-base font-semibold text-[#0F172A]">Chưa có dữ liệu</p>
            <p className="mt-1 text-sm text-[#64748B]">{emptyText}</p>
          </div>
        ) : (
          sessions.slice(0, 5).map((session) => {
            const VehicleIcon = session.type === 'Xe máy' ? Bike : CarFront;
            return (
            <div
              key={session.id}
              className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 rounded-[22px] border border-[#DCE7F5] bg-white px-5 py-4 transition-all duration-200 hover:border-blue-200 hover:shadow-md"
            >
              {/* Left: icon + plate + badge */}
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#EEF5FF] text-[#1D6BFF]">
                  <VehicleIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold text-[#0F172A]">{session.plate}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {completed ? (
                      <>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${paymentClasses[getCompletedPayment(session)] || 'bg-slate-100 text-slate-700'}`}>
                          {getCompletedPayment(session)}
                        </span>
                        <span className="text-sm font-bold text-emerald-600">{getCompletedFee(session)}</span>
                      </>
                    ) : (
                      <StatusBadge status={session.status} />
                    )}
                  </div>
                </div>
              </div>

              {/* Entry time */}
              <div className="min-w-[72px] text-center">
                <p className="text-sm font-semibold text-[#64748B]">Giờ vào</p>
                <p className="mt-1 text-base font-bold text-[#0F172A]">{session.entry}</p>
              </div>

              {/* Exit time (completed only) */}
              {completed ? (
                <div className="min-w-[72px] text-center">
                  <p className="text-sm font-semibold text-[#64748B]">Giờ ra</p>
                  <p className="mt-1 text-base font-bold text-[#0F172A]">{session.exit}</p>
                </div>
              ) : null}

              {/* Detail button */}
              <button
                type="button"
                onClick={() => onDetail(session)}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 active:scale-[0.98]"
              >
                Chi tiết <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            );
          })
        )}
      </div>
    </div>
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
  const [exporting, setExporting] = useState(false);
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
        description: 'Xe gói + xe vãng lai trong ngày',
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

  async function handleExportReport() {
    setExporting(true);
    try {
      await exportParkingDashboardReport({ data: currentData, selectedDate });
    } catch (err) {
      console.error('Export dashboard report error:', err);
      window.alert('Không thể xuất báo cáo. Vui lòng thử lại.');
    } finally {
      setExporting(false);
    }
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
    <div className="relative space-y-8 font-[Inter]">
      <div className="pointer-events-none absolute -bottom-10 -left-24 h-[360px] w-[360px] rounded-full bg-blue-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-14 top-12 h-[360px] w-[360px] rounded-full bg-sky-400/10 blur-[120px]" />

      <section className="relative min-h-[210px] overflow-hidden rounded-[28px] border border-white/90 bg-[linear-gradient(135deg,#ffffff_0%,#F3F8FF_58%,#EEF7FF_100%)] px-8 py-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] ring-1 ring-[#E6EDF5]/80">
        <div className="pointer-events-none absolute -left-12 -top-12 h-56 w-56 rounded-full bg-blue-100/80 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-52 w-52 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="pointer-events-none absolute bottom-2 right-8 hidden h-[168px] w-[420px] lg:block">
          <div
            className="absolute inset-0 bg-contain bg-right-bottom bg-no-repeat opacity-[0.3]"
            style={{ backgroundImage: "url('/illustrations/parking-hero.svg')" }}
          />
          <div className="absolute inset-x-3 bottom-2 h-5 rounded-full bg-blue-400/20 blur-2xl" />
        </div>

        <div className="absolute right-8 top-6 z-20 hidden items-center gap-3 lg:flex">
          <input
            type="date"
            value={selectedDate}
            max={getToday()}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="h-12 rounded-full border border-[#E6EDF5] bg-white/90 px-4 text-sm font-semibold text-[#0F172A] outline-none transition-all duration-200 hover:border-blue-200 focus:border-[#1D6BFF] focus:ring-4 focus:ring-blue-100"
          />
          <button
            type="button"
            onClick={() => setSelectedDate(getToday())}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-[#E6EDF5] bg-white/90 px-5 text-sm font-semibold text-[#0F172A] transition-all duration-200 hover:scale-[1.02] hover:border-blue-200 hover:bg-white hover:shadow-md active:scale-[0.98]"
          >
            <CalendarDays className="h-4 w-4 text-[#1D6BFF]" />
            Hôm nay
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#1565FF] to-[#1EA7FF] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(29,107,255,0.25)] transition-all duration-200 hover:scale-[1.02] hover:brightness-105 hover:shadow-xl active:scale-[0.98]"
          >
            <RefreshCw className={`h-4 w-4 ${(refreshing || loading) ? 'animate-spin' : ''}`} />
            {refreshing || loading ? 'Đang tải...' : 'Làm mới'}
          </button>
          <button
            type="button"
            onClick={handleExportReport}
            disabled={loading || exporting}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 text-sm font-semibold text-emerald-700 transition-all duration-200 hover:scale-[1.02] hover:border-emerald-300 hover:bg-emerald-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {exporting ? 'Đang xuất...' : 'Xuất báo cáo'}
          </button>
        </div>

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-start gap-4">
            <div>
              <h1 className="text-[38px] font-bold leading-none tracking-tight text-[#0F172A] sm:text-[52px]">Tình hình hôm nay</h1>
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
              max={getToday()}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="h-12 rounded-full border border-[#E6EDF5] bg-white/90 px-4 text-sm font-semibold text-[#0F172A] outline-none transition-all duration-200 hover:border-blue-200 focus:border-[#1D6BFF] focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setSelectedDate(getToday())}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[#E6EDF5] bg-white/90 px-5 text-sm font-semibold text-[#0F172A] transition-all duration-200 hover:scale-[1.02] hover:border-blue-200 hover:bg-white hover:shadow-md active:scale-[0.98]"
            >
              <CalendarDays className="h-4 w-4 text-[#1D6BFF]" />
              Hôm nay
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#1565FF] to-[#1EA7FF] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(29,107,255,0.25)] transition-all duration-200 hover:scale-[1.02] hover:brightness-105 hover:shadow-xl active:scale-[0.98]"
            >
              <RefreshCw className={`h-4 w-4 ${(refreshing || loading) ? 'animate-spin' : ''}`} />
              {refreshing || loading ? 'Đang tải...' : 'Làm mới'}
            </button>
            <button
              type="button"
              onClick={handleExportReport}
              disabled={loading || exporting}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 text-sm font-semibold text-emerald-700 transition-all duration-200 hover:scale-[1.02] hover:border-emerald-300 hover:bg-emerald-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className="h-4 w-4" />
              {exporting ? 'Đang xuất...' : 'Xuất báo cáo'}
            </button>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-5 left-8 hidden items-center gap-3 text-[#1D6BFF] opacity-45 lg:flex">
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
      <section className="relative z-0 grid grid-cols-1 gap-8 xl:grid-cols-2">
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
