import React, { useMemo, useState } from 'react';
import { CalendarDays, RotateCcw, Search } from 'lucide-react';
import SessionDetailDrawer from '../../components/parking/SessionDetailDrawer';
import { allParkingSessions } from '../../data/parkingSessions';

const tabs = ['Đang hoạt động', 'Đã hoàn thành', 'Tất cả'];
const vehicleTypes = ['Tất cả', 'Ô tô', 'Xe máy'];
const customerTypes = ['Tất cả', 'Gói tháng', 'Vãng lai'];
const statuses = ['Tất cả', 'Bình thường', 'Quá 24 giờ', 'Quá 7 ngày', 'Đã hoàn thành'];
const defaultDate = '2026-06-17';

const statusClasses = {
  'Bình thường': 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  'Quá 24 giờ': 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  'Quá 7 ngày': 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
  'Đã hoàn thành': 'bg-sky-50 text-sky-700 ring-1 ring-sky-100',
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        statusClasses[status] || 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
      }`}
    >
      {status}
    </span>
  );
}

function Panel({ children, className = '' }) {
  return (
    <section
      className={`rounded-[28px] border border-white/60 bg-white/70 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}

function MiniKpi({ label, value, tone = 'text-slate-950' }) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/65 px-4 py-3">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tracking-tight ${tone}`}>{value}</p>
    </div>
  );
}

function FilterSelect({ value, onChange, options, label }) {
  return (
    <label className="min-w-0">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl border border-slate-200/70 bg-white/85 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
      >
        {options.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}

export default function ParkingSessionsPage() {
  const [activeTab, setActiveTab] = useState('Đang hoạt động');
  const [search, setSearch] = useState('');
  const [vehicleType, setVehicleType] = useState('Tất cả');
  const [customerType, setCustomerType] = useState('Tất cả');
  const [status, setStatus] = useState('Tất cả');
  const [date, setDate] = useState(defaultDate);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const kpis = useMemo(() => {
    const active = allParkingSessions.filter((session) => session.status !== 'Đã hoàn thành').length;
    const completed = allParkingSessions.filter((session) => session.status === 'Đã hoàn thành').length;
    const overdue = allParkingSessions.filter((session) => session.status.includes('Quá')).length;

    return {
      active,
      completed,
      overdue,
      total: allParkingSessions.length,
    };
  }, []);

  const filteredSessions = useMemo(() => {
    return allParkingSessions.filter((session) => {
      const matchesTab =
        activeTab === 'Tất cả' ||
        (activeTab === 'Đang hoạt động' && session.status !== 'Đã hoàn thành') ||
        (activeTab === 'Đã hoàn thành' && session.status === 'Đã hoàn thành');
      const normalizedSearch = search.trim().toLowerCase();
      const matchesSearch =
        session.plate.toLowerCase().includes(normalizedSearch) ||
        session.id.toLowerCase().includes(normalizedSearch) ||
        session.cardId.toLowerCase().includes(normalizedSearch);
      const matchesVehicle = vehicleType === 'Tất cả' || session.type === vehicleType;
      const matchesCustomer = customerType === 'Tất cả' || session.customer === customerType;
      const matchesStatus = status === 'Tất cả' || session.status === status;

      return matchesTab && matchesSearch && matchesVehicle && matchesCustomer && matchesStatus && date;
    });
  }, [activeTab, customerType, date, search, status, vehicleType]);

  function openSessionDetail(session) {
    setSelectedSession(session);
    setIsDetailOpen(true);
  }

  function resetFilters() {
    setSearch('');
    setVehicleType('Tất cả');
    setCustomerType('Tất cả');
    setStatus('Tất cả');
    setDate(defaultDate);
  }

  return (
    <div className="space-y-5">
      <Panel className="overflow-hidden p-4 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Danh sách phiên</h1>
          </div>
          <div className="flex w-full max-w-full overflow-x-auto rounded-2xl bg-slate-100/80 p-1 ring-1 ring-white/70 xl:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MiniKpi label="Đang hoạt động" value={kpis.active} tone="text-sky-700" />
          <MiniKpi label="Đã hoàn thành" value={kpis.completed} tone="text-emerald-700" />
          <MiniKpi label="Quá hạn" value={kpis.overdue} tone="text-rose-700" />
          <MiniKpi label="Tổng phiên" value={kpis.total} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(240px,1.4fr)_150px_160px_170px_160px_112px]">
          <label className="relative min-w-0">
            <span className="sr-only">Search</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search biển số, mã phiên, mã thẻ"
              className="h-11 w-full rounded-2xl border border-slate-200/70 bg-white/85 pl-10 pr-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </label>
          <FilterSelect label="Loại xe" value={vehicleType} onChange={setVehicleType} options={vehicleTypes} />
          <FilterSelect label="Loại khách" value={customerType} onChange={setCustomerType} options={customerTypes} />
          <FilterSelect label="Trạng thái" value={status} onChange={setStatus} options={statuses} />
          <label className="relative min-w-0">
            <span className="sr-only">Ngày</span>
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200/70 bg-white/85 pl-10 pr-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </label>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200/70 bg-white/85 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" />
            Đặt lại
          </button>
        </div>
      </Panel>

      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] table-fixed text-left text-sm">
            <thead className="bg-slate-50/90 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="w-[230px] px-4 py-3">Biển số + mã phiên</th>
                <th className="w-[110px] px-4 py-3">Loại xe</th>
                <th className="w-[130px] px-4 py-3">Khách</th>
                <th className="w-[210px] px-4 py-3">Thời gian</th>
                <th className="w-[110px] px-4 py-3">Phí</th>
                <th className="w-[150px] px-4 py-3">Trạng thái</th>
                <th className="w-[100px] px-4 py-3 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white/95">
              {filteredSessions.map((session) => (
                <tr key={session.id} className="text-slate-600 transition hover:bg-sky-50/45">
                  <td className="px-4 py-3">
                    <p className="truncate text-base font-semibold text-slate-950">{session.plate}</p>
                    <p className="mt-1 truncate text-xs font-semibold text-slate-400">{session.id}</p>
                  </td>
                  <td className="px-4 py-3 font-medium">{session.type}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-700">{session.customer}</p>
                    <p className="mt-1 truncate text-xs font-semibold text-slate-400">{session.cardId}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-700">Vào: {session.entry}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">
                      Ra: {session.exit} · {session.duration}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-950">{session.fee}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={session.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openSessionDetail(session)}
                      className="rounded-xl px-3 py-1.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <SessionDetailDrawer open={isDetailOpen} session={selectedSession} onClose={() => setIsDetailOpen(false)} />
    </div>
  );
}
