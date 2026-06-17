import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Lock, User } from 'lucide-react';

const defaultAvatar =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80';

export default function UserProfileDropdown({ onViewProfile, onChangePassword, profile }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const profileData = {
    name: profile?.name ?? 'Demo Admin',
    role: profile?.role ?? 'Admin',
    email: profile?.email ?? '',
    avatar: profile?.avatar || defaultAvatar,
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (open && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (open && event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  function handleAction(action) {
    action?.();
    setOpen(false);
  }

  return (
    <div className="relative inline-flex text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-12 min-w-[220px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2.5 pr-3 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
      >
        <img
          src={profileData.avatar}
          alt="Avatar"
          className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100"
        />
        <div className="hidden min-w-0 flex-1 flex-col text-left sm:flex">
          <span className="truncate text-sm font-semibold leading-tight text-slate-950">{profileData.name}</span>
          <span className="truncate text-xs font-medium leading-tight text-slate-500">{profileData.role}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            role="menu"
            className="absolute right-0 top-full z-[9999] mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]"
          >
            <div className="border-b border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <img
                  src={profileData.avatar}
                  alt="Avatar"
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">{profileData.name}</p>
                  <p className="truncate text-xs text-slate-500">{profileData.email || profileData.role}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                type="button"
                role="menuitem"
                onClick={() => handleAction(onViewProfile)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600">
                  <User className="h-4 w-4" />
                </span>
                Profile
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => handleAction(onChangePassword)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600">
                  <Lock className="h-4 w-4" />
                </span>
                Change password
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
