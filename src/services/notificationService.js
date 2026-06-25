import { apiClient } from './apiClient';
import { apiDateTimeMillis } from '../utils/dateTime';
import { getStaffOperationsDashboard } from './staffService';

export const NOTIFICATION_CATEGORIES = {
  HE_THONG: 'Hệ thống',
  BAO_TRI: 'Bảo trì',
  GOI_GUI_XE: 'Gói gửi xe',
  THANH_TOAN: 'Thanh toán',
  SU_CO: 'Sự cố',
};

export const CATEGORY_META = {
  'Hệ thống':    { label: 'Hệ thống',   tone: 'sky'     },
  'Bảo trì':     { label: 'Bảo trì',    tone: 'cyan'    },
  'Gói gửi xe':  { label: 'Gói gửi xe', tone: 'violet'  },
  'Thanh toán':  { label: 'Thanh toán', tone: 'emerald' },
  'Sự cố':       { label: 'Sự cố',      tone: 'orange'  },
};

const TONE_CLASSES = {
  sky:     'bg-sky-50 text-sky-600 border-sky-200',
  cyan:    'bg-cyan-50 text-cyan-600 border-cyan-200',
  violet:  'bg-violet-50 text-violet-600 border-violet-200',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  purple:  'bg-purple-50 text-purple-600 border-purple-200',
  orange:  'bg-orange-50 text-orange-600 border-orange-200',
  red:     'bg-red-50 text-red-600 border-red-200',
  slate:   'bg-slate-50 text-slate-600 border-slate-200',
};

export function getCategoryToneClass(category) {
  const meta = CATEGORY_META[category];
  return TONE_CLASSES[meta?.tone] || TONE_CLASSES.slate;
}

export function getCategoryLabel(category) {
  return CATEGORY_META[category]?.label || category;
}

export const notificationService = {
  async getActiveNotifications({ page = 0, size = 10 } = {}) {
    try {
      const response = await apiClient.get('/api/v1/notifications', {
        params: { page, size },
      });
      return {
        data: response.data?.content || [],
        page: response.data || null,
        error: null,
      };
    } catch (error) {
      console.warn('[notificationService.getActiveNotifications]', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      return { data: [], page: null, error };
    }
  },

  async getNotificationDetail(id) {
    try {
      const response = await apiClient.get(`/api/v1/notifications/${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      console.warn('[notificationService.getNotificationDetail]', {
        id,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      return { data: null, error };
    }
  },

  async registerDeviceToken({ token, platform }) {
    try {
      await apiClient.post('/api/v1/notifications/register-token', {
        token,
        platform,
      });
      return { error: null };
    } catch (error) {
      console.warn('[notificationService.registerDeviceToken]', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      return { error };
    }
  },
};

const relativeTime = (value) => {
  if (!value) return '—';
  const minutes = Math.max(0, Math.floor((Date.now() - apiDateTimeMillis(value)) / 60000));
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
  const activities = (dashboard?.recentVehicleActivities || []).map((item) => ({
    id: `activity-${item.id}`,
    title: item.exitTime ? 'Xe đã ra bãi' : 'Xe đã vào bãi',
    message: `${item.licensePlate || '—'} · ${item.vehicleType || '—'} · ${item.status || '—'}`,
    type: 'success',
    time: relativeTime(item.updatedAt || item.entryTime),
    createdAt: item.updatedAt || item.entryTime,
  }));
  return [...incidents, ...activities]
    .sort((a, b) => apiDateTimeMillis(b.createdAt || 0) - apiDateTimeMillis(a.createdAt || 0))
    .slice(0, 20);
}

export async function getDatabaseNotificationById(id) {
  const items = await getDatabaseNotifications();
  return items.find((item) => item.id === id);
}
