import React, { useEffect, useState } from 'react';
import ReportToolbar from '../../components/admin/ReportToolbar';

const formatShortDate = (value) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));

const getSelectedRangeDates = (range) => {
  const now = new Date();
  const today = new Date(now);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (range.key === 'today') {
    return { from: today, to: today };
  }

  if (range.key === 'yesterday') {
    return { from: yesterday, to: yesterday };
  }

  if (range.key === 'past7') {
    const from = new Date(now);
    from.setDate(now.getDate() - 6);
    return { from, to: today };
  }

  if (range.key === 'past30') {
    const from = new Date(now);
    from.setDate(now.getDate() - 29);
    return { from, to: today };
  }

  if (range.key === 'custom' && range.from && range.to) {
    return { from: new Date(range.from), to: new Date(range.to) };
  }

  return { from: today, to: today };
};

const buildMockDashboardData = ({ from, to }) => {
  const diffDays = Math.max(
    1,
    Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );
  const baseTraffic = 3200 + diffDays * 28;
  const baseRevenue = 32 + diffDays * 0.55;
  const availableBase = 170 - Math.min(80, diffDays * 2);
  const carShare = 56 + ((diffDays % 5) - 2);
  const bikeShare = 24 + ((diffDays % 4) - 1);
  const evShare = Math.max(10, 100 - carShare - bikeShare);

  const volume = Array.from({ length: 7 }, (_, index) => {
    const variation = 35 + index * 7 + (diffDays % 6) * 3;
    return Math.min(95, Math.max(20, variation));
  });

  return {
    metrics: [
      {
        label: 'Tổng chỗ đỗ',
        value: '1,250',
        icon: 'directions_car',
        badge: '+2.5%',
        badgeClass: 'bg-emerald-100 text-emerald-700',
        iconBg: 'bg-blue-100 text-blue-700',
      },
      {
        label: 'Chỗ trống hiện tại',
        value: `${Math.max(40, availableBase)}`,
        icon: 'event_seat',
        badge: diffDays > 14 ? '72% Đầy' : '85% Đầy',
        badgeClass: 'bg-slate-100 text-slate-700',
        iconBg: 'bg-slate-100 text-slate-700',
      },
      {
        label: 'Doanh thu hôm nay',
        value: `${baseRevenue.toFixed(1)}M`,
        icon: 'payments',
        badge: diffDays > 20 ? '+18%' : '+12%',
        badgeClass: 'bg-emerald-100 text-emerald-700',
        iconBg: 'bg-cyan-100 text-cyan-700',
      },
      {
        label: 'Lượt xe ra/vào',
        value: `${baseTraffic.toLocaleString('vi-VN')}`,
        icon: 'sync_alt',
        badge: diffDays > 20 ? '+5%' : '-0.8%',
        badgeClass: diffDays > 20 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700',
        iconBg: 'bg-slate-100 text-slate-700',
      },
    ],
    volume,
    distribution: [
      { title: 'Ô tô', value: Math.max(45, Math.min(70, carShare)), statusClass: 'bg-blue-600' },
      { title: 'Xe máy', value: Math.max(18, Math.min(35, bikeShare)), statusClass: 'bg-cyan-400' },
      { title: 'Xe điện', value: Math.max(10, Math.min(25, evShare)), statusClass: 'bg-emerald-500' },
    ],
  };
};

const initialTodayDate = new Date().toISOString().slice(0, 10);
const initialRange = { key: 'today', from: initialTodayDate, to: initialTodayDate };

const activityRows = [
  { plate: '30F-123.45', time: '14:20:05', type: 'Vào', location: 'Tầng B1 - A05', status: 'Thành công', statusClass: 'bg-emerald-100 text-emerald-700' },
  { plate: '51G-888.88', time: '14:18:22', type: 'Ra', location: 'Cổng Chính 1', status: 'Thành công', statusClass: 'bg-emerald-100 text-emerald-700' },
  { plate: '29A-555.21', time: '14:15:10', type: 'Vào', location: 'Tầng B2 - C12', status: 'Chờ duyệt', statusClass: 'bg-amber-100 text-amber-700' },
  { plate: '43C-990.01', time: '14:12:45', type: 'Ra', location: 'Cổng Phụ 2', status: 'Lỗi thẻ', statusClass: 'bg-rose-100 text-rose-700' },
];

const devices = [
  { title: 'Hệ thống Camera AI', subtitle: '24/24 Online', statusClass: 'bg-emerald-500', icon: 'videocam' },
  { title: 'Cổng Barrier', subtitle: '8/8 Hoạt động', statusClass: 'bg-emerald-500', icon: 'door_front' },
  { title: 'Trạm thu phí POS', subtitle: '1 trạm đang bảo trì', statusClass: 'bg-rose-500', icon: 'point_of_sale' },
  { title: 'Hệ thống Mạng & Server', subtitle: 'Độ trễ: 12ms', statusClass: 'bg-emerald-500', icon: 'router' },
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Tổng quan hệ thống</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Chào mừng trở lại — đây là tình trạng bãi đỗ xe hôm nay.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ReportToolbar />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
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
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Lưu lượng xe 24h qua</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Biểu đồ lưu lượng</h2>
            </div>
            <select className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
              <option>Tất cả bãi xe</option>
              <option>Bãi xe A1</option>
              <option>Bãi xe B2</option>
            </select>
          </div>

          <div className="grid grid-cols-7 items-end gap-3 h-[240px]">
            {[40, 65, 80, 95, 55, 85, 45].map((height, index) => (
              <div key={index} className="flex flex-col items-center gap-3">
                <div className="relative flex h-full w-full items-end rounded-3xl bg-slate-100">
                  <div className="absolute inset-x-0 bottom-0 rounded-3xl bg-blue-600 transition-all" style={{ height: `${height}%` }} />
                </div>
                <span className="text-[11px] text-slate-500">{['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'][index]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Phân loại phương tiện</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Tỷ lệ xe trên bãi</h2>
            </div>
          </div>

          <div className="relative flex items-center justify-center py-8">
            <div className="h-44 w-44 rounded-full border-[18px] border-blue-100" />
            <div className="absolute inset-0 rounded-full border-[18px] border-slate-200" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 0, 50% 0)' }} />
            <div className="absolute inset-0 rounded-full border-[18px] border-cyan-200" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }} />
            <div className="absolute inset-0 grid place-items-center rounded-full bg-white/90 text-center px-4">
              <p className="text-2xl font-semibold text-slate-950">3.8K</p>
              <p className="text-sm text-slate-500">Tổng xe</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full bg-blue-600" />
                <span className="text-sm text-slate-700">Ô tô</span>
              </div>
              <span className="font-semibold text-slate-950">62%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full bg-cyan-400" />
                <span className="text-sm text-slate-700">Xe máy</span>
              </div>
              <span className="font-semibold text-slate-950">25%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full bg-emerald-500" />
                <span className="text-sm text-slate-700">Xe điện</span>
              </div>
              <span className="font-semibold text-slate-950">13%</span>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.9fr_1fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Hoạt động gần đây</h2>
              <p className="mt-1 text-sm text-slate-500">Danh sách thao tác xe & trạng thái ra/vào mới nhất.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-blue-500 to-blue-800 px-5 py-3 text-sm font-bold !text-white shadow-md transition-all hover:shadow-lg hover:from-blue-600 hover:to-blue-900" type="button">
              <span className="!text-white">Xem tất cả</span>
            </button>
          </div>
          <div className="overflow-x-auto px-6 pb-6">
            <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Biển số xe</th>
                  <th className="px-4 py-3">Thời gian</th>
                  <th className="px-4 py-3">Loại</th>
                  <th className="px-4 py-3">Vị trí bãi</th>
                  <th className="px-4 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {activityRows.map((row) => (
                  <tr key={row.plate} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 font-semibold text-slate-900">{row.plate}</td>
                    <td className="px-4 py-4 text-slate-600">{row.time}</td>
                    <td className="px-4 py-4 text-slate-600">{row.type}</td>
                    <td className="px-4 py-4 text-slate-600">{row.location}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${row.statusClass}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Trạng thái thiết bị</h2>
              <p className="mt-1 text-sm text-slate-500">Kiểm tra nhanh các hệ thống kết nối.</p>
            </div>
          </div>
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.title} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-slate-700">
                    <span className="material-symbols-outlined">{device.icon}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">{device.title}</p>
                    <p className="text-sm text-slate-600">{device.subtitle}</p>
                  </div>
                </div>
                <span className={`h-3.5 w-3.5 rounded-full ${device.statusClass}`} />
              </div>
            ))}
          </div>
          <button className="mt-6 w-full rounded-3xl bg-gradient-to-r from-blue-500 to-blue-800 px-5 py-3 text-sm font-bold !text-white shadow-md transition-all hover:shadow-lg hover:from-blue-600 hover:to-blue-900" type="button">
            <span className="!text-white">Chẩn đoán hệ thống</span>
          </button>
        </section>
      </div>
    </div>
  );
}
