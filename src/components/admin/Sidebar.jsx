const navItems = [
  { label: 'Tổng quan', icon: 'dashboard', active: true },
  { label: 'Quản lý tài khoản', icon: 'manage_accounts' },
  { label: 'Quyền truy cập', icon: 'security' },
  { label: 'Cấu hình hệ thống', icon: 'settings' },
  { label: 'Nhật ký hệ thống', icon: 'history' },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:justify-between bg-slate-950 text-white shadow-xl">
      <div className="px-6 py-8">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-600 text-white">
            <span className="material-symbols-outlined text-2xl">local_parking</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Smart Parking AI</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Hệ thống quản trị</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                item.active ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-800 px-6 py-5">
        <button className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white" type="button">
          <span className="material-symbols-outlined text-lg">help</span>
          Hỗ trợ
        </button>
        <button className="mt-3 flex w-full items-center gap-3 rounded-3xl bg-slate-900 px-4 py-3 text-sm text-rose-300 transition hover:bg-slate-800" type="button">
          <span className="material-symbols-outlined text-lg">logout</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
