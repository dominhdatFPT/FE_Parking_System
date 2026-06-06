const chartBars = [
  { label: '00:00', value: 35, tone: 'bg-blue-600' },
  { label: '04:00', value: 55, tone: 'bg-slate-400' },
  { label: '08:00', value: 72, tone: 'bg-blue-600' },
  { label: '12:00', value: 92, tone: 'bg-blue-500' },
  { label: '16:00', value: 66, tone: 'bg-slate-400' },
  { label: '20:00', value: 84, tone: 'bg-blue-600' },
  { label: '23:59', value: 58, tone: 'bg-slate-400' },
];

export default function TrafficChart() {
  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200 ring-opacity-70">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Lưu lượng xe 24h qua</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">Biểu đồ lưu lượng</h3>
        </div>
        <select className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200">
          <option>Bãi xe A1</option>
          <option>Bãi xe B2</option>
          <option>Tất cả bãi xe</option>
        </select>
      </div>

      <div className="mt-8 grid grid-cols-7 items-end gap-3"> 
        {chartBars.map((bar) => (
          <div key={bar.label} className="flex flex-col items-center gap-3">
            <div className={`relative flex h-52 w-full items-end justify-center rounded-3xl ${bar.tone}`}> 
              <div className="absolute bottom-0 h-full w-full rounded-3xl bg-slate-100/80" style={{ height: `${100 - bar.value}%` }} />
              <div className="relative h-full w-full rounded-3xl bg-gradient-to-t from-slate-700 to-blue-500 transition-all duration-500" style={{ height: `${bar.value}%` }} />
            </div>
            <span className="text-xs text-slate-500">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
