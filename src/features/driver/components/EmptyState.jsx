import Button from './Button';

export default function EmptyState({ icon = 'inbox', title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 px-6 py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </div>
      <h3 className="text-base font-bold text-slate-700">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" icon="add" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
