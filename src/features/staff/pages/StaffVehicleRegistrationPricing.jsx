import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bike,
  CarFront,
  CheckCircle2,
  CircleDollarSign,
  Clock4,
  Coins,
  Crown,
  Flame,
  Loader2,
  MoonStar,
  Package,
  PencilLine,
  Percent,
  Receipt,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Tag,
  X,
  XCircle,
} from 'lucide-react';
import {
  getFeePackages,
  getVisitorFeeRates,
  toggleFeePackage,
  updateFeePackagePrice,
  updateVisitorFeeRate,
} from '../../../services/adminPricingService';

const VEHICLE_COLUMNS = [
  { key: 'MOTORBIKE', label: 'Xe máy', subLabel: '2 bánh', Icon: Bike, accent: 'from-sky-500 to-blue-600' },
  { key: 'CAR', label: 'Ô tô con', subLabel: 'Dưới 9 chỗ', Icon: CarFront, accent: 'from-indigo-500 to-blue-700' },
];

const PACKAGE_DURATIONS = [
  { durationMonths: 1, key: 'MONTHLY', label: 'Gói tháng', shortLabel: '1 tháng' },
  { durationMonths: 3, key: 'QUARTERLY', label: 'Gói quý', shortLabel: '3 tháng' },
  { durationMonths: 6, key: 'HALF_YEAR', label: 'Gói nửa năm', shortLabel: '6 tháng' },
  { durationMonths: 12, key: 'YEARLY', label: 'Gói năm', shortLabel: '12 tháng' },
];

const formatVND = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return '—';
  return `${number.toLocaleString('vi-VN')} đ`;
};

const formatMinutes = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return '—';
  return `${number.toLocaleString('vi-VN')} phút`;
};

function isMotorbikeType(item) {
  if (!item) return false;
  const name = String(item.vehicleTypeName || '').toLowerCase();
  if (name.includes('máy') || name.includes('motor') || name.includes('moto')) return true;
  return Number(item.vehicleTypeId) === 1;
}

function isCarType(item) {
  if (!item) return false;
  const name = String(item.vehicleTypeName || '').toLowerCase();
  if (name.includes('ô tô') || name.includes('oto') || name.includes('car')) return true;
  return Number(item.vehicleTypeId) === 2;
}

function getPackageByDuration(packages, vehicleTypeMatcher, durationMonths) {
  return packages.find((pkg) => vehicleTypeMatcher(pkg) && Number(pkg.durationMonths) === durationMonths) || null;
}

function PackageSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-3 h-7 w-32 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-3 h-5 w-20 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-6 h-9 w-full animate-pulse rounded-xl bg-slate-100" />
    </div>
  );
}

function VisitorRateSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="space-y-2 rounded-xl bg-slate-50 p-3">
            <div className="h-2.5 w-16 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-20 animate-pulse rounded-full bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="mt-5 h-9 w-full animate-pulse rounded-xl bg-slate-100" />
    </div>
  );
}

function PricingToast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => onClose(), 3200);
    return () => window.clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const Icon = isSuccess ? CheckCircle2 : XCircle;
  const colorClasses = isSuccess
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-rose-200 bg-rose-50 text-rose-700';

  return (
    <div
      role="status"
      className={`pointer-events-none fixed bottom-6 right-6 z-[1100] flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-semibold shadow-2xl backdrop-blur-md ${colorClasses}`}
    >
      <Icon size={18} />
      <span>{toast.message}</span>
    </div>
  );
}

function Toggle({ checked, disabled, onChange, label }) {
  return (
    <label
      className={`inline-flex select-none items-center gap-2 text-xs font-bold ${
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      }`}
      title={label}
    >
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
          checked ? 'bg-emerald-500' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={Boolean(checked)}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      <span className={checked ? 'text-emerald-700' : 'text-slate-500'}>
        {checked ? 'Đang bật' : 'Đang tắt'}
      </span>
    </label>
  );
}

function PackageCard({ pkg, onEdit, onToggle, toggling }) {
  const currentPrice = Number(pkg.currentPrice ?? pkg.price ?? 0);
  const originalPrice = Number(pkg.originalPrice ?? 0);
  const discountPercent = Number(pkg.discountPercent ?? 0);
  const hasDiscount = discountPercent > 0 && originalPrice > currentPrice;

  const badges = [];
  if (pkg.isPopular) badges.push({ label: 'Phổ biến nhất', Icon: Flame, className: 'bg-rose-50 text-rose-600 ring-rose-200' });
  if (pkg.isBestValue) badges.push({ label: 'Tiết kiệm nhất', Icon: Crown, className: 'bg-amber-50 text-amber-700 ring-amber-200' });

  return (
    <div className="relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-black text-slate-950">{pkg.name || 'Gói thẻ'}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-slate-500">
            <Clock4 size={12} />
            {pkg.durationMonths} tháng
          </p>
        </div>
        {badges.length > 0 && (
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            {badges.map(({ label, Icon, className }) => (
              <span
                key={label}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ring-1 ${className}`}
              >
                <Icon size={10} />
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Giá hiện tại</p>
        <p className="mt-1 text-2xl font-black text-slate-950">{formatVND(currentPrice)}</p>
        {hasDiscount && (
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-400 line-through">{formatVND(originalPrice)}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 ring-1 ring-emerald-200">
              <Percent size={10} />
              -{discountPercent}%
            </span>
          </div>
        )}
      </div>

      {pkg.benefits && (
        <p className="mt-3 line-clamp-2 text-[11px] font-semibold text-slate-500">{pkg.benefits}</p>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <Toggle
          checked={pkg.isActive}
          disabled={toggling}
          onChange={() => onToggle(pkg)}
          label="Bật/tắt gói"
        />
        <button
          type="button"
          onClick={() => onEdit(pkg)}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-3.5 text-xs font-black text-white shadow-sm shadow-sky-600/20 transition hover:bg-sky-700"
        >
          <PencilLine size={13} />
          Cập nhật giá
        </button>
      </div>
    </div>
  );
}

function PackageEditModal({ pkg, onClose, onSaved }) {
  const [originalPrice, setOriginalPrice] = useState(String(pkg?.originalPrice ?? ''));
  const [price, setPrice] = useState(String(pkg?.currentPrice ?? pkg?.price ?? ''));
  const [discountPercent, setDiscountPercent] = useState(String(pkg?.discountPercent ?? 0));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setOriginalPrice(String(pkg?.originalPrice ?? ''));
    setPrice(String(pkg?.currentPrice ?? pkg?.price ?? ''));
    setDiscountPercent(String(pkg?.discountPercent ?? 0));
    setError('');
  }, [pkg]);

  const originalNumber = Number(originalPrice);
  const priceNumber = Number(price);
  const discountNumber = Number(discountPercent);

  const handleOriginalChange = (value) => {
    setOriginalPrice(value);
    const o = Number(value);
    const p = Number(price);
    if (Number.isFinite(o) && o > 0 && Number.isFinite(p) && p >= 0) {
      const derived = Math.round(((o - p) / o) * 100);
      setDiscountPercent(String(Math.max(0, Math.min(100, derived))));
    }
  };

  const handlePriceChange = (value) => {
    setPrice(value);
    const o = Number(originalPrice);
    const p = Number(value);
    if (Number.isFinite(o) && o > 0 && Number.isFinite(p) && p >= 0) {
      const derived = Math.round(((o - p) / o) * 100);
      setDiscountPercent(String(Math.max(0, Math.min(100, derived))));
    }
  };

  const handleDiscountChange = (value) => {
    setDiscountPercent(value);
    const o = Number(originalPrice);
    const d = Number(value);
    if (Number.isFinite(o) && o > 0 && Number.isFinite(d)) {
      const safe = Math.max(0, Math.min(100, d));
      const derived = Math.round(o - (o * safe) / 100);
      setPrice(String(derived));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!pkg) return;

    if (!Number.isFinite(originalNumber) || originalNumber <= 0) {
      setError('Vui lòng nhập giá gốc hợp lệ.');
      return;
    }
    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      setError('Vui lòng nhập giá bán hợp lệ.');
      return;
    }
    if (priceNumber > originalNumber) {
      setError('Giá bán không được lớn hơn giá gốc.');
      return;
    }
    if (!Number.isFinite(discountNumber) || discountNumber < 0 || discountNumber > 100) {
      setError('Giảm giá phải nằm trong khoảng 0 – 100%.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await updateFeePackagePrice(pkg.feePackageId, {
        originalPrice: originalNumber,
        price: priceNumber,
        discountPercent: discountNumber,
      });
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể cập nhật giá gói.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1050] grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-600">Cập nhật giá gói</p>
            <h2 className="mt-1 text-lg font-black text-slate-950">Cập nhật giá — {pkg?.name || 'Gói thẻ'}</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {pkg?.vehicleTypeName} · {pkg?.durationMonths} tháng
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-6 py-5">
          <label className="block">
            <span className="text-xs font-black uppercase text-slate-500">Giá gốc (originalPrice)</span>
            <div className="relative mt-2">
              <CircleDollarSign size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min="0"
                required
                value={originalPrice}
                onChange={(event) => handleOriginalChange(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm font-black text-slate-800 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase text-slate-500">Giá bán (price)</span>
            <div className="relative mt-2">
              <Tag size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min="0"
                required
                value={price}
                onChange={(event) => handlePriceChange(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm font-black text-slate-800 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-400">Giá bán phải nhỏ hơn hoặc bằng giá gốc.</p>
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase text-slate-500">Giảm giá (%)</span>
            <div className="relative mt-2">
              <Percent size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={discountPercent}
                onChange={(event) => handleDiscountChange(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm font-black text-slate-800 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-400">
              Tự động tính từ giá gốc và giá bán (0 – 100).
            </p>
          </label>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="h-10 rounded-xl bg-white px-4 text-sm font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 text-sm font-black text-white shadow-sm shadow-sky-600/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CheckCircle2 size={14} />
            )}
            {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}

function VisitorRateCard({ rate, onEdit }) {
  const dailyCap = rate?.dailyCap;
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-gradient-to-br from-sky-50 to-white p-3 ring-1 ring-sky-100">
          <p className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-sky-600">
            <Clock4 size={11} />
            Block đầu
          </p>
          <p className="mt-1.5 text-sm font-black text-slate-900">
            {formatMinutes(rate?.firstBlockMinutes)}
          </p>
          <p className="mt-0.5 text-[11px] font-bold text-slate-500">
            Phí: <span className="font-black text-sky-700">{formatVND(rate?.firstBlockFee)}</span>
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white p-3 ring-1 ring-indigo-100">
          <p className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-indigo-600">
            <Receipt size={11} />
            Block tiếp theo
          </p>
          <p className="mt-1.5 text-sm font-black text-slate-900">
            {formatMinutes(rate?.nextBlockMinutes)}/block
          </p>
          <p className="mt-0.5 text-[11px] font-bold text-slate-500">
            Phí: <span className="font-black text-indigo-700">{formatVND(rate?.nextBlockFee)}</span>
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white p-3 ring-1 ring-emerald-100">
          <p className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600">
            <ShieldCheck size={11} />
            Giá trần/ngày
          </p>
          <p className="mt-1.5 text-sm font-black text-slate-900">
            {dailyCap ? formatVND(dailyCap) : 'Không giới hạn'}
          </p>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
            {dailyCap ? 'Áp dụng khi vượt trần' : 'Tùy chọn'}
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-violet-50 to-white p-3 ring-1 ring-violet-100">
          <p className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-violet-600">
            <MoonStar size={11} />
            Phí qua đêm
          </p>
          <p className="mt-1.5 text-sm font-black text-slate-900">
            {formatVND(rate?.overnightFee)}
          </p>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-400">Tính phí khi gửi qua ngày</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end">
        <button
          type="button"
          onClick={() => onEdit(rate)}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-3.5 text-xs font-black text-white shadow-sm shadow-sky-600/20 transition hover:bg-sky-700"
        >
          <PencilLine size={13} />
          Cập nhật giá
        </button>
      </div>
    </div>
  );
}

function VisitorRateEditModal({ rate, onClose, onSaved }) {
  const [firstBlockMinutes, setFirstBlockMinutes] = useState(String(rate?.firstBlockMinutes ?? ''));
  const [firstBlockFee, setFirstBlockFee] = useState(String(rate?.firstBlockFee ?? ''));
  const [nextBlockMinutes, setNextBlockMinutes] = useState(String(rate?.nextBlockMinutes ?? ''));
  const [nextBlockFee, setNextBlockFee] = useState(String(rate?.nextBlockFee ?? ''));
  const [dailyCap, setDailyCap] = useState(rate?.dailyCap == null ? '' : String(rate.dailyCap));
  const [overnightFee, setOvernightFee] = useState(String(rate?.overnightFee ?? ''));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFirstBlockMinutes(String(rate?.firstBlockMinutes ?? ''));
    setFirstBlockFee(String(rate?.firstBlockFee ?? ''));
    setNextBlockMinutes(String(rate?.nextBlockMinutes ?? ''));
    setNextBlockFee(String(rate?.nextBlockFee ?? ''));
    setDailyCap(rate?.dailyCap == null ? '' : String(rate.dailyCap));
    setOvernightFee(String(rate?.overnightFee ?? ''));
    setError('');
  }, [rate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!rate) return;

    const required = [
      ['firstBlockMinutes', firstBlockMinutes, 'Block đầu tiên'],
      ['firstBlockFee', firstBlockFee, 'Phí block đầu'],
      ['nextBlockMinutes', nextBlockMinutes, 'Block tiếp theo'],
      ['nextBlockFee', nextBlockFee, 'Phí block tiếp'],
      ['overnightFee', overnightFee, 'Phí qua đêm'],
    ];
    for (const [, value, label] of required) {
      if (value === '' || !Number.isFinite(Number(value)) || Number(value) < 0) {
        setError(`Vui lòng nhập ${label} hợp lệ.`);
        return;
      }
    }
    if (dailyCap !== '' && (!Number.isFinite(Number(dailyCap)) || Number(dailyCap) < 0)) {
      setError('Giá tối đa/ngày phải là số không âm.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await updateVisitorFeeRate(rate.vehicleTypeId, {
        firstBlockMinutes: Number(firstBlockMinutes),
        firstBlockFee: Number(firstBlockFee),
        nextBlockMinutes: Number(nextBlockMinutes),
        nextBlockFee: Number(nextBlockFee),
        dailyCap: dailyCap === '' ? null : Number(dailyCap),
        overnightFee: Number(overnightFee),
      });
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể cập nhật giá vãng lai.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1050] grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-600">Cập nhật giá vãng lai</p>
            <h2 className="mt-1 text-lg font-black text-slate-950">
              Cập nhật giá vãng lai — {rate?.vehicleTypeName || 'Loại xe'}
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Áp dụng cho xe không đăng ký thẻ định kỳ.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-4 overflow-y-auto px-6 py-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-black uppercase text-slate-500">Block đầu tiên (phút)</span>
            <input
              type="number"
              min="0"
              required
              value={firstBlockMinutes}
              onChange={(event) => setFirstBlockMinutes(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-800 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            />
          </label>
          <label className="block">
            <span className="text-xs font-black uppercase text-slate-500">Phí block đầu (đồng)</span>
            <input
              type="number"
              min="0"
              required
              value={firstBlockFee}
              onChange={(event) => setFirstBlockFee(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-800 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            />
          </label>
          <label className="block">
            <span className="text-xs font-black uppercase text-slate-500">Block tiếp theo (phút)</span>
            <input
              type="number"
              min="0"
              required
              value={nextBlockMinutes}
              onChange={(event) => setNextBlockMinutes(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-800 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            />
          </label>
          <label className="block">
            <span className="text-xs font-black uppercase text-slate-500">Phí block tiếp (đồng)</span>
            <input
              type="number"
              min="0"
              required
              value={nextBlockFee}
              onChange={(event) => setNextBlockFee(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-800 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            />
          </label>
          <label className="block">
            <span className="text-xs font-black uppercase text-slate-500">Giá tối đa/ngày (đồng)</span>
            <input
              type="number"
              min="0"
              value={dailyCap}
              onChange={(event) => setDailyCap(event.target.value)}
              placeholder="Không bắt buộc"
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-800 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            />
          </label>
          <label className="block">
            <span className="text-xs font-black uppercase text-slate-500">Phí qua đêm (đồng)</span>
            <input
              type="number"
              min="0"
              required
              value={overnightFee}
              onChange={(event) => setOvernightFee(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-800 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            />
          </label>
        </div>

        {error && (
          <div className="mx-6 mb-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="h-10 rounded-xl bg-white px-4 text-sm font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 text-sm font-black text-white shadow-sm shadow-sky-600/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CheckCircle2 size={14} />
            )}
            {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}

function PackageColumn({ column, packages, onEdit, onToggle, togglingId, loading }) {
  const matcher = column.key === 'MOTORBIKE' ? isMotorbikeType : isCarType;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-3 rounded-xl bg-gradient-to-r from-sky-50 via-white to-white p-3 ring-1 ring-sky-100">
        <span className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm ${column.accent}`}>
          <column.Icon size={17} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-950">{column.label}</p>
          <p className="truncate text-[11px] font-semibold text-slate-500">{column.subLabel}</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-3">
          {PACKAGE_DURATIONS.map((d) => (
            <PackageSkeleton key={d.key} />
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {PACKAGE_DURATIONS.map((d) => {
            const pkg = getPackageByDuration(packages, matcher, d.durationMonths);
            if (!pkg) {
              return (
                <div
                  key={d.key}
                  className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-center"
                >
                  <p className="text-xs font-black text-slate-500">{d.label}</p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-400">{d.shortLabel}</p>
                  <p className="mt-3 text-[11px] font-semibold italic text-slate-400">Chưa có dữ liệu gói.</p>
                </div>
              );
            }
            return (
              <PackageCard
                key={pkg.feePackageId}
                pkg={pkg}
                onEdit={onEdit}
                onToggle={onToggle}
                toggling={togglingId === pkg.feePackageId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function VisitorRateColumn({ column, rate, onEdit, loading }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-3 rounded-xl bg-gradient-to-r from-sky-50 via-white to-white p-3 ring-1 ring-sky-100">
        <span className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm ${column.accent}`}>
          <column.Icon size={17} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-950">{column.label}</p>
          <p className="truncate text-[11px] font-semibold text-slate-500">{column.subLabel}</p>
        </div>
      </div>
      {loading ? (
        <VisitorRateSkeleton />
      ) : rate ? (
        <VisitorRateCard rate={rate} onEdit={onEdit} />
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-center text-[11px] font-semibold italic text-slate-400">
          Chưa có cấu hình giá vãng lai cho loại xe này.
        </div>
      )}
    </div>
  );
}

export default function StaffVehicleRegistrationPricing() {
  const [packages, setPackages] = useState([]);
  const [visitorRates, setVisitorRates] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingRates, setLoadingRates] = useState(true);
  const [editingPackage, setEditingPackage] = useState(null);
  const [editingRate, setEditingRate] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
  }, []);

  const closeToast = useCallback(() => setToast(null), []);

  const handleApiError = useCallback(
    (error) => {
      if (error?.response?.status === 403) {
        showToast('error', 'Bạn không có quyền thực hiện thao tác này');
        return;
      }
      showToast('error', error?.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    },
    [showToast],
  );

  const fetchPackages = useCallback(async () => {
    setLoadingPackages(true);
    try {
      const data = await getFeePackages();
      setPackages(Array.isArray(data) ? data : []);
    } catch (error) {
      setPackages([]);
      handleApiError(error);
    } finally {
      setLoadingPackages(false);
    }
  }, [handleApiError]);

  const fetchVisitorRates = useCallback(async () => {
    setLoadingRates(true);
    try {
      const data = await getVisitorFeeRates();
      setVisitorRates(Array.isArray(data) ? data : []);
    } catch (error) {
      setVisitorRates([]);
      handleApiError(error);
    } finally {
      setLoadingRates(false);
    }
  }, [handleApiError]);

  useEffect(() => {
    fetchPackages();
    fetchVisitorRates();
  }, [fetchPackages, fetchVisitorRates]);

  const handleTogglePackage = async (pkg) => {
    if (!pkg?.feePackageId) return;
    setTogglingId(pkg.feePackageId);
    try {
      const result = await toggleFeePackage(pkg.feePackageId);
      const message = result?.message || (pkg.isActive ? 'Đã tắt gói thẻ' : 'Đã bật gói thẻ');
      showToast('success', message);
      await fetchPackages();
    } catch (error) {
      handleApiError(error);
    } finally {
      setTogglingId(null);
    }
  };

  const handlePackageSaved = async (message) => {
    showToast('success', message || 'Cập nhật giá thành công');
    await fetchPackages();
  };

  const handleRateSaved = async (message) => {
    showToast('success', message || 'Cập nhật giá vãng lai thành công');
    await fetchVisitorRates();
  };

  const handlePackageModalClose = () => setEditingPackage(null);
  const handleRateModalClose = () => setEditingRate(null);

  const ratesByVehicle = useMemo(() => {
    return {
      MOTORBIKE: visitorRates.find(isMotorbikeType) || null,
      CAR: visitorRates.find(isCarType) || null,
    };
  }, [visitorRates]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
      {/* SECTION 1 — GÓI THẺ ĐỊNH KỲ */}
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-sky-50/30 to-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-sky-700 ring-1 ring-sky-200">
              <Sparkles size={11} />
              Pricing · Gói thẻ
            </div>
            <h2 className="mt-2 text-lg font-black text-slate-950 sm:text-xl">Gói thẻ định kỳ</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
              Quản lý giá bán và trạng thái các gói thẻ tháng, quý, nửa năm và năm.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700 ring-1 ring-emerald-200">
              <Coins size={12} />
              {packages.filter((p) => p.isActive).length}/{packages.length} đang bật
            </span>
            <button
              type="button"
              onClick={fetchPackages}
              disabled={loadingPackages}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCcw size={13} className={loadingPackages ? 'animate-spin' : ''} />
              Làm mới
            </button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {VEHICLE_COLUMNS.map((col) => (
            <PackageColumn
              key={col.key}
              column={col}
              packages={packages}
              loading={loadingPackages}
              onEdit={setEditingPackage}
              onToggle={handleTogglePackage}
              togglingId={togglingId}
            />
          ))}
        </div>
      </section>

      {/* SECTION 2 — GIÁ VÃNG LAI */}
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-indigo-50/30 to-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-700 ring-1 ring-indigo-200">
              <Package size={11} />
              Pricing · Vãng lai
            </div>
            <h2 className="mt-2 text-lg font-black text-slate-950 sm:text-xl">Giá vãng lai (xe không đăng ký thẻ)</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
              Cấu hình phí theo block thời gian cho khách vãng lai theo từng loại xe.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchVisitorRates}
            disabled={loadingRates}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCcw size={13} className={loadingRates ? 'animate-spin' : ''} />
            Làm mới
          </button>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {VEHICLE_COLUMNS.map((col) => (
            <VisitorRateColumn
              key={col.key}
              column={col}
              rate={ratesByVehicle[col.key]}
              loading={loadingRates}
              onEdit={setEditingRate}
            />
          ))}
        </div>
      </section>

      {editingPackage && (
        <PackageEditModal
          pkg={editingPackage}
          onClose={handlePackageModalClose}
          onSaved={() => handlePackageSaved('Cập nhật giá thành công')}
        />
      )}

      {editingRate && (
        <VisitorRateEditModal
          rate={editingRate}
          onClose={handleRateModalClose}
          onSaved={() => handleRateSaved('Cập nhật giá vãng lai thành công')}
        />
      )}

      <PricingToast toast={toast} onClose={closeToast} />
    </div>
  );
}
