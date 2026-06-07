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
        <div className="mb-10 flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()} title="Làm mới trang">
          <img
            alt="Parking System Logo"
            className="h-12 w-12 object-contain"
            src="/parking-system-logo.png"
          />
          <div>
            <h1 className="text-xl font-bold text-white">Parking System</h1>
            <p className="text-xs text-slate-400">Hệ thống quản trị</p>
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

      <div className="border-t border-slate-800 px-6 py-5 flex items-center gap-3 shrink-0">
        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1e3a8a] hover:bg-blue-800 rounded-lg transition-colors text-sm font-semibold shadow-sm">
          <span className="material-symbols-outlined text-lg text-white">help</span>
          <span className="text-white">Hỗ trợ</span>
        </button>
        <button 
          title="Đăng xuất"
          className="flex-shrink-0 flex items-center justify-center p-2.5 text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-100 rounded-lg transition-all" type="button">
          <span className="material-symbols-outlined text-lg">logout</span>
        </button>
      </div>
    </aside>
  );
}
