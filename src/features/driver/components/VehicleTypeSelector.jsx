import { useTranslation } from 'react-i18next';

const types = [
  { id: 'MOTORBIKE', icon: 'two_wheeler', descKey: 'motorcycle' },
  { id: 'CAR', icon: 'directions_car', descKey: 'car' },
];

export default function VehicleTypeSelector({ selected, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-3">
      {types.map((type) => {
        const isActive = selected === type.id;
        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onChange(type.id)}
            className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all duration-300 ${
              isActive
                ? 'border-sky-500 bg-sky-50/80 shadow-lg shadow-sky-100/80'
                : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/30 hover:shadow-md'
            }`}
          >
            {isActive && (
              <div className="absolute right-3 top-3">
                <span className="material-symbols-outlined text-[18px] text-sky-500">check_circle</span>
              </div>
            )}
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] text-white shadow-lg shadow-sky-300/40'
                : 'bg-slate-100 text-slate-400 group-hover:bg-sky-100 group-hover:text-sky-500'
            }`}>
              <span className="material-symbols-outlined text-[28px]">{type.icon}</span>
            </div>
            <div className="text-center">
              <p className={`text-sm font-bold ${isActive ? 'text-sky-700' : 'text-slate-700'}`}>{t(`booking.${type.descKey}`)}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
