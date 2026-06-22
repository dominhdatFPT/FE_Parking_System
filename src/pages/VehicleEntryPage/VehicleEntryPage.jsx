import { useMemo, useState } from 'react';
import {
  AlertCircle,
  Bike,
  Camera,
  CarFront,
  ChevronDown,
  CheckCircle2,
  Clock3,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { checkParkingEntry, confirmParkingEntry } from '../../services/staffService';
import { formatVietnamDateTime } from '../../utils/dateTime';

const CAMERA_FEEDS = [
  { id: '01', title: 'Trước xe', status: 'Captured', angle: 'FRONT' },
  { id: '02', title: 'Sau xe', status: 'Live', angle: 'REAR' },
];

const MERCEDES_FRONT_IMAGE_URL = 'https://freepngimg.com/save/22102-mercedes-front-file/2048x1360';

const STATUS_THEME = {
  ready: {
    icon: CheckCircle2,
    label: 'Sẵn sàng cho vào',
    barrier: 'Sẵn sàng mở barrier',
    badgeClass: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    shellClass: 'from-emerald-50 via-white to-cyan-50/70 ring-emerald-100',
    accentClass: 'bg-emerald-500',
  },
  waiting: {
    icon: Clock3,
    label: 'Chờ kiểm tra',
    barrier: 'Barrier đang chờ xác nhận',
    badgeClass: 'bg-sky-50 text-sky-700 ring-sky-200',
    shellClass: 'from-sky-50 via-white to-slate-50 ring-sky-100',
    accentClass: 'bg-sky-500',
  },
  error: {
    icon: AlertCircle,
    label: 'Không hợp lệ',
    barrier: 'Cần kiểm tra lại dữ liệu',
    badgeClass: 'bg-rose-50 text-rose-700 ring-rose-200',
    shellClass: 'from-rose-50 via-white to-slate-50 ring-rose-100',
    accentClass: 'bg-rose-500',
  },
};

const formatTime = (value) => (value ? new Date(value).toLocaleString('vi-VN') : 'Chưa kiểm tra');

const getVehicleLabel = (value) => {
  if (value === 'MOTORBIKE' || value === 'Xe máy') return 'Xe máy';
  if (value === 'CAR' || value === 'Ô tô') return 'Ô tô';
  return value || 'Chưa chọn';
};

function getStatusKey(result, error) {
  if (error || result?.entryType === 'INVALID') return 'error';
  if (result?.canConfirm) return 'ready';
  return 'waiting';
}

function CameraCard({ feed }) {
  const live = feed.status === 'Live';
  const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const plateText = feed.angle === 'FRONT' ? '29A-000.00' : '29A-000.01';

  return (
    <article
      className={`group relative h-[245px] overflow-hidden rounded-[26px] bg-gradient-to-br p-[2px] shadow-[0_16px_38px_rgba(15,35,66,0.12)] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] 2xl:h-[265px] ${
        live
          ? 'from-sky-300/80 via-cyan-200/40 to-slate-100 ring-1 ring-sky-300/70 hover:shadow-[0_22px_55px_rgba(14,165,233,0.22)]'
          : 'from-emerald-300/80 via-cyan-200/40 to-slate-100 ring-1 ring-emerald-300/70'
      }`}
    >
      <div className="relative h-full overflow-hidden rounded-[24px] bg-[#08111b] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_62%,rgba(125,211,252,0.2),transparent_26%),linear-gradient(180deg,#10283b_0%,#0a1724_46%,#050b13_100%)]" />
        <div className="absolute inset-0 opacity-[0.2] [background-image:radial-gradient(rgba(203,213,225,0.35)_1px,transparent_1px)] [background-size:6px_6px]" />
        <div className="absolute inset-x-0 bottom-0 h-[66%] bg-[linear-gradient(160deg,transparent_0_34%,rgba(148,163,184,0.18)_34.4%,transparent_35.1%_63%,rgba(148,163,184,0.16)_63.4%,transparent_64%),linear-gradient(180deg,rgba(15,23,42,0.16),rgba(2,6,23,0.58))]" />
        <div className="absolute left-1/2 top-10 h-[220px] w-[72%] -translate-x-1/2 rounded-[50%] bg-cyan-200/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.1] [background-image:linear-gradient(rgba(226,232,240,0.42)_1px,transparent_1px)] [background-size:100%_4px]" />
        <div className="absolute bottom-7 left-1/2 h-px w-[84%] -translate-x-1/2 bg-cyan-100/16" />
        <div className="absolute bottom-8 left-[18%] h-[150px] w-px origin-bottom -skew-x-[24deg] bg-cyan-100/16" />
        <div className="absolute bottom-8 right-[18%] h-[150px] w-px origin-bottom skew-x-[24deg] bg-cyan-100/16" />
        <div className="absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 animate-pulse bg-cyan-200/6 blur-xl" />

        <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-2xl bg-slate-950/48 px-3 py-2 text-[11px] font-semibold text-slate-100 shadow-[0_10px_24px_rgba(0,0,0,0.24)] ring-1 ring-cyan-100/15 backdrop-blur">
          <Camera className="h-3.5 w-3.5 text-cyan-200" strokeWidth={1.7} />
          <span className="leading-none">Camera {feed.id}</span>
        </div>

        <div className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-2xl bg-slate-950/48 px-3 py-2 text-[10px] font-black text-slate-200 shadow-[0_10px_24px_rgba(0,0,0,0.22)] ring-1 ring-cyan-100/15 backdrop-blur">
            <span className="font-mono text-xs text-white">{time}</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-slate-950/48 px-3 py-2 text-[10px] font-black text-slate-200 shadow-[0_10px_24px_rgba(0,0,0,0.22)] ring-1 ring-cyan-100/15 backdrop-blur">
            <span className={`h-2 w-2 rounded-full ${live ? 'animate-pulse bg-sky-300 shadow-[0_0_14px_rgba(125,211,252,0.85)]' : 'bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.75)]'}`} />
            <span className="text-cyan-200">FPS 30</span>
          </div>
        </div>

        <div className="absolute inset-x-8 bottom-14 top-14 flex items-end justify-center">
          <div className="relative h-[142px] w-[270px] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-1">
            <div className="absolute -inset-x-4 -top-4 bottom-0 animate-pulse rounded-[28px] border border-cyan-300/35 shadow-[0_0_22px_rgba(103,232,249,0.12)]" />
            <div className="absolute -left-4 -top-4 h-5 w-5 rounded-tl-2xl border-l-2 border-t-2 border-cyan-200/75" />
            <div className="absolute -right-4 -top-4 h-5 w-5 rounded-tr-2xl border-r-2 border-t-2 border-cyan-200/75" />
            <div className="absolute -bottom-0 -left-4 h-5 w-5 rounded-bl-2xl border-b-2 border-l-2 border-cyan-200/75" />
            <div className="absolute -bottom-0 -right-4 h-5 w-5 rounded-br-2xl border-b-2 border-r-2 border-cyan-200/75" />
            <div className="absolute left-1/2 top-[116px] h-9 w-[258px] -translate-x-1/2 rounded-full bg-black/55 blur-xl" />
            {feed.angle === 'FRONT' ? (
              <img
                src={MERCEDES_FRONT_IMAGE_URL}
                alt="Mercedes-Benz front view detected by AI camera"
                className="absolute left-1/2 top-1 h-[142px] w-[292px] -translate-x-1/2 object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.5)]"
                draggable="false"
              />
            ) : (
              <div className="absolute left-1/2 top-2 h-[132px] w-[232px] -translate-x-1/2 drop-shadow-[0_18px_22px_rgba(0,0,0,0.5)]">
                <div className="absolute left-1/2 top-[108px] h-7 w-[204px] -translate-x-1/2 rounded-full bg-black/42 blur-lg" />
                <div className="absolute left-[42px] right-[42px] top-1 h-[54px] rounded-t-[28px] rounded-b-[10px] bg-gradient-to-b from-slate-100 via-slate-300 to-slate-500 shadow-[inset_0_2px_8px_rgba(255,255,255,0.55)] ring-1 ring-white/45" />
                <div className="absolute left-[64px] right-[64px] top-0 h-[40px] rounded-t-[26px] rounded-b-[12px] bg-gradient-to-b from-slate-900/88 via-slate-700/78 to-slate-500/52 ring-1 ring-cyan-100/25" />
                <div className="absolute left-[22px] right-[22px] top-[40px] h-[68px] rounded-t-[18px] rounded-b-[16px] bg-gradient-to-b from-white via-slate-200 to-slate-500 shadow-[0_18px_34px_rgba(0,0,0,0.42)] ring-1 ring-white/45" />
                <div className="absolute left-[32px] right-[32px] top-[60px] h-px bg-slate-400/45" />
                <div className="absolute left-[38px] top-[56px] h-[24px] w-[58px] rounded-l-[18px] rounded-r-lg bg-gradient-to-r from-red-700 via-rose-400 to-red-500 shadow-[0_0_16px_rgba(248,113,113,0.5)]" />
                <div className="absolute right-[38px] top-[56px] h-[24px] w-[58px] rounded-r-[18px] rounded-l-lg bg-gradient-to-r from-red-500 via-rose-400 to-red-700 shadow-[0_0_16px_rgba(248,113,113,0.5)]" />
                <div className="absolute left-1/2 top-[54px] h-[20px] w-[20px] -translate-x-1/2 rounded-full bg-slate-100 shadow-sm ring-[3px] ring-slate-500">
                  <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-500" />
                </div>
                <div className="absolute left-1/2 top-[82px] h-[27px] w-[112px] -translate-x-1/2 rounded-lg bg-gradient-to-b from-slate-100 to-slate-300 shadow-[inset_0_1px_6px_rgba(255,255,255,0.55)] ring-1 ring-slate-400/45" />
                <div className="absolute left-[28px] top-[96px] h-[34px] w-[36px] rounded-b-[13px] bg-slate-950 ring-[6px] ring-slate-400" />
                <div className="absolute right-[28px] top-[96px] h-[34px] w-[36px] rounded-b-[13px] bg-slate-950 ring-[6px] ring-slate-400" />
                <div className="absolute left-[64px] top-[113px] h-2 w-[104px] rounded-full bg-slate-900/78" />
                <div className="absolute left-[50px] top-[98px] h-2 w-8 rounded-full bg-slate-300/80" />
                <div className="absolute right-[50px] top-[98px] h-2 w-8 rounded-full bg-slate-300/80" />
              </div>
            )}

            <div className="absolute left-1/2 top-[91px] -translate-x-1/2 rounded-xl border border-cyan-200/80 bg-cyan-200/8 p-1 shadow-[0_0_22px_rgba(103,232,249,0.34)] transition duration-500 group-hover:scale-[1.02]">
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

export default function VehicleEntryPage() {
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleType, setVehicleType] = useState('MOTORBIKE');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  const statusKey = getStatusKey(result, error);
  const theme = STATUS_THEME[statusKey];
  const StatusIcon = theme.icon;
  const plateRequiredError = Boolean(error) && !licensePlate.trim();

  const data = useMemo(() => ({
    plate: result?.licensePlate || licensePlate || 'Chưa có biển số',
    type: result || vehicleType ? getVehicleLabel(result?.vehicleType || vehicleType) : 'Chưa chọn',
    customer: !result
      ? 'Chưa có dữ liệu'
      : result.entryType === 'MONTHLY'
        ? 'Khách gói tháng'
        : result.entryType === 'VISITOR'
          ? 'Khách vãng lai'
          : 'Không hợp lệ',
    time: formatTime(result?.entryTime || result?.createdAt),
    canConfirm: Boolean(result?.canConfirm),
  }), [licensePlate, result, vehicleType]);

  const check = async (event) => {
    event?.preventDefault();
    const plate = licensePlate.trim().toUpperCase();
    if (!plate) {
      setError('Vui lòng nhập biển số.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    try {
      setResult(await checkParkingEntry(plate, vehicleType || null));
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Không thể kiểm tra biển số.');
    } finally {
      setLoading(false);
    }
  };

  const confirm = async () => {
    if (!result?.canConfirm) return;

    setConfirming(true);
    setError('');
    try {
      setResult(await confirmParkingEntry({ ...result, vehicleType: vehicleType || result.vehicleType }));
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Không thể xác nhận xe vào.');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="h-full overflow-hidden rounded-[30px] bg-[radial-gradient(circle_at_0%_0%,rgba(14,165,233,0.16),transparent_30%),linear-gradient(135deg,#eef7ff_0%,#f8fbff_48%,#eafdf7_100%)] p-3 text-slate-950 sm:p-4">
      <div className="mx-auto flex h-full max-w-[1540px] flex-col">
        <header className="mb-3 flex shrink-0 items-center justify-between gap-4 rounded-[24px] bg-white/58 px-3.5 py-2 shadow-[0_10px_28px_rgba(15,35,66,0.06)] ring-1 ring-white/70 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[18px] bg-slate-950 text-cyan-300 shadow-[0_12px_28px_rgba(15,23,42,0.18)] ring-1 ring-white/40">
              <CarFront className="h-6 w-6" strokeWidth={1.7} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600">Smart parking gate</p>
              <p className="mt-0.5 max-w-2xl text-sm font-semibold leading-5 text-slate-600">
                Kiểm tra biển số và xác nhận phương tiện vào bãi
              </p>
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-2.5 rounded-[18px] bg-white/84 px-3 py-2 shadow-[0_10px_24px_rgba(15,35,66,0.06)] ring-1 ring-emerald-100 md:flex">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-black text-emerald-700">Cổng vào A đang hoạt động</span>
          </div>
        </header>

        <section className="grid min-h-0 flex-1 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(340px,28%)_minmax(0,1fr)]">
          <aside className="min-h-0 xl:sticky xl:top-0">
            <form
              onSubmit={check}
              className="rounded-[28px] bg-white/92 p-4 shadow-[0_18px_42px_rgba(15,35,66,0.1)] ring-1 ring-slate-200/80 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-sky-600">Điều khiển</p>
                  <h2 className="mt-0.5 text-lg font-black tracking-tight text-slate-950">Kiểm tra biển số</h2>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                  <ShieldCheck className="h-5 w-5" strokeWidth={1.7} />
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <label className="block">
                  <span className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Biển số</span>
                  <div className="relative mt-1.5">
                    <input
                      autoFocus
                      value={licensePlate}
                      onChange={(event) => {
                        setLicensePlate(event.target.value.toUpperCase());
                        setResult(null);
                        setError('');
                      }}
                      placeholder="29HT-12345"
                      className={`h-12 w-full rounded-[18px] border-0 bg-slate-50 px-4 font-mono text-base font-black uppercase tracking-wide text-slate-950 outline-none ring-1 transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
                        plateRequiredError
                          ? 'ring-rose-300 focus:ring-rose-300'
                          : 'ring-slate-200 focus:ring-sky-300'
                      }`}
                    />
                  </div>
                  {plateRequiredError ? (
                    <p className="mt-2 rounded-2xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 ring-1 ring-rose-100">
                      Vui lòng nhập biển số.
                    </p>
                  ) : null}
                </label>

                <label className="block">
                  <span className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Loại xe</span>
                  <div className="group relative mt-1.5">
                    <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-sky-600">
                      {vehicleType === 'CAR' ? <CarFront className="h-5 w-5" strokeWidth={1.7} /> : <Bike className="h-5 w-5" strokeWidth={1.7} />}
                    </div>
                    <select
                      value={vehicleType}
                      onChange={(event) => {
                        setVehicleType(event.target.value);
                        setResult(null);
                        setError('');
                      }}
                      className="h-12 w-full cursor-pointer appearance-none rounded-[18px] border-0 bg-white/88 pl-12 pr-14 text-sm font-black text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_22px_rgba(15,35,66,0.04)] outline-none ring-1 ring-slate-200/90 transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white hover:ring-sky-200 focus:bg-white focus:ring-2 focus:ring-sky-300"
                    >
                      <option value="MOTORBIKE">Xe máy</option>
                      <option value="CAR">Ô tô</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-2xl bg-slate-100 text-slate-500 ring-1 ring-slate-200 transition duration-300 group-focus-within:bg-sky-50 group-focus-within:text-sky-600 group-focus-within:ring-sky-200">
                      <ChevronDown className="h-4 w-4" strokeWidth={2} />
                    </div>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group mt-4 flex h-12 w-full items-center justify-center gap-2.5 rounded-[18px] bg-sky-600 px-5 text-sm font-black text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)] transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-sky-700 active:scale-[0.98] disabled:translate-y-0 disabled:opacity-70"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white/16 transition duration-300 group-hover:translate-x-0.5">
                  <Search className="h-4 w-4" strokeWidth={2.2} />
                </span>
                {loading ? 'Đang kiểm tra' : 'Kiểm tra biển số'}
              </button>
            </form>
          </aside>

          <main className="flex min-h-0 flex-col">
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {CAMERA_FEEDS.map((feed) => (
                <CameraCard key={feed.id} feed={feed} />
              ))}
            </section>

            <section
              className={`relative mt-4 overflow-hidden rounded-[30px] bg-gradient-to-br ${theme.shellClass} p-4 shadow-[0_18px_42px_rgba(15,35,66,0.1)] ring-1`}
            >
              <div className={`absolute inset-y-4 left-0 w-1.5 rounded-r-full ${theme.accentClass}`} />
              <div className="relative">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ${theme.badgeClass} ring-1`}>
                      <StatusIcon className="h-4 w-4" strokeWidth={1.8} />
                      {theme.label}
                    </span>
                  </div>

                  <h2 className="mt-3 truncate font-mono text-[2.4rem] font-black leading-none tracking-tight text-slate-950 lg:text-[2.6rem]">
                    {data.plate}
                  </h2>

                  {error && !plateRequiredError ? (
                    <p className="mt-3 rounded-2xl bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700 ring-1 ring-rose-100">
                      {error}
                    </p>
                  ) : null}

                  <div className="mt-3.5 grid items-stretch gap-3 md:grid-cols-[repeat(3,minmax(0,1fr))_300px]">
                    {[
                      { label: 'Loại xe', value: data.type },
                      { label: 'Loại khách', value: data.customer },
                      { label: 'Thời gian vào', value: data.time },
                    ].map((item) => (
                      <div key={item.label} className="rounded-[20px] bg-white/76 px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] ring-1 ring-slate-200/70">
                        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">{item.label}</p>
                        <p className="mt-1 truncate text-sm font-black text-slate-900">{item.value}</p>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={confirm}
                      disabled={!data.canConfirm || confirming}
                      className={`flex min-h-[76px] w-full items-center justify-center gap-2 rounded-[20px] px-4 text-base font-black transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] disabled:active:scale-100 ${
                        data.canConfirm
                          ? 'bg-sky-600 text-white shadow-[0_14px_28px_rgba(14,165,233,0.24)] hover:-translate-y-0.5 hover:bg-sky-700'
                          : 'cursor-not-allowed bg-slate-100 text-slate-500 ring-1 ring-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
                      {confirming ? 'Đang xác nhận' : 'Xác nhận cho vào'}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </section>
      </div>
    </div>
  );
}
