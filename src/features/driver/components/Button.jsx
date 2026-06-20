const variants = {
  primary:
    'bg-[#0EA5E9] hover:bg-[#0284c7] !text-white font-semibold shadow-sm shadow-sky-500/10 hover:shadow-md hover:shadow-sky-500/15 hover:-translate-y-0.5 active:scale-[0.97]',
  secondary:
    'bg-white border border-sky-200/50 text-slate-700 font-medium hover:bg-sky-50/50 hover:border-sky-300/60 hover:shadow-sm hover:-translate-y-0.5 active:scale-[0.97]',
  danger:
    'bg-gradient-to-r from-red-500 to-rose-500 !text-white font-semibold shadow-sm shadow-red-200/40 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97]',
  success:
    'bg-gradient-to-r from-emerald-500 to-green-500 !text-white font-semibold shadow-sm shadow-emerald-200/40 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97]',
  ghost:
    'bg-transparent text-slate-700 font-medium hover:bg-sky-50/60 hover:text-sky-600 active:scale-[0.97]',
};

const sizes = {
  sm: 'px-3.5 py-1.5 text-xs rounded-xl gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-sm rounded-xl gap-2',
  xl: 'px-8 py-3.5 text-base rounded-2xl gap-2.5',
  icon: 'h-10 w-10 rounded-xl justify-center p-0',
  'icon-sm': 'h-8 w-8 rounded-lg justify-center p-0',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  disabled = false,
  loading = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed !translate-y-0 !shadow-none !scale-100' : ''
      } ${className}`}
      {...props}
    >
      {loading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : icon ? (
        <span className="material-symbols-outlined flex-shrink-0 text-[18px]">{icon}</span>
      ) : null}
      {children && <span>{children}</span>}
      {iconRight && !loading && (
        <span className="material-symbols-outlined flex-shrink-0 text-[18px]">{iconRight}</span>
      )}
    </button>
  );
}
