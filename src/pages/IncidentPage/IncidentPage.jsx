import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock3, LifeBuoy, MessageSquareText, Search, Send, X } from 'lucide-react';
import { incidentService } from '../../services/incidentService';
import { formatVietnamDateTime } from '../../utils/dateTime';

const STATUS_LABELS = {
  OPEN: 'Chờ xử lý',
  IN_PROGRESS: 'Đang xử lý',
  REPLIED: 'Đã phản hồi',
  RESOLVED: 'Đã giải quyết',
  CLOSED: 'Đã đóng',
};
const STATUS_CODES = Object.fromEntries(Object.entries(STATUS_LABELS).map(([code, label]) => [label, code]));
const statuses = ['Tất cả', ...Object.values(STATUS_LABELS)];

const formatDate = (value) => value
  ? formatVietnamDateTime(value)
  : '—';

const normalizeIncident = (item) => ({
  ...item,
  statusCode: item.status,
  status: STATUS_LABELS[item.status] || item.status,
  createdAt: formatDate(item.createdAt),
  repliedAt: formatDate(item.repliedAt),
});

function statusClass(status) {
  return {
    'Chờ xử lý': 'bg-amber-50 text-amber-700 ring-amber-200',
    'Đang xử lý': 'bg-sky-50 text-sky-700 ring-sky-200',
    'Đã phản hồi': 'bg-violet-50 text-violet-700 ring-violet-200',
    'Đã giải quyết': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    'Đã đóng': 'bg-slate-100 text-slate-600 ring-slate-200',
  }[status] || 'bg-slate-100 text-slate-700 ring-slate-200';
}

function Badge({ status }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(status)}`}>{status}</span>;
}

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <article className="rounded-[28px] bg-white p-6 ring-1 ring-slate-200/70 shadow-sm">
      <div className="flex items-start justify-between">
        <div><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-3 text-4xl font-semibold text-slate-950">{value}</p></div>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100"><Icon className="h-5 w-5" /></span>
      </div>
      <p className="mt-4 text-sm text-slate-500">{description}</p>
    </article>
  );
}

function ReplyModal({ incident, onClose, onSaved }) {
  const [title, setTitle] = useState(incident.replyTitle || '');
  const [message, setMessage] = useState(incident.replyMessage || '');
  const [status, setStatus] = useState(incident.status === 'Chờ xử lý' ? 'Đã phản hồi' : incident.status);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!title.trim() || !message.trim()) { setError('Vui lòng nhập đầy đủ tiêu đề và nội dung phản hồi.'); return; }
    setSaving(true); setError('');
    try {
      const saved = await incidentService.reply(incident.id, { title: title.trim(), message: message.trim(), status: STATUS_CODES[status] });
      onSaved(normalizeIncident(saved));
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Không thể gửi phản hồi. Vui lòng thử lại.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 lg:left-[260px]">
      <section className="relative max-h-[86vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="text-2xl font-semibold">Phản hồi sự cố</h2>
          <button type="button" onClick={onClose} className="rounded-xl bg-slate-100 p-2"><X className="h-5 w-5" /></button>
        </header>
        <div className="grid lg:grid-cols-2">
          <div className="space-y-4 bg-slate-50 p-6">
            <article className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <h3 className="font-semibold">Thông tin người gửi</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Tên người gửi</dt><dd className="font-semibold">{incident.userName || '—'}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Email</dt><dd className="font-semibold">{incident.userEmail || '—'}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Loại sự cố</dt><dd className="font-semibold">{incident.service}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Trạng thái</dt><dd><Badge status={incident.status} /></dd></div>
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Thời gian gửi</dt><dd className="font-semibold">{incident.createdAt}</dd></div>
              </dl>
            </article>
            <article className="rounded-2xl bg-white p-5 ring-1 ring-slate-200"><h3 className="font-semibold">Nội dung sự cố</h3><p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">{incident.content}</p></article>
          </div>
          <div className="space-y-4 p-6">
            <label className="block"><span className="mb-2 block text-sm font-semibold">Tiêu đề phản hồi</span><input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-sky-400" /></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold">Cập nhật trạng thái</span><select value={status} onChange={(e) => setStatus(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 px-4">{statuses.slice(2).map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold">Nội dung phản hồi</span><textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={5000} className="h-56 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-sky-400" /></label>
            {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
            <div className="flex justify-end gap-3"><button type="button" onClick={onClose} disabled={saving} className="rounded-xl border px-5 py-3">Hủy</button><button type="button" onClick={submit} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white disabled:opacity-60"><Send className="h-4 w-4" />{saving ? 'Đang gửi...' : 'Gửi phản hồi'}</button></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function IncidentPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [selected, setSelected] = useState(null);
  const [success, setSuccess] = useState('');

  const load = async () => {
    setLoading(true); setLoadError('');
    try { setIncidents((await incidentService.getAll()).map(normalizeIncident)); }
    catch (error) { setLoadError(error?.response?.data?.message || 'Không thể tải danh sách sự cố từ hệ thống.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => incidents.filter((item) => {
    const keyword = search.trim().toLowerCase();
    const matchesText = !keyword || [item.userName, item.userEmail, item.service, item.content, item.replyTitle].some((value) => String(value || '').toLowerCase().includes(keyword));
    return matchesText && (statusFilter === 'Tất cả' || item.status === statusFilter);
  }), [incidents, search, statusFilter]);
  const stats = { total: incidents.length, pending: incidents.filter((x) => x.status === 'Chờ xử lý').length, replied: incidents.filter((x) => x.replyMessage).length };

  const saved = (incident) => { setIncidents((items) => items.map((item) => item.id === incident.id ? incident : item)); setSelected(null); setSuccess('Phản hồi đã được lưu và gửi đến người dùng.'); };

  return (
    <main className="mx-auto max-w-[1440px] space-y-6">
      {success && <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 font-semibold text-emerald-700 ring-1 ring-emerald-200"><CheckCircle2 className="h-5 w-5" />{success}</div>}
      {loadError && <div className="rounded-2xl bg-rose-50 p-4 font-semibold text-rose-700 ring-1 ring-rose-200">{loadError} <button type="button" onClick={load} className="ml-2 underline">Thử lại</button></div>}
      <section className="grid gap-4 md:grid-cols-3"><StatCard icon={LifeBuoy} label="Tổng sự cố" value={stats.total} description="Dữ liệu thực trong hệ thống" /><StatCard icon={Clock3} label="Chờ xử lý" value={stats.pending} description="Cần staff/admin kiểm tra" /><StatCard icon={MessageSquareText} label="Đã phản hồi" value={stats.replied} description="Đã gửi phản hồi cho người dùng" /></section>
      <section className="overflow-hidden rounded-[28px] bg-white ring-1 ring-slate-200 shadow-sm">
        <div className="flex flex-col gap-4 border-b p-6 lg:flex-row lg:items-center lg:justify-between"><h2 className="text-xl font-semibold">Danh sách sự cố</h2><div className="flex flex-col gap-3 sm:flex-row"><label className="relative"><Search className="absolute left-4 top-4 h-4 w-4 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm người gửi, dịch vụ, nội dung..." className="h-12 min-w-[360px] rounded-xl border bg-slate-50 pl-11 pr-4" /></label><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-12 rounded-xl border px-4">{statuses.map((item) => <option key={item}>{item}</option>)}</select></div></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-5">Người gửi</th><th className="p-5">Loại sự cố</th><th className="p-5">Trạng thái</th><th className="p-5">Thời gian</th><th className="p-5 text-right">Thao tác</th></tr></thead><tbody className="divide-y">{loading ? <tr><td colSpan="5" className="p-16 text-center text-slate-500">Đang tải dữ liệu...</td></tr> : filtered.length === 0 ? <tr><td colSpan="5" className="p-16 text-center text-slate-500">Chưa có sự cố phù hợp.</td></tr> : filtered.map((item) => <tr key={item.id} className="hover:bg-sky-50/50"><td className="p-5"><p className="font-semibold">{item.userName || '—'}</p><p className="text-xs text-slate-500">{item.userEmail || '—'}</p></td><td className="p-5">{item.service}</td><td className="p-5"><Badge status={item.status} /></td><td className="p-5">{item.createdAt}</td><td className="p-5 text-right"><button type="button" onClick={() => { setSelected(item); setSuccess(''); }} className="rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white">Xem chi tiết</button></td></tr>)}</tbody></table></div>
      </section>
      {selected && <ReplyModal incident={selected} onClose={() => setSelected(null)} onSaved={saved} />}
    </main>
  );
}
