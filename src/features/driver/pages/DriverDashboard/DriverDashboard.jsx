import React from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../../contexts/useAuth';
import { useActiveParkingOrders } from '../../../../hooks/useActiveParkingOrders';
import DriverPageShell, { EmptyState } from '../../components/DriverPageShell';

function groupActiveOrdersByFloor(orders) {
  return orders.reduce((acc, order) => {
    const floorName = order.floorName || 'Chưa xác định';
    acc[floorName] = (acc[floorName] || 0) + 1;
    return acc;
  }, {});
}

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, loading, error, refetch } = useActiveParkingOrders();
  const activeOrders = Array.isArray(orders) ? orders : [];
  const floorCounts = groupActiveOrdersByFloor(activeOrders);
  const displayName = user?.fullName || user?.name || 'Bạn';

  return (
    <DriverPageShell
      title={`Xin chào, ${displayName}`}
      subtitle="Thông tin bên dưới được lấy từ backend theo tài khoản đang đăng nhập."
    >
      {loading ? (
        <section className="rounded-xl border border-slate-100 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Đang tải thông tin xe đang gửi...
        </section>
      ) : error ? (
        <section className="rounded-xl border border-red-100 bg-white p-6 shadow-sm">
          <p className="font-semibold text-red-600">Không thể tải dữ liệu xe đang gửi</p>
          <p className="mt-1 text-sm text-slate-500">{error}</p>
          <button type="button" onClick={refetch} className="mt-4 rounded-lg bg-[#1e3a8a] px-4 py-2 text-sm font-semibold text-white">
            Thử lại
          </button>
        </section>
      ) : activeOrders.length === 0 ? (
        <EmptyState
          title="Không có xe đang gửi"
          description="Backend trả về danh sách trống cho tài khoản hiện tại. Khi có parking order ACTIVE, dữ liệu sẽ xuất hiện tại đây."
          actionLabel="Đặt chỗ"
          onAction={() => navigate('/driver-booking')}
        />
      ) : (
        <section className="space-y-4">
          {activeOrders.slice(0, 3).map((order) => (
            <article key={order.orderId} className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-800">{order.licensePlate || 'Chưa có biển số'}</h2>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {order.parkingStatus || 'ACTIVE'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{order.vehicleTypeName || 'Chưa có loại xe'}</p>
                </div>

                <dl className="grid gap-4 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Vị trí</dt>
                    <dd className="mt-1 font-semibold text-slate-800">{order.parkingName || '-'}</dd>
                    <dd className="text-slate-500">{order.floorName || ''}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Thời gian vào</dt>
                    <dd className="mt-1 font-semibold text-slate-800">
                      {order.entryTime ? dayjs(order.entryTime).format('HH:mm') : '-'}
                    </dd>
                    <dd className="text-slate-500">{order.entryTime ? dayjs(order.entryTime).format('DD/MM/YYYY') : ''}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Phí tạm tính</dt>
                    <dd className="mt-1 text-lg font-bold text-[#1e3a8a]">
                      {Number(order.calculatedFee || 0).toLocaleString('vi-VN')} VNĐ
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">Tình trạng theo dữ liệu hiện có</h2>
          <p className="mt-1 text-sm text-slate-500">
            DB hiện chưa có bảng `parking_slots`, nên FE không thể tính số chỗ trống thật. Phần này chỉ thống kê xe ACTIVE theo tầng từ parking orders.
          </p>
          <div className="mt-5 space-y-3">
            {Object.keys(floorCounts).length === 0 ? (
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500">Chưa có dữ liệu tầng.</p>
            ) : (
              Object.entries(floorCounts).map(([floor, count]) => (
                <div key={floor} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                  <span className="font-semibold text-slate-700">{floor}</span>
                  <span className="text-sm font-bold text-[#1e3a8a]">{count} xe đang gửi</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">Dữ liệu chưa có API</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-500">
            <p className="rounded-lg bg-slate-50 px-3 py-2">Biểu phí gửi xe chưa có endpoint backend.</p>
            <p className="rounded-lg bg-slate-50 px-3 py-2">Thông báo người dùng chưa có endpoint backend.</p>
            <p className="rounded-lg bg-slate-50 px-3 py-2">Sức chứa/chỗ trống cần bảng hoặc API slot hợp lệ.</p>
          </div>
        </div>
      </section>
    </DriverPageShell>
  );
}
