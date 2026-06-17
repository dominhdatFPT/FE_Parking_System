import React, { useMemo, useState } from 'react';
import SessionDetailDrawer from '../../components/parking/SessionDetailDrawer';
import { allParkingSessions } from '../../data/parkingSessions';

const tabs = ['Đang hoạt động', 'Đã hoàn thành', 'Tất cả'];
const vehicleTypes = ['Tất cả', 'Ô tô', 'Xe máy'];
const customerTypes = ['Tất cả', 'Gói tháng', 'Vãng lai'];
const statuses = ['Tất cả', 'Bình thường', 'Quá 24 giờ', 'Quá 7 ngày', 'Đã hoàn thành'];

const statusClasses = {
  'Bình thường': 'bg-emerald-50 text-emerald-700',
  'Quá 24 giờ': 'bg-amber-50 text-amber-700',
  'Quá 7 ngày': 'bg-red-50 text-red-700',
  'Đã hoàn thành': 'bg-blue-50 text-blue-700',
};

function StatusBadge({ status }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[status] || 'bg-slate-100 text-slate-700'}`}>{status}</span>;
}

export default function ParkingSessionsPage() {
  const [activeTab, setActiveTab] = useState('Đang hoạt động');
  const [search, setSearch] = useState('');
  const [vehicleType, setVehicleType] = useState('Tất cả');
  const [customerType, setCustomerType] = useState('Tất cả');
  const [status, setStatus] = useState('Tất cả');
  const [date, setDate] = useState('2026-06-17');
  const [selectedSession, setSelectedSession] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredSessions = useMemo(() => {
    return allParkingSessions.filter((session) => {
      const matchesTab =
        activeTab === 'Tất cả' ||
        (activeTab === 'Đang hoạt động' && session.status !== 'Đã hoàn thành') ||
        (activeTab === 'Đã hoàn thành' && session.status === 'Đã hoàn thành');
      const matchesSearch = session.plate.toLowerCase().includes(search.trim().toLowerCase());
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

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Tất cả phiên gửi xe</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Theo dõi phiên đang hoạt động, đã hoàn thành và lịch sử gửi xe.</p>
          </div>
          <div className="flex rounded-xl bg-slate-100 p-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  activeTab === tab ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-[minmax(220px,1fr)_160px_170px_170px_160px] gap-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo biển số"
            className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <select value={vehicleType} onChange={(event) => setVehicleType(event.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
            {vehicleTypes.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={customerType} onChange={(event) => setCustomerType(event.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
            {customerTypes.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </select>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-3 py-2.5">Mã phiên</th>
              <th className="px-3 py-2.5">Biển số</th>
              <th className="px-3 py-2.5">Loại xe</th>
              <th className="px-3 py-2.5">Loại khách</th>
              <th className="px-3 py-2.5">Mã thẻ</th>
              <th className="px-3 py-2.5">Giờ vào</th>
              <th className="px-3 py-2.5">Giờ ra</th>
              <th className="px-3 py-2.5">Thời gian gửi</th>
              <th className="px-3 py-2.5">Phí</th>
              <th className="px-3 py-2.5">Trạng thái</th>
              <th className="px-3 py-2.5 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSessions.map((session) => (
              <tr key={session.id} className="text-slate-600 hover:bg-slate-50">
                <td className="truncate px-3 py-3 font-semibold text-slate-950">{session.id}</td>
                <td className="px-3 py-3 font-semibold text-slate-950">{session.plate}</td>
                <td className="px-3 py-3">{session.type}</td>
                <td className="px-3 py-3">{session.customer}</td>
                <td className="px-3 py-3">{session.cardId}</td>
                <td className="px-3 py-3">{session.entry}</td>
                <td className="px-3 py-3">{session.exit}</td>
                <td className="px-3 py-3">{session.duration}</td>
                <td className="px-3 py-3">{session.fee}</td>
                <td className="px-3 py-3"><StatusBadge status={session.status} /></td>
                <td className="px-3 py-3 text-right">
                  <button onClick={() => openSessionDetail(session)} className="rounded-lg px-2 py-1 text-sm font-semibold text-blue-700 hover:bg-blue-50">Chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <SessionDetailDrawer open={isDetailOpen} session={selectedSession} onClose={() => setIsDetailOpen(false)} />
    </div>
  );
}
