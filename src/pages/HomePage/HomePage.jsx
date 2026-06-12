import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReportToolbar from '../../components/admin/ReportToolbar';
import { useAuth } from '../../contexts/useAuth';
import { getAdminDashboardData } from '../../services/adminDashboardService';

const initialTodayDate = new Date().toISOString().slice(0, 10);
const initialRange = { key: 'today', from: initialTodayDate, to: initialTodayDate };

const timeLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'];

const slotStatusLabels = {
  AVAILABLE: 'Chỗ trống',
  OCCUPIED: 'Đang sử dụng',
  RESERVED: 'Đã đặt',
  MAINTENANCE: 'Bảo trì',
};

const statusClasses = {
  AVAILABLE: 'bg-emerald-100 text-emerald-700',
  OCCUPIED: 'bg-blue-100 text-blue-700',
  RESERVED: 'bg-amber-100 text-amber-700',
  MAINTENANCE: 'bg-rose-100 text-rose-700',
};

const apiStatusLabels = {
  users: 'API tài khoản',
  bookings: 'API đặt chỗ',
  slots: 'API chỗ đỗ',
};

const formatNumber = (value) =>
  Number(value || 0).toLocaleString('vi-VN');

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const getSelectedRangeDates = (range) => {
  const now = new Date();
  const today = new Date(now);
  today.setHours(23, 59, 59, 999);

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const yesterdayStart = new Date(startOfToday);
  yesterdayStart.setDate(startOfToday.getDate() - 1);
  const yesterdayEnd = new Date(yesterdayStart);
  yesterdayEnd.setHours(23, 59, 59, 999);

  if (range.key === 'today') {
    return { from: startOfToday, to: today };
  }

  if (range.key === 'yesterday') {
    return { from: yesterdayStart, to: yesterdayEnd };
  }

  if (range.key === 'past7') {
    const from = new Date(startOfToday);
    from.setDate(startOfToday.getDate() - 6);
    return { from, to: today };
  }

  if (range.key === 'past30') {
    const from = new Date(startOfToday);
    from.setDate(startOfToday.getDate() - 29);
    return { from, to: today };
  }

  if (range.key === 'custom' && range.from && range.to) {
    const from = new Date(range.from);
    const to = new Date(range.to);
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);
    return { from, to };
  }

  return { from: startOfToday, to: today };
};

const isWithinRange = (value, rangeDates) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date >= rangeDates.from && date <= rangeDates.to;
};

const getBookingTime = (booking) => booking.startTime || booking.createdAt || booking.updatedAt;

const buildTrafficVolume = (bookings, rangeDates) => {
  const buckets = [0, 0, 0, 0, 0, 0, 0];

  bookings.forEach((booking) => {
    const value = getBookingTime(booking);
    if (!isWithinRange(value, rangeDates)) return;

    const hour = new Date(value).getHours();
    const index = Math.min(6, Math.floor(hour / 4));
    buckets[index] += 1;
  });

  const max = Math.max(...buckets, 1);
  return buckets.map((count) => ({
    count,
    height: count > 0 ? Math.max(12, Math.round((count / max) * 100)) : 0,
  }));
};

const buildSlotDistribution = (slots) => {
  const counts = slots.reduce((acc, slot) => {
    const status = slot.status || 'UNKNOWN';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([status, count]) => ({
      status,
      label: slotStatusLabels[status] || status,
      count,
      percent: slots.length > 0 ? Math.round((count / slots.length) * 100) : 0,
      className: statusClasses[status] || 'bg-slate-100 text-slate-700',
    }))
    .sort((a, b) => b.count - a.count);
};

const getFriendlyError = (error) => {
  const message = error?.response?.data?.message;
  if (typeof message === 'string') return message;
  if (error?.response?.status === 500) return 'Backend hoặc schema database đang lỗi.';
  if (error?.response?.status === 404) return 'Backend chưa có endpoint này.';
  return 'Không thể tải dữ liệu.';
};

export default function HomePage() {
  const { user } = useAuth();
  const [selectedRange, setSelectedRange] = useState(initialRange);
  const [dashboardState, setDashboardState] = useState({
    users: [],
    bookings: [],
    slots: [],
    errors: {},
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminDashboardData();
      setDashboardState(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const rangeDates = useMemo(() => getSelectedRangeDates(selectedRange), [selectedRange]);

  const dashboardData = useMemo(() => {
    const { users, bookings, slots, errors } = dashboardState;
    const filteredBookings = bookings.filter((booking) => isWithinRange(getBookingTime(booking), rangeDates));
    const availableSlots = slots.filter((slot) => slot.status === 'AVAILABLE').length;
    const occupiedSlots = slots.filter((slot) => slot.status && slot.status !== 'AVAILABLE').length;
    const occupancyRate = slots.length > 0 ? Math.round((occupiedSlots / slots.length) * 100) : null;
    const slotDistribution = buildSlotDistribution(slots);
    const volume = buildTrafficVolume(bookings, rangeDates);

    const metrics = [
      {
        label: 'Tổng chỗ đỗ',
        value: errors.slots ? 'Chưa sẵn sàng' : formatNumber(slots.length),
        icon: 'local_parking',
        badge: errors.slots ? 'Lỗi API' : 'Từ DB',
        badgeClass: errors.slots ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700',
        iconBg: 'bg-blue-100 text-blue-700',
      },
      {
        label: 'Chỗ trống hiện tại',
        value: errors.slots ? 'Chưa có dữ liệu' : formatNumber(availableSlots),
        icon: 'event_seat',
        badge: occupancyRate === null ? 'Chưa tính' : `${occupancyRate}% đầy`,
        badgeClass: 'bg-slate-100 text-slate-700',
        iconBg: 'bg-slate-100 text-slate-700',
      },
      {
        label: 'Tài khoản hệ thống',
        value: errors.users ? 'Chưa sẵn sàng' : formatNumber(users.length),
        icon: 'manage_accounts',
        badge: errors.users ? 'Lỗi API' : 'Từ users',
        badgeClass: errors.users ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700',
        iconBg: 'bg-cyan-100 text-cyan-700',
      },
      {
        label: 'Lượt đặt chỗ',
        value: errors.bookings ? 'Chưa sẵn sàng' : formatNumber(filteredBookings.length),
        icon: 'event_available',
        badge: errors.bookings ? 'Lỗi API' : 'Theo khoảng ngày',
        badgeClass: errors.bookings ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700',
        iconBg: 'bg-slate-100 text-slate-700',
      },
    ];

    const reportStats = {
      totalSlots: errors.slots ? 'Chưa có dữ liệu' : formatNumber(slots.length),
      availableSlots: errors.slots ? 'Chưa có dữ liệu' : formatNumber(availableSlots),
      bookings: errors.bookings ? 'Chưa có dữ liệu' : formatNumber(filteredBookings.length),
      revenue: 'Chưa có API doanh thu',
      occupancyRate: occupancyRate === null ? 'Chưa có dữ liệu' : `${occupancyRate}%`,
      slotStatusSummary:
        slotDistribution.length === 0
          ? 'Chưa có dữ liệu trạng thái chỗ đỗ'
          : slotDistribution.map((item) => `${item.label}: ${formatNumber(item.count)} (${item.percent}%)`).join('\n'),
      peakHours: volume.some((item) => item.count > 0)
        ? volume.map((item, index) => `${timeLabels[index]}: ${formatNumber(item.count)} lượt đặt`)
        : ['Chưa có dữ liệu lượt đặt trong khoảng đã chọn'],
      exporter: user?.fullName || user?.name || 'Admin',
    };

    const recentActivities = [...bookings]
      .sort((a, b) => new Date(getBookingTime(b) || 0) - new Date(getBookingTime(a) || 0))
      .slice(0, 5);

    return {
      metrics,
      volume,
      slotDistribution,
      recentActivities,
      reportStats,
      errors,
      totalSlots: slots.length,
    };
  }, [dashboardState, rangeDates, user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Tổng quan hệ thống</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Dữ liệu bên dưới được lấy từ backend hiện có. Những phần chưa có API sẽ được đánh dấu rõ.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={fetchDashboard}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Làm mới
          </button>
          <ReportToolbar onRangeChange={setSelectedRange} reportStats={dashboardData.reportStats} />
        </div>
      </div>

      {loading && (
        <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm">
          Đang tải dữ liệu dashboard...
        </section>
      )}

      {Object.values(dashboardData.errors).some(Boolean) && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Một số API chưa sẵn sàng: {Object.entries(dashboardData.errors)
            .filter(([, error]) => Boolean(error))
            .map(([key, error]) => `${apiStatusLabels[key]} (${getFriendlyError(error)})`)
            .join(', ')}.
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardData.metrics.map((metric) => (
          <article key={metric.label} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200">
            <div className="flex items-start justify-between gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${metric.iconBg}`}>
                <span className="material-symbols-outlined text-xl">{metric.icon}</span>
              </div>
              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${metric.badgeClass}`}>{metric.badge}</span>
            </div>
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{metric.label}</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">{metric.value}</h2>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.8fr_1fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Lượt đặt chỗ theo giờ</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Biểu đồ đặt chỗ</h2>
            </div>
            <span className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
              Dữ liệu từ bookings
            </span>
          </div>

          {dashboardData.volume.some((item) => item.count > 0) ? (
            <div className="grid h-[240px] grid-cols-7 items-end gap-3">
              {dashboardData.volume.map((item, index) => (
                <div key={timeLabels[index]} className="flex h-full flex-col items-center gap-3">
                  <div className="relative flex h-full w-full items-end rounded-3xl bg-slate-100">
                    <div className="absolute inset-x-0 bottom-0 rounded-3xl bg-blue-600 transition-all" style={{ height: `${item.height}%` }} />
                  </div>
                  <span className="text-[11px] text-slate-500">{timeLabels[index]}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid h-[240px] place-items-center rounded-3xl bg-slate-50 text-center text-sm text-slate-500">
              Chưa có booking trong khoảng ngày đã chọn.
            </div>
          )}
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Trạng thái chỗ đỗ</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Phân bổ slot</h2>
            </div>
          </div>

          <div className="relative flex items-center justify-center py-8">
            <div className="grid h-44 w-44 place-items-center rounded-full border-[18px] border-slate-100 bg-white text-center">
              <div>
                <p className="text-2xl font-semibold text-slate-950">{formatNumber(dashboardData.totalSlots)}</p>
                <p className="text-sm text-slate-500">Tổng slot</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {dashboardData.slotDistribution.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                Chưa có dữ liệu slot từ backend.
              </p>
            ) : (
              dashboardData.slotDistribution.map((item) => (
                <div key={item.status} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-3.5 w-3.5 rounded-full ${item.className.split(' ')[0]}`} />
                    <span className="text-sm text-slate-700">{item.label}</span>
                  </div>
                  <span className="font-semibold text-slate-950">
                    {formatNumber(item.count)} ({item.percent}%)
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.9fr_1fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Booking gần đây</h2>
              <p className="mt-1 text-sm text-slate-500">Danh sách đặt chỗ mới nhất từ API backend.</p>
            </div>
          </div>
          <div className="overflow-x-auto px-6 pb-6">
            <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Khách hàng</th>
                  <th className="px-4 py-3">Slot</th>
                  <th className="px-4 py-3">Bắt đầu</th>
                  <th className="px-4 py-3">Kết thúc</th>
                  <th className="px-4 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {dashboardData.recentActivities.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                      Chưa có booking từ backend.
                    </td>
                  </tr>
                ) : (
                  dashboardData.recentActivities.map((booking) => (
                    <tr key={booking.id} className="transition-colors hover:bg-slate-50">
                      <td className="px-4 py-4 font-semibold text-slate-900">{booking.userFullName || `User #${booking.userId || '-'}`}</td>
                      <td className="px-4 py-4 text-slate-600">{booking.slotNumber || booking.parkingSlotId || '-'}</td>
                      <td className="px-4 py-4 text-slate-600">{formatDateTime(booking.startTime)}</td>
                      <td className="px-4 py-4 text-slate-600">{formatDateTime(booking.endTime)}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                          {booking.status || '-'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-950">Trạng thái API</h2>
            <p className="mt-1 text-sm text-slate-500">Kiểm tra nhanh các nguồn dữ liệu dashboard.</p>
          </div>
          <div className="space-y-4">
            {Object.entries(apiStatusLabels).map(([key, label]) => {
              const hasError = Boolean(dashboardData.errors[key]);
              return (
                <div key={key} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-slate-700">
                      <span className="material-symbols-outlined">{hasError ? 'error' : 'check_circle'}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">{label}</p>
                      <p className="text-sm text-slate-600">{hasError ? getFriendlyError(dashboardData.errors[key]) : 'Đang hoạt động'}</p>
                    </div>
                  </div>
                  <span className={`h-3.5 w-3.5 rounded-full ${hasError ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
