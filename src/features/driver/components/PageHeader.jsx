export default function PageHeader({ title, subtitle, icon, actions, variant }) {
  if (variant === 'banner') {
    return (
      <div className="relative mb-6 overflow-hidden rounded-[24px] border border-[#4BB8FA] bg-[#4BB8FA] p-4 shadow-[0_18px_46px_rgba(15,23,42,0.06)] md:mb-8 md:p-5">
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[#0EA5E9]/10 blur-3xl" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between relative z-10">
          <div>
            <h1 className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white md:text-2xl">
              {icon && <span className="material-symbols-outlined text-[28px] text-white" style={{ color: '#FFFFFF' }}>{icon}</span>}
              {title}
            </h1>
            {subtitle && <p className="mt-1 text-xs font-semibold leading-relaxed text-white/90">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-800">
          {icon && <span className="material-symbols-outlined text-[28px] text-sky-500">{icon}</span>}
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
