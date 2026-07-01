import React, { useState } from 'react';
import {
  AlertCircle, ArrowUpFromLine, CarFront, CheckCircle2, Clock3,
  CreditCard, Keyboard, LoaderCircle, ReceiptText, ScanLine,
  ShieldCheck, TimerReset, UserRound,
} from 'lucide-react';
import { checkParkingExit, confirmParkingExit } from '../../../services/staffService';
import { VIETNAM_TIME_ZONE } from '../../../utils/dateTime';

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')} đ`;

const formatKpiDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: VIETNAM_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  }).format(date);
};

const formatDuration = (minutes) => {
  const total = Number(minutes || 0);
  const days = Math.floor(total / 1440);
  const hours = Math.floor((total % 1440) / 60);
  const mins = total % 60;
  return [days ? `${days} ngày` : '', hours ? `${hours} giờ` : '', `${mins} phút`]
    .filter(Boolean).join(' ');
};

function InfoCard({ icon: Icon, label, value, chip }) {
  const hasValue = value && value !== '—';

  return (
    <div className="flex flex-col justify-center gap-1 rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-1.5">
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-blue-50 text-blue-500">
          <Icon className="h-3 w-3" strokeWidth={2.5} />
        </span>
        <p className="truncate text-[9px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      </div>
      <div className="flex items-center gap-1.5 pl-[26px]">
        {chip && (
          <span className="inline-flex shrink-0 items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
            {chip}
          </span>
        )}
        <p title={value || '—'} className={`whitespace-nowrap text-[12px] font-extrabold ${hasValue ? 'text-slate-900' : 'text-slate-400'}`}>{value || '—'}</p>
      </div>
    </div>
  );
}

function CameraPanel({ label, status = 'Online', imageSrc = '/empty_parking.png' }) {
  return (
    <article className="group relative h-full overflow-hidden rounded-2xl bg-slate-700 shadow-sm ring-1 ring-black/[0.06] transition-all duration-300">
      <img src={imageSrc} alt={label} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-3 pt-3">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/55 px-2.5 py-1 text-[10.5px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
          {label}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/55 px-2.5 py-1 text-[10.5px] font-semibold text-white backdrop-blur-sm">
          <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-400" />
          {status}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2.5">
        <span className="inline-flex shrink-0 items-center gap-1.5 text-[10.5px] font-black text-white">
          <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
          LIVE
        </span>
        <p className="truncate text-[10.5px] font-semibold text-white/90">27/06/2026 • 21:07:27</p>
      </div>
    </article>
  );
}

export default function StaffVehicleExit() {
  const [licensePlate, setLicensePlate] = useState('');
  const [result, setResult] = useState(null);
  const [hasCheckedVehicle, setHasCheckedVehicle] = useState(false);
  const [hasReceivedCash, setHasReceivedCash] = useState(false);
  const [isExitCompleted, setIsExitCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const hasExitData = hasCheckedVehicle && Boolean(result);
  const isVisitor = result?.exitType === 'VISITOR';
  const extractError = (err, fallback) =>
    err?.response?.data?.message || err?.response?.data?.error || fallback;

  const handleSearch = async (event) => {
    event?.preventDefault();
    const plate = licensePlate.trim();
    if (!plate) {
      setError('Vui lòng nhập biển số xe cần kiểm tra.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMessage('');
    setResult(null);
    setHasCheckedVehicle(false);
    setHasReceivedCash(false);
    setIsExitCompleted(false);
    try {
      const data = await checkParkingExit(plate);
      setResult(data);
      setLicensePlate(data.licensePlate || plate.toUpperCase());
      setHasCheckedVehicle(true);
    } catch (err) {
      setError(extractError(err, 'Không tìm thấy phiên gửi xe đang hoạt động.'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmExit = async () => {
    if (!result || isExitCompleted) return;
    if (isVisitor && !hasReceivedCash) {
      setError('Vui lòng xác nhận đã nhận đủ tiền trước khi hoàn tất xe ra.');
      return;
    }
    setConfirming(true);
    setError('');
    try {
      const data = await confirmParkingExit(result.orderId, {
        paymentConfirmed: isVisitor ? hasReceivedCash : false,
        paymentMethod: isVisitor ? 'CASH' : null,
      });
      setResult(data);
      setIsExitCompleted(true);
      setSuccessMessage(data.message || 'Đã xác nhận thanh toán và hoàn tất xe ra');
    } catch (err) {
      setError(extractError(err, 'Không thể xác nhận xe ra. Vui lòng thử lại.'));
    } finally {
      setConfirming(false);
    }
  };

  const handleNewSearch = () => {
    setLicensePlate('');
    setResult(null);
    setHasCheckedVehicle(false);
    setHasReceivedCash(false);
    setIsExitCompleted(false);
    setError('');
    setSuccessMessage('');
  };

  const vehicleTypeDisplay =
    result?.vehicleType === 'MOTORBIKE' ? 'Xe máy (2 bánh)' :
    result?.vehicleType === 'CAR' ? 'Ô tô (4 chỗ)' :
    result?.vehicleType || '—';
  const visitorCardDisplay = hasExitData
    ? (result.visitorCardCode || (isVisitor ? '—' : 'Không có'))
    : '—';
  const entryTimeDisplay = hasExitData ? formatKpiDateTime(result.entryTime) : '—';
  const durationDisplay = hasExitData ? formatDuration(result.durationMinutes) : '—';
  const customerDisplay = hasExitData ? (result.customerName || 'Khách vãng lai') : '—';
  const totalFeeDisplay = hasExitData ? formatCurrency(result.fee?.amount) : '—';
  const feeDescription = hasExitData
    ? (result.fee?.description || 'Tính theo thời gian gửi thực tế, làm tròn lên theo mỗi khung phí')
    : 'Nhập biển số để xem chi tiết phí.';
  const firstBlockDisplay = hasExitData && result.fee?.firstBlockMinutes != null
    ? `${result.fee.firstBlockMinutes} phút · ${formatCurrency(result.fee?.firstBlockFee)}`
    : '—';
  const additionalBlockDisplay = hasExitData && result.fee?.additionalBlocks != null
    ? `${result.fee.additionalBlocks} · ${formatCurrency(result.fee?.additionalFee)}`
    : '—';
  const canToggleCash = hasExitData && isVisitor && !isExitCompleted;

  const canConfirmExit =
    hasCheckedVehicle && result && !isExitCompleted &&
    (!isVisitor || hasReceivedCash);

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden bg-[#EEF3FB] px-5 pb-0 pt-0 font-sans">

      {/* ══════ CAMERAS ══════ */}
      <div className="grid h-[31vh] max-h-[298px] shrink-0 grid-cols-2 gap-3">
        <CameraPanel label="CAMERA 1" imageSrc="/camera-entry-front.png" />
        <CameraPanel label="CAMERA 2" imageSrc="/camera-entry-rear.png" />
      </div>

      {/* ══════ MAIN CONTENT ══════ */}
      <div className="mt-2 grid min-h-0 flex-1 grid-cols-[58fr_42fr] gap-3">

        {/* ── LEFT: Kiểm soát xe ra ── */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm">

          {/* Header */}
          <div className="mb-2 flex shrink-0 items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-sm shadow-blue-500/30">
              <ArrowUpFromLine className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <h2 className="text-[13px] font-black tracking-tight text-slate-900">Kiểm soát xe ra</h2>
          </div>

          <div className="mb-2 h-px shrink-0 bg-slate-100" />

          {/* Alerts */}
          {error && (
            <div className="mb-2 flex shrink-0 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-700">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
              <span>{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="mb-2 flex shrink-0 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Search form */}
          <form onSubmit={handleSearch} className="mb-2.5 shrink-0">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Biển số xe
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                  <CarFront className="h-4 w-4" strokeWidth={2.25} />
                </span>
                <input
                  autoFocus
                  value={licensePlate}
                  onChange={(e) => {
                    setLicensePlate(e.target.value.toUpperCase());
                    if (!isExitCompleted) { setResult(null); setError(''); setHasCheckedVehicle(false); }
                  }}
                  placeholder="VD: 30A-123.45"
                  disabled={isExitCompleted}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-sm font-bold uppercase tracking-wide text-slate-950 outline-none transition-all placeholder:normal-case placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-3 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <Keyboard className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-300" />
              </div>
              <button
                type="submit"
                disabled={loading || isExitCompleted}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 text-[12.5px] font-bold text-white shadow-sm shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
              >
                {loading
                  ? <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2.25} />
                  : <ScanLine className="h-4 w-4" strokeWidth={2.25} />
                }
                <span className="whitespace-nowrap">{loading ? 'Đang kiểm tra...' : 'Kiểm tra xe'}</span>
              </button>
            </div>
          </form>

          {/* Info grid */}
          <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-2 overflow-hidden">
            <InfoCard icon={ReceiptText} label="Mã lượt gửi" value={hasExitData ? result.orderCode : '—'} />
            <InfoCard icon={CarFront} label="Loại xe" value={hasExitData ? vehicleTypeDisplay : '—'} />
            <InfoCard
              icon={CreditCard}
              label="Thẻ vãng lai"
              value={visitorCardDisplay}
              chip={hasExitData && isVisitor ? 'Thẻ vãng lai' : undefined}
            />
            <InfoCard icon={Clock3} label="Thời gian vào" value={entryTimeDisplay} />
            <InfoCard icon={TimerReset} label="Thời gian gửi" value={durationDisplay} />
            <InfoCard icon={UserRound} label="Khách hàng" value={customerDisplay} />
          </div>
        </div>

        {/* ── RIGHT: Chi tiết cần thu ── */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm">

          {/* Header */}
          <div className="mb-2 flex shrink-0 items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
              <ReceiptText className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <h2 className="flex-1 text-[13px] font-black tracking-tight text-slate-900">Chi tiết cần thu</h2>
            <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
              isExitCompleted
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-amber-200 bg-amber-50 text-amber-600'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isExitCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {isExitCompleted ? 'Đã hoàn tất' : 'Chờ thanh toán'}
            </span>
          </div>

          <div className="mb-2 h-px shrink-0 bg-slate-100" />

          {/* Total fee box */}
          <div className="mb-2 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D1B35] via-[#142240] to-[#1B2F5A] px-4 py-3.5 text-white">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">TỔNG TIỀN</p>
            <p className="mt-0.5 text-[26px] font-black leading-none tracking-tight">
              {totalFeeDisplay}
            </p>
            <p className="mt-1 text-[10px] leading-4 text-slate-400">
              {feeDescription}
            </p>
          </div>

          {/* Fee breakdown */}
          <div className="mb-2 shrink-0 overflow-hidden rounded-xl border border-slate-100">
            <div className="flex items-center justify-between gap-3 px-3 py-2 text-[11px]">
              <span className="font-medium text-slate-500">Khung đầu</span>
              <strong className={`truncate text-right font-bold ${firstBlockDisplay === '—' ? 'text-slate-400' : 'text-slate-800'}`}>{firstBlockDisplay}</strong>
            </div>
            <div className="mx-3 h-px bg-slate-100" />
            <div className="flex items-center justify-between gap-3 px-3 py-2 text-[11px]">
              <span className="font-medium text-slate-500">Khung phát sinh</span>
              <strong className={`truncate text-right font-bold ${additionalBlockDisplay === '—' ? 'text-slate-400' : 'text-slate-800'}`}>{additionalBlockDisplay}</strong>
            </div>
          </div>

          {/* Cash confirmation checkbox */}
          <label className={`mb-2 flex shrink-0 items-start gap-3 rounded-xl border px-3 py-2 transition-colors ${
            !canToggleCash
              ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-70'
              : hasReceivedCash
                ? 'cursor-pointer border-emerald-200 bg-emerald-50'
                : 'cursor-pointer border-slate-200 bg-slate-50 hover:border-slate-300'
          }`}>
            <input
              type="checkbox"
              checked={hasReceivedCash}
              disabled={!canToggleCash}
              onChange={(e) => setHasReceivedCash(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-600 disabled:cursor-not-allowed"
            />
            <span>
              <span className={`block text-[12px] font-bold ${canToggleCash ? 'text-slate-900' : 'text-slate-500'}`}>Đã nhận đủ tiền mặt</span>
              <span className="block text-[10px] text-slate-500">Xác nhận trước khi cho xe ra khỏi bãi.</span>
            </span>
          </label>

          {/* Action button — pushed to bottom */}
          <div className="mt-4 shrink-0">
            {isExitCompleted ? (
              <button
                type="button"
                onClick={handleNewSearch}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-[13px] font-black text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
              >
                <ScanLine className="h-4 w-4" strokeWidth={2.25} />
                Kiểm tra xe tiếp theo
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmExit}
                disabled={confirming || !canConfirmExit}
                className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[13px] font-black text-white shadow-md transition-all ${
                  !canConfirmExit || confirming
                    ? 'cursor-not-allowed bg-slate-200 text-slate-400 shadow-none'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-blue-500/20 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]'
                }`}
              >
                {confirming
                  ? <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2.25} />
                  : <ShieldCheck className="h-4 w-4" strokeWidth={2.25} />
                }
                <span>{confirming ? 'Đang hoàn tất...' : 'Xác nhận thanh toán & cho xe ra'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
