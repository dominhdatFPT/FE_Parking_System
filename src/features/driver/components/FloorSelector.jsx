import { useTranslation } from 'react-i18next';

export default function FloorSelector({ floors, selectedFloor, onSelect }) {
  const { t } = useTranslation();

  if (!floors || floors.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-6 text-sm text-slate-400">
        <span className="material-symbols-outlined mr-2 text-[18px]">layers</span>
        {t('booking.selectFloor')}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{t('booking.step2')}</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {floors.map((floor) => {
          const noSlot = floor.availableSlots === 0;
          const isActive = selectedFloor === floor.floorNumber;
          return (
            <button
              key={floor.floorNumber}
              type="button"
              disabled={noSlot}
              onClick={() => onSelect(floor.floorNumber)}
              className={`group relative flex flex-col items-center rounded-xl border-2 p-3 transition-all duration-200 ${
                noSlot
                  ? 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-50'
                  : isActive
                    ? 'border-[#0EA5E9] bg-sky-50 shadow-md shadow-sky-200/40'
                    : 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm'
              }`}
            >
              {isActive && (
                <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] shadow-sm">
                  <span className="material-symbols-outlined text-[12px] text-white">check</span>
                </div>
              )}
              <span className={`text-lg font-bold ${isActive ? 'text-sky-600' : noSlot ? 'text-slate-300' : 'text-slate-700'}`}>
                T{floor.floorNumber}
              </span>
              <span className={`mt-1 text-[11px] font-medium ${noSlot ? 'text-slate-300' : isActive ? 'text-sky-500' : 'text-emerald-500'}`}>
                {noSlot ? t('booking.floorFull') : `${floor.availableSlots} ${t('booking.floorAvailable')}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
