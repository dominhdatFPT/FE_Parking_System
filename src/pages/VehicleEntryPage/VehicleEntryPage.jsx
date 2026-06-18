import React, { useState } from 'react';
import { AlertTriangle, CarFront, CheckCircle2, CreditCard, TicketCheck } from 'lucide-react';

const packageCards = {
  PKG1029: {
    customerName: 'Nguyen Minh Anh',
    licensePlate: '51A-248.19',
    vehicleType: 'Car',
    packageType: 'Gói tháng Premium',
    expirationDate: '31/07/2026',
  },
  PKG9999: {
    reason: 'Sai biển số',
  },
  PKG0001: {
    reason: 'Thẻ hết hạn',
  },
  BAD0001: {
    reason: 'Thẻ không tồn tại',
  },
};

const vehicleTypes = ['Motorbike', 'Car'];

function normalize(value) {
  return value.trim().toUpperCase();
}

function nowText() {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

function GlassCard({ children, className = '' }) {
  return (
    <section
      className={`rounded-[28px] border border-white/60 bg-white/70 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}

function FieldRow({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50/80 px-4 py-3 ring-1 ring-slate-200/70">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function Badge({ type, children }) {
  const styles = {
    package: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    visitor: 'border-amber-200 bg-amber-50 text-amber-700',
    invalid: 'border-rose-200 bg-rose-50 text-rose-700',
  };

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${styles[type]}`}>
      {children}
    </span>
  );
}

function PackageResult({ result }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <FieldRow label="Tên khách hàng" value={result.customerName} />
      <FieldRow label="Biển số đăng ký" value={result.licensePlate} />
      <FieldRow label="Loại xe đăng ký" value={result.vehicleType} />
      <FieldRow label="Loại gói" value={result.packageType} />
      <FieldRow label="Ngày hết hạn" value={result.expirationDate} />
      <FieldRow label="Trạng thái" value="Thẻ gói hợp lệ" />
    </div>
  );
}

function VisitorResult({ result }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <FieldRow label="Mã thẻ" value={result.cardCode} />
      <FieldRow label="Loại xe" value={result.vehicleType} />
      <FieldRow label="Giờ vào" value={result.entryTime} />
      <FieldRow label="Trạng thái" value={result.sessionStatus} />
    </div>
  );
}

function InvalidResult({ result }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-4">
      <p className="text-xs font-semibold text-rose-400">Lý do</p>
      <p className="mt-1 text-base font-semibold text-rose-700">{result.reason}</p>
    </div>
  );
}

function ResultConfirmationCard({ resultType, result, canConfirm }) {
  const config = {
    package: {
      badge: <Badge type="package">Thẻ gói hợp lệ</Badge>,
      title: 'Phiếu xe vào',
      eyebrow: 'Package ticket',
      plate: result.licensePlate,
      icon: <CreditCard className="h-5 w-5" />,
      iconClassName: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
      note: 'Đối chiếu biển số và loại xe thực tế trước khi cho xe vào.',
      noteClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      buttonClassName: 'bg-sky-500 text-white shadow-[0_16px_34px_rgba(14,165,233,0.25)] hover:bg-sky-600',
    },
    visitor: {
      badge: <Badge type="visitor">Khách vãng lai</Badge>,
      title: 'Phiếu xe vào',
      eyebrow: 'Visitor ticket',
      plate: result.licensePlate,
      icon: <TicketCheck className="h-5 w-5" />,
      iconClassName: 'bg-amber-50 text-amber-700 ring-amber-100',
      note: 'Đưa thẻ cho khách trước khi cho xe vào.',
      noteClassName: 'border-amber-200 bg-amber-50 text-amber-700',
      buttonClassName: 'bg-amber-400 text-slate-950 shadow-[0_16px_34px_rgba(245,158,11,0.24)] hover:bg-amber-500',
    },
    invalid: {
      badge: <Badge type="invalid">Không hợp lệ</Badge>,
      title: 'Phiếu cần kiểm tra',
      eyebrow: 'Rejected ticket',
      plate: 'Không xác thực',
      icon: <AlertTriangle className="h-5 w-5" />,
      iconClassName: 'bg-rose-50 text-rose-700 ring-rose-100',
      note: 'Không cho xe vào. Yêu cầu nhân viên kiểm tra lại thẻ hoặc liên hệ quản trị.',
      noteClassName: 'border-rose-200 bg-rose-50 text-rose-700',
      buttonClassName: 'bg-slate-300 text-slate-500',
    },
  }[resultType];

  return (
    <GlassCard className="relative flex h-full min-h-0 flex-col overflow-hidden p-4 sm:p-5">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`grid h-12 w-12 place-items-center rounded-2xl ring-1 ${config.iconClassName}`}>
              {config.icon}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{config.eyebrow}</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{config.title}</h2>
            </div>
          </div>
          {config.badge}
        </div>

        <div className="mt-5 rounded-[24px] border border-slate-200/70 bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
          <p className="text-xs font-semibold text-slate-400">Biển số</p>
          <p className="mt-2 break-words text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {config.plate}
          </p>
        </div>

        <div className="my-4 border-t border-dashed border-slate-300/80" />

        {resultType === 'package' && <PackageResult result={result} />}
        {resultType === 'visitor' && <VisitorResult result={result} />}
        {resultType === 'invalid' && <InvalidResult result={result} />}

        <p className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold leading-6 ${config.noteClassName}`}>
          {config.note}
        </p>

        <button
          type="button"
          disabled={!canConfirm}
          className={`mt-4 flex h-12 w-full items-center justify-center rounded-2xl text-sm font-bold transition active:scale-[0.98] disabled:cursor-not-allowed ${config.buttonClassName}`}
        >
          XÁC NHẬN CHO XE VÀO
        </button>
      </div>
    </GlassCard>
  );
}

export default function VehicleEntryPage() {
  const [cardCode, setCardCode] = useState('PKG1029');
  const [visitorPlate, setVisitorPlate] = useState('88B-123.45');
  const [visitorType, setVisitorType] = useState('Car');
  const [resultType, setResultType] = useState('visitor');
  const [result, setResult] = useState({
    cardCode: 'VIS1029',
    licensePlate: '88B-123.45',
    vehicleType: 'Car',
    entryTime: nowText(),
    sessionStatus: 'Đã tạo phiên gửi xe',
  });

  function handleCheckCard() {
    const card = packageCards[normalize(cardCode)];

    if (!card || card.reason) {
      setResultType('invalid');
      setResult({
        reason: card?.reason || 'Thẻ không tồn tại',
      });
      return;
    }

    setResultType('package');
    setResult(card);
  }

  function handleCreateVisitorCard() {
    setResultType('visitor');
    setResult({
      cardCode: 'VIS1029',
      licensePlate: normalize(visitorPlate),
      vehicleType: visitorType,
      entryTime: nowText(),
      sessionStatus: 'Đã tạo phiên gửi xe',
    });
  }

  const canConfirm = resultType !== 'invalid';

  return (
    <div className="h-full overflow-hidden">
      <div className="grid h-full min-h-0 gap-4 xl:grid-cols-12">
        <GlassCard className="flex min-h-0 flex-col p-4 xl:col-span-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
              <CarFront className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-950">Thao tác vào bãi</h1>
            </div>
          </div>

          <div className="mt-4 min-h-0 flex-1 space-y-3">
            <div className="rounded-[24px] border border-white/70 bg-white/65 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-slate-800">Kiểm tra thẻ</h2>
                <CreditCard className="h-4 w-4 text-slate-400" />
              </div>
              <label className="mt-3 block text-xs font-semibold text-slate-500">Mã thẻ</label>
              <input
                value={cardCode}
                onChange={(event) => setCardCode(event.target.value.toUpperCase())}
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200/70 bg-white/70 px-3 text-sm font-semibold tracking-wide text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/20"
                placeholder="PKG1029"
              />
              <button
                type="button"
                onClick={handleCheckCard}
                className="mt-3 h-10 w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(14,165,233,0.22)] transition hover:bg-sky-600 active:scale-[0.98]"
              >
                Kiểm tra thẻ
              </button>
            </div>

            <div className="rounded-[24px] border border-amber-100/80 bg-amber-50/50 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-slate-800">Tạo thẻ vãng lai</h2>
                <TicketCheck className="h-4 w-4 text-amber-600" />
              </div>
              <label className="mt-3 block text-xs font-semibold text-slate-500">Biển số</label>
              <input
                value={visitorPlate}
                onChange={(event) => setVisitorPlate(event.target.value.toUpperCase())}
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200/70 bg-white/75 px-3 text-sm font-semibold tracking-wide text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/20"
                placeholder="88B-123.45"
              />
              <label className="mt-3 block text-xs font-semibold text-slate-500">Loại xe</label>
              <select
                value={visitorType}
                onChange={(event) => setVisitorType(event.target.value)}
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200/70 bg-white/75 px-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/20"
              >
                {vehicleTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleCreateVisitorCard}
                className="mt-3 h-10 w-full rounded-2xl bg-amber-400 text-sm font-semibold text-slate-950 shadow-[0_14px_28px_rgba(245,158,11,0.20)] transition hover:bg-amber-500 active:scale-[0.98]"
              >
                Tạo thẻ vãng lai
              </button>
            </div>
          </div>
        </GlassCard>

        <div className="min-h-0 xl:col-span-8">
          <ResultConfirmationCard resultType={resultType} result={result} canConfirm={canConfirm} />
        </div>
      </div>
    </div>
  );
}
