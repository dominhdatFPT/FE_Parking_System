import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ROUTES } from '../../../../constants/routes';
import { STORAGE_KEYS } from '../../../../constants/storageKeys';
import { ADMIN_CODE, permissionActions, permissionModules } from '../data';
import {
  getSecurityLogs,
  getStoredPermissions,
  getStoredRoles,
  getStoredUsers,
  saveRolePermissionState,
  writeSecurityLog,
} from '../services/rolePermissionStorage';
import type { PermissionAction, PermissionMatrix, PermissionModule, Role, RolePermissionSet } from '../types';
import './RolePermissionPage.css';

const emptyPermissionRow = { view: false, create: false, edit: false, delete: false };

function createEmptyMatrix(): PermissionMatrix {
  return permissionModules.reduce((matrix, moduleItem) => {
    matrix[moduleItem.key] = { ...emptyPermissionRow };
    return matrix;
  }, {} as PermissionMatrix);
}

function verifyAdminCode(code: string) {
  return code.trim() === ADMIN_CODE;
}

function Icon({ name }: { name: string }) {
  return (
    <span className="material-symbols-outlined" aria-hidden="true">
      {name}
    </span>
  );
}

export default function RolePermissionPage() {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [roles, setRoles] = useState<Role[]>(getStoredRoles);
  const [permissions, setPermissions] = useState<RolePermissionSet>(getStoredPermissions);
  const [users, setUsers] = useState(getStoredUsers);
  const [securityLogs, setSecurityLogs] = useState(getSecurityLogs);
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id ?? 'admin');
  const [searchValue, setSearchValue] = useState('');
  const [message, setMessage] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [operationCode, setOperationCode] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.userId ?? '');
  const [assignRoleId, setAssignRoleId] = useState(roles[0]?.id ?? 'admin');

  const selectedRole = roles.find((role) => role.id === selectedRoleId) ?? roles[0];
  const selectedPermissions = permissions[selectedRole.id] ?? createEmptyMatrix();

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(ROUTES.ADMIN.DASHBOARD);
  }

  function handleLogout() {
    window.localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    window.localStorage.removeItem(STORAGE_KEYS.USER);
    window.sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    window.sessionStorage.removeItem(STORAGE_KEYS.USER);
    navigate(ROUTES.LOGIN);
  }

  const filteredRoles = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    if (!keyword) {
      return roles;
    }

    return roles.filter((role) => {
      return role.name.toLowerCase().includes(keyword) || role.description.toLowerCase().includes(keyword);
    });
  }, [roles, searchValue]);

  function refreshLogs() {
    setSecurityLogs(getSecurityLogs());
  }

  function rejectOperation(action: string, reason: string) {
    writeSecurityLog({ action, status: 'Failed', message: reason });
    refreshLogs();
    setMessage(reason);
  }

  function requireOperationCode(action: string) {
    if (!verifyAdminCode(operationCode)) {
      rejectOperation(action, 'Admin Code không hợp lệ. Thao tác đã bị từ chối và ghi log bảo mật.');
      return false;
    }

    setOperationCode('');
    return true;
  }

  function persist(nextRoles = roles, nextPermissions = permissions, nextUsers = users) {
    saveRolePermissionState(nextRoles, nextPermissions, nextUsers);
  }

  function handleAccessSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!verifyAdminCode(adminCode)) {
      writeSecurityLog({
        action: 'Access role permission screen',
        status: 'Blocked',
        message: 'Nhập sai Admin Code khi truy cập màn hình phân quyền.',
      });
      refreshLogs();
      setAuthError('Admin Code không đúng. Bạn không được phép truy cập màn hình này.');
      return;
    }

    writeSecurityLog({
      action: 'Access role permission screen',
      status: 'Success',
      message: 'Xác thực Admin Code thành công.',
    });
    refreshLogs();
    setIsVerified(true);
  }

  function togglePermission(moduleKey: PermissionModule, actionKey: PermissionAction) {
    setPermissions((currentPermissions) => ({
      ...currentPermissions,
      [selectedRole.id]: {
        ...selectedPermissions,
        [moduleKey]: {
          ...selectedPermissions[moduleKey],
          [actionKey]: !selectedPermissions[moduleKey][actionKey],
        },
      },
    }));
    setMessage('Quyền đã thay đổi, cần nhập Admin Code và lưu để cập nhật hệ thống.');
  }

  function handleCreateRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!requireOperationCode('Create role')) {
      return;
    }

    const trimmedName = newRoleName.trim();
    if (!trimmedName) {
      setMessage('Tên Role không được để trống.');
      return;
    }

    const newRole: Role = {
      id: `role-${Date.now()}`,
      name: trimmedName,
      description: newRoleDescription.trim() || 'Role mới trong hệ thống',
      status: 'Active',
      assignedUsers: 0,
    };
    const nextRoles = [...roles, newRole];
    const nextPermissions = { ...permissions, [newRole.id]: createEmptyMatrix() };

    setRoles(nextRoles);
    setPermissions(nextPermissions);
    setSelectedRoleId(newRole.id);
    setNewRoleName('');
    setNewRoleDescription('');
    persist(nextRoles, nextPermissions, users);
    writeSecurityLog({ action: 'Create role', status: 'Success', message: `Đã tạo role ${newRole.name}.` });
    refreshLogs();
    setMessage('Đã tạo Role mới và cập nhật danh sách.');
  }

  function handleSavePermissions() {
    if (!requireOperationCode('Update role permissions')) {
      return;
    }

    persist();
    writeSecurityLog({
      action: 'Update role permissions',
      status: 'Success',
      message: `Đã cập nhật quyền cho role ${selectedRole.name}.`,
    });
    refreshLogs();
    setMessage('Đã lưu thay đổi phân quyền.');
  }

  function handleDeleteRole() {
    if (selectedRole.isSystemRole) {
      setMessage('Không được xóa role hệ thống mặc định.');
      return;
    }

    if (selectedRole.assignedUsers > 0) {
      writeSecurityLog({
        action: 'Delete role',
        status: 'Blocked',
        message: `Không cho phép xóa ${selectedRole.name} vì đang được gán cho user.`,
      });
      refreshLogs();
      setMessage('Role đang được gán cho user, không thể xóa.');
      return;
    }

    if (!requireOperationCode('Delete role')) {
      return;
    }

    const nextRoles = roles.filter((role) => role.id !== selectedRole.id);
    const nextPermissions = { ...permissions };
    delete nextPermissions[selectedRole.id];

    setRoles(nextRoles);
    setPermissions(nextPermissions);
    setSelectedRoleId(nextRoles[0]?.id ?? '');
    persist(nextRoles, nextPermissions, users);
    writeSecurityLog({ action: 'Delete role', status: 'Success', message: `Đã xóa role ${selectedRole.name}.` });
    refreshLogs();
    setMessage('Đã xóa Role và cập nhật danh sách.');
  }

  function handleAssignRole() {
    if (!requireOperationCode('Assign role to user')) {
      return;
    }

    const previousUsers = users;
    const nextUsers = users.map((user) => (user.userId === selectedUserId ? { ...user, roleId: assignRoleId } : user));
    const nextRoles = roles.map((role) => {
      const assignedUsers = nextUsers.filter((user) => user.roleId === role.id).length;
      return { ...role, assignedUsers };
    });

    setUsers(nextUsers);
    setRoles(nextRoles);
    persist(nextRoles, permissions, nextUsers);
    writeSecurityLog({
      action: 'Assign role to user',
      status: 'Success',
      message: `Đã gán role ${assignRoleId} cho user ${selectedUserId}.`,
    });
    refreshLogs();
    setMessage(previousUsers === nextUsers ? 'Không có thay đổi.' : 'Đã gán Role cho User và cập nhật quyền.');
  }

  if (!isVerified) {
    return (
      <main className="rbac-access">
        <form className="rbac-access__card" onSubmit={handleAccessSubmit}>
          <p className="rbac-eyebrow">Admin Code Required</p>
          <button className="rbac-back-button" onClick={handleBack} type="button">
            Quay lại
          </button>
          <h1>Xác thực quyền truy cập</h1>
          <p>Nhập Admin Code để mở màn hình phân quyền. Nếu nhập sai, hệ thống sẽ từ chối truy cập và ghi log bảo mật.</p>
          <input
            autoFocus
            onChange={(event) => setAdminCode(event.target.value)}
            placeholder="Ví dụ: ADMIN2026"
            type="password"
            value={adminCode}
          />
          {authError ? <strong className="rbac-error">{authError}</strong> : null}
          <button type="submit">Xác thực</button>
        </form>
      </main>
    );
  }

  return (
    <div className="rbac-page">
      <aside className="rbac-sidebar">
        <div className="rbac-sidebar__brand">
          <div className="rbac-sidebar__logo">
            <Icon name="local_parking" />
          </div>
          <div>
            <strong>Smart Parking AI</strong>
            <span>System Administrator</span>
          </div>
        </div>
        <nav>
          <Link to={ROUTES.ADMIN.DASHBOARD}>
            <Icon name="dashboard" />
            Tổng quan
          </Link>
          <Link to={ROUTES.ADMIN.USERS}>
            <Icon name="manage_accounts" />
            Quản lý tài khoản
          </Link>
          <Link className="active" to={ROUTES.ADMIN.ROLES}>
            <Icon name="security" />
            Phân quyền
          </Link>
          <Link to={ROUTES.ADMIN.SYSTEM_CONFIG}>
            <Icon name="settings" />
            Cấu hình hệ thống
          </Link>
          <Link to={ROUTES.ADMIN.AUDIT_LOG}>
            <Icon name="history" />
            Audit Log & Bảo mật
          </Link>
        </nav>
        <div className="rbac-sidebar__footer">
          <Link to={ROUTES.HOME}>
            <Icon name="help" />
            Hỗ trợ
          </Link>
          <button className="rbac-sidebar__logout" onClick={handleLogout} type="button">
            <Icon name="logout" />
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="rbac-main">
        <header className="rbac-header">
          <div>
            <p className="rbac-eyebrow">RBAC Management</p>
            <h1>Phân quyền hệ thống</h1>
          </div>
          <button className="rbac-back-button" onClick={handleBack} type="button">
            Quay lại
          </button>
          <label>
            Tìm kiếm Role
            <input
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Admin, Manager, Staff, Driver..."
              type="search"
              value={searchValue}
            />
          </label>
        </header>

        {message ? <p className="rbac-message">{message}</p> : null}

        <section className="rbac-grid">
          <div className="rbac-panel">
            <div className="rbac-panel__heading">
              <h2>Danh sách Role</h2>
              <p>Flow 2 và 8: xem, tìm kiếm và chọn role.</p>
            </div>
            <div className="rbac-role-list">
              {filteredRoles.map((role) => (
                <button
                  className={role.id === selectedRole.id ? 'selected' : ''}
                  key={role.id}
                  onClick={() => {
                    setSelectedRoleId(role.id);
                    setMessage('');
                  }}
                  type="button"
                >
                  <span>
                    <strong>{role.name}</strong>
                    <small>{role.status}</small>
                  </span>
                  <em>{role.description}</em>
                  <small>{role.assignedUsers} user đang dùng</small>
                </button>
              ))}
            </div>
          </div>

          <div className="rbac-panel">
            <div className="rbac-panel__heading rbac-panel__heading--row">
              <div>
                <h2>Permission Matrix: {selectedRole.name}</h2>
                <p>Flow 3 và 5: xem, chỉnh quyền View/Create/Edit/Delete.</p>
              </div>
              <button onClick={handleSavePermissions} type="button">
                Lưu quyền
              </button>
            </div>
            <div className="rbac-table-wrap">
              <table className="rbac-table">
                <thead>
                  <tr>
                    <th>Module</th>
                    {permissionActions.map((action) => (
                      <th key={action.key}>{action.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissionModules.map((moduleItem) => (
                    <tr key={moduleItem.key}>
                      <td>
                        <strong>{moduleItem.label}</strong>
                        <span>{moduleItem.description}</span>
                      </td>
                      {permissionActions.map((action) => (
                        <td key={action.key}>
                          <input
                            checked={selectedPermissions[moduleItem.key][action.key]}
                            onChange={() => togglePermission(moduleItem.key, action.key)}
                            type="checkbox"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="rbac-actions">
          <form className="rbac-panel" onSubmit={handleCreateRole}>
            <div className="rbac-panel__heading">
              <h2>Tạo Role mới</h2>
              <p>Flow 4: nhập tên, mô tả, Admin Code rồi lưu.</p>
            </div>
            <input placeholder="Tên Role" value={newRoleName} onChange={(event) => setNewRoleName(event.target.value)} />
            <textarea
              placeholder="Mô tả Role"
              value={newRoleDescription}
              onChange={(event) => setNewRoleDescription(event.target.value)}
            />
            <button type="submit">Tạo Role</button>
          </form>

          <div className="rbac-panel">
            <div className="rbac-panel__heading">
              <h2>Xóa Role</h2>
              <p>Flow 6: kiểm tra role đang được gán trước khi xóa.</p>
            </div>
            <p>
              Role đang chọn: <strong>{selectedRole.name}</strong>
            </p>
            <button className="danger" onClick={handleDeleteRole} type="button">
              Xóa Role đang chọn
            </button>
          </div>

          <div className="rbac-panel">
            <div className="rbac-panel__heading">
              <h2>Gán Role cho User</h2>
              <p>Flow 7: chọn user, chọn role, nhập Admin Code rồi xác thực.</p>
            </div>
            <select value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)}>
              {users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.fullName} - {user.email}
                </option>
              ))}
            </select>
            <select value={assignRoleId} onChange={(event) => setAssignRoleId(event.target.value)}>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <button onClick={handleAssignRole} type="button">
              Gán Role
            </button>
          </div>
        </section>

        <section className="rbac-bottom">
          <label className="rbac-code">
            Admin Code cho thao tác tạo/sửa/xóa/gán Role
            <input
              onChange={(event) => setOperationCode(event.target.value)}
              placeholder="Nhập Admin Code trước khi lưu thao tác"
              type="password"
              value={operationCode}
            />
          </label>
          <div className="rbac-log">
            <h2>Security Log</h2>
            {securityLogs.slice(0, 5).map((log) => (
              <p key={log.id}>
                <strong>{log.status}</strong> - {log.action}: {log.message}
              </p>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
