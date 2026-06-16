import React, { useEffect, useMemo, useState } from 'react';
import { getStaffBookings, getStaffParkingSlots } from '../../../services/staffService';

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

export default function StaffVehicleEntry() {
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ plate: '', cardCode: '', vehicleType: 'CAR', slotNumber: '' });
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.allSettled([getStaffBookings(), getStaffParkingSlots()]).then(([bookingResult, slotResult]) => {
      if (bookingResult.status === 'fulfilled') setBookings(bookingResult.value);
      if (slotResult.status === 'fulfilled') setSlots(slotResult.value);
    });
  }, []);

  const availableSlots = useMemo(() => slots.filter((slot) => slot.status === 'AVAILABLE'), [slots]);
  const candidateBooking = useMemo(() => {
    const keyword = form.cardCode.trim().toLowerCase();
    if (!keyword) return null;
    return bookings.find((booking) => String(booking.cardCode || '').toLowerCase() === keyword);
  }, [bookings, form.cardCode]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.plate.trim()) {
      setMessage('Vui long nhap bien so xe.');
      return;
    }

    const chosenSlot = form.slotNumber || candidateBooking?.slotNumber || availableSlots[0]?.slotNumber || 'Chua gan slot';
    const nextEvent = {
      id: Date.now(),
      type: 'ENTRY',
      plate: form.plate.trim().toUpperCase(),
      cardCode: form.cardCode.trim() || candidateBooking?.cardCode || 'Khach vang lai',
      vehicleType: form.vehicleType,
      slotNumber: chosenSlot,
      status: candidateBooking ? 'Co booking hop le' : 'Xe vao vang lai',
      createdAt: new Date().toISOString(),
    };

    setEvents((current) => [nextEvent, ...current].slice(0, 8));
    setMessage(`Da ghi nhan xe vao: ${nextEvent.plate} - ${chosenSlot}.`);
    setForm({ plate: '', cardCode: '', vehicleType: 'CAR', slotNumber: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950">Xe vao bai</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Nhap bien so, ma the va slot de xac nhan xe vao. Neu ma the khop booking, he thong se hien thong tin doi chieu.
        </p>
      </div>

      {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">{message}</div>}

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Phieu xe vao</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Bien so xe
              <input
                value={form.plate}
                onChange={(event) => handleChange('plate', event.target.value)}
                placeholder="VD: 51F-12345"
                className="rounded-xl border border-slate-200 px-4 py-3 font-semibold uppercase outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Ma the / booking
              <input
                value={form.cardCode}
                onChange={(event) => handleChange('cardCode', event.target.value)}
                placeholder="CARD-000001"
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Loai xe
              <select
                value={form.vehicleType}
                onChange={(event) => handleChange('vehicleType', event.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              >
                <option value="CAR">O to</option>
                <option value="BIKE">Xe may</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Slot de xuat
              <select
                value={form.slotNumber}
                onChange={(event) => handleChange('slotNumber', event.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              >
                <option value="">Tu dong / theo booking</option>
                {availableSlots.slice(0, 60).map((slot) => (
                  <option key={slot.id} value={slot.slotNumber}>{slot.slotNumber} - Tang {slot.floor}</option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
          >
            <span className="material-symbols-outlined">login</span>
            Xac nhan xe vao
          </button>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Doi chieu booking</h2>
          {candidateBooking ? (
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-bold text-emerald-700">Tim thay booking phu hop</p>
                <p className="mt-2 text-xl font-black text-emerald-950">{candidateBooking.userFullName || `User #${candidateBooking.userId}`}</p>
              </div>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="font-bold text-slate-400">Slot</dt>
                  <dd className="mt-1 font-black text-slate-900">{candidateBooking.slotNumber || '-'}</dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="font-bold text-slate-400">Trang thai</dt>
                  <dd className="mt-1 font-black text-slate-900">{candidateBooking.status || '-'}</dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="font-bold text-slate-400">Bat dau</dt>
                  <dd className="mt-1 font-black text-slate-900">{formatDateTime(candidateBooking.startTime)}</dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="font-bold text-slate-400">Thanh toan</dt>
                  <dd className="mt-1 font-black text-slate-900">{candidateBooking.paymentStatus || '-'}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Nhap ma the de tim booking. Neu khong co booking, staff co the ghi nhan xe vang lai.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Lich su xe vao trong ca</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {events.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">Chua co xe vao duoc ghi nhan.</p>
          ) : (
            events.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-black text-slate-950">{item.plate} - {item.slotNumber}</p>
                  <p className="text-sm text-slate-500">{item.cardCode} - {item.status}</p>
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
