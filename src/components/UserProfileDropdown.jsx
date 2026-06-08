import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronDown, Lock, LogOut, Moon, Settings, User } from 'lucide-react';

const defaultAvatar =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80';

const quickActions = [
  { label: 'Hồ sơ cá nhân', icon: User },
  { label: 'Đổi mật khẩu', icon: Lock },
  { label: 'Thông báo', icon: Bell },
  { label: 'Cài đặt', icon: Settings },
];

export default function UserProfileDropdown({ onViewProfile, onLogout, profile }) {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef(null);

  const profileData = {
    name: profile?.name ?? 'Đỗ Minh Đạt',
    role: profile?.role ?? 'Quản trị viên',
    email: profile?.email ?? 'dat.dominh@parking.ai',
    avatar: profile?.avatar ?? defaultAvatar,
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (open && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-flex text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex min-w-[220px] w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition hover:bg-slate-50"
      >
        <img
          src={profileData.avatar}
          alt="Avatar"
          className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-200"
        />
        <div className="hidden flex-1 flex-col text-left sm:flex">
          <span className="text-sm font-semibold text-slate-950 leading-tight">{profileData.name}</span>
          <span className="text-xs text-slate-500 leading-tight">{profileData.role}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full z-[9999] mt-3 w-[360px] max-h-[calc(100vh-120px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
          >
            <div className="flex min-h-0 flex-col gap-3 p-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={profileData.avatar}
                    alt="Avatar"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{profileData.name}</p>
                    <p className="text-xs text-slate-500">{profileData.role}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onViewProfile}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1e3a8a] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800"
                >
                  <span className="material-symbols-outlined text-lg text-white">account_circle</span>
                  <span className="text-white">Xem hồ sơ</span>
                </button>
              </div>

              <div className="rounded-[16px] bg-white p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Quick Actions</p>
                <div className="mt-3 grid gap-2">
                  {quickActions.map((action) => {
                    const IconComponent = action.icon;
                    return (
                      <button
                        key={action.label}
                        type="button"
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                          <IconComponent className="h-4 w-4" />
                        </span>
                        <span>{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[16px] bg-white p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Preferences</p>
                <button
                  type="button"
                  onClick={() => setDarkMode((prev) => !prev)}
                  className="mt-3 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                      <Moon className="h-4 w-4" />
                    </span>
                    {darkMode ? 'Chế độ tối' : 'Chế độ sáng'}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                    {darkMode ? 'Bật' : 'Tắt'}
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#B91C1C] transition hover:bg-[#FEE2E2]"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
