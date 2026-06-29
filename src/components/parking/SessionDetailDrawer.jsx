import React from 'react';

const statusClasses = {
  'Bình thường': 'bg-emerald-50 text-emerald-700',
  'Quá 24 giờ': 'bg-amber-50 text-amber-700',
  'Quá 7 ngày': 'bg-red-50 text-red-700',
  'Đã hoàn thành': 'bg-blue-50 text-blue-700',
};

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-[130px_minmax(0,1fr)] gap-3 border-b border-slate-100 py-2.5 last:border-b-0">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="truncate text-sm font-semibold text-slate-950">{value || '--'}</span>
    </div>
  );
}

function TimeDetailRow({ label, date, time }) {
  return (
    <div className="grid grid-cols-[130px_minmax(0,1fr)] gap-3 border-b border-slate-100 py-3 last:border-b-0">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Ngày</span>
          <span className="mt-0.5 block text-sm font-semibold text-slate-950">{date || '--'}</span>
        </div>
        <div className="rounded-xl bg-blue-50 px-3 py-2">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-blue-500">Giờ</span>
          <span className="mt-0.5 block text-sm font-semibold text-blue-950">{time || '--'}</span>
        </div>
      </div>
    </div>
  );
}

export default function SessionDetailDrawer({ open, session, onClose }) {
  if (!open || !session) return null;

  const isPackageCustomer = session.customer === 'Gói tháng';
  const isCompleted = session.status === 'Đã hoàn thành';
  const displayFee = isPackageCustomer && isCompleted ? 'Không phát sinh phí' : session.fee;
  const displayPayment = isPackageCustomer && isCompleted ? 'Gói' : session.payment;

  return (
    <div className="fixed inset-0 z-[1000]">
      <button
        type="button"
        aria-label="Đóng chi tiết phiên"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/30"
      />
      <aside className="absolute right-0 top-0 h-full w-[440px] overflow-y-auto border-l border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Parking Session</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">Chi tiết phiên gửi xe</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Đóng
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Trạng thái</span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[session.status] || 'bg-slate-100 text-slate-700'}`}>
              {session.status}
            </span>
          </div>
          <DetailRow label="Mã phiên" value={session.id} />
          <DetailRow label="Biển số" value={session.plate} />
          <DetailRow label="Loại xe" value={session.type} />
          <DetailRow label="Loại khách" value={session.customer} />
          <DetailRow label="Mã thẻ" value={session.cardId} />
          <TimeDetailRow label="Giờ vào" date={session.entryDate} time={session.entry} />
          {isCompleted ? <TimeDetailRow label="Giờ ra" date={session.exitDate} time={session.exit} /> : null}
          <DetailRow label="Thời gian gửi" value={session.duration} />
          {isCompleted ? (
            <>
              <DetailRow label="Phí" value={displayFee} />
              <DetailRow label="Thanh toán" value={displayPayment} />
              <DetailRow label="Nhân viên xử lý" value={session.handledBy} />
            </>
          ) : (
            <>
              <DetailRow label="Tầng" value={session.floor} />
              <DetailRow label="Khu" value={session.zone} />
            </>
          )}
        </div>

        {isPackageCustomer || !isCompleted ? (
          <div className="mt-4 rounded-2xl border border-slate-200 p-4">
            {isPackageCustomer ? (
              <>
                <DetailRow label="Tên khách hàng" value={session.customerName} />
                <DetailRow label="Loại gói" value={session.packageType} />
                <DetailRow label="Ngày hết hạn" value={session.expirationDate} />
              </>
            ) : (
              <>
                <DetailRow label="Loại khách" value="Vãng lai" />
                <DetailRow label="Dự kiến phí hiện tại" value={session.estimatedFee || session.fee} />
              </>
            )}
          </div>
        ) : null}

        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Đóng
          </button>
        </div>
      </aside>
    </div>
  );
}
