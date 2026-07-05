import type { PermissionAction, PermissionModule, Role, RolePermissionSet, UserRoleAssignment } from './types';

export const ADMIN_CODE = 'ADMIN2026';

export const permissionActions: Array<{ key: PermissionAction; label: string }> = [
  { key: 'view', label: 'View' },
  { key: 'create', label: 'Create' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
];

export const permissionModules: Array<{ key: PermissionModule; label: string; description: string }> = [
  { key: 'parkingManagement', label: 'Quản lý bãi xe', description: 'Tòa nhà, facility, tầng và khu vực' },
  { key: 'slotManagement', label: 'Quản lý slot', description: 'Slot trống, đang dùng, đặt trước, bảo trì' },
  { key: 'parkingSession', label: 'Parking Session', description: 'Lượt xe vào, xe ra và vòng đời gửi xe' },
  { key: 'reservation', label: 'Đặt chỗ', description: 'Reservation của Driver' },
  { key: 'payment', label: 'Thanh toán', description: 'Giao dịch, hóa đơn và trạng thái phí' },
  { key: 'pricingPolicy', label: 'Chính sách giá', description: 'Bảng giá, phí phạt, phí qua đêm' },
  { key: 'reporting', label: 'Báo cáo', description: 'Doanh thu, lượt xe, occupancy rate' },
  { key: 'userManagement', label: 'Người dùng', description: 'Tài khoản và hồ sơ người dùng' },
  { key: 'systemConfiguration', label: 'Cấu hình hệ thống', description: 'Camera, RFID, QR, payment gateway' },
  { key: 'aiOptimization', label: 'AI Optimization', description: 'Gợi ý slot, dự đoán cao điểm, tối ưu luồng xe' },
];

export const defaultRoles: Role[] = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Toàn quyền quản trị hệ thống',
    status: 'Active',
    assignedUsers: 2,
    isSystemRole: true,
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Quản lý vận hành, cấu hình nghiệp vụ và báo cáo',
    status: 'Active',
    assignedUsers: 3,
    isSystemRole: true,
  },
  {
    id: 'staff',
    name: 'Staff',
    description: 'Nhân viên xử lý xe vào, xe ra và ngoại lệ',
    status: 'Active',
    assignedUsers: 8,
    isSystemRole: true,
  },
  {
    id: 'driver',
    name: 'Driver',
    description: 'Người gửi xe, đặt chỗ, thanh toán và gửi hỗ trợ',
    status: 'Active',
    assignedUsers: 120,
    isSystemRole: true,
  },
];

export const defaultUsers: UserRoleAssignment[] = [
  { userId: 'u-001', fullName: 'Đỗ Minh Đạt', email: 'dat@example.com', roleId: 'admin' },
  { userId: 'u-002', fullName: 'Võ Gia Phú', email: 'phu@example.com', roleId: 'manager' },
  { userId: 'u-003', fullName: 'Bùi Minh Duy', email: 'duy@example.com', roleId: 'staff' },
  { userId: 'u-004', fullName: 'Nguyễn Tiến Anh Quốc', email: 'quoc@example.com', roleId: 'driver' },
];

const full = { view: true, create: true, edit: true, delete: true };
const readOnly = { view: true, create: false, edit: false, delete: false };
const none = { view: false, create: false, edit: false, delete: false };

export const defaultRolePermissions: RolePermissionSet = {
  admin: {
    parkingManagement: full,
    slotManagement: full,
    parkingSession: full,
    reservation: full,
    payment: full,
    pricingPolicy: full,
    reporting: full,
    userManagement: full,
    systemConfiguration: full,
    aiOptimization: full,
  },
  manager: {
    parkingManagement: { view: true, create: true, edit: true, delete: false },
    slotManagement: { view: true, create: true, edit: true, delete: false },
    parkingSession: { view: true, create: false, edit: true, delete: false },
    reservation: readOnly,
    payment: readOnly,
    pricingPolicy: { view: true, create: true, edit: true, delete: false },
    reporting: readOnly,
    userManagement: readOnly,
    systemConfiguration: none,
    aiOptimization: { view: true, create: true, edit: true, delete: false },
  },
  staff: {
    parkingManagement: readOnly,
    slotManagement: { view: true, create: false, edit: true, delete: false },
    parkingSession: { view: true, create: true, edit: true, delete: false },
    reservation: { view: true, create: false, edit: true, delete: false },
    payment: { view: true, create: true, edit: false, delete: false },
    pricingPolicy: readOnly,
    reporting: none,
    userManagement: none,
    systemConfiguration: none,
    aiOptimization: readOnly,
  },
  driver: {
    parkingManagement: readOnly,
    slotManagement: readOnly,
    parkingSession: readOnly,
    reservation: { view: true, create: true, edit: true, delete: false },
    payment: { view: true, create: true, edit: false, delete: false },
    pricingPolicy: readOnly,
    reporting: none,
    userManagement: none,
    systemConfiguration: none,
    aiOptimization: none,
  },
};
