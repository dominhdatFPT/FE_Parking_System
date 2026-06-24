import React, { useEffect, useMemo, useState } from 'react';
import { getStaffBookings, getStaffParkingSlots } from '../../../services/staffService';
import { VIETNAM_TIME_ZONE } from '../../../utils/dateTime';

const activeStatuses = ['APPROVED_WAITING_PAYMENT', 'PAID', 'CONFIRMED'];

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: VIETNAM_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export default function StaffSessions() {
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [nextBookings, nextSlots] = await Promise.all([getStaffBookings(), getStaffParkingSlots()]);
      setBookings(nextBookings);
      setSlots(nextSlots);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sessions = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    return bookings
      .filter((booking) => activeStatuses.includes(booking.status))
      .filter((booking) => status === 'all' || booking.status === status)
      .filter((booking) => {
        if (!text) return true;
        return [booking.userFullName, booking.cardCode, booking.slotNumber, booking.vehicleTypeName, booking.zoneName, booking.floorName]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(text));
      });
  }, [bookings, keyword, status]);

  const slotMap = useMemo(() => {
    return slots.reduce((acc, slot) => {
      acc[slot.slotNumber] = slot;
      return acc;
    }, {});
  }, [slots]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Phien dang gui</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Theo doi cac booking da duyet/da thanh toan va slot dang duoc su dung trong ca truc.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchData}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Lam moi
        </button>
      </div>

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tim theo khach hang, ma the, slot, khu..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />
        </div>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        >
          <option value="all">Tat ca trang thai</option>
          <option value="APPROVED_WAITING_PAYMENT">Cho thanh toan</option>
          <option value="PAID">Da thanh toan</option>
          <option value="CONFIRMED">Da xac nhan</option>
        </select>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="text-lg font-black text-slate-950">{loading ? 'Dang tai...' : `${sessions.length} phien`}</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">Cap nhat theo API bookings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Khach hang</th>
                <th className="px-4 py-3">Slot</th>
                <th className="px-4 py-3">Thoi gian</th>
                <th className="px-4 py-3">Trang thai</th>
                <th className="px-4 py-3">Slot DB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessions.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-slate-500" colSpan="5">Khong co phien dang gui phu hop.</td>
                </tr>
              ) : (
                sessions.map((booking) => {
                  const slot = slotMap[booking.slotNumber];
                  return (
                    <tr key={booking.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <p className="font-black text-slate-950">{booking.userFullName || `User #${booking.userId || '-'}`}</p>
                        <p className="text-xs text-slate-500">{booking.cardCode || 'Chua co ma the'}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-slate-800">{booking.slotNumber || '-'}</p>
                        <p className="text-xs text-slate-500">{booking.zoneName || booking.floorName || '-'}</p>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">{booking.status}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{slot?.status || 'Khong ro'}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
