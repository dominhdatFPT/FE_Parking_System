import { useRef, useState } from 'react';
import { AlertCircle, CarFront, CheckCircle2, TicketCheck, Bike, Keyboard, ChevronDown, Clock3, User, ScanLine, SlidersHorizontal } from 'lucide-react';
import { checkParkingEntry, confirmParkingEntry } from '../../services/staffService';
import { VIETNAM_TIME_ZONE } from '../../utils/dateTime';
import { rememberVehicleType } from '../../utils/vehicleTypeMemory';

const PLATE_REGEX = /^[A-Z0-9-]*$/;
const PLATE_MAX_LENGTH = 12;

const VEHICLE_TYPES = {
  MOTORBIKE: { code: 'MOTORBIKE', id: 1 },
  CAR: { code: 'CAR', id: 2 },
};
const DEFAULT_VEHICLE_TYPE = VEHICLE_TYPES.MOTORBIKE.code;

const getVehicleType = (value) => VEHICLE_TYPES[String(value || '').toUpperCase()] || null;

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

const getSessionCode = (value) => (
  value?.orderCode
  || value?.sessionCode
  || value?.parkingSessionCode
  || value?.parkingOrderCode
  || value?.orderId
  || value?.parkingOrderId
  || value?.sessionId
  || value?.id
);

const formatSessionStatus = (value, canConfirm, invalid) => {
  if (value === '—') return '—';
  const normalized = String(value || '').toUpperCase();
  if (normalized.includes('COMPLETED') || normalized.includes('CREATED') || normalized.includes('ACTIVE')) {
    return 'Đã tạo phiên';
  }
  if (normalized.includes('PENDING') || normalized.includes('WAITING') || normalized.includes('CHƯA') || normalized.includes('CHUA')) {
    return 'Chưa tạo phiên';
  }
  if (normalized.includes('ĐÃ') || normalized.includes('DA')) {
    return 'Đã tạo phiên';
  }
  if (invalid) return 'Chưa tạo phiên';
  return canConfirm ? 'Chưa tạo phiên' : 'Đã tạo phiên';
};

function Info({ label, value, tone = 'blue', icon: Icon = CarFront }) {
  const tones = {
    blue:   { card: 'border-blue-100 shadow-blue-950/[0.04]',    icon: 'bg-blue-50 text-blue-600 ring-blue-100',       accent: 'bg-blue-500',    glow: 'bg-blue-300/15' },
    green:  { card: 'border-emerald-100 shadow-emerald-950/[0.04]', icon: 'bg-emerald-50 text-emerald-600 ring-emerald-100', accent: 'bg-emerald-500', glow: 'bg-emerald-300/15' },
    purple: { card: 'border-violet-100 shadow-violet-950/[0.04]', icon: 'bg-violet-50 text-violet-600 ring-violet-100',   accent: 'bg-violet-500',  glow: 'bg-violet-300/15' },
    orange: { card: 'border-orange-100 shadow-orange-950/[0.04]', icon: 'bg-orange-50 text-orange-600 ring-orange-100',   accent: 'bg-orange-500',  glow: 'bg-orange-300/15' },
  };
  const s = tones[tone] || tones.blue;
  return (
    <div className={`group relative flex h-[74px] min-w-0 items-center gap-2 overflow-hidden rounded-[16px] border bg-gradient-to-br from-white via-white to-slate-50/80 px-2.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${s.card}`}>
      <span className={`absolute inset-x-0 top-0 h-1 ${s.accent}`} />
      <span className={`pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full blur-2xl transition-opacity duration-200 group-hover:opacity-100 ${s.glow}`} />
      <span className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-2xl shadow-inner ring-1 ${s.icon}`}>
        <Icon className="h-4 w-4" strokeWidth={2.25} />
      </span>
      <div className="relative min-w-0">
        <p className="truncate text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
        <p title={value || '—'} className="mt-0.5 whitespace-nowrap text-[14px] font-extrabold leading-none tracking-tight text-slate-950">{value || '—'}</p>
      </div>
    </div>
  );
}

function CameraPanel({ label, status = 'Online' }) {
  return (
    <article className="group relative h-full overflow-hidden rounded-[24px] border border-[#E5EDF7] bg-slate-900 shadow-[0_16px_42px_rgba(15,23,42,0.07)] transition-all duration-300">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_50%,#0f172a_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(0deg,rgba(148,163,184,0.1)_1px,transparent_1px)] bg-[size:34px_34px]" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

      {/* TOP: camera label pill (left) + online status pill (right) */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-4 pt-4">
        <span className="inline-flex items-center gap-1.5 rounded-[10px] bg-slate-950/55 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-white backdrop-blur-sm ring-1 ring-white/10">
          {label}
        </span>
        <span className="inline-flex items-center gap-2 rounded-[10px] bg-slate-950/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm ring-1 ring-white/10">
          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" />
          {status}
        </span>
      </div>

      {/* BOTTOM: LIVE indicator (left) + timestamp (right) */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-5 py-4 text-white">
        <span className="inline-flex shrink-0 items-center gap-2 text-sm font-black">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          LIVE
        </span>
        <p className="truncate text-sm font-semibold">27/06/2026 • 21:07:27</p>
      </div>
    </article>
  );
}

export default function VehicleEntryPage() {
  const plateInputRef = useRef(null);
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleType, setVehicleType] = useState(DEFAULT_VEHICLE_TYPE);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  // notice: { type: 'error'|'warning'|'success', message: string, code?: string } | null
  const [notice, setNotice] = useState(null);
  // hasChecked: true only after the user explicitly pressed "Kiểm tra xe" and got a response
  const [hasChecked, setHasChecked] = useState(false);
  const [plateError, setPlateError] = useState('');
  const [typeError, setTypeError] = useState('');
  const selectedVehicleType = getVehicleType(vehicleType);

  const check = async (event) => {
    event?.preventDefault();
    const plate = licensePlate.trim().toUpperCase();
    let hasError = false;
    if (!plate) {
      setPlateError('Vui lòng nhập biển số xe');
      hasError = true;
    } else if (plate.length < 5 || plate.length > 12) {
      setPlateError('Biển số phải từ 5-12 ký tự');
      hasError = true;
    } else if (!PLATE_REGEX.test(plate)) {
      setPlateError('Biển số chỉ được chứa chữ cái, số và dấu gạch ngang');
      hasError = true;
    }
    if (!selectedVehicleType) {
      setTypeError('Vui lòng chọn loại xe');
      hasError = true;
    }
    if (hasError) return;
    setLoading(true); setNotice(null); setResult(null); setHasChecked(false);
    try {
      console.log('[DEBUG check] vehicleType state:', selectedVehicleType.code, '| vehicleTypeId:', selectedVehicleType.id, '| plate:', plate);
      const res = await checkParkingEntry(plate, selectedVehicleType);
      setResult(res);
      setHasChecked(true);
      if (res.entryType === 'MONTHLY') {
        setNotice({ type: 'success', message: 'Xe đã đăng ký gói tháng. Không cần cấp thẻ vãng lai.' });
      } else if (res.entryType === 'VISITOR') {
        setNotice({
          type: 'warning',
          message: `Xe chưa có gói — cấp thẻ ${res.visitorCardCode}`,
          code: res.visitorCardCode,
        });
      } else if (res.entryType === 'INVALID') {
        setNotice({ type: 'error', message: res.message || 'Biển số không hợp lệ hoặc xe đang trong bãi.' });
      } else {
        // Catch-all: unknown entryType hoặc trường hợp backend chưa định nghĩa
        setNotice({ type: 'error', message: res.message || 'Không thể xử lý yêu cầu cho xe này.' });
      }
    }
    catch (err) { setNotice({ type: 'error', message: err.response?.data?.message || err.response?.data?.error || 'Không thể kiểm tra biển số xe.' }); }
    finally { setLoading(false); }
  };

  const confirm = async () => {
    if (!result?.canConfirm || !selectedVehicleType) return;
    setConfirming(true); setNotice(null);
    try {
      const payload = {
        licensePlate: result.licensePlate || licensePlate.trim().toUpperCase(),
        entryType: result.entryType,
        visitorCardCode: result.visitorCardCode,
        vehicleType: selectedVehicleType.code,
        vehicleTypeCode: selectedVehicleType.code,
        vehicleTypeId: selectedVehicleType.id,
      };
      console.log('[DEBUG confirm] vehicleType state:', selectedVehicleType.code, '| vehicleTypeId:', selectedVehicleType.id, '| payload.vehicleType:', payload.vehicleType, '| payload.vehicleTypeCode:', payload.vehicleTypeCode, '| result.vehicleType:', result?.vehicleType);
      setResult(await confirmParkingEntry(payload));
      rememberVehicleType(result?.licensePlate || licensePlate, selectedVehicleType.code);
      setNotice({ type: 'success', message: 'Đã xác nhận xe vào bãi' });
      setLicensePlate('');
      setVehicleType(DEFAULT_VEHICLE_TYPE);
      setResult(null);
      setHasChecked(false);
      setPlateError('');
      setTypeError('');
      setTimeout(() => plateInputRef.current?.focus(), 0);
    }
    catch (err) { setNotice({ type: 'error', message: err.response?.data?.message || err.response?.data?.error || 'Không thể xác nhận xe vào.' }); }
    finally { setConfirming(false); }
  };

  const isRegistered = result?.entryType === 'MONTHLY';
  const isVisitor = result?.entryType === 'VISITOR';
  const isInvalid = result?.entryType === 'INVALID';
  // All display values are blank/neutral until hasChecked is true
  const badgeClassName = loading
    ? 'bg-blue-50 text-blue-600 border-blue-200'
    : !hasChecked
      ? 'bg-slate-100 text-slate-500 border-slate-200'
      : isInvalid
        ? 'bg-rose-50 text-rose-700 border-rose-200'
        : isRegistered
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-blue-50 text-blue-700 border-blue-200';
  const badgeLabel = loading ? 'ĐANG KIỂM TRA' : !hasChecked ? 'CHƯA KIỂM TRA' : isRegistered ? 'XE ĐÃ ĐĂNG KÝ GÓI' : isVisitor ? 'KHÁCH VÃNG LAI' : isInvalid ? 'KHÔNG HỢP LỆ' : 'CHƯA KIỂM TRA';
  const displayPlate = hasChecked ? (result?.licensePlate || licensePlate.trim().toUpperCase() || '—') : '—';
  const customerType = !hasChecked ? '—' : isRegistered ? 'Khách tháng' : isVisitor ? 'Vãng lai' : isInvalid ? 'Không hợp lệ' : '—';
  const entryTime = hasChecked ? formatKpiDateTime(result?.entryTime || result?.checkInTime || result?.createdAt) : '—';
  const exitTime = hasChecked ? formatKpiDateTime(result?.exitTime || result?.checkOutTime) : '—';
  const sessionCode = getSessionCode(result);
  const isMotorbike = selectedVehicleType?.code === VEHICLE_TYPES.MOTORBIKE.code;
  const vehicleTypeDisplay = !hasChecked ? '—' : isMotorbike ? 'Xe máy' : 'Ô tô';
  const VehicleTypeIcon = isMotorbike ? Bike : CarFront;
  const sessionStatusDisplay = hasChecked ? formatSessionStatus(result?.sessionStatus, result?.canConfirm, isInvalid) : '—';
  const sessionTitle = !hasChecked
    ? 'Chưa kiểm tra xe'
    : result?.canConfirm
      ? 'Chưa tạo phiên'
      : sessionCode
        ? String(sessionCode)
        : 'Phiên gửi xe đã tạo';

  return (
    /*
     * Single-root CSS grid — cameras get 0.95fr (~48%), bottom gets 1.05fr (~52%).
     * Decorative divs are absolute so the browser ignores them for grid placement.
     * h-full fills AdminLayout <main>'s content area; overflow-hidden is the hard stop.
     */
    <div className="relative grid h-full grid-rows-[0.95fr_1.05fr] gap-4 overflow-hidden bg-[#F5FAFF] px-5 pb-5 pt-0 font-sans">

      {/* decorative glows — absolute, do not participate in grid */}
      <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-2 h-80 w-80 rounded-full bg-cyan-200/20 blur-3xl" />

      {/* ═══ ROW 1 — Cameras (0.95fr ≈ 48%) ═══ */}
      <div className="grid min-h-0 grid-cols-2 gap-4">
        <CameraPanel label="CAMERA 1" />
        <CameraPanel label="CAMERA 2" />
      </div>

      {/* ═══ ROW 2 — Control (0.9fr ≈ 32%) + Result (1.9fr ≈ 68%) (1.05fr ≈ 52%) ═══ */}
      <div className="grid min-h-0 grid-cols-[0.9fr_1.9fr] gap-4">

        {/* ── CONTROL CARD ── */}
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[24px] border border-[#E5EDF7] bg-white p-5 shadow-[0_16px_42px_rgba(15,23,42,0.07)]">
          <div className="mb-4 flex shrink-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
              <SlidersHorizontal className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <h2 className="font-sans text-[15px] font-black uppercase tracking-tight text-slate-900">ĐIỀU KHIỂN</h2>
          </div>

          <form onSubmit={check} className="flex min-h-0 flex-1 flex-col">
            <div className="space-y-3">
              {/* License Plate */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">BIỂN SỐ XE</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-xl bg-blue-50 text-blue-600">
                    {vehicleType === 'MOTORBIKE' ? <Bike className="h-4 w-4" strokeWidth={2.25} /> : <CarFront className="h-4 w-4" strokeWidth={2.25} />}
                  </span>
                  <input
                    ref={plateInputRef}
                    autoFocus
                    value={licensePlate}
                    maxLength={PLATE_MAX_LENGTH}
                    onChange={(e) => {
                      const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, PLATE_MAX_LENGTH);
                      setLicensePlate(raw);
                      setPlateError('');
                      setResult(null);
                      setNotice(null);
                      setHasChecked(false);
                    }}
                    placeholder="VD: 30A-123.45"
                    className={`h-12 w-full rounded-[14px] border bg-white pl-[52px] pr-11 font-sans text-sm font-bold uppercase tracking-wide text-slate-950 shadow-sm outline-none transition-all duration-200 placeholder:normal-case placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-400 focus:ring-4 ${plateError ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-[#D8E3F1] focus:border-blue-400 focus:ring-blue-100'}`}
                  />
                  <Keyboard className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                {plateError && <p className="mt-1 text-xs font-semibold text-red-500">{plateError}</p>}
              </div>

              {/* Vehicle Type */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">LOẠI XE</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-xl bg-blue-50 text-blue-600">
                    {vehicleType === 'MOTORBIKE' ? <Bike className="h-4 w-4" strokeWidth={2.25} /> : <CarFront className="h-4 w-4" strokeWidth={2.25} />}
                  </span>
                  <select
                    value={vehicleType}
                    onChange={(e) => { setVehicleType(getVehicleType(e.target.value)?.code || ''); setTypeError(''); setResult(null); setNotice(null); setHasChecked(false); }}
                    className={`h-12 w-full appearance-none rounded-[14px] border bg-white pl-[52px] pr-11 font-sans text-sm font-bold text-slate-800 shadow-sm outline-none transition-all duration-200 focus:ring-4 ${typeError ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-[#D8E3F1] focus:border-blue-400 focus:ring-blue-100'}`}
                  >
                    <option value={VEHICLE_TYPES.MOTORBIKE.code}>Xe máy</option>
                    <option value={VEHICLE_TYPES.CAR.code}>Ô tô</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                </div>
                {typeError && <p className="mt-1 text-xs font-semibold text-red-500">{typeError}</p>}
              </div>
            </div>

            {/* Action buttons — mt-auto pins them to the card bottom, never clipped */}
            <div className="mt-auto grid grid-cols-2 gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border border-blue-500 bg-white px-4 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:bg-blue-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                <ScanLine className="h-4 w-4" strokeWidth={2.25} />
                <span className="truncate">{loading ? 'Đang kiểm tra...' : 'Kiểm tra xe'}</span>
              </button>
              <button
                type="button"
                onClick={confirm}
                disabled={!result?.canConfirm || confirming}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-blue-600 to-sky-500 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:scale-[1.01] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                <span className="whitespace-nowrap">{confirming ? 'Đang lưu' : 'Xác nhận vào'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* ── RESULT CARD ── */}
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[24px] border border-[#E5EDF7] bg-white p-5 shadow-[0_16px_42px_rgba(15,23,42,0.07)]">
          <span className="pointer-events-none absolute -bottom-16 right-20 h-40 w-40 rounded-full bg-blue-300/10 blur-3xl" />

          {/* Header: badge pill (left) + notice (right) — fixed h-11 so layout never shifts */}
          <div className="flex h-11 shrink-0 items-center gap-4">
            <span className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-bold uppercase tracking-wide ${badgeClassName}`}>
              <span className="h-2 w-2 shrink-0 rounded-full bg-current opacity-80" />
              {badgeLabel}
            </span>

            {/* Notice slot — always rendered at h-11; invisible when empty to prevent layout shift */}
            <div className={`ml-auto inline-flex h-11 max-w-[70%] shrink-0 items-center gap-3 rounded-[18px] border px-3 shadow-sm transition-colors duration-150 ${
              !notice
                ? 'invisible border-transparent bg-transparent shadow-none'
                : notice.type === 'error'
                  ? 'border-red-200 bg-red-50'
                  : notice.type === 'warning'
                    ? 'border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50/70 to-white shadow-amber-900/[0.04]'
                    : 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-white'
            }`}>
              {notice?.type === 'error' && (
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-red-100 text-red-600 ring-1 ring-red-200">
                  <AlertCircle className="h-3.5 w-3.5" strokeWidth={2.25} />
                </span>
              )}
              {notice?.type === 'warning' && (
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-100 text-orange-600 ring-1 ring-amber-200">
                  <TicketCheck className="h-3.5 w-3.5" strokeWidth={2.25} />
                </span>
              )}
              {notice?.type === 'success' && (
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600 ring-1 ring-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.25} />
                </span>
              )}
              <span className={`truncate text-sm font-semibold ${
                !notice ? '' :
                notice.type === 'error' ? 'text-red-700' :
                notice.type === 'warning' ? 'text-slate-800' :
                'text-emerald-800'
              }`}>{notice?.message ?? ''}</span>
              {notice?.type === 'warning' && notice?.code && (
                <span className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border border-amber-300 bg-white px-3 text-xs font-black text-orange-600">
                  <TicketCheck className="h-3.5 w-3.5" strokeWidth={2.25} />
                  {notice.code}
                </span>
              )}
            </div>
          </div>

          {/* Middle: plate on the left, session facts on the right. */}
          <div className="mt-3 grid min-h-0 flex-1 grid-cols-[0.95fr_1.35fr] items-stretch gap-5">
            <div className="flex min-h-[132px] items-center justify-center overflow-hidden rounded-[20px] border border-[#DCE7F4] bg-white px-6 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
              <div className="w-full text-center">
                <p className="truncate font-sans text-[40px] font-black leading-none tracking-tight text-slate-950">{displayPlate}</p>
                <div className="mt-3 h-px bg-slate-200" />
                <p className="mt-2 text-[11px] font-black uppercase tracking-wider text-slate-500">BIỂN SỐ XE</p>
              </div>
            </div>

            <div className="grid min-h-[132px] grid-cols-2 gap-3 rounded-[20px] border border-slate-200 bg-slate-50/80 p-3">
              <div className="flex min-w-0 flex-col justify-center rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Phiên gửi xe</p>
                <p className="mt-2 truncate text-lg font-black text-slate-950" title={sessionTitle}>{sessionTitle}</p>
                <p className="mt-1 text-[10px] font-semibold text-slate-400">Dùng mã này để thanh toán checkout</p>
              </div>
              <div className="flex min-w-0 flex-col justify-center rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
                <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Giờ vào</p>
                <p className="mt-2 text-lg font-extrabold text-slate-950 tabular-nums">{entryTime}</p>
                <p className="mt-1 text-[10px] font-semibold text-slate-400">Ghi nhận theo giờ hệ thống</p>
              </div>
            </div>
          </div>

          {/* 4 KPI tiles — compact state summary for quick scanning */}
          <div className="grid shrink-0 grid-cols-4 gap-3">
            <Info label="Loại xe"    value={vehicleTypeDisplay}                                           tone="blue"   icon={VehicleTypeIcon} />
            <Info label="Loại khách" value={customerType}                                                   tone="green"  icon={User}        />
            <Info label="Giờ vào"    value={entryTime}                                                      tone="purple" icon={Clock3}      />
            <Info label="Trạng thái" value={sessionStatusDisplay}                                          tone="orange" icon={AlertCircle} />
          </div>


        </div>

      </div>
    </div>
  );
}
