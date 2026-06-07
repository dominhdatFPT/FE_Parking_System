export default function StatCard({ icon, label, value, trend, trendLabel }) {
  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200 ring-opacity-70 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-slate-900">
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
          {trend}
        </div>
      </div>

      <div className="mt-6">
        <div className="text-4xl font-semibold tracking-tight text-slate-950">{value}</div>
        <p className="mt-2 text-sm text-slate-500">{label}</p>
      </div>

      {trendLabel ? <p className="mt-4 text-sm text-slate-400">{trendLabel}</p> : null}
    </div>
  );
}
