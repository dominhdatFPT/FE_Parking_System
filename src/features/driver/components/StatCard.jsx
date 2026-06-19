export default function StatCard({ icon, value, label, accent = 'sky', trend, trendUp }) {
  const accents = {
    sky: { bg: 'bg-sky-50', iconBg: 'bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4]', iconColor: 'text-white', valueColor: 'text-sky-600', ring: 'ring-sky-100' },
    emerald: { bg: 'bg-emerald-50', iconBg: 'bg-gradient-to-br from-emerald-400 to-green-500', iconColor: 'text-white', valueColor: 'text-emerald-600', ring: 'ring-emerald-100' },
    amber: { bg: 'bg-amber-50', iconBg: 'bg-gradient-to-br from-amber-400 to-orange-400', iconColor: 'text-white', valueColor: 'text-amber-600', ring: 'ring-amber-100' },
    violet: { bg: 'bg-violet-50', iconBg: 'bg-gradient-to-br from-violet-400 to-purple-500', iconColor: 'text-white', valueColor: 'text-violet-600', ring: 'ring-violet-100' },
  };

  const a = accents[accent] || accents.sky;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-sky-100/40 bg-white p-5 shadow-[0_1px_3px_rgba(14,165,233,0.06)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(14,165,233,0.1)] hover:-translate-y-0.5">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-sky-100/30 transition-transform duration-500 group-hover:scale-150" />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.iconBg} ${a.iconColor} shadow-md transition-transform duration-300 group-hover:scale-110`}>
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
          </div>
          <div>
            <p className={`text-2xl font-bold tracking-tight ${a.valueColor}`}>{value}</p>
            <p className="text-[13px] font-medium text-slate-400">{label}</p>
          </div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
            <span className="material-symbols-outlined text-[14px]">{trendUp ? 'trending_up' : 'trending_down'}</span>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}
