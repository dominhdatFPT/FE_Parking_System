import { useTranslation } from 'react-i18next';
import Button from './Button';
import StatusBadge from './StatusBadge';

export default function ParkingLotCard({ area, onSelect }) {
  const { t } = useTranslation();
  const isFull = area.status === 'FULL' || area.availableSlots === 0;

  return (
    <div className={`group relative overflow-hidden rounded-2xl border bg-white shadow-[0_1px_3px_rgba(14,165,233,0.06)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(14,165,233,0.1)] hover:-translate-y-1 ${isFull ? 'border-red-100/80' : 'border-sky-100/40'}`}>
      <div className={`absolute inset-x-0 top-0 h-1 ${isFull ? 'bg-gradient-to-r from-red-400 to-rose-400' : 'bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4]'}`} />

      <div className="p-5 pt-6">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] text-white shadow-md transition-transform duration-300 group-hover:scale-110">
            <span className="material-symbols-outlined text-[22px]">local_parking</span>
          </div>
          {isFull && <StatusBadge status="FULL" />}
        </div>

        <h3 className="mt-4 text-[15px] font-bold text-slate-800">{area.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
          <span className="material-symbols-outlined text-[14px]">location_on</span>
          {area.address}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-slate-50 px-2 py-2.5 text-center">
            <p className="text-[10px] font-medium text-slate-400">{t('booking.floor')}</p>
            <p className="text-sm font-bold text-slate-700">{area.totalFloors}</p>
          </div>
          <div className="rounded-xl bg-slate-50 px-2 py-2.5 text-center">
            <p className="text-[10px] font-medium text-slate-400">Slot</p>
            <p className="text-sm font-bold text-slate-700">{area.totalSlots}</p>
          </div>
          <div className="rounded-xl bg-sky-50 px-2 py-2.5 text-center ring-1 ring-sky-100">
            <p className="text-[10px] font-medium text-sky-500">{t('booking.floorAvailable')}</p>
            <p className="text-sm font-bold text-sky-600">{area.availableSlots}</p>
          </div>
        </div>

        <Button
          variant={isFull ? 'secondary' : 'primary'}
          size="md"
          disabled={isFull}
          icon={isFull ? 'block' : 'check_circle'}
          className="mt-4 w-full justify-center"
          onClick={() => !isFull && onSelect(area)}
        >
          {isFull ? t('booking.full') : t('booking.parkingLot')}
        </Button>
      </div>
    </div>
  );
}
