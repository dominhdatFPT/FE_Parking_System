export type NotificationRole = 'admin' | 'staff';

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'success';
  time: string;
  isRead: boolean;
  roles: NotificationRole[];
};

const notificationList: NotificationItem[] = [
  {
    id: '1',
    title: 'Camera AI tầng B2 mất kết nối',
    message: 'Camera AI tại tầng B2 không gửi dữ liệu trong 2 phút gần đây.',
    type: 'critical',
    time: '2 phút trước',
    isRead: false,
    roles: ['admin'],
  },
  {
    id: '2',
    title: 'Barrier cổng A1 phản hồi chậm',
    message: 'Thiết bị barrier tại cổng A1 phản hồi chậm hơn bình thường.',
    type: 'warning',
    time: '10 phút trước',
    isRead: false,
    roles: ['admin'],
  },
  {
    id: '3',
    title: 'Sao lưu dữ liệu thành công',
    message: 'Hệ thống đã sao lưu dữ liệu lúc 02:00 sáng nay.',
    type: 'success',
    time: '1 giờ trước',
    isRead: true,
    roles: ['admin'],
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

function isNotificationRead(notification: NotificationItem, readState: Record<string, boolean>) {
  if (Object.prototype.hasOwnProperty.call(readState, notification.id)) {
    return readState[notification.id];
  }
  return notification.isRead;
}

export function getNotificationsForRole(role: NotificationRole) {
  const readState = loadReadState();

  return notificationList
    .filter((notification) => notification.roles.includes(role))
    .map((notification) => ({
      ...notification,
      isRead: isNotificationRead(notification, readState),
      unread: !isNotificationRead(notification, readState),
    }))
    .sort((a, b) => Number(a.isRead) - Number(b.isRead));
}

export function getNotificationById(id: string) {
  const notification = notificationList.find((item) => item.id === id);
  if (!notification) {
    return undefined;
  }

  const readState = loadReadState();
  return {
    ...notification,
    isRead: isNotificationRead(notification, readState),
  };
}

export function getUnreadCount(role: NotificationRole) {
  const readState = loadReadState();
  return notificationList.filter(
    (notification) => notification.roles.includes(role) && !isNotificationRead(notification, readState),
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

export function markNotificationAsUnread(id: string) {
  const readState = loadReadState();
  if (Object.prototype.hasOwnProperty.call(readState, id)) {
    const nextState = { ...readState };
    delete nextState[id];
    saveReadState(nextState);
  }
}
