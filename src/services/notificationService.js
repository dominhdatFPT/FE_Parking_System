import { apiClient } from './apiClient';

export const NOTIFICATION_CATEGORIES = {
  THONG_TIN: 'THONG_TIN',
  CHINH_SACH: 'CHINH_SACH',
  CANH_BAO: 'CANH_BAO',
  BAO_TRI: 'BAO_TRI',
};

export const CATEGORY_META = {
  THONG_TIN:  { label: 'Thông tin',   tone: 'sky'     },
  CHINH_SACH: { label: 'Chính sách',  tone: 'purple'  },
  CANH_BAO:   { label: 'Cảnh báo',    tone: 'orange'  },
  BAO_TRI:    { label: 'Bảo trì',     tone: 'red'     },
};

const TONE_CLASSES = {
  sky:    'bg-sky-50 text-sky-600 border-sky-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
  red:    'bg-red-50 text-red-600 border-red-200',
  slate:  'bg-slate-50 text-slate-600 border-slate-200',
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
