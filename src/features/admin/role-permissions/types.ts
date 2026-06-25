export type RoleStatus = 'Active' | 'Inactive';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete';

export type PermissionModule =
  | 'parkingManagement'
  | 'slotManagement'
  | 'parkingSession'
  | 'vehicleRegistration'
  | 'payment'
  | 'pricingPolicy'
  | 'reporting'
  | 'userManagement'
  | 'systemConfiguration'
  | 'aiOptimization';

export type Role = {
  id: string;
  name: string;
  description: string;
  status: RoleStatus;
  assignedUsers: number;
  isSystemRole?: boolean;
};

export type UserRoleAssignment = {
  userId: string;
  fullName: string;
  email: string;
  roleId: string;
};

export type PermissionMatrix = Record<PermissionModule, Record<PermissionAction, boolean>>;

export type RolePermissionSet = Record<string, PermissionMatrix>;

export type SecurityLog = {
  id: string;
  action: string;
  status: 'Success' | 'Failed' | 'Blocked';
  message: string;
  createdAt: string;
};
