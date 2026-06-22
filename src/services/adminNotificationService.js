import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';
import { formatVietnamDate } from '../utils/dateTime';

const unwrapData = (response) => response.data?.data ?? response.data;

const unwrapList = (response) => {
  const payload = unwrapData(response);
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.items)) return payload.items;
  return Array.isArray(payload) ? payload : [];
};

const formatDate = (value) => {
  return formatVietnamDate(value) || (value ? String(value) : '');
};

const mapStatusToView = (status = '') => {
  const value = String(status).toUpperCase();
  if (value === 'SENT' || value === 'DA_GUI' || value === 'ĐÃ GỬI') return 'Đã gửi';
  if (value === 'SCHEDULED' || value === 'HEN_LICH' || value === 'HẸN LỊCH') return 'Hẹn lịch';
  return 'Nháp';
};

const mapPriorityToView = (priority = '') => {
  const value = String(priority).toUpperCase();
  if (value === 'IMPORTANT' || value === 'QUAN_TRONG' || value === 'QUAN TRỌNG') return 'Quan trọng';
  return 'Thường';
};

const mapStatusToApi = (status = '') => {
  if (status === 'Đã gửi') return 'SENT';
  if (status === 'Hẹn lịch') return 'SCHEDULED';
  return 'DRAFT';
};

const mapPriorityToApi = (priority = '') => (priority === 'Quan trọng' ? 'IMPORTANT' : 'NORMAL');

const normalizeNotification = (item = {}) => ({
  id: item.id ?? item.notificationId,
  title: item.title ?? '',
  content: item.content ?? item.message ?? '',
  type: item.type ?? item.category ?? 'Hệ thống',
  target: item.target ?? item.recipientTarget ?? item.audience ?? 'Tất cả user',
  priority: mapPriorityToView(item.priority),
  status: mapStatusToView(item.status),
  createdAt: formatDate(item.createdAt ?? item.createdDate ?? item.created_at),
});

const buildPayload = (notification, status) => ({
  title: notification.title,
  content: notification.content,
  type: notification.type,
  target: notification.target,
  priority: mapPriorityToApi(notification.priority),
  status: mapStatusToApi(status),
});

export const getAdminNotifications = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN_NOTIFICATIONS.BASE, {
    params: { page: 0, size: 100 },
  });

  return unwrapList(response).map(normalizeNotification);
};

export const createAdminNotification = async (notification, status) => {
  const response = await apiClient.post(
    API_ENDPOINTS.ADMIN_NOTIFICATIONS.BASE,
    buildPayload(notification, status),
  );

  return normalizeNotification(unwrapData(response));
};

export const updateAdminNotification = async (id, notification, status) => {
  const response = await apiClient.put(
    API_ENDPOINTS.ADMIN_NOTIFICATIONS.DETAIL(id),
    buildPayload(notification, status),
  );

  return normalizeNotification(unwrapData(response));
};

export const deleteAdminNotification = async (id) => {
  await apiClient.delete(API_ENDPOINTS.ADMIN_NOTIFICATIONS.DETAIL(id));
};

export const sendAdminNotification = async (id) => {
  const response = await apiClient.patch(API_ENDPOINTS.ADMIN_NOTIFICATIONS.SEND(id));
  return normalizeNotification(unwrapData(response));
};
