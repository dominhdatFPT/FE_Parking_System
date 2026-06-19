import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Lock, User } from 'lucide-react';

const SELECTED_AVATAR_STORAGE_KEY = 'selectedAvatar';

const avatarOptions = [
  '/avatars/avatar-1.svg',
  '/avatars/avatar-2.svg',
  '/avatars/avatar-3.svg',
  '/avatars/avatar-4.svg',
  '/avatars/avatar-5.svg',
];

function getInitials(name = '') {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return 'DA';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getStoredAvatar() {
  if (typeof window === 'undefined') return avatarOptions[0];

  const saved = window.localStorage.getItem(SELECTED_AVATAR_STORAGE_KEY);
  return avatarOptions.includes(saved) ? saved : avatarOptions[0];
}

function AvatarImage({ src, initials, className = '' }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <span className={`grid place-items-center rounded-full bg-sky-500 font-bold text-white ${className}`}>
        {initials}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt="Avatar"
      onError={() => setHasError(true)}
      className={`rounded-full object-cover ${className}`}
    />
  );
}

export default function UserProfileDropdown({ onViewProfile, onChangePassword, profile }) {
  const [open, setOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(getStoredAvatar);
  const dropdownRef = useRef(null);

  const profileData = {
    name: profile?.name ?? profile?.email ?? 'Người dùng',
    role: profile?.role ?? '',
    email: profile?.email ?? '',
  };
  const initials = getInitials(profileData.name);

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

  function handleAvatarSelect(avatar) {
    setSelectedAvatar(avatar);
    window.localStorage.setItem(SELECTED_AVATAR_STORAGE_KEY, avatar);
  }

  return (
    <div className="relative inline-flex text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="User menu"
        className="grid h-12 w-12 place-items-center rounded-2xl border border-white/70 bg-white/70 shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl transition duration-200 hover:bg-white/85 hover:shadow-md active:scale-[0.98]"
      >
        <AvatarImage
          src={selectedAvatar}
          initials={initials}
          className="h-10 w-10 text-xs ring-2 ring-white"
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            role="menu"
            className="absolute right-0 top-full z-[9999] mt-3 w-80 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-900/10"
          >
            <div className="border-b border-slate-100 bg-white p-4">
              <div className="flex items-center gap-3">
                <AvatarImage
                  src={selectedAvatar}
                  initials={initials}
                  className="h-12 w-12 text-sm ring-2 ring-white"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">{profileData.name}</p>
                  <p className="truncate text-xs text-slate-500">{profileData.email || profileData.role}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-2">
              <button
                type="button"
                role="menuitem"
                onClick={() => handleAction(onViewProfile)}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100/70 hover:text-slate-950"
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
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100/70 hover:text-slate-950"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600">
                  <Lock className="h-4 w-4" />
                </span>
                Change password
              </button>
            </div>

            <div className="border-t border-slate-100 bg-white p-4">
              <p className="mb-3 text-xs font-semibold text-slate-500">Chọn ảnh đại diện</p>
              <div className="flex items-center gap-2">
                {avatarOptions.map((avatar, index) => {
                  const isSelected = selectedAvatar === avatar;

                  return (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => handleAvatarSelect(avatar)}
                      className={`relative grid h-12 w-12 place-items-center rounded-full transition duration-200 ${
                        isSelected ? 'ring-2 ring-sky-500 ring-offset-2 ring-offset-white' : 'hover:ring-2 hover:ring-slate-200'
                      }`}
                      aria-label={`Chọn ảnh đại diện ${index + 1}`}
                    >
                      <AvatarImage
                        src={avatar}
                        initials={initials}
                        className="h-12 w-12 text-xs"
                      />
                      {isSelected ? (
                        <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-sky-500 text-white ring-2 ring-white">
                          <Check className="h-3 w-3" />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
