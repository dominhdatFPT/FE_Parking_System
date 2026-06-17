import React, { useEffect, useMemo, useState } from 'react';

const OPEN_INCIDENTS_STORAGE_KEY = 'parking.staff.openIncidents';
const INCIDENT_TICKETS_STORAGE_KEY = 'parking.staff.incidentTickets';
const INCIDENTS_UPDATED_EVENT = 'parking:incidents-updated';

const exceptionTypes = [
  { value: 'LOST_CARD', label: 'Mat the', severity: 'Cao' },
  { value: 'PLATE_MISMATCH', label: 'Sai bien so', severity: 'Cao' },
  { value: 'PAYMENT_FAILED', label: 'Thanh toan loi', severity: 'Trung binh' },
  { value: 'NO_BOOKING', label: 'Khong tim thay booking', severity: 'Trung binh' },
  { value: 'CAMERA_ERROR', label: 'Camera khong nhan dien', severity: 'Thap' },
  { value: 'OTHER', label: 'Khac', severity: 'Thap' },
];

const severityTone = {
  Cao: 'bg-rose-100 text-rose-700',
  'Trung binh': 'bg-amber-100 text-amber-700',
  Thap: 'bg-slate-100 text-slate-700',
};

const formatDateTime = (value) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export default function StaffExceptions() {
  const [form, setForm] = useState({
    type: 'LOST_CARD',
    plate: '',
    cardCode: '',
    description: '',
    resolution: 'Dang xu ly',
  });
  const [tickets, setTickets] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const storedTickets = JSON.parse(window.localStorage.getItem(INCIDENT_TICKETS_STORAGE_KEY) || '[]');
      return Array.isArray(storedTickets) ? storedTickets : [];
    } catch {
      return [];
    }
  });

  const selectedType = useMemo(() => exceptionTypes.find((item) => item.value === form.type) || exceptionTypes[0], [form.type]);

  useEffect(() => {
    const openCount = tickets.filter((ticket) => ticket.status === 'OPEN').length;
    window.localStorage.setItem(OPEN_INCIDENTS_STORAGE_KEY, String(openCount));
    window.localStorage.setItem(INCIDENT_TICKETS_STORAGE_KEY, JSON.stringify(tickets));
    window.dispatchEvent(new Event(INCIDENTS_UPDATED_EVENT));
  }, [tickets]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextTicket = {
      id: Date.now(),
      ...form,
      typeLabel: selectedType.label,
      severity: selectedType.severity,
      createdAt: new Date().toISOString(),
      status: 'OPEN',
    };
    setTickets((current) => [nextTicket, ...current]);
    setForm({ type: 'LOST_CARD', plate: '', cardCode: '', description: '', resolution: 'Dang xu ly' });
  };

  const closeTicket = (ticketId) => {
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: 'CLOSED', resolution: 'Da xu ly tai quay' } : ticket,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950">Xu ly su co</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Ghi nhan cac tinh huong tai cong vao/ra nhu mat the, sai bien so, loi thanh toan hoac camera khong nhan dien.
        </p>
      </div>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Tao ticket su co</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Loai su co
              <select
                value={form.type}
                onChange={(event) => handleChange('type', event.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              >
                {exceptionTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Bien so
                <input
                  value={form.plate}
                  onChange={(event) => handleChange('plate', event.target.value)}
                  placeholder="51F-12345"
                  className="rounded-xl border border-slate-200 px-4 py-3 uppercase outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Ma the
                <input
                  value={form.cardCode}
                  onChange={(event) => handleChange('cardCode', event.target.value)}
                  placeholder="CARD-000001"
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Mo ta
              <textarea
                value={form.description}
                onChange={(event) => handleChange('description', event.target.value)}
                placeholder="Nhap tinh huong va thong tin doi chieu..."
                className="min-h-28 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Huong xu ly du kien
              <input
                value={form.resolution}
                onChange={(event) => handleChange('resolution', event.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>
          </div>
          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-rose-100 hover:bg-rose-700"
          >
            <span className="material-symbols-outlined">report</span>
            Ghi nhan su co
          </button>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">Ticket trong ca</h2>
              <p className="mt-1 text-sm text-slate-500">Danh sach su co staff da ghi nhan tren man hinh nay.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{tickets.length} ticket</span>
          </div>

          <div className="mt-5 space-y-3">
            {tickets.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">
                Chua co su co nao trong ca.
              </div>
            ) : (
              tickets.map((ticket) => (
                <article key={ticket.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-slate-950">{ticket.typeLabel}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${severityTone[ticket.severity]}`}>{ticket.severity}</span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">{ticket.status}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        {ticket.plate || 'Chua co bien so'} - {ticket.cardCode || 'Chua co ma the'} - {formatDateTime(ticket.createdAt)}
                      </p>
                    </div>
                    {ticket.status === 'OPEN' && (
                      <button
                        type="button"
                        onClick={() => closeTicket(ticket.id)}
                        className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
                      >
                        Dong ticket
                      </button>
                    )}
                  </div>
                  {ticket.description && <p className="mt-3 text-sm text-slate-700">{ticket.description}</p>}
                  <p className="mt-3 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-600">Xu ly: {ticket.resolution}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
