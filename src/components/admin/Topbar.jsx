export default function Topbar() {
  return (
    <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200 ring-opacity-70">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-slate-950">Tổng quan hệ thống</h2>
          <p className="mt-1 text-sm text-slate-500">Chào mừng trở lại. Đây là tình trạng bãi đỗ xe của bạn hôm nay.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
            <span className="material-symbols-outlined">calendar_today</span>
            Hôm nay: 24/05/2024
          </button>
          <button className="inline-flex items-center gap-2 rounded-3xl bg-[#1e3a8a] px-4 py-3 text-sm font-semibold transition hover:bg-blue-800">
            <span className="material-symbols-outlined text-white">download</span>
            <span className="text-white">Xuất báo cáo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
