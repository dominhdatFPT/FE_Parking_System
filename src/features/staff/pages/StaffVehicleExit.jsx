import React, { useState } from 'react';
import {
  BadgeCheck, Banknote, CalendarDays, CarFront, CheckCircle2, Clock3,
  CreditCard, LoaderCircle, ReceiptText, Search, ShieldCheck,
  TimerReset, UserRound,
} from 'lucide-react';
import { checkParkingExit, confirmParkingExit } from '../../../services/staffService';

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')} ₫`;

const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
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
    <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 shadow-sm shadow-slate-200/30">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
        <Icon className="h-4 w-4" />{label}
      </div>
      <p className={`mt-2 truncate text-base font-bold ${accent ? 'text-sky-700' : 'text-slate-900'}`}>
        {value || '—'}
      </p>
    </div>
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
    <div className="mx-auto max-w-[1480px] space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-sky-100 bg-gradient-to-br from-white via-sky-50/70 to-cyan-100/60 p-6 shadow-[0_24px_70px_rgba(14,165,233,0.10)] sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-sky-300/25 blur-3xl" />
        <div className="relative grid gap-8 xl:grid-cols-[0.8fr_1.2fr] xl:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
              <ShieldCheck className="h-4 w-4" /> Kiểm soát cổng ra
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Xác nhận xe ra</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Nhập biển số để truy xuất đúng phiên đang gửi, kiểm tra gói hoặc số tiền cần thu trước khi mở cổng.
            </p>
          </div>
          <form onSubmit={handleSearch} className="rounded-3xl border border-white/90 bg-white/85 p-3 shadow-xl shadow-sky-900/5 backdrop-blur-xl">
            <label htmlFor="exit-license-plate" className="sr-only">Biển số xe</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <CarFront className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-600" />
                <input id="exit-license-plate" value={licensePlate}
                  onChange={(event) => setLicensePlate(event.target.value.toUpperCase())}
                  placeholder="Nhập biển số, ví dụ: 51A-123.45" autoComplete="off"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-base font-bold uppercase tracking-wide text-slate-950 outline-none transition placeholder:font-medium placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
              </div>
              <button type="submit" disabled={loading}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-7 text-sm font-black text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                {loading ? 'Đang kiểm tra' : 'Kiểm tra xe'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-800">{error}</div> : null}
      {success ? <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-800"><CheckCircle2 className="h-5 w-5" />{success}</div> : null}

      {!result ? (
        <section className="grid min-h-[330px] place-items-center rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-8 text-center shadow-sm">
          <div className="max-w-md">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-slate-100 text-slate-400"><Search className="h-9 w-9" /></div>
            <h2 className="mt-5 text-xl font-black text-slate-900">Sẵn sàng tra cứu</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Thông tin xe, thời gian gửi, gói sử dụng và phí thanh toán sẽ xuất hiện tại đây.</p>
          </div>
        </section>
      ) : (
        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/15"><CarFront className="h-7 w-7" /></div>
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Biển số xe</p><h2 className="mt-1 text-3xl font-black tracking-wide text-slate-950">{result.licensePlate}</h2></div>
              </div>
              <span className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-black ${isCompleted ? 'bg-emerald-100 text-emerald-800' : isVisitor ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>
                <BadgeCheck className="h-4 w-4" />{isCompleted ? 'Đã hoàn tất' : isVisitor ? 'Xe vãng lai' : 'Xe có gói'}
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem icon={ReceiptText} label="Mã lượt gửi" value={result.orderCode} />
              <InfoItem icon={CarFront} label="Loại xe" value={result.vehicleType} />
              <InfoItem icon={CreditCard} label="Thẻ vãng lai" value={result.visitorCardCode || 'Không sử dụng'} />
              <InfoItem icon={Clock3} label="Thời gian vào" value={formatDateTime(result.entryTime)} />
              <InfoItem icon={TimerReset} label="Thời gian gửi" value={formatDuration(result.durationMinutes)} accent />
              <InfoItem icon={UserRound} label="Khách hàng" value={result.customerName || 'Khách vãng lai'} />
            </div>
            {!isVisitor && result.subscription ? (
              <div className="mt-5 rounded-3xl border border-sky-200 bg-gradient-to-r from-sky-600 to-cyan-600 p-5 text-white shadow-lg shadow-sky-600/15">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-100">Gói đang áp dụng</p><h3 className="mt-2 text-2xl font-black">{result.subscription.packageName || 'Gói gửi xe'}</h3></div>
                  <span className="w-fit rounded-full bg-white/15 px-3 py-1.5 text-xs font-black ring-1 ring-white/20">{result.subscription.status || 'ACTIVE'}</span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15"><p className="flex items-center gap-2 text-xs font-bold text-sky-100"><CalendarDays className="h-4 w-4" /> Bắt đầu</p><p className="mt-2 font-bold">{formatDateTime(result.subscription.startDate)}</p></div>
                  <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15"><p className="flex items-center gap-2 text-xs font-bold text-sky-100"><CalendarDays className="h-4 w-4" /> Hết hạn</p><p className="mt-2 font-bold">{formatDateTime(result.subscription.endDate)}</p></div>
                </div>
              </div>
            ) : null}
          </div>

          <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Thanh toán tại cổng</p><h2 className="mt-1 text-xl font-black text-slate-950">Chi tiết cần thu</h2></div>
              <div className={`grid h-11 w-11 place-items-center rounded-2xl ${isVisitor ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{isVisitor ? <Banknote className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}</div>
            </div>
            <div className={`mt-5 rounded-3xl p-5 ${isVisitor ? 'bg-slate-950 text-white' : 'bg-emerald-600 text-white'}`}>
              <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-70">Tổng tiền</p>
              <p className="mt-3 text-4xl font-black tracking-tight">{formatCurrency(result.fee?.amount)}</p>
              <p className="mt-3 text-sm leading-6 opacity-75">{result.fee?.description}</p>
            </div>
            {isVisitor ? (
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm"><span className="text-slate-500">Khung đầu</span><strong className="text-slate-900">{result.fee?.firstBlockMinutes || 0} phút · {formatCurrency(result.fee?.firstBlockFee)}</strong></div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm"><span className="text-slate-500">Khung phát sinh</span><strong className="text-slate-900">{result.fee?.additionalBlocks || 0} · {formatCurrency(result.fee?.additionalFee)}</strong></div>
                {!isCompleted ? (
                  <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${paymentConfirmed ? 'border-emerald-300 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                    <input type="checkbox" checked={paymentConfirmed} onChange={(event) => setPaymentConfirmed(event.target.checked)} className="mt-0.5 h-5 w-5 rounded border-slate-300 accent-emerald-600" />
                    <span><span className="block text-sm font-black text-slate-900">Đã nhận đủ tiền mặt</span><span className="mt-1 block text-xs leading-5 text-slate-600">Xác nhận trước khi hoàn tất và mở cổng cho xe.</span></span>
                  </label>
                ) : null}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p className="flex items-center gap-2 text-sm font-black text-emerald-800"><CheckCircle2 className="h-5 w-5" /> Không cần thu tiền</p><p className="mt-2 text-xs leading-5 text-emerald-700">Xe được miễn phí theo gói đã ghi nhận tại thời điểm vào bãi.</p></div>
            )}
            {isCompleted ? (
              <button type="button" onClick={handleNewSearch} className="mt-5 w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white hover:bg-slate-800">Kiểm tra xe tiếp theo</button>
            ) : (
              <button type="button" onClick={handleConfirmExit} disabled={confirming || (isVisitor && !paymentConfirmed)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">
                {confirming ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                {confirming ? 'Đang hoàn tất' : isVisitor ? 'Xác nhận thanh toán & cho xe ra' : 'Xác nhận miễn phí & cho xe ra'}
              </button>
            )}
          </aside>
        </section>
      )}
    </div>
  );
}
