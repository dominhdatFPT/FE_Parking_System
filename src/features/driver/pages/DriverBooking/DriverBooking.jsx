import React, { useState } from 'react';
import DriverPageShell, { EmptyState } from '../../components/DriverPageShell';

export default function DriverBooking() {
  const [form, setForm] = useState({
    licensePlate: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
  });

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  return (
    <DriverPageShell
      title="Đặt chỗ đỗ xe"
      subtitle="Form này đã bỏ dữ liệu mẫu. Danh sách chỗ đỗ sẽ hiển thị khi backend có bảng/API parking slots hợp lệ."
    >
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">Thông tin đặt chỗ</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="font-semibold text-slate-600">Ngày đỗ xe</span>
              <input type="date" value={form.bookingDate} onChange={updateField('bookingDate')} className="rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-semibold text-slate-600">Biển số xe</span>
              <input type="text" value={form.licensePlate} onChange={updateField('licensePlate')} placeholder="Nhập biển số xe" className="rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-semibold text-slate-600">Giờ vào dự kiến</span>
              <input type="time" value={form.startTime} onChange={updateField('startTime')} className="rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-semibold text-slate-600">Giờ ra dự kiến</span>
              <input type="time" value={form.endTime} onChange={updateField('endTime')} className="rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">Tóm tắt</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Biển số</dt>
              <dd className="font-semibold text-slate-800">{form.licensePlate || '-'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Ngày</dt>
              <dd className="font-semibold text-slate-800">{form.bookingDate || '-'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Thời gian</dt>
              <dd className="font-semibold text-slate-800">{form.startTime && form.endTime ? `${form.startTime} - ${form.endTime}` : '-'}</dd>
            </div>
          </dl>
          <button type="button" disabled className="mt-6 w-full rounded-lg bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-500">
            Chưa thể đặt chỗ
          </button>
        </div>
      </section>

      <EmptyState
        title="Chưa có dữ liệu chỗ đỗ thật"
        description="Endpoint parking slots đang lỗi vì DB thiếu bảng `parking_slots`. Sau khi tạo bảng hoặc đổi backend sang bảng đúng, FE có thể render danh sách chỗ trống từ API."
      />
    </DriverPageShell>
  );
}
