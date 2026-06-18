import React, { useEffect, useMemo, useState } from 'react';
import { getStaffBookings } from '../../../services/staffService';

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')} VND`;

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

const calculateFee = (booking) => {
  if (!booking) return 0;
  const start = new Date(booking.startTime || booking.createdAt || Date.now());
  const end = new Date();
  const hours = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 3600000));
  const baseRate = booking.vehicleTypeName?.toLowerCase().includes('may') ? 5000 : 20000;
  return hours * baseRate;
};

export default function StaffVehicleExit() {
  const [bookings, setBookings] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [exits, setExits] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getStaffBookings()
      .then(setBookings)
      .catch(() => setMessage('Khong the tai danh sach booking.'));
  }, []);

  const matchedBooking = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    if (!text) return null;
    return bookings.find((booking) => {
      return [
        booking.cardCode,
        booking.slotNumber,
        booking.userFullName,
        booking.id ? `#${booking.id}` : '',
        booking.id ? String(booking.id) : '',
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(text));
    });
  }, [bookings, keyword]);

  const fee = calculateFee(matchedBooking);

  const handleConfirmExit = () => {
    if (!matchedBooking) {
      setMessage('Vui long tim booking hoac ma the truoc khi xac nhan xe ra.');
      return;
    }

    const nextExit = {
      id: Date.now(),
      bookingId: matchedBooking.id,
      userFullName: matchedBooking.userFullName,
      slotNumber: matchedBooking.slotNumber,
      cardCode: matchedBooking.cardCode,
      fee,
      createdAt: new Date().toISOString(),
    };

    setExits((current) => [nextExit, ...current].slice(0, 8));
    setMessage(`Da xac nhan xe ra cho booking #${matchedBooking.id}.`);
    setKeyword('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950">Xe ra bai</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Tra cuu bang ma the, booking, ten khach hoac slot. Man hinh tinh phi tam tinh de staff doi chieu truoc khi mo cong.
        </p>
      </div>

      {message && <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-bold text-sky-800">{message}</div>}

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Tra cuu xe</h2>
          <label className="mt-5 grid gap-2 text-sm font-bold text-slate-700">
            Bien so / ma the / slot / booking
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="VD: CARD-000001, A01, #12"
                className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </label>

          {matchedBooking ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-500">Booking #{matchedBooking.id}</p>
                  <h3 className="mt-1 text-2xl font-black text-slate-950">{matchedBooking.userFullName || 'Khach hang'}</h3>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">{matchedBooking.status || '-'}</span>
              </div>
              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-3">
                  <dt className="text-xs font-bold uppercase text-slate-400">Slot</dt>
                  <dd className="mt-1 font-black text-slate-900">{matchedBooking.slotNumber || '-'}</dd>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <dt className="text-xs font-bold uppercase text-slate-400">Ma the</dt>
                  <dd className="mt-1 font-black text-slate-900">{matchedBooking.cardCode || '-'}</dd>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <dt className="text-xs font-bold uppercase text-slate-400">Gio vao</dt>
                  <dd className="mt-1 font-black text-slate-900">{formatDateTime(matchedBooking.startTime)}</dd>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <dt className="text-xs font-bold uppercase text-slate-400">Thanh toan</dt>
                  <dd className="mt-1 font-black text-slate-900">{matchedBooking.paymentStatus || '-'}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Nhap thong tin de tim booking can cho xe ra.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Xac nhan ra bai</h2>
          <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Phi tam tinh</p>
            <p className="mt-3 text-4xl font-black">{formatCurrency(fee)}</p>
            <p className="mt-2 text-sm text-slate-300">Phi tam tinh dua tren thoi gian booking va loai xe.</p>
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input type="checkbox" className="h-5 w-5 rounded border-slate-300" defaultChecked />
              Da doi chieu bien so va ma the
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input type="checkbox" className="h-5 w-5 rounded border-slate-300" defaultChecked={matchedBooking?.paymentStatus === 'PAID'} />
              Thanh toan hop le hoac duoc xu ly tai quay
            </label>
          </div>
          <button
            type="button"
            onClick={handleConfirmExit}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
          >
            <span className="material-symbols-outlined">logout</span>
            Xac nhan xe ra
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Lich su xe ra trong ca</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {exits.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">Chua co xe ra duoc ghi nhan.</p>
          ) : (
            exits.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-black text-slate-950">{item.userFullName || `Booking #${item.bookingId}`} - {item.slotNumber || '-'}</p>
                  <p className="text-sm text-slate-500">{item.cardCode || '-'} - {formatCurrency(item.fee)}</p>
                </div>
                <span className="text-sm font-semibold text-slate-500">{formatDateTime(item.createdAt)}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
