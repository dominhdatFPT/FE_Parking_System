import React from 'react';
import { useAuth } from '../../../../contexts/useAuth';
import DriverPageShell, { EmptyState } from '../../components/DriverPageShell';

export default function DriverProfile() {
  const { user } = useAuth();
  const displayName = user?.fullName || user?.name || 'Người dùng';

  return (
    <DriverPageShell
      title="Hồ sơ cá nhân"
      subtitle="Thông tin tài khoản lấy từ dữ liệu đăng nhập hiện tại."
    >
      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-xl border border-slate-100 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#1e3a8a] text-3xl font-bold text-white">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-800">{displayName}</h2>
          <p className="mt-1 text-sm text-slate-500">{user?.email || 'Chưa có email'}</p>
          <div className="mt-6 rounded-lg bg-slate-50 px-4 py-3 text-left text-sm">
            <p className="text-slate-500">Role</p>
            <p className="font-semibold text-slate-800">{user?.role || 'driver'}</p>
          </div>
        </div>

        <div className="space-y-6">
          <EmptyState
            title="Chưa có API danh sách xe"
            description="Các xe mẫu đã được gỡ bỏ. Cần endpoint phương tiện của customer để hiển thị, thêm, sửa hoặc xoá xe thật."
          />
          <EmptyState
            title="Chưa có API ví/thống kê tài khoản"
            description="Số dư ví, số lượt gửi xe theo tháng và ưu đãi không còn dùng dữ liệu mẫu."
          />
        </div>
      </section>
    </DriverPageShell>
  );
}
