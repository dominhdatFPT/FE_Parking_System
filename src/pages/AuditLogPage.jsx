import { useEffect, useMemo, useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import { getSecurityLogs } from '../features/admin/role-permissions/services/rolePermissionStorage';
import './AuditLogPage.css';

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
      <div className="audit-log-page">
        <div className="audit-log-toolbar">
          <div className="audit-log-filters">
            <label>
              Tìm kiếm
              <input
                type="search"
                placeholder="Hành động, trạng thái, nội dung..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label>
              Trạng thái
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="audit-log-actions">
            <button className="primary-button" type="button" onClick={handleRefresh}>
              Tải lại
            </button>
          </div>
        </div>

        <div className="audit-log-summary">
          <span>Tổng số sự kiện: {filteredLogs.length}</span>
          <span>Hiển thị tối đa: 30 dòng</span>
        </div>

        <div className="audit-log-table-wrap">
          <table className="audit-log-table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Hành động</th>
                <th>Trạng thái</th>
                <th>Nội dung</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-row">
                    Không tìm thấy log phù hợp.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                    <td>{log.action}</td>
                    <td className={`status-pill status-${log.status.toLowerCase()}`}>{log.status}</td>
                    <td>{log.message}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
