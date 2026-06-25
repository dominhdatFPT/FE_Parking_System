import { useState } from 'react';
import { checkParkingEntry, confirmParkingEntry } from '../../../services/staffService';

export default function StaffVehicleEntry() {
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleType, setVehicleType] = useState('CAR');
  const [entryInfo, setEntryInfo] = useState(null);
  const [visitorCardCode, setVisitorCardCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheck = async (event) => {
    event.preventDefault();
    if (!licensePlate.trim()) {
      setMessage('Vui lòng nhập biển số xe.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      setEntryInfo(await checkParkingEntry(licensePlate.trim().toUpperCase(), vehicleType));
    } catch (error) {
      setEntryInfo(null);
      setMessage(error.response?.data?.message || 'Không thể kiểm tra thông tin xe.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!entryInfo) return;
    setLoading(true);
    setMessage('');
    try {
      const result = await confirmParkingEntry({ ...entryInfo, visitorCardCode });
      setMessage(`Đã xác nhận xe ${result?.licensePlate || licensePlate.toUpperCase()} vào bãi.`);
      setEntryInfo(null);
      setLicensePlate('');
      setVisitorCardCode('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Không thể xác nhận xe vào.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950">Xe vào bãi</h1>
        <p className="mt-2 text-sm text-slate-500">Kiểm tra thẻ xe đã đăng ký hoặc cấp thẻ khách vãng lai.</p>
      </div>

      {message && <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-bold text-sky-800">{message}</div>}

      <form onSubmit={handleCheck} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Biển số xe
          <input
            value={licensePlate}
            onChange={(event) => setLicensePlate(event.target.value)}
            placeholder="VD: 51F-12345"
            className="rounded-xl border border-slate-200 px-4 py-3 uppercase outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Loại xe
          <select value={vehicleType} onChange={(event) => setVehicleType(event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3">
            <option value="CAR">Ô tô</option>
            <option value="MOTORBIKE">Xe máy</option>
          </select>
        </label>
        <button type="submit" disabled={loading} className="rounded-xl bg-sky-600 px-5 py-3 font-black text-white sm:col-span-2">
          {loading ? 'Đang kiểm tra...' : 'Kiểm tra phương tiện'}
        </button>
      </form>

      {entryInfo && (
        <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Kết quả kiểm tra</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <Info label="Biển số" value={entryInfo.licensePlate || licensePlate.toUpperCase()} />
            <Info label="Loại vào bãi" value={entryInfo.entryType || '-'} />
            <Info label="Phương tiện" value={entryInfo.vehicleTypeName || entryInfo.vehicleType || vehicleType} />
            <Info label="Chủ xe" value={entryInfo.ownerName || entryInfo.userFullName || 'Khách vãng lai'} />
          </dl>
          {entryInfo.entryType === 'VISITOR' && (
            <input
              value={visitorCardCode}
              onChange={(event) => setVisitorCardCode(event.target.value)}
              placeholder="Nhập mã thẻ khách"
              className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          )}
          <button type="button" onClick={handleConfirm} disabled={loading} className="mt-5 w-full rounded-xl bg-emerald-600 px-5 py-3 font-black text-white">
            Xác nhận xe vào
          </button>
        </section>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <dt className="font-bold text-slate-400">{label}</dt>
      <dd className="mt-1 font-black text-slate-900">{value}</dd>
    </div>
  );
}
