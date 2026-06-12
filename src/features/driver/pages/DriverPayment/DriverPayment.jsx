import React from 'react';
import dayjs from 'dayjs';
import { useActiveParkingOrders } from '../../../../hooks/useActiveParkingOrders';
import DriverPageShell, { EmptyState } from '../../components/DriverPageShell';

export default function DriverPayment() {
  const { orders, loading, error, refetch } = useActiveParkingOrders();
  const activeOrder = Array.isArray(orders) ? orders[0] : null;

  return (
    <DriverPageShell
      title="Thanh toán"
      subtitle="Đã bỏ hóa đơn và QR mẫu. Trang thanh toán chỉ hiển thị dữ liệu khi backend có order thật."
    >
      {loading ? (
        <section className="rounded-xl border border-slate-100 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Đang tải phiên gửi xe...
        </section>
      ) : error ? (
        <section className="rounded-xl border border-red-100 bg-white p-6 shadow-sm">
          <p className="font-semibold text-red-600">Không thể tải phiên gửi xe</p>
          <p className="mt-1 text-sm text-slate-500">{error}</p>
          <button type="button" onClick={refetch} className="mt-4 rounded-lg bg-[#1e3a8a] px-4 py-2 text-sm font-semibold text-white">
            Thử lại
          </button>
        </section>
      ) : !activeOrder ? (
        <EmptyState
          title="Không có phiên cần thanh toán"
          description="Backend không trả về parking order ACTIVE cho tài khoản này. Khi có hóa đơn thật, thông tin thanh toán sẽ hiển thị tại đây."
        />
      ) : (
        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">Chi tiết phiên gửi xe</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                <dt className="text-slate-500">Mã phiên</dt>
                <dd className="font-semibold text-slate-800">#{activeOrder.orderId}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                <dt className="text-slate-500">Biển số</dt>
                <dd className="font-semibold text-slate-800">{activeOrder.licensePlate || '-'}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                <dt className="text-slate-500">Thời gian vào</dt>
                <dd className="font-semibold text-slate-800">
                  {activeOrder.entryTime ? dayjs(activeOrder.entryTime).format('DD/MM/YYYY HH:mm') : '-'}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-bold text-[#1e3a8a]">Phí tạm tính</dt>
                <dd className="text-xl font-bold text-[#1e3a8a]">
                  {Number(activeOrder.calculatedFee || 0).toLocaleString('vi-VN')} VNĐ
                </dd>
              </div>
            </dl>
          </div>

          <EmptyState
            title="Chưa có API thanh toán"
            description="Các phương thức thanh toán, QR banking và xác nhận thanh toán cần endpoint backend riêng. FE không còn hiển thị QR hoặc số tiền giả."
          />
        </section>
      )}
    </DriverPageShell>
  );
}
