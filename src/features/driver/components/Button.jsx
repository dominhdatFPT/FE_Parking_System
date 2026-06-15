const variants = {
  primary:
    'bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white font-semibold shadow-md shadow-sky-300/40 hover:shadow-lg hover:shadow-sky-400/50 hover:-translate-y-0.5 active:scale-[0.98]',
  secondary:
    'bg-white border border-sky-200/60 text-slate-700 font-medium hover:bg-sky-50 hover:border-sky-300 hover:shadow-sm hover:-translate-y-0.5 active:scale-[0.98]',
  danger:
    'bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold shadow-md shadow-red-200/60 hover:shadow-lg hover:shadow-red-300/60 hover:-translate-y-0.5 active:scale-[0.98]',
  success:
    'bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold shadow-md shadow-emerald-200/60 hover:shadow-lg hover:shadow-emerald-300/60 hover:-translate-y-0.5 active:scale-[0.98]',
  ghost:
    'bg-transparent text-slate-700 font-medium hover:bg-sky-50 hover:text-sky-600 active:scale-[0.98]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-2xl gap-2',
  lg: 'px-6 py-3 text-sm rounded-2xl gap-2',
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
      className={`inline-flex items-center transition-all duration-300 ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${
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
