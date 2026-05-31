export type NotificationRole = 'admin' | 'staff';

export type NotificationItem = {
  id: string;
  title: string;
  preview: string;
  content: string;
  createdAt: string;
  sender: string;
  roles: NotificationRole[];
};

const notificationList: NotificationItem[] = [
  {
    id: 'notif-01',
    title: 'Báo cáo doanh thu hôm nay đã sẵn sàng',
    preview: 'Báo cáo doanh thu và lượt xe vào/ra đã được tổng hợp thành công.',
    content:
      'Báo cáo doanh thu và lượt xe vào/ra của hệ thống đã được tổng hợp. Vui lòng tải về để kiểm tra chi tiết các bãi xe, doanh thu theo ca và các điểm cần chú ý trong ngày.',
    createdAt: '2026-05-26T09:20:00',
    sender: 'Hệ thống Parking AI',
    roles: ['admin'],
  },
  {
    id: 'notif-02',
    title: 'Cảnh báo chỗ đỗ gần đầy',
    preview: 'Bãi xe A1 chỉ còn 8 chỗ trống. Vui lòng điều phối nhân viên.',
    content:
      'Bãi xe A1 hiện chỉ còn 8 chỗ trống. Hệ thống khuyến nghị chuyển khách sang bãi B2 hoặc kích hoạt thêm tuyến xe đưa đón để tránh tình trạng quá tải.',
    createdAt: '2026-05-26T11:34:00',
    sender: 'Hệ thống Parking AI',
    roles: ['admin', 'staff'],
  },
  {
    id: 'notif-03',
    title: 'Nhân viên cổng được yêu cầu xác nhận ca trực',
    preview: 'Ca trực buổi tối ngày 26/05/2026 cần 2 nhân viên bổ sung.',
    content:
      'Bạn cần xác nhận ca trực buổi tối tại cổng chính 1. Hệ thống đã gửi yêu cầu bổ sung nhân sự cho bộ phận vận hành. Vui lòng kiểm tra và cập nhật trạng thái kịp thời.',
    createdAt: '2026-05-26T13:10:00',
    sender: 'Phòng Vận hành',
    roles: ['staff'],
  },
  {
    id: 'notif-04',
    title: 'Thông báo bảo trì hệ thống vào cuối tuần',
    preview: 'Hệ thống sẽ bảo trì từ 22:00 đến 23:59 thứ Bảy tuần này.',
    content:
      'Để đảm bảo hoạt động ổn định, hệ thống sẽ tiến hành bảo trì vào cuối tuần. Trong thời gian này, các chức năng báo cáo và thanh toán trực tuyến có thể bị gián đoạn ngắn.',
    createdAt: '2026-05-25T17:45:00',
    sender: 'IT Support',
    roles: ['admin', 'staff'],
  },
];

const STORAGE_KEY = 'parking.notifications.read';

function loadReadState() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, boolean>;
  } catch {
    return {};
  }
}

function saveReadState(state: Record<string, boolean>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getNotificationsForRole(role: NotificationRole) {
  const readState = loadReadState();

  return notificationList
    .filter((notification) => notification.roles.includes(role))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((notification) => ({
      ...notification,
      unread: !readState[notification.id],
    }));
}

export function getNotificationById(id: string) {
  return notificationList.find((notification) => notification.id === id);
}

export function getUnreadCount(role: NotificationRole) {
  const readState = loadReadState();
  return notificationList.filter(
    (notification) => notification.roles.includes(role) && !readState[notification.id],
  ).length;
}

export function markNotificationAsRead(id: string) {
  const readState = loadReadState();
  if (!readState[id]) {
    saveReadState({
      ...readState,
      [id]: true,
    });
  }
}
