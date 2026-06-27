import { useTranslation } from 'react-i18next';
import StatusBadge from './StatusBadge';
import { vietnamDayjs } from '../../../utils/dateTime';

export default function CurrentBookingPanel({ booking, loading }) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="space-y-3">
          <div className="h-5 w-32 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-32 animate-pulse rounded-xl bg-slate-50" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
          <span className="material-symbols-outlined text-[28px]">event_busy</span>
        </div>
        <p className="text-sm font-bold text-slate-600">{t('dashboard.empty')}</p>
        <p className="mt-1 text-xs text-slate-400">{t('dashboard.emptyDesc')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] text-white shadow-sm">
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
          </span>
          {t('dashboard.recentBookings')}
        </h3>
        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-4 rounded-xl bg-gradient-to-br from-slate-50 to-sky-50/30 p-4 space-y-2.5 ring-1 ring-slate-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">{t('payment.bookingId')}</span>
          <span className="font-bold text-sky-600">#{booking.id}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">{t('booking.vehicleType')}</span>
          <span className="font-semibold text-slate-700">{booking.vehicleType === 'MOTORBIKE' ? t('booking.motorcycle') : t('booking.car')}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">{t('booking.parkingLot')}</span>
          <span className="font-semibold text-slate-700">{booking.parkingAreaName}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">{t('booking.floor')}</span>
          <span className="font-semibold text-slate-700">{t('booking.floor')} {booking.floorNumber}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">{t('history.createdAt')}</span>
          <span className="font-semibold text-slate-700">{vietnamDayjs(booking.createdAt).format('HH:mm DD/MM/YYYY')}</span>
        </div>
      </div>

      <div className={`mt-3 flex items-start gap-2 rounded-xl p-3 text-xs leading-relaxed ${
        booking.status === 'PENDING' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100' :
        booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' :
        'bg-red-50 text-red-700 ring-1 ring-red-100'
      }`}>
        <span className="material-symbols-outlined mt-0.5 text-[16px]">
          {booking.status === 'PENDING' ? 'hourglass_top' : booking.status === 'CONFIRMED' ? 'check_circle' : 'error'}
        </span>
        {t('booking.pendingNote')}
      </div>
    </div>
  );
}
