import React from 'react';
import { Bike, CarFront, X } from 'lucide-react';
import { formatVietnamDateTime } from '../../utils/dateTime';

const statusClasses = {
  'Bình thường': 'bg-emerald-50 text-emerald-700',
  'Quá 24 giờ': 'bg-amber-50 text-amber-700',
  'Quá 7 ngày': 'bg-red-50 text-red-700',
  'Đã hoàn thành': 'bg-blue-50 text-blue-700',
};

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-[140px_minmax(0,1fr)] items-start gap-3 py-1.5">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-right text-sm font-semibold text-slate-950">{value || '--'}</span>
    </div>
  );
}

function TimelineItem({ tone = 'emerald', label, value, last = false }) {
  const toneClasses = {
    emerald: 'bg-emerald-500 ring-emerald-100',
    blue: 'bg-blue-500 ring-blue-100',
    slate: 'bg-slate-400 ring-slate-200',
  };

  return (
    <div className="relative flex items-start gap-3">
      <div className="relative mt-0.5 flex w-5 justify-center">
        <span className={`h-2.5 w-2.5 rounded-full ring-4 ${toneClasses[tone] || toneClasses.slate}`} />
        {!last ? <span className="absolute top-3 h-9 w-px bg-slate-200" /> : null}
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-sm font-semibold text-slate-950">{value || '--'}</p>
      </div>
    </div>
  );
}

function isMotorbikeSession(session) {
  const vehicleType = String(session?.type || session?.vehicleType || '').toLowerCase();
  return vehicleType.includes('motor') || vehicleType.includes('bike') || vehicleType.includes('xe máy');
}

export default function SessionDetailDrawer({ open, session, onClose }) {
  if (!open || !session) return null;

  const isPackageCustomer = session.customer === 'Gói tháng';
  const isCompleted = session.status === 'Đã hoàn thành';
  const VehicleIcon = isMotorbikeSession(session) ? Bike : CarFront;

  return (
    <div className="fixed inset-0 z-[1000]">
      <button
        type="button"
        aria-label="Đóng chi tiết phiên"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/30"
      />
      <aside className="absolute right-0 top-0 h-full w-[460px] overflow-y-auto border-l border-slate-200 bg-gradient-to-b from-[#F8FBFF] to-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.2)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <span className="relative mt-0.5 shrink-0">
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 opacity-40 blur-lg" />
              <span className="relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-[0_12px_28px_rgba(37,99,235,0.35)]">
                <VehicleIcon className="h-7 w-7" />
              </span>
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-[30px] font-bold tracking-tight text-slate-950">{session.plate || '---'}</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">{`${session.type || 'Xe máy'} • ${isPackageCustomer ? 'Khách tháng' : 'Vãng lai'}`}</p>
              <span
                className={`mt-3 inline-flex rounded-full px-4 py-1.5 text-sm font-semibold ${statusClasses[session.status] || 'bg-slate-100 text-slate-700'}`}
              >
                {session.status}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Thông tin xe</h3>
            <div className="mt-3 space-y-1">
              <DetailRow label="Mã phiên" value={session.id} />
              <DetailRow label="Biển số" value={session.plate} />
              <DetailRow label="Loại xe" value={session.type} />
              <DetailRow label="Loại khách" value={session.customer} />
              <DetailRow label="Mã thẻ" value={session.cardId} />
              {!isCompleted ? (
                <>
                  <DetailRow label="Tầng" value={session.floor} />
                  <DetailRow label="Khu" value={session.zone} />
                </>
              ) : null}
              {isPackageCustomer ? (
                <>
                  <DetailRow label="Tên khách" value={session.customerName} />
                  <DetailRow label="Loại gói" value={session.packageType} />
                  <DetailRow label="Hết hạn" value={session.expirationDate} />
                </>
              ) : null}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Thời gian</h3>
            <div className="mt-4 space-y-3 rounded-xl bg-slate-50 px-4 py-4">
              <TimelineItem tone="emerald" label="Xe vào" value={formatVietnamDateTime(session.entryTime) || '--'} />
              <TimelineItem tone="blue" label="Xe ra" value={isCompleted ? (formatVietnamDateTime(session.exitTime) || '--') : '--'} />
              <TimelineItem tone="slate" label="Thời gian gửi" value={session.duration} last />
            </div>
          </section>


        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Đóng
          </button>
        </div>
      </aside>
    </div>
  );
}
