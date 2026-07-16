export default function PageHeader({ title, subtitle, icon, actions, variant }) {
  if (variant === 'banner') {
    return (
      <div className="relative mb-6 overflow-hidden rounded-[24px] border border-[#4BB8FA] bg-[#4BB8FA] p-5 shadow-[0_18px_46px_rgba(14,165,233,0.16)] md:mb-8 md:p-6">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-20 w-80 rounded-full bg-[#0EA5E9]/20 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-white md:text-3xl">
              {icon && <span className="material-symbols-outlined text-[30px] text-white">{icon}</span>}
              {title}
            </h1>
            {subtitle && <p className="mt-2 text-sm font-semibold leading-relaxed text-white/90">{subtitle}</p>}
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
