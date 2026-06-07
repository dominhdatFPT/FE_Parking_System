import { useEffect, useMemo, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import { getSecurityLogs } from '../../features/admin/role-permissions/services/rolePermissionStorage';

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter] = useState('All');

  useEffect(() => {
    setLogs(getSecurityLogs());
  }, []);

  function escapeCsvValue(value) {
    const stringValue = String(value ?? '');
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  function downloadReport(content, fileName, format) {
    const mimeType = format === 'PDF' ? 'application/pdf' : 'text/csv;charset=utf-8;';
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function buildCsvContent(rows) {
    const headers = ['Thời gian', 'Hành động', 'Trạng thái', 'Nội dung'];
    return [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(','))
      .join('\n');
  }

  const filteredLogs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return logs.filter((log) => {
      const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        log.action.toLowerCase().includes(normalizedSearch) ||
        log.message.toLowerCase().includes(normalizedSearch) ||
        log.status.toLowerCase().includes(normalizedSearch);
      return matchesStatus && matchesSearch;
    });
  }, [logs, search, statusFilter]);

  function handleRefresh() {
    setLogs(getSecurityLogs());
  }

  return (
    <DashboardShell title="Nhật ký hệ thống & Bảo mật" description="Theo dõi hoạt động người dùng và giám sát hệ thống trong Smart Parking AI.">
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-start justify-between">
              <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                <span className="material-symbols-outlined">login</span>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">+12%</span>
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-slate-500">Đăng nhập hôm nay</p>
            <h3 className="mt-3 text-3xl font-semibold text-slate-950">245</h3>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-start justify-between">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <span className="material-symbols-outlined">shield</span>
              </div>
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">-5%</span>
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-slate-500">Sự kiện bảo mật</p>
            <h3 className="mt-3 text-3xl font-semibold text-slate-950">18</h3>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition border-t-2 border-t-rose-500">
            <div className="flex items-start justify-between">
              <div className="rounded-2xl bg-rose-100 p-3 text-rose-700">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Most critical</span>
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-slate-500">Hoạt động bất thường</p>
            <h3 className="mt-3 text-3xl font-semibold text-slate-950">3</h3>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-start justify-between">
              <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-slate-500">Trạng thái hệ thống</p>
            <h3 className="mt-3 text-3xl font-semibold text-slate-950">Ổn định</h3>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">Nhật ký &amp; bảo mật</h3>
                  <p className="mt-1 text-sm text-slate-500">Lọc và xuất báo cáo hoạt động hệ thống.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" type="button" onClick={() => downloadReport(buildCsvContent(filteredLogs.map((log) => [new Date(log.createdAt).toLocaleString('vi-VN'), log.action, log.status, log.message])), 'audit-log.csv', 'CSV')}>
                    <span className="material-symbols-outlined text-sm">download</span>
                    Xuất CSV
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700" type="button" onClick={handleRefresh}>
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    Làm mới
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.8fr_1fr_1fr_0.9fr]">
                <div className="space-y-2 text-sm text-slate-600">
                  <label className="block text-slate-700 font-medium">Tìm kiếm</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                      type="search"
                      placeholder="Tìm hoạt động..."
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <label className="block text-slate-700 font-medium">Người dùng</label>
                  <select className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    <option>Tất cả</option>
                    <option>Nguyễn Văn A</option>
                    <option>Trần Thị B</option>
                  </select>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <label className="block text-slate-700 font-medium">Loại sự kiện</label>
                  <select className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    <option>Tất cả</option>
                    <option>Đăng nhập</option>
                    <option>Thay đổi quyền</option>
                  </select>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <label className="block text-slate-700 font-medium">Mức độ</label>
                  <select className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    <option>Tất cả</option>
                    <option>Trung bình</option>
                    <option>Cao</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Người dùng</th>
                    <th className="px-4 py-3">Thời gian</th>
                    <th className="px-4 py-3">Hành động</th>
                    <th className="px-4 py-3">IP / Thiết bị</th>
                    <th className="px-4 py-3">Mức độ</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-6 text-center text-sm text-slate-500">
                        Không tìm thấy log phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.slice(0, 30).map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="font-semibold text-slate-950">{log.user || 'Unknown'}</div>
                          <div className="text-xs text-slate-500">{log.role || 'User'}</div>
                        </td>
                        <td className="px-4 py-4 text-slate-700">{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                        <td className="px-4 py-4 text-slate-700">{log.action}</td>
                        <td className="px-4 py-4 text-slate-700">
                          <div className="flex flex-col">
                            <span>{log.ip || '—'}</span>
                            <span className="text-xs text-slate-500">{log.device || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">{log.severity || 'Trung bình'}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${log.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : log.status === 'Failed' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 hover:bg-slate-200">
                              <span className="material-symbols-outlined text-[20px]">visibility</span>
                            </button>
                            <button className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 hover:bg-slate-200">
                              <span className="material-symbols-outlined text-[20px]">info</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <span className="material-symbols-outlined text-primary">psychology</span>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Cảnh báo AI</h3>
                <p className="text-sm text-slate-500">Phát hiện hành vi đáng ngờ trong hệ thống.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-600">warning</span>
                  <div>
                    <h4 className="font-semibold text-slate-950">Đăng nhập bất thường</h4>
                    <p className="mt-1 text-sm text-slate-600">IP mới từ Hà Nội, mức độ trung bình.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-rose-600">dangerous</span>
                  <div>
                    <h4 className="font-semibold text-slate-950">Thay đổi quyền trái phép</h4>
                    <p className="mt-1 text-sm text-slate-600">Người dùng A yêu cầu cập nhật quyền admin.</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardShell>
  );
}
