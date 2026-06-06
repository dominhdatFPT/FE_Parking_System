import { useEffect, useMemo, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import { getSecurityLogs } from '../../features/admin/role-permissions/services/rolePermissionStorage';

const STATUS_OPTIONS = ['All', 'Success', 'Failed', 'Blocked'];

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

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
    <DashboardShell title="Nhật ký hệ thống" description="Xem lại hoạt động bảo mật, truy cập và thay đổi cấu hình hệ thống.">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <label className="flex flex-col gap-1.5 flex-1 max-w-sm">
              <span className="text-sm font-medium text-gray-700">Tìm kiếm</span>
              <input
                type="search"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Hành động, trạng thái, nội dung..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-gray-700">Trạng thái</span>
              <select 
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[120px]"
                value={statusFilter} 
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex items-end">
            <button 
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="button" 
              onClick={handleRefresh}
            >
              Tải lại
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="px-5 py-3 bg-white border-b border-gray-200 flex justify-between items-center text-sm text-gray-600">
          <span>Tổng số sự kiện: <strong className="text-gray-900">{filteredLogs.length}</strong></span>
          <span>Hiển thị tối đa: 30 dòng</span>
        </div>

        {/* Table Wrap */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
              <tr>
                <th className="px-5 py-3 font-semibold whitespace-nowrap">Thời gian</th>
                <th className="px-5 py-3 font-semibold whitespace-nowrap">Hành động</th>
                <th className="px-5 py-3 font-semibold whitespace-nowrap">Trạng thái</th>
                <th className="px-5 py-3 font-semibold w-full">Nội dung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-5 py-8 text-center text-gray-500">
                    Không tìm thấy log phù hợp.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const statusColors = {
                    success: 'bg-green-100 text-green-700',
                    failed: 'bg-red-100 text-red-700',
                    error: 'bg-red-100 text-red-700',
                    blocked: 'bg-orange-100 text-orange-700',
                    default: 'bg-gray-100 text-gray-700'
                  };
                  const colorClass = statusColors[log.status.toLowerCase()] || statusColors.default;

                  return (
                    <tr key={log.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 whitespace-nowrap text-gray-900 font-medium">
                        {new Date(log.createdAt).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {log.message}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
