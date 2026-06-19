import { getStaffOperationsDashboard } from './staffService';

const relativeTime = (value) => {
  if (!value) return '—';
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} giờ trước`;
  return `${Math.floor(minutes / 1440)} ngày trước`;
};

export async function getDatabaseNotifications() {
  const dashboard = await getStaffOperationsDashboard();
  const incidents = (dashboard?.recentIncidents || []).map((item) => ({
    id: `incident-${item.id}`,
    title: item.title || item.type || 'Sự cố bãi xe',
    message: item.description || `Sự cố liên quan đến biển số ${item.licensePlate || '—'}`,
    type: 'critical',
    time: relativeTime(item.createdAt),
    createdAt: item.createdAt,
  }));
  const bookings = (dashboard?.pendingBookings || []).map((item) => ({
    id: `booking-${item.id}`,
    title: 'Booking đang chờ xử lý',
    message: `${item.userFullName || `Khách hàng #${item.userId}`} · ${item.parkingName || 'Bãi xe'} · ${item.status}`,
    type: 'warning',
    time: relativeTime(item.createdAt),
    createdAt: item.createdAt,
  }));
  const activities = (dashboard?.recentVehicleActivities || []).map((item) => ({
    id: `activity-${item.id}`,
    title: item.exitTime ? 'Xe đã ra bãi' : 'Xe đã vào bãi',
    message: `${item.licensePlate || '—'} · ${item.vehicleType || '—'} · ${item.status || '—'}`,
    type: 'success',
    time: relativeTime(item.updatedAt || item.entryTime),
    createdAt: item.updatedAt || item.entryTime,
  }));
  return [...incidents, ...bookings, ...activities]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 20);
}

export async function getDatabaseNotificationById(id) {
  const items = await getDatabaseNotifications();
  return items.find((item) => item.id === id);
}
