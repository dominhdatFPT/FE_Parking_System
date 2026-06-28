import { ROUTES } from '../../constants/routes';

export type UserRole = 'admin' | 'staff';

export type SettingItem = {
  id: string;
  label: string;
  icon: string;
  to: string;
  roles: UserRole[];
  description?: string;
};

export const SETTINGS_ITEMS: SettingItem[] = [
  { id: 'profile', label: 'Hồ sơ cá nhân', icon: 'account_circle', to: ROUTES.SETTINGS.PROFILE, roles: ['admin', 'staff'], description: 'Cập nhật thông tin cá nhân và liên hệ của bạn.' },
  { id: 'password', label: 'Đổi mật khẩu', icon: 'lock', to: ROUTES.SETTINGS.PASSWORD, roles: ['admin', 'staff'], description: 'Bảo vệ tài khoản với mật khẩu mới an toàn hơn.' },
  { id: 'notifications', label: 'Cài đặt thông báo', icon: 'notifications', to: ROUTES.SETTINGS.NOTIFICATIONS, roles: ['admin', 'staff'], description: 'Điều khiển loại thông báo bạn muốn nhận.' },
  { id: 'language', label: 'Ngôn ngữ', icon: 'language', to: ROUTES.SETTINGS.LANGUAGE, roles: ['admin', 'staff'], description: 'Thay đổi ngôn ngữ hiển thị dashboard.' },
  { id: 'system', label: 'Cài đặt hệ thống', icon: 'settings', to: ROUTES.SETTINGS.SYSTEM, roles: ['admin'], description: 'Thiết lập cấu hình chung cho hệ thống.' },
  { id: 'security-logs', label: 'Nhật ký bảo mật', icon: 'history', to: ROUTES.SETTINGS.SECURITY_LOGS, roles: ['admin'], description: 'Xem lại hoạt động bảo mật và lịch sử truy cập.' },
];

export const SETTINGS_SECTIONS: Record<string, { title: string; description: string; content?: string }> = {
  profile: {
    title: 'Hồ sơ cá nhân',
    description: 'Cập nhật thông tin cá nhân và liên hệ của bạn.',
    content:
      'Ở đây bạn có thể chỉnh sửa tên, email và thông tin hiển thị. Việc cập nhật xảy ra ngay lập tức trong dashboard.',
  },
  password: {
    title: 'Đổi mật khẩu',
    description: 'Bảo vệ tài khoản với mật khẩu mới an toàn hơn.',
    content:
      'Nhập mật khẩu hiện tại và mật khẩu mới. Mật khẩu nên chứa tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số.',
  },
  notifications: {
    title: 'Cài đặt thông báo',
    description: 'Điều khiển loại thông báo bạn muốn nhận.',
    content:
      'Bật hoặc tắt thông báo email, push và cảnh báo thời gian thực cho hệ thống quản lý bãi đỗ.',
  },
  language: {
    title: 'Ngôn ngữ',
    description: 'Thay đổi ngôn ngữ hiển thị dashboard.',
    content:
      'Chọn ngôn ngữ phù hợp để nội dung và các điều hướng hiển thị rõ ràng hơn với bạn.',
  },
  system: {
    title: 'Cài đặt hệ thống',
    description: 'Thiết lập cấu hình chung cho hệ thống Parking AI.',
    content:
      'Quản trị hệ thống có thể chỉnh sửa các cấu hình mặc định, quy tắc bảo mật và tham số vận hành.',
  },
  'security-logs': {
    title: 'Nhật ký bảo mật',
    description: 'Xem lại hoạt động bảo mật và lịch sử truy cập.',
    content:
      'Theo dõi sự kiện đăng nhập, thay đổi cấu hình và các cảnh báo bảo mật quan trọng trong hệ thống.',
  },
};

export default SETTINGS_ITEMS;
