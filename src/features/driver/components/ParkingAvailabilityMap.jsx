import { useTranslation } from 'react-i18next';

export default function ParkingAvailabilityMap({ selectedArea, floors }) {
  const { t } = useTranslation();

  if (!selectedArea) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
          <span className="material-symbols-outlined text-[28px]">map</span>
        </div>
        <p className="text-sm font-bold text-slate-600">{t('dashboard.selectParkingLot')}</p>
        <p className="mt-1 text-xs text-slate-400">{t('dashboard.selectParkingLotDesc')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] text-white shadow-sm">
            <span className="material-symbols-outlined text-[16px]">map</span>
          </span>
          {t('dashboard.parkingMap')}
        </h3>
        <span className="text-xs font-medium text-slate-400">{selectedArea.name}</span>
      </div>

      <div className="mt-3 flex items-center gap-4 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#0EA5E9]" />
          <span className="text-slate-500">Còn trống</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-slate-300" />
          <span className="text-slate-500">Đang dùng</span>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {(floors || selectedArea.floors || []).map((floor) => {
          const ratio = floor.totalSlots > 0 ? floor.availableSlots / floor.totalSlots : 0;
          return (
            <div key={floor.floorNumber} className="rounded-xl bg-slate-50/80 p-3 ring-1 ring-slate-100">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Tầng {floor.floorNumber}</span>
                <span className="text-[10px] font-medium text-slate-400">
                  {floor.availableSlots}/{floor.totalSlots} trống
                </span>
              </div>
              <div className="mb-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(1 - ratio) * 100}%`,
                    backgroundColor: ratio > 0.3 ? '#0EA5E9' : ratio > 0 ? '#fbbf24' : '#ef4444',
                  }}
                />
              </div>
              <div className="grid grid-cols-10 gap-1">
                {Array.from({ length: Math.min(20, floor.totalSlots) }).map((_, i) => {
                  const isAvailable = i < floor.availableSlots;
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-sm transition-all duration-300 hover:scale-110 ${
                        isAvailable ? 'bg-[#0EA5E9] hover:bg-[#0284C7]' : 'bg-slate-300'
                      }`}
                      title={isAvailable ? 'Còn trống' : 'Đang dùng'}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
