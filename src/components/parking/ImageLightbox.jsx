import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function ImageLightbox({ src, title, onClose }) {
  useEffect(() => {
    if (!src) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[85vh] max-w-3xl">
        <img
          src={src}
          alt={title || 'Ảnh chụp biển số'}
          className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
        />
        {title ? (
          <p className="mt-2 text-center text-sm font-semibold text-white/90">{title}</p>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng ảnh"
          className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-slate-700 shadow-lg transition hover:bg-slate-100"
        >
          <X className="h-4 w-4" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}
