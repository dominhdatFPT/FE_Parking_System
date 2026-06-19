import { useEffect, useMemo, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import { systemDataService } from '../../services/systemDataService';

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try { setLogs(await systemDataService.getAuditLogs()); }
    catch (err) { setError(err.response?.data?.message || 'Không thể tải nhật ký từ database.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? logs.filter(x => [x.action, x.message, x.status, x.user_name, x.email].some(v => String(v || '').toLowerCase().includes(q))) : logs;
  }, [logs, search]);

  const exportCsv = () => {
    const quote = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const rows = [['Thời gian','Người dùng','Hành động','Mức độ','Trạng thái','Nội dung'], ...filtered.map(x => [x.created_at,x.user_name,x.action,x.severity,x.status,x.message])];
    const blob = new Blob([rows.map(r => r.map(quote).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='audit-log.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return <DashboardShell title="Nhật ký hệ thống" description="Dữ liệu nhật ký được đọc trực tiếp từ database.">
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Tổng sự kiện" value={logs.length} />
        <Metric label="Thành công" value={logs.filter(x=>x.status==='SUCCESS').length} />
        <Metric label="Mức cao" value={logs.filter(x=>['HIGH','CRITICAL'].includes(x.severity)).length} />
      </div>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm trong nhật ký..." className="min-w-72 rounded-xl border px-4 py-3" /><div className="flex gap-2"><button onClick={exportCsv} className="rounded-xl border px-4 py-3">Xuất CSV</button><button onClick={load} className="rounded-xl bg-blue-700 px-4 py-3 text-white">Làm mới</button></div></div>
        {error && <p className="mt-4 rounded-xl bg-rose-50 p-4 text-rose-700">{error}</p>}
        <div className="mt-5 overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-slate-50 text-left"><tr><th className="p-3">Người dùng</th><th className="p-3">Thời gian</th><th className="p-3">Hành động</th><th className="p-3">Mức độ</th><th className="p-3">Trạng thái</th><th className="p-3">Nội dung</th></tr></thead><tbody className="divide-y">{loading ? <tr><td colSpan="6" className="p-8 text-center">Đang tải từ database...</td></tr> : filtered.length === 0 ? <tr><td colSpan="6" className="p-8 text-center text-slate-500">Database chưa có nhật ký phù hợp.</td></tr> : filtered.map(x=><tr key={x.id}><td className="p-3"><b>{x.user_name || 'Hệ thống'}</b><div className="text-xs text-slate-500">{x.email || '—'}</div></td><td className="p-3">{new Date(x.created_at).toLocaleString('vi-VN')}</td><td className="p-3">{x.action}</td><td className="p-3">{x.severity}</td><td className="p-3">{x.status}</td><td className="p-3">{x.message}</td></tr>)}</tbody></table></div>
      </section>
    </div>
  </DashboardShell>;
}

function Metric({ label, value }) { return <div className="rounded-2xl border bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>; }
