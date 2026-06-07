const vehicleTypes = [
  { label: 'Ô tô', value: '62%', color: 'bg-blue-600' },
  { label: 'Xe máy', value: '25%', color: 'bg-sky-400' },
  { label: 'Xe điện', value: '13%', color: 'bg-emerald-500' },
];

export default function VehicleTypeChart() {
  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200 ring-opacity-70">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Phân loại phương tiện</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">Tỷ lệ xe trên bãi</h3>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative h-44 w-44">
          <div className="absolute inset-0 rounded-full border-[18px] border-blue-100"></div>
          <div className="absolute inset-0 rounded-full border-[18px] border-sky-200" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 0, 50% 0)' }} />
          <div className="absolute inset-0 rounded-full border-[18px] border-emerald-200" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }} />
          <div className="absolute inset-0 rounded-full bg-white/90 flex items-center justify-center text-center p-4">
            <div>
              <p className="text-xl font-semibold text-slate-950">3.8K</p>
              <p className="text-sm text-slate-500">Tổng xe</p>
            </div>
          </div>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-2">
          {vehicleTypes.map((item) => (
            <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                  <span className={`material-symbols-outlined text-xl ${item.color === 'bg-blue-600' ? 'text-blue-600' : item.color === 'bg-sky-400' ? 'text-sky-400' : 'text-emerald-500'}`}>
                    {item.label === 'Ô tô' ? 'directions_car' : item.label === 'Xe máy' ? 'electric_scooter' : 'ev_charger'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{item.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
