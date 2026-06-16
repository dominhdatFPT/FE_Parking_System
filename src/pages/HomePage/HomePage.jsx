import { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck2,
  CarFront,
  CircleDollarSign,
  ClipboardList,
  LogIn,
  LogOut,
  ParkingCircle,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getStaffOperationsDashboard } from '../../services/staffService';

const areaColors = ['#0ea5e9', '#22c55e', '#f59e0b', '#6366f1', '#ef4444', '#14b8a6'];

const defaultTraffic = Array.from({ length: 12 }, (_, index) => ({
  hour: `${String(index * 2).padStart(2, '0')}:00`,
  in: 0,
  out: 0,
}));

const emptyDashboard = {
  metrics: {
    vehiclesInParking: 0,
    availableSlots: 0,
    pendingBookings: 0,
    vehiclesInToday: 0,
    vehiclesOutToday: 0,
    openIncidents: 0,
    revenueToday: 0,
    totalSlots: 0,
    occupancyRate: 0,
  },
  areaOccupancy: [],
  trafficByHour: defaultTraffic,
  pendingBookings: [],
  recentIncidents: [],
  recentVehicleActivities: [],
};

const formatNumber = (value) => Number(value || 0).toLocaleString('vi-VN');

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

function KpiCard({ icon: Icon, label, value, hint, trend, tone }) {
  const isDown = trend?.direction === 'down';

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_-28px_rgba(15,23,42,0.5)]">
      <div className="flex items-start justify-between gap-3">
        <div className={`grid h-12 w-12 place-items-center rounded-xl ${tone}`}>
          <Icon size={22} strokeWidth={2.3} />
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black ${isDown ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
            {isDown ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
            {trend.value}
          </span>
        )}
      </div>
      <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</h3>
      <p className="mt-2 text-sm font-medium text-slate-500">{hint}</p>
    </article>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-lg font-black text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function EmptyState({ children }) {
  return (
    <div className="grid min-h-40 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm font-semibold text-slate-500">
      {children}
    </div>
  );
}

export default function HomePage() {
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getStaffOperationsDashboard();
      setDashboard({
        ...emptyDashboard,
        ...data,
        metrics: {
          ...emptyDashboard.metrics,
          ...(data?.metrics || {}),
        },
        trafficByHour: data?.trafficByHour?.length ? data.trafficByHour : defaultTraffic,
      });
    } catch (requestError) {
      setDashboard(emptyDashboard);
      setError(requestError.response?.data?.message || 'Không thể tải dashboard từ database.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const { metrics } = dashboard;
  const inOutDirection = metrics.vehiclesInToday >= metrics.vehiclesOutToday ? 'up' : 'down';

  const kpis = [
    {
      label: 'Tổng xe trong bãi',
      value: formatNumber(metrics.vehiclesInParking),
      hint: `${metrics.occupancyRate}% công suất đang sử dụng`,
      icon: CarFront,
      tone: 'bg-sky-50 text-sky-700',
      trend: { value: 'DB live', direction: 'up' },
    },
    {
      label: 'Số chỗ còn trống',
      value: formatNumber(metrics.availableSlots),
      hint: `${formatNumber(metrics.totalSlots)} tổng sức chứa`,
      icon: ParkingCircle,
      tone: 'bg-emerald-50 text-emerald-700',
      trend: { value: 'DB live', direction: 'up' },
    },
    {
      label: 'Booking chờ duyệt',
      value: formatNumber(metrics.pendingBookings),
      hint: 'Đọc từ bảng bookings',
      icon: CalendarCheck2,
      tone: 'bg-amber-50 text-amber-700',
      trend: { value: metrics.pendingBookings > 0 ? 'Cần xử lý' : 'Ổn định', direction: metrics.pendingBookings > 0 ? 'up' : 'down' },
    },
    {
      label: 'Xe vào hôm nay',
      value: formatNumber(metrics.vehiclesInToday),
      hint: 'Đọc từ parking_orders.entry_time',
      icon: LogIn,
      tone: 'bg-indigo-50 text-indigo-700',
      trend: { value: 'Today', direction: inOutDirection },
    },
    {
      label: 'Xe ra hôm nay',
      value: formatNumber(metrics.vehiclesOutToday),
      hint: 'Đọc từ parking_orders.exit_time',
      icon: LogOut,
      tone: 'bg-cyan-50 text-cyan-700',
      trend: { value: 'Today', direction: metrics.vehiclesOutToday > metrics.vehiclesInToday ? 'up' : 'down' },
    },
    {
      label: 'Sự cố đang mở',
      value: formatNumber(metrics.openIncidents),
      hint: 'Đọc từ notes/status trong parking_orders',
      icon: ShieldAlert,
      tone: 'bg-rose-50 text-rose-700',
      trend: { value: metrics.openIncidents > 0 ? 'Cần xử lý' : '0', direction: metrics.openIncidents > 0 ? 'up' : 'down' },
    },
    {
      label: 'Doanh thu hôm nay',
      value: formatCurrency(metrics.revenueToday),
      hint: 'Tổng calculated_fee hôm nay',
      icon: CircleDollarSign,
      tone: 'bg-violet-50 text-violet-700',
      trend: { value: 'DB live', direction: 'up' },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-600">Operations overview</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Dashboard vận hành bãi xe</h1>
          <p className="mt-2 max-w-3xl text-sm font-medium text-slate-500">
            Dữ liệu được đọc trực tiếp từ database qua API backend: slots, bookings và parking orders.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboard}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Làm mới
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_1.35fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.45)]">
          <SectionHeader
            title="Tỷ lệ lấp đầy theo tầng/khu"
            subtitle="Tổng hợp từ bảng parking_slots."
            action={<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">{metrics.occupancyRate}% tổng thể</span>}
          />

          {dashboard.areaOccupancy.length ? (
            <div className="h-[320px] min-h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard.areaOccupancy} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Legend />
                  <Bar dataKey="occupied" name="Đang sử dụng" radius={[8, 8, 0, 0]}>
                    {dashboard.areaOccupancy.map((_, index) => (
                      <Cell key={`occupied-${index}`} fill={areaColors[index % areaColors.length]} />
                    ))}
                  </Bar>
                  <Bar dataKey="available" name="Còn trống" fill="#dbeafe" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState>Database chưa có dữ liệu slot để vẽ biểu đồ.</EmptyState>
          )}
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.45)]">
          <SectionHeader
            title="Lượt xe vào/ra theo giờ"
            subtitle="Tổng hợp từ parking_orders.entry_time và exit_time trong hôm nay."
            action={<span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">Live today</span>}
          />

          <div className="h-[320px] min-h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard.trafficByHour} margin={{ top: 8, right: 16, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="checkInGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="checkOutGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="in" name="Xe vào" stroke="#0ea5e9" strokeWidth={3} fill="url(#checkInGradient)" />
                <Area type="monotone" dataKey="out" name="Xe ra" stroke="#f59e0b" strokeWidth={3} fill="url(#checkOutGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr_1fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.45)]">
          <SectionHeader
            title="Booking chờ xử lý gần đây"
            subtitle="Đọc từ bảng bookings."
            action={<ClipboardList size={20} className="text-amber-600" />}
          />

          <div className="space-y-3">
            {dashboard.pendingBookings.length ? (
              dashboard.pendingBookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-950">{booking.userFullName || `User #${booking.userId || '-'}`}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        Booking #{booking.id || '-'} - {booking.slotNumber || booking.zoneName || booking.floorName || 'Chưa gán vị trí'}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-700">{booking.status}</span>
                  </div>
                  <p className="mt-3 text-xs font-bold text-slate-400">{formatDateTime(booking.createdAt || booking.startTime)}</p>
                </div>
              ))
            ) : (
              <EmptyState>Không có booking chờ xử lý.</EmptyState>
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.45)]">
          <SectionHeader
            title="Sự cố mới nhất"
            subtitle="Đọc từ notes/status trong parking_orders."
            action={<AlertTriangle size={20} className="text-rose-600" />}
          />

          <div className="space-y-3">
            {dashboard.recentIncidents.length ? (
              dashboard.recentIncidents.map((ticket) => (
                <div key={ticket.id} className="rounded-xl border border-rose-100 bg-rose-50/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-slate-950">{ticket.title || ticket.type}</p>
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-rose-700">{ticket.status || '-'}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-600">
                    {ticket.licensePlate || 'Chưa có biển số'} - {ticket.description || 'Không có ghi chú'}
                  </p>
                  <p className="mt-2 text-xs font-bold text-slate-400">{formatDateTime(ticket.createdAt)}</p>
                </div>
              ))
            ) : (
              <EmptyState>Database chưa có sự cố mới.</EmptyState>
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.45)]">
          <SectionHeader
            title="Hoạt động xe gần đây"
            subtitle="Đọc từ bảng parking_orders."
            action={<CarFront size={20} className="text-sky-600" />}
          />

          <div className="space-y-3">
            {dashboard.recentVehicleActivities.length ? (
              dashboard.recentVehicleActivities.map((activity) => (
                <div key={activity.id} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500 ring-4 ring-sky-100" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate font-black text-slate-950">{activity.licensePlate || activity.orderCode || `Order #${activity.id}`}</p>
                      <span className="shrink-0 text-xs font-bold text-slate-400">{formatDateTime(activity.updatedAt || activity.entryTime)}</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {activity.parkingName || 'Bãi xe'} - {activity.floorName || 'Chưa rõ tầng'}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-600">{activity.status || '-'}</span>
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">{formatCurrency(activity.calculatedFee)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState>Database chưa có hoạt động xe gần đây.</EmptyState>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
