import React, { useState } from 'react';
import {
  BadgeCheck, Banknote, CalendarDays, Camera, CarFront, CheckCircle2, Clock3,
  CreditCard, LoaderCircle, ReceiptText, Search, ShieldCheck,
  TimerReset, UserRound,
} from 'lucide-react';
import { checkParkingExit, confirmParkingExit } from '../../../services/staffService';
import { VIETNAM_TIME_ZONE } from '../../../utils/dateTime';

const EXIT_CAMERA_FEEDS = [
  { id: '01', status: 'Captured', angle: 'FRONT' },
  { id: '02', status: 'Live', angle: 'REAR' },
];

const MERCEDES_FRONT_IMAGE_URL = 'https://freepngimg.com/save/22102-mercedes-front-file/2048x1360';

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')} đ`;

const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: VIETNAM_TIME_ZONE,
    hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric',
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

function InfoItem({ icon: Icon, label, value, accent = false }) {
  return (
    <div className="rounded-[20px] bg-white/78 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ring-1 ring-slate-200/75">
      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
        <Icon className="h-4 w-4" strokeWidth={1.8} />
        {label}
      </div>
      <p className={`mt-2 truncate text-sm font-black ${accent ? 'text-sky-700' : 'text-slate-950'}`}>
        {value || '—'}
      </p>
    </div>
  );
}

function ExitCameraCard({ feed }) {
  const live = feed.status === 'Live';
  const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const plateText = feed.angle === 'FRONT' ? '29A-000.00' : '29A-000.01';

  return (
    <article
      className={`group relative h-[225px] overflow-hidden rounded-[26px] bg-gradient-to-br p-[2px] shadow-[0_16px_38px_rgba(15,35,66,0.12)] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] 2xl:h-[245px] ${
        live
          ? 'from-sky-300/80 via-cyan-200/40 to-slate-100 ring-1 ring-sky-300/70'
          : 'from-emerald-300/80 via-cyan-200/40 to-slate-100 ring-1 ring-emerald-300/70'
      }`}
    >
      <div className="relative h-full overflow-hidden rounded-[24px] bg-[#08111b] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_62%,rgba(125,211,252,0.2),transparent_26%),linear-gradient(180deg,#10283b_0%,#0a1724_46%,#050b13_100%)]" />
        <div className="absolute inset-0 opacity-[0.2] [background-image:radial-gradient(rgba(203,213,225,0.35)_1px,transparent_1px)] [background-size:6px_6px]" />
        <div className="absolute inset-x-0 bottom-0 h-[66%] bg-[linear-gradient(160deg,transparent_0_34%,rgba(148,163,184,0.18)_34.4%,transparent_35.1%_63%,rgba(148,163,184,0.16)_63.4%,transparent_64%),linear-gradient(180deg,rgba(15,23,42,0.16),rgba(2,6,23,0.58))]" />
        <div className="absolute inset-0 opacity-[0.1] [background-image:linear-gradient(rgba(226,232,240,0.42)_1px,transparent_1px)] [background-size:100%_4px]" />
        <div className="absolute bottom-7 left-1/2 h-px w-[84%] -translate-x-1/2 bg-cyan-100/16" />
        <div className="absolute bottom-8 left-[18%] h-[135px] w-px origin-bottom -skew-x-[24deg] bg-cyan-100/16" />
        <div className="absolute bottom-8 right-[18%] h-[135px] w-px origin-bottom skew-x-[24deg] bg-cyan-100/16" />
        <div className="absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 animate-pulse bg-cyan-200/6 blur-xl" />

        <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-2xl bg-slate-950/48 px-3 py-2 text-[11px] font-semibold text-slate-100 shadow-[0_10px_24px_rgba(0,0,0,0.24)] ring-1 ring-cyan-100/15 backdrop-blur">
          <Camera className="h-3.5 w-3.5 text-cyan-200" strokeWidth={1.7} />
          <span className="leading-none">Camera {feed.id}</span>
        </div>

        <div className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-between gap-3">
          <div className="rounded-2xl bg-slate-950/48 px-3 py-2 text-[10px] font-black text-slate-200 shadow-[0_10px_24px_rgba(0,0,0,0.22)] ring-1 ring-cyan-100/15 backdrop-blur">
            <span className="font-mono text-xs text-white">{time}</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-slate-950/48 px-3 py-2 text-[10px] font-black text-slate-200 shadow-[0_10px_24px_rgba(0,0,0,0.22)] ring-1 ring-cyan-100/15 backdrop-blur">
            <span className={`h-2 w-2 rounded-full ${live ? 'animate-pulse bg-sky-300 shadow-[0_0_14px_rgba(125,211,252,0.85)]' : 'bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.75)]'}`} />
            <span className="text-cyan-200">FPS 30</span>
          </div>
        </div>

        <div className="absolute inset-x-8 bottom-14 top-14 flex items-end justify-center">
          <div className="relative h-[132px] w-[260px] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-1">
            <div className="absolute -inset-x-4 -top-4 bottom-0 animate-pulse rounded-[28px] border border-cyan-300/35 shadow-[0_0_22px_rgba(103,232,249,0.12)]" />
            <div className="absolute -left-4 -top-4 h-5 w-5 rounded-tl-2xl border-l-2 border-t-2 border-cyan-200/75" />
            <div className="absolute -right-4 -top-4 h-5 w-5 rounded-tr-2xl border-r-2 border-t-2 border-cyan-200/75" />
            <div className="absolute -bottom-0 -left-4 h-5 w-5 rounded-bl-2xl border-b-2 border-l-2 border-cyan-200/75" />
            <div className="absolute -bottom-0 -right-4 h-5 w-5 rounded-br-2xl border-b-2 border-r-2 border-cyan-200/75" />
            <div className="absolute left-1/2 top-[106px] h-9 w-[248px] -translate-x-1/2 rounded-full bg-black/55 blur-xl" />

            {feed.angle === 'FRONT' ? (
              <img
                src={MERCEDES_FRONT_IMAGE_URL}
                alt="Mercedes-Benz front view in exit camera"
                className="absolute left-1/2 top-0 h-[132px] w-[282px] -translate-x-1/2 object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.5)]"
                draggable="false"
              />
            ) : (
              <div className="absolute left-1/2 top-1 h-[126px] w-[224px] -translate-x-1/2 drop-shadow-[0_18px_22px_rgba(0,0,0,0.5)]">
                <div className="absolute left-1/2 top-[104px] h-7 w-[196px] -translate-x-1/2 rounded-full bg-black/42 blur-lg" />
                <div className="absolute left-[40px] right-[40px] top-1 h-[52px] rounded-t-[28px] rounded-b-[10px] bg-gradient-to-b from-slate-100 via-slate-300 to-slate-500 shadow-[inset_0_2px_8px_rgba(255,255,255,0.55)] ring-1 ring-white/45" />
                <div className="absolute left-[62px] right-[62px] top-0 h-[38px] rounded-t-[26px] rounded-b-[12px] bg-gradient-to-b from-slate-900/88 via-slate-700/78 to-slate-500/52 ring-1 ring-cyan-100/25" />
                <div className="absolute left-[22px] right-[22px] top-[39px] h-[66px] rounded-t-[18px] rounded-b-[16px] bg-gradient-to-b from-white via-slate-200 to-slate-500 shadow-[0_18px_34px_rgba(0,0,0,0.42)] ring-1 ring-white/45" />
                <div className="absolute left-[36px] top-[55px] h-[23px] w-[56px] rounded-l-[18px] rounded-r-lg bg-gradient-to-r from-red-700 via-rose-400 to-red-500 shadow-[0_0_16px_rgba(248,113,113,0.5)]" />
                <div className="absolute right-[36px] top-[55px] h-[23px] w-[56px] rounded-r-[18px] rounded-l-lg bg-gradient-to-r from-red-500 via-rose-400 to-red-700 shadow-[0_0_16px_rgba(248,113,113,0.5)]" />
                <div className="absolute left-1/2 top-[53px] h-[20px] w-[20px] -translate-x-1/2 rounded-full bg-slate-100 shadow-sm ring-[3px] ring-slate-500">
                  <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-500" />
                </div>
                <div className="absolute left-1/2 top-[80px] h-[27px] w-[112px] -translate-x-1/2 rounded-lg bg-gradient-to-b from-slate-100 to-slate-300 shadow-[inset_0_1px_6px_rgba(255,255,255,0.55)] ring-1 ring-slate-400/45" />
                <div className="absolute left-[28px] top-[93px] h-[33px] w-[35px] rounded-b-[13px] bg-slate-950 ring-[6px] ring-slate-400" />
                <div className="absolute right-[28px] top-[93px] h-[33px] w-[35px] rounded-b-[13px] bg-slate-950 ring-[6px] ring-slate-400" />
                <div className="absolute left-[62px] top-[109px] h-2 w-[100px] rounded-full bg-slate-900/78" />
              </div>
            )}

            <div className="absolute left-1/2 top-[86px] -translate-x-1/2 rounded-xl border border-cyan-200/80 bg-cyan-200/8 p-1 shadow-[0_0_22px_rgba(103,232,249,0.34)] transition duration-500 group-hover:scale-[1.02]">
              <div className="rounded-lg bg-white px-4 py-1.5 font-mono text-[13px] font-black text-slate-950 shadow-[0_8px_14px_rgba(15,23,42,0.28)] ring-1 ring-slate-200">
                {plateText}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-3 top-3 h-3 w-3 border-l border-t border-white/35" />
        <div className="absolute right-3 top-3 h-3 w-3 border-r border-t border-white/35" />
        <div className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-white/35" />
        <div className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-white/35" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(2,6,23,0.36)_100%)]" />
      </div>
    </article>
  );
}

export default function StaffVehicleExit() {
  const [licensePlate, setLicensePlate] = useState('');
  const [result, setResult] = useState(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isVisitor = result?.exitType === 'VISITOR';
  const isCompleted = result?.parkingStatus === 'COMPLETED';
  const canConfirmExit = Boolean(result) && !isCompleted && (!isVisitor || paymentConfirmed);
  const extractError = (requestError, fallback) =>
    requestError?.response?.data?.message || requestError?.response?.data?.error || fallback;

  const handleSearch = async (event) => {
    event?.preventDefault();
    const plate = licensePlate.trim();
    if (!plate) {
      setError('Vui lòng nhập biển số xe cần kiểm tra.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    setResult(null);
    setPaymentConfirmed(false);
    try {
      const data = await checkParkingExit(plate);
      setResult(data);
      setLicensePlate(data.licensePlate || plate.toUpperCase());
    } catch (requestError) {
      setError(extractError(requestError, 'Không tìm thấy phiên gửi xe đang hoạt động.'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmExit = async () => {
    if (!result || isCompleted) return;
    if (isVisitor && !paymentConfirmed) {
      setError('Vui lòng xác nhận đã nhận đủ tiền trước khi hoàn tất xe ra.');
      return;
    }
    setConfirming(true);
    setError('');
    try {
      const data = await confirmParkingExit(result.orderId, {
        paymentConfirmed: isVisitor ? paymentConfirmed : false,
        paymentMethod: isVisitor ? 'CASH' : null,
      });
      setResult(data);
      setSuccess(data.message || 'Đã hoàn tất thủ tục xe ra.');
    } catch (requestError) {
      setError(extractError(requestError, 'Không thể xác nhận xe ra. Vui lòng thử lại.'));
    } finally {
      setConfirming(false);
    }
  };

  const handleNewSearch = () => {
    setLicensePlate('');
    setResult(null);
    setPaymentConfirmed(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-full rounded-[30px] bg-[radial-gradient(circle_at_0%_0%,rgba(14,165,233,0.16),transparent_30%),linear-gradient(135deg,#eef7ff_0%,#f8fbff_48%,#eafdf7_100%)] p-3 text-slate-950 sm:p-4">
      <div className="mx-auto flex max-w-[1540px] flex-col gap-4">
        <header className="flex items-center justify-between gap-4 rounded-[24px] bg-white/58 px-3.5 py-2 shadow-[0_10px_28px_rgba(15,35,66,0.06)] ring-1 ring-white/70 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[18px] bg-slate-950 text-cyan-300 shadow-[0_12px_28px_rgba(15,23,42,0.18)] ring-1 ring-white/40">
              <CarFront className="h-6 w-6" strokeWidth={1.7} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600">Kiểm soát cổng ra</p>
              <h1 className="mt-0.5 text-lg font-black tracking-tight text-slate-950">Xác nhận xe ra</h1>
              <p className="mt-0.5 max-w-2xl text-sm font-semibold leading-5 text-slate-600">
                Nhập biển số để truy xuất phiên gửi, kiểm tra phí và mở cổng.
              </p>
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-2.5 rounded-[18px] bg-white/84 px-3 py-2 shadow-[0_10px_24px_rgba(15,35,66,0.06)] ring-1 ring-emerald-100 md:flex">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-black text-emerald-700">Cổng ra A đang hoạt động</span>
          </div>
        </header>

        <section className="grid items-start gap-4 xl:grid-cols-[minmax(340px,28%)_minmax(0,1fr)]">
          <aside className="space-y-4 xl:sticky xl:top-0">
            <form
              onSubmit={handleSearch}
              className="rounded-[28px] bg-white/92 p-4 shadow-[0_18px_42px_rgba(15,35,66,0.1)] ring-1 ring-slate-200/80 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-sky-600">Điều khiển</p>
                  <h2 className="mt-0.5 text-lg font-black tracking-tight text-slate-950">Kiểm tra xe ra</h2>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                  <ShieldCheck className="h-5 w-5" strokeWidth={1.7} />
                </span>
              </div>

              <label htmlFor="exit-license-plate" className="mt-4 block">
                <span className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Biển số</span>
                <div className="relative mt-1.5">
                  <CarFront className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-600" strokeWidth={1.7} />
                  <input
                    id="exit-license-plate"
                    value={licensePlate}
                    onChange={(event) => setLicensePlate(event.target.value.toUpperCase())}
                    placeholder="29HT-12345"
                    autoComplete="off"
                    className="h-12 w-full rounded-[18px] border-0 bg-slate-50 pl-12 pr-4 font-mono text-base font-black uppercase tracking-wide text-slate-950 outline-none ring-1 ring-slate-200 transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-300"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="group mt-4 flex h-12 w-full items-center justify-center gap-2.5 rounded-[18px] bg-sky-600 px-5 text-sm font-black text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)] transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-sky-700 active:scale-[0.98] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white/16 transition duration-300 group-hover:translate-x-0.5">
                  {loading ? <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2.2} /> : <Search className="h-4 w-4" strokeWidth={2.2} />}
                </span>
                {loading ? 'Đang kiểm tra' : 'Kiểm tra xe'}
              </button>
            </form>

            {result ? (
              <aside className="rounded-[30px] bg-white/92 p-4 shadow-[0_18px_42px_rgba(15,35,66,0.1)] ring-1 ring-sky-100 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-sky-600">Xác nhận xe ra</p>
                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">Chi tiết cần thu</h2>
                  </div>
                  <div className={`grid h-11 w-11 place-items-center rounded-[18px] ${isVisitor ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'}`}>
                    {isVisitor ? <Banknote className="h-6 w-6" strokeWidth={1.7} /> : <ShieldCheck className="h-6 w-6" strokeWidth={1.7} />}
                  </div>
                </div>

                <div className="mt-4 rounded-[24px] bg-slate-950 p-5 text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)]">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Tổng tiền</p>
                  <p className="mt-3 text-4xl font-black tracking-tight">{formatCurrency(result.fee?.amount)}</p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-300">{result.fee?.description}</p>
                </div>

                {isVisitor ? (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-3 rounded-[18px] bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-100">
                      <span className="font-semibold text-slate-500">Khung đầu</span>
                      <strong className="text-right text-slate-950">{result.fee?.firstBlockMinutes || 0} phút · {formatCurrency(result.fee?.firstBlockFee)}</strong>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-[18px] bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-100">
                      <span className="font-semibold text-slate-500">Khung phát sinh</span>
                      <strong className="text-right text-slate-950">{result.fee?.additionalBlocks || 0} · {formatCurrency(result.fee?.additionalFee)}</strong>
                    </div>
                    {!isCompleted ? (
                      <label className={`flex cursor-pointer items-start gap-3 rounded-[20px] p-4 transition ring-1 ${
                        paymentConfirmed
                          ? 'bg-emerald-50 ring-emerald-200'
                          : 'bg-amber-50 ring-amber-200'
                      }`}>
                        <input
                          type="checkbox"
                          checked={paymentConfirmed}
                          onChange={(event) => setPaymentConfirmed(event.target.checked)}
                          className="mt-0.5 h-5 w-5 rounded border-slate-300 accent-emerald-600"
                        />
                        <span>
                          <span className="block text-sm font-black text-slate-950">Đã nhận đủ tiền mặt</span>
                          <span className="mt-1 block text-xs leading-5 text-slate-600">Xác nhận trước khi hoàn tất và mở cổng cho xe.</span>
                        </span>
                      </label>
                    ) : (
                      <div className="rounded-[20px] bg-emerald-50 p-4 text-sm font-black text-emerald-800 ring-1 ring-emerald-100">
                        <CheckCircle2 className="mr-2 inline h-5 w-5" />
                        Đã hoàn tất thanh toán
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 rounded-[20px] bg-emerald-50 p-4 ring-1 ring-emerald-100">
                    <p className="flex items-center gap-2 text-sm font-black text-emerald-800">
                      <CheckCircle2 className="h-5 w-5" strokeWidth={1.8} />
                      Không cần thu tiền
                    </p>
                    <p className="mt-2 text-xs leading-5 text-emerald-700">Xe được miễn phí theo gói đã ghi nhận tại thời điểm vào bãi.</p>
                  </div>
                )}

                {isCompleted ? (
                  <button
                    type="button"
                    onClick={handleNewSearch}
                    className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[18px] bg-sky-600 px-5 text-sm font-black text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-sky-700 active:scale-[0.98]"
                  >
                    <Search className="h-5 w-5" strokeWidth={2} />
                    Kiểm tra xe tiếp theo
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmExit}
                    disabled={confirming || !canConfirmExit}
                    className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[18px] bg-sky-600 px-5 text-sm font-black text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-sky-700 active:scale-[0.98] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 disabled:shadow-none disabled:ring-1 disabled:ring-slate-200"
                  >
                    {confirming ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" strokeWidth={2} />}
                    {confirming ? 'Đang hoàn tất' : isVisitor ? 'Xác nhận thanh toán & cho xe ra' : 'Xác nhận miễn phí & cho xe ra'}
                  </button>
                )}
              </aside>
            ) : null}
          </aside>

          <main className="flex min-w-0 flex-col gap-4">
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {EXIT_CAMERA_FEEDS.map((feed) => (
                <ExitCameraCard key={feed.id} feed={feed} />
              ))}
            </section>

            {!result ? (
              <section className="grid min-h-[230px] place-items-center rounded-[28px] bg-white/72 p-8 text-center shadow-[0_18px_42px_rgba(15,35,66,0.08)] ring-1 ring-dashed ring-slate-200">
                <div className="max-w-md">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-[24px] bg-sky-50 text-sky-500 ring-1 ring-sky-100">
                    <Search className="h-8 w-8" strokeWidth={1.7} />
                  </div>
                  <h2 className="mt-4 text-lg font-black text-slate-950">Sẵn sàng tra cứu</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Thông tin xe, thời gian gửi và phí thanh toán sẽ xuất hiện tại đây.</p>
                </div>
              </section>
            ) : (
              <section className="rounded-[30px] bg-gradient-to-br from-sky-50 via-white to-slate-50 p-4 shadow-[0_18px_42px_rgba(15,35,66,0.1)] ring-1 ring-sky-100">
                <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[18px] bg-slate-950 text-cyan-300 shadow-[0_12px_28px_rgba(15,23,42,0.16)]">
                      <CarFront className="h-6 w-6" strokeWidth={1.7} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">Biển số xe</p>
                      <h2 className="mt-1 truncate font-mono text-3xl font-black tracking-tight text-slate-950">{result.licensePlate}</h2>
                    </div>
                  </div>
                  <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ring-1 ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                      : isVisitor
                        ? 'bg-amber-50 text-amber-700 ring-amber-200'
                        : 'bg-sky-50 text-sky-700 ring-sky-200'
                  }`}>
                    <BadgeCheck className="h-4 w-4" strokeWidth={1.8} />
                    {isCompleted ? 'Đã hoàn tất' : isVisitor ? 'Xe vãng lai' : 'Xe có gói'}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <InfoItem icon={ReceiptText} label="Mã lượt gửi" value={result.orderCode} />
                  <InfoItem icon={CarFront} label="Loại xe" value={result.vehicleType} />
                  <InfoItem icon={CreditCard} label="Thẻ vãng lai" value={result.visitorCardCode || 'Không sử dụng'} />
                  <InfoItem icon={Clock3} label="Thời gian vào" value={formatDateTime(result.entryTime)} />
                  <InfoItem icon={TimerReset} label="Thời gian gửi" value={formatDuration(result.durationMinutes)} accent />
                  <InfoItem icon={UserRound} label="Khách hàng" value={result.customerName || 'Khách vãng lai'} />
                </div>

                {!isVisitor && result.subscription ? (
                  <div className="mt-4 rounded-[24px] bg-gradient-to-r from-sky-600 to-cyan-600 p-4 text-white shadow-[0_16px_34px_rgba(14,165,233,0.18)] ring-1 ring-sky-200">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-sky-100">Gói đang áp dụng</p>
                        <h3 className="mt-1 text-xl font-black">{result.subscription.packageName || 'Gói gửi xe'}</h3>
                      </div>
                      <span className="w-fit rounded-full bg-white/15 px-3 py-1.5 text-xs font-black ring-1 ring-white/20">{result.subscription.status || 'ACTIVE'}</span>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
                        <p className="flex items-center gap-2 text-xs font-bold text-sky-100"><CalendarDays className="h-4 w-4" /> Bắt đầu</p>
                        <p className="mt-1 font-bold">{formatDateTime(result.subscription.startDate)}</p>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
                        <p className="flex items-center gap-2 text-xs font-bold text-sky-100"><CalendarDays className="h-4 w-4" /> Hết hạn</p>
                        <p className="mt-1 font-bold">{formatDateTime(result.subscription.endDate)}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </section>
            )}
          </main>
        </section>

        {error ? (
          <div className="rounded-[22px] bg-rose-50 px-5 py-4 text-sm font-bold text-rose-700 shadow-[0_12px_28px_rgba(244,63,94,0.08)] ring-1 ring-rose-100">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="flex items-center gap-3 rounded-[22px] bg-emerald-50 px-5 py-4 text-sm font-black text-emerald-800 shadow-[0_12px_28px_rgba(16,185,129,0.08)] ring-1 ring-emerald-100">
            <CheckCircle2 className="h-5 w-5" strokeWidth={1.8} />
            {success}
          </div>
        ) : null}

      </div>
    </div>
  );
}
