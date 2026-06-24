import { useState } from 'react';
import { AlertCircle, CarFront, CheckCircle2, Search, TicketCheck, Bike } from 'lucide-react';
import { checkParkingEntry, confirmParkingEntry } from '../../services/staffService';
import { formatVietnamDateTime } from '../../utils/dateTime';

const formatDateTime = (value) => formatVietnamDateTime(value) || '—';

function Info({ label, value }) {
  return <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-400">{label}</p><p className="mt-1 font-bold text-slate-800">{value || '—'}</p></div>;
}

export default function VehicleEntryPage() {
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  const check = async (event) => {
    event?.preventDefault();
    const plate = licensePlate.trim().toUpperCase();
    if (!plate) { setError('Vui lòng nhập biển số xe.'); return; }
    setLoading(true); setError(''); setResult(null);
    try { setResult(await checkParkingEntry(plate, vehicleType || null)); }
    catch (err) { setError(err.response?.data?.message || err.response?.data?.error || 'Không thể kiểm tra biển số trong database.'); }
    finally { setLoading(false); }
  };

  const confirm = async () => {
    if (!result?.canConfirm) return;
    setConfirming(true); setError('');
    try {
      const payload = {
        ...result,
        vehicleType: vehicleType || result.vehicleType,
      };
      setResult(await confirmParkingEntry(payload));
    }
    catch (err) { setError(err.response?.data?.message || err.response?.data?.error || 'Không thể xác nhận xe vào.'); }
    finally { setConfirming(false); }
  };

  const isRegistered = result?.entryType === 'MONTHLY';
  const isVisitor = result?.entryType === 'VISITOR';
  const isInvalid = result?.entryType === 'INVALID';

  return <div className="mx-auto max-w-6xl space-y-6 pb-8">
    <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-8">
      <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-100 text-sky-700"><CarFront /></span><div><p className="text-xs font-bold uppercase tracking-[.2em] text-sky-600">Kiểm soát cổng vào</p><h1 className="text-3xl font-black text-slate-950">Kiểm tra xe vào</h1></div></div>
      <p className="mt-3 text-slate-500">Nhập biển số một lần. Hệ thống tự tra xe đăng ký; chỉ cấp thẻ khi xe là khách vãng lai.</p>

      <form onSubmit={check} className="mt-7 flex flex-col gap-3 rounded-3xl bg-slate-50 p-3 lg:flex-row">
        <div className="relative flex-1"><CarFront className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-600"/><input autoFocus value={licensePlate} onChange={(e)=>{setLicensePlate(e.target.value.toUpperCase());setResult(null);setError('');}} placeholder="Nhập biển số xe, ví dụ 51A-248.19" className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-lg font-bold uppercase tracking-wide outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100" /></div>
        <div className="relative min-w-[180px]">
          <select
            value={vehicleType}
            onChange={(e) => { setVehicleType(e.target.value); setResult(null); setError(''); }}
            className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-4 pr-10 text-sm font-bold text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          >
            <option value="">Tự đoán loại xe</option>
            <option value="CAR">Ô tô</option>
            <option value="MOTORBIKE">Xe máy</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{vehicleType === 'MOTORBIKE' ? <Bike className="h-5 w-5"/> : <CarFront className="h-5 w-5"/>}</div>
        </div>
        <button disabled={loading} className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-7 font-bold text-white shadow-lg shadow-sky-200 hover:bg-sky-700 disabled:opacity-60"><Search className="h-5 w-5"/>{loading ? 'Đang kiểm tra...' : 'Kiểm tra biển số'}</button>
      </form>
    </section>

    {error && <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 font-semibold text-rose-700"><AlertCircle />{error}</div>}

    {!result && !error && <section className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-16 text-center"><Search className="mx-auto h-12 w-12 text-slate-300"/><h2 className="mt-4 text-xl font-bold">Sẵn sàng kiểm tra</h2><p className="mt-2 text-slate-500">Thông tin thật từ database sẽ xuất hiện tại đây.</p></section>}

    {result && <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-2">{isInvalid ? <AlertCircle className="text-rose-600"/> : <CheckCircle2 className="text-emerald-600"/>}<span className={`rounded-full px-3 py-1 text-xs font-bold ${isRegistered ? 'bg-emerald-100 text-emerald-700' : isVisitor ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{isRegistered ? 'XE ĐÃ ĐĂNG KÝ GÓI' : isVisitor ? 'KHÁCH VÃNG LAI' : 'KHÔNG HỢP LỆ'}</span></div><p className="mt-4 text-4xl font-black tracking-wide text-slate-950">{result.licensePlate}</p><p className="mt-2 text-slate-500">{result.message}</p></div>{isVisitor && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center"><TicketCheck className="mx-auto text-amber-600"/><p className="mt-1 text-xs font-bold text-amber-600">THẺ SẼ CẤP</p><p className="text-2xl font-black text-amber-800">{result.visitorCardCode}</p></div>}</div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{isRegistered && <Info label="Khách hàng" value={result.customerName}/>}<Info label="Loại xe" value={result.vehicleType}/>{isRegistered && <Info label="Hãng / màu xe" value={[result.vehicleBrand,result.vehicleColor].filter(Boolean).join(' · ')}/>}<Info label="Trạng thái" value={result.sessionStatus}/><Info label="Gói sử dụng" value={isRegistered ? result.monthlyPackageName : 'Không có'}/><Info label="Hạn sử dụng" value={isRegistered ? formatDateTime(result.subscriptionEndDate) : 'Không áp dụng'}/></div>
      {isVisitor && <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 font-semibold text-amber-800">Đây là xe chưa có gói đăng ký. Hãy đưa thẻ {result.visitorCardCode} cho khách sau khi xác nhận.</p>}
      {result.canConfirm && <button onClick={confirm} disabled={confirming} className="mt-6 h-14 w-full rounded-2xl bg-slate-950 font-black text-white hover:bg-slate-800 disabled:opacity-60">{confirming ? 'Đang lưu vào database...' : 'XÁC NHẬN CHO XE VÀO'}</button>}
      {!result.canConfirm && !isInvalid && <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 p-4 font-bold text-emerald-700"><CheckCircle2/>Đã tạo phiên gửi xe trong database</div>}
    </section>}
  </div>;
}
