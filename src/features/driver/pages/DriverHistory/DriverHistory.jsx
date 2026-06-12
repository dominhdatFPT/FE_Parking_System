import React from 'react';
import DriverPageShell, { EmptyState } from '../../components/DriverPageShell';

export default function DriverHistory() {
  return (
    <DriverPageShell
      title="Lịch sử gửi xe"
      subtitle="Đã bỏ danh sách lịch sử mẫu. Trang này cần endpoint lịch sử parking orders của user để hiển thị dữ liệu thật."
    >
      <EmptyState
        title="Chưa có API lịch sử gửi xe"
        description="Backend hiện chỉ có endpoint xe đang gửi ACTIVE. Cần bổ sung endpoint trả về các parking orders đã hoàn tất hoặc tất cả orders của customer."
      />
    </DriverPageShell>
  );
}
