import { useEffect, useMemo, useState } from 'react';
import { systemDataService } from '../../../services/systemDataService';
import { formatVietnamDateTime } from '../../../utils/dateTime';

const exceptionTypes = [
  { value: 'LOST_CARD', label: 'Mất thẻ', severity: 'HIGH' },
  { value: 'PLATE_MISMATCH', label: 'Sai biển số', severity: 'HIGH' },
  { value: 'PAYMENT_FAILED', label: 'Thanh toán lỗi', severity: 'MEDIUM' },
  { value: 'CARD_NOT_FOUND', label: 'Không tìm thấy thẻ xe', severity: 'MEDIUM' },
  { value: 'CAMERA_ERROR', label: 'Camera không nhận diện', severity: 'LOW' },
  { value: 'OTHER', label: 'Khác', severity: 'LOW' },
];

const labels = Object.fromEntries(exceptionTypes.map((item) => [item.value, item.label]));
const tones = { HIGH: 'bg-rose-100 text-rose-700', MEDIUM: 'bg-amber-100 text-amber-700', LOW: 'bg-slate-100 text-slate-700' };
const formatDateTime = (value) => formatVietnamDateTime(value) || '—';

export default function StaffExceptions() {
  const [form, setForm] = useState({ type: 'LOST_CARD', plate: '', cardCode: '', description: '', resolution: 'Đang xử lý' });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const selectedType = useMemo(() => exceptionTypes.find((item) => item.value === form.type), [form.type]);

  const loadTickets = async () => {
    setLoading(true); setError('');
    try { setTickets(await systemDataService.getIncidents()); }
    catch (err) { setError(err.response?.data?.message || 'Không thể tải sự cố từ database.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadTickets(); }, []);

  const submit = async (event) => {
    event.preventDefault(); setError('');
    try {
      await systemDataService.createIncident({ ...form, severity: selectedType.severity });
      setForm({ type: 'LOST_CARD', plate: '', cardCode: '', description: '', resolution: 'Đang xử lý' });
      await loadTickets();
    } catch (err) { setError(err.response?.data?.message || 'Không thể ghi sự cố vào database.'); }
  };
  const close = async (id) => { await systemDataService.closeIncident(id, 'Đã xử lý tại quầy'); await loadTickets(); };

  return <div className="space-y-6">
    <div><h1 className="text-3xl font-black text-slate-950">Xử lý sự cố</h1><p className="mt-2 text-sm text-slate-500">Mọi ticket được lưu và đọc trực tiếp từ database.</p></div>
    {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>}
    <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-black">Tạo ticket sự cố</h2>
        <label className="grid gap-2 text-sm font-bold">Loại sự cố<select value={form.type} onChange={(e) => setForm({...form,type:e.target.value})} className="rounded-xl border p-3">{exceptionTypes.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}</select></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-bold">Biển số<input value={form.plate} onChange={(e)=>setForm({...form,plate:e.target.value})} className="rounded-xl border p-3 uppercase" /></label><label className="grid gap-2 text-sm font-bold">Mã thẻ<input value={form.cardCode} onChange={(e)=>setForm({...form,cardCode:e.target.value})} className="rounded-xl border p-3" /></label></div>
        <label className="grid gap-2 text-sm font-bold">Mô tả<textarea required value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} className="min-h-28 rounded-xl border p-3" /></label>
        <label className="grid gap-2 text-sm font-bold">Hướng xử lý<input value={form.resolution} onChange={(e)=>setForm({...form,resolution:e.target.value})} className="rounded-xl border p-3" /></label>
        <button className="w-full rounded-xl bg-rose-600 px-5 py-3 font-black text-white">Ghi nhận sự cố</button>
      </form>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex justify-between"><h2 className="text-xl font-black">Danh sách ticket</h2><span>{tickets.length} ticket</span></div>
        <div className="mt-5 space-y-3">{loading ? <p>Đang tải từ database...</p> : tickets.length === 0 ? <div className="rounded-xl border border-dashed p-10 text-center text-slate-500">Database chưa có sự cố.</div> : tickets.map(ticket => <article key={ticket.id} className="rounded-2xl border bg-slate-50 p-4"><div className="flex justify-between gap-3"><div><div className="flex gap-2"><b>{labels[ticket.type] || ticket.type}</b><span className={`rounded-full px-3 py-1 text-xs ${tones[ticket.severity] || tones.LOW}`}>{ticket.severity}</span><span>{ticket.status}</span></div><p className="mt-2 text-sm text-slate-500">{ticket.plate || '—'} · {ticket.card_code || '—'} · {formatDateTime(ticket.created_at)}</p></div>{ticket.status === 'OPEN' && <button onClick={()=>close(ticket.id)} className="rounded-xl bg-slate-950 px-3 py-2 text-xs text-white">Đóng ticket</button>}</div><p className="mt-3">{ticket.description}</p><p className="mt-3 rounded-xl bg-white p-3">Xử lý: {ticket.resolution || '—'}</p></article>)}</div>
      </div>
    </section>
  </div>;
}
