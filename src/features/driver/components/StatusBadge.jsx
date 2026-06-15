import { useTranslation } from 'react-i18next';

const statusStyles = {
  PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400', ring: 'ring-amber-100' },
  CONFIRMED: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400', ring: 'ring-emerald-100' },
  REJECTED: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400', ring: 'ring-red-100' },
  CANCELLED: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400', ring: 'ring-slate-200' },
  OPEN: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400', ring: 'ring-emerald-100' },
  FULL: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400', ring: 'ring-red-100' },
  PAID: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400', ring: 'ring-emerald-100' },
  FAILED: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400', ring: 'ring-red-100' },
};

const statusLabels = {
  PENDING: 'Đang chờ',
  CONFIRMED: 'Đã xác nhận',
  REJECTED: 'Bị từ chối',
  CANCELLED: 'Đã hủy',
  OPEN: 'Đang mở',
  FULL: 'Đầy',
  PAID: 'Đã thanh toán',
  FAILED: 'Thất bại',
};

export default function StatusBadge({ status, className = '' }) {
  const { t } = useTranslation();
  const config = statusStyles[status] || {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
    ring: 'ring-slate-200',
  };

  const label = statusLabels[status] || t(`status.${status}`, status);

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${config.bg} ${config.text} ${config.ring} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {label}
    </span>
  );
}
