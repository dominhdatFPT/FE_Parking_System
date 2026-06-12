import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../../contexts/useAuth';

const navItems = [
  { label: 'Trang chủ', path: '/driver-dashboard', icon: 'grid' },
  { label: 'Đặt chỗ', path: '/driver-booking', icon: 'ticket' },
  { label: 'Lịch sử', path: '/driver-history', icon: 'clock' },
  { label: 'Hồ sơ', path: '/driver-profile', icon: 'user' },
];

function NavIcon({ name }) {
  if (name === 'ticket') {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V6a2 2 0 0 1 2-2Z" />
      </svg>
    );
  }

  if (name === 'clock') {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    );
  }

  if (name === 'user') {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z" />
      </svg>
    );
  }

  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5ZM4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4Zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4Z" />
    </svg>
  );
}

export function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-9 8h12a2 2 0 0 0 2-2V7.8a2 2 0 0 0-.6-1.4l-3.8-3.8A2 2 0 0 0 14.2 2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-lg bg-[#1e3a8a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default function DriverPageShell({ title, subtitle, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const displayName = user?.fullName || user?.name || user?.email || 'Bạn';

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-800">
      <aside className="hidden w-64 shrink-0 flex-col bg-[#131b2e] text-white md:flex">
        <div className="flex h-20 items-center gap-3 px-6">
          <img src="/parking-system-logo.png" alt="Parking System Logo" className="h-10 w-10 object-contain" />
          <span className="text-xl font-bold">Parking System</span>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-4 pt-4">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-4 rounded-xl px-5 py-3.5 text-left transition ${
                  active ? 'bg-blue-600 font-bold text-white shadow-sm' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <NavIcon name={item.icon} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-6">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full rounded-lg bg-rose-100 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 bg-white/85 px-8">
          <div className="relative w-full max-w-xl">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Tìm kiếm tính năng..."
              className="w-full rounded-full border-0 bg-slate-50 py-2.5 pl-12 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-slate-200"
            />
          </div>
          <div className="ml-6 flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-slate-400">Tài khoản</p>
              <p className="max-w-48 truncate text-sm font-semibold text-slate-700">{displayName}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-6xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1e3a8a]">{title}</h1>
              {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
