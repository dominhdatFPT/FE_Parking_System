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
    id: 'booking-approved',
    title: 'Booking approved',
    message: 'Monthly parking request for plate 51A-248.19 has been approved.',
    type: 'success',
    time: '2 min ago',
    isRead: false,
    roles: ['admin', 'staff'],
  },
  {
    id: 'booking-rejected',
    title: 'Booking rejected',
    message: 'Booking request BK-1048 was rejected because the selected zone is full.',
    type: 'warning',
    time: '8 min ago',
    isRead: false,
    roles: ['admin'],
  },
  {
    id: 'vehicle-entered',
    title: 'Vehicle entered',
    message: 'Vehicle 59B1-882.33 entered Gate A and was assigned to Zone B1.',
    type: 'success',
    time: '12 min ago',
    isRead: true,
    roles: ['admin', 'staff'],
  },
  {
    id: 'vehicle-exited',
    title: 'Vehicle exited',
    message: 'Vehicle 30F-921.04 exited after 2h 18m. Payment was completed.',
    type: 'success',
    time: '24 min ago',
    isRead: true,
    roles: ['admin', 'staff'],
  },
  {
    id: 'incident-alert',
    title: 'Incident alert',
    message: 'Barrier sensor at Gate C reported an abnormal stop event.',
    type: 'critical',
    time: '31 min ago',
    isRead: false,
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
