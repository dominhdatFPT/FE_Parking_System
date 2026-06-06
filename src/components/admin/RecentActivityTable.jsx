const activityRows = [
  { plate: '30F-123.45', time: '14:20:05', type: 'Vào', location: 'Tầng B1 - A05', status: 'Thành công', tone: 'bg-emerald-100 text-emerald-700' },
  { plate: '51G-888.88', time: '14:18:22', type: 'Ra', location: 'Cổng Chính 1', status: 'Thành công', tone: 'bg-emerald-100 text-emerald-700' },
  { plate: '29A-555.21', time: '14:15:10', type: 'Vào', location: 'Tầng B2 - C12', status: 'Chờ duyệt', tone: 'bg-amber-100 text-amber-700' },
  { plate: '43C-990.01', time: '14:12:45', type: 'Ra', location: 'Cổng Phụ 2', status: 'Lỗi thẻ', tone: 'bg-rose-100 text-rose-700' },
];

export default function RecentActivityTable() {
  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200 ring-opacity-70 overflow-hidden">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Hoạt động gần đây</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">Người dùng & phương tiện</h3>
        </div>
        <button className="rounded-3xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
          Xem tất cả
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3 text-left">
          <thead>
            <tr className="text-xs uppercase tracking-[0.2em] text-slate-500">
              <th className="px-4 py-3">Biển số xe</th>
              <th className="px-4 py-3">Thời gian</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Vị trí bãi</th>
              <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {activityRows.map((row) => (
              <tr key={row.plate} className="rounded-[20px] bg-slate-50 shadow-sm transition hover:bg-slate-100">
                <td className="px-4 py-4 text-sm font-semibold text-slate-900">{row.plate}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{row.time}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{row.type}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{row.location}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${row.tone}`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
