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

const emptyPermissionRow = { view: false, create: false, edit: false, delete: false };
const panelClass = 'grid gap-3.5 rounded-lg border border-[#d8dbe7] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]';
const panelHeadingClass = 'grid gap-1';
const inputClass = 'min-h-10 rounded-lg border border-[#c3c6d6] px-3 py-[9px] outline-none focus:border-[#0052cc] focus:shadow-[0_0_0_2px_rgba(0,82,204,0.12)]';
const primaryButtonClass = 'min-h-10 cursor-pointer rounded-lg border border-[#0052cc] bg-[#0052cc] px-3.5 font-extrabold text-white';
const sidebarLinkClass = 'flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-[#dbeafe] no-underline transition hover:bg-white/10 hover:text-white';

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
      <main className="grid min-h-screen place-items-center bg-[#eef2f7] p-6">
        <form
          className="grid w-full max-w-[440px] gap-3.5 rounded-lg border border-[#d8dbe7] bg-white p-7 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
          onSubmit={handleAccessSubmit}
        >
          <p className="m-0 text-xs font-extrabold uppercase tracking-[0.08em] text-[#0052cc]">Admin Code Required</p>
          <button className={`${primaryButtonClass} justify-self-start`} onClick={handleBack} type="button">
            Quay lại
          </button>
          <h1 className="m-0">Xác thực quyền truy cập</h1>
          <p className="m-0">Nhập Admin Code để mở màn hình phân quyền. Nếu nhập sai, hệ thống sẽ từ chối truy cập và ghi log bảo mật.</p>
          <input
            className={inputClass}
            autoFocus
            onChange={(event) => setAdminCode(event.target.value)}
            placeholder="Ví dụ: ADMIN2026"
            type="password"
            value={adminCode}
          />
          {authError ? <strong className="block rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-red-700">{authError}</strong> : null}
          <button className={primaryButtonClass} type="submit">Xác thực</button>
        </form>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f4f7fb] text-[#111827] max-[1080px]:flex-col">
      <aside className="flex w-[280px] shrink-0 flex-col gap-6 bg-[#172033] px-[18px] py-6 text-white max-[1080px]:w-auto">
        <div className="flex items-center gap-3 border-b border-white/10 px-2 pt-1 pb-3.5">
          <div className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-lg bg-blue-600 text-white">
            <Icon name="local_parking" />
          </div>
          <div>
            <strong className="block">Smart Parking AI</strong>
            <span className="mt-1 block text-[13px] text-slate-300">System Administrator</span>
          </div>
        </div>
        <nav className="grid gap-2.5">
          <Link className={sidebarLinkClass} to={ROUTES.ADMIN.DASHBOARD}>
            <Icon name="dashboard" />
            Tổng quan
          </Link>
          <Link className={sidebarLinkClass} to={ROUTES.ADMIN.USERS}>
            <Icon name="manage_accounts" />
            Quản lý tài khoản
          </Link>
          <Link className={`${sidebarLinkClass} bg-white/10 text-white shadow-[inset_3px_0_0_#60a5fa]`} to={ROUTES.ADMIN.ROLES}>
            <Icon name="security" />
            Phân quyền
          </Link>
          <Link className={sidebarLinkClass} to={ROUTES.ADMIN.SYSTEM_CONFIG}>
            <Icon name="settings" />
            Cấu hình hệ thống
          </Link>
          <Link className={sidebarLinkClass} to={ROUTES.ADMIN.AUDIT_LOG}>
            <Icon name="history" />
            Audit Log & Bảo mật
          </Link>
        </nav>
        <div className="mt-auto grid gap-2.5 border-t border-white/10 pt-3">
          <Link className={sidebarLinkClass} to={ROUTES.HOME}>
            <Icon name="help" />
            Hỗ trợ
          </Link>
          <button
            className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg border-0 bg-transparent px-3 text-left text-[#fecaca] transition hover:bg-white/10 hover:text-white"
            onClick={handleLogout}
            type="button"
          >
            <Icon name="logout" />
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <header className="mb-[18px] flex items-center justify-between gap-4 max-[1080px]:flex-col max-[1080px]:items-stretch">
          <div>
            <p className="m-0 text-xs font-extrabold uppercase tracking-[0.08em] text-[#0052cc]">RBAC Management</p>
            <h1 className="m-0">Phân quyền hệ thống</h1>
          </div>
          <button className={`${primaryButtonClass} self-start`} onClick={handleBack} type="button">
            Quay lại
          </button>
          <label className="grid gap-1.5 text-[13px] font-bold text-gray-600">
            Tìm kiếm Role
            <input
              className={inputClass}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Admin, Manager, Staff, Driver..."
              type="search"
              value={searchValue}
            />
          </label>
        </header>

        {message ? <p className="mb-[18px] rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-3 text-blue-700">{message}</p> : null}

        <section className="grid grid-cols-[minmax(260px,0.32fr)_minmax(520px,0.68fr)] gap-[18px] max-[1080px]:grid-cols-1">
          <div className={panelClass}>
            <div className={panelHeadingClass}>
              <h2 className="m-0">Danh sách Role</h2>
              <p className="m-0 text-slate-500">Flow 2 và 8: xem, tìm kiếm và chọn role.</p>
            </div>
            <div className="grid gap-2.5">
              {filteredRoles.map((role) => (
                <button
                  className={`grid cursor-pointer gap-1.5 rounded-lg border p-3.5 text-left text-[#111827] transition hover:border-blue-300 hover:bg-[#f8fbff] hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)] ${
                    role.id === selectedRole.id
                      ? 'border-[#0052cc] bg-[#edf4ff] shadow-[inset_3px_0_0_#0052cc]'
                      : 'border-[#d8dbe7] bg-white'
                  }`}
                  key={role.id}
                  onClick={() => {
                    setSelectedRoleId(role.id);
                    setMessage('');
                  }}
                  type="button"
                >
                  <span className="flex justify-between">
                    <strong>{role.name}</strong>
                    <small className="text-slate-500">{role.status}</small>
                  </span>
                  <em className="not-italic leading-snug text-slate-500">{role.description}</em>
                  <small className="text-slate-500">{role.assignedUsers} user đang dùng</small>
                </button>
              ))}
            </div>
          </div>

          <div className={panelClass}>
            <div className="flex items-center justify-between gap-4 max-[1080px]:flex-col max-[1080px]:items-stretch">
              <div>
                <h2 className="m-0">Permission Matrix: {selectedRole.name}</h2>
                <p className="m-0 text-slate-500">Flow 3 và 5: xem, chỉnh quyền View/Create/Edit/Delete.</p>
              </div>
              <button className={primaryButtonClass} onClick={handleSavePermissions} type="button">
                Lưu quyền
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-gray-200 bg-gray-100 p-3 text-left text-xs uppercase text-gray-600">Module</th>
                    {permissionActions.map((action) => (
                      <th className="border-b border-gray-200 bg-gray-100 p-3 text-center text-xs uppercase text-gray-600" key={action.key}>{action.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissionModules.map((moduleItem) => (
                    <tr key={moduleItem.key}>
                      <td className="border-b border-gray-200 p-3 text-left">
                        <strong>{moduleItem.label}</strong>
                        <span className="mt-0.5 block text-[13px] text-slate-500">{moduleItem.description}</span>
                      </td>
                      {permissionActions.map((action) => (
                        <td className="border-b border-gray-200 p-3 text-center" key={action.key}>
                          <input
                            className="h-[18px] w-[18px] accent-[#0052cc]"
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

        <section className="mt-[18px] grid grid-cols-3 gap-[18px] max-[1080px]:grid-cols-1">
          <form className={panelClass} onSubmit={handleCreateRole}>
            <div className={panelHeadingClass}>
              <h2 className="m-0">Tạo Role mới</h2>
              <p className="m-0 text-slate-500">Flow 4: nhập tên, mô tả, Admin Code rồi lưu.</p>
            </div>
            <input className={inputClass} placeholder="Tên Role" value={newRoleName} onChange={(event) => setNewRoleName(event.target.value)} />
            <textarea
              className={`${inputClass} min-h-[84px] resize-y`}
              placeholder="Mô tả Role"
              value={newRoleDescription}
              onChange={(event) => setNewRoleDescription(event.target.value)}
            />
            <button className={primaryButtonClass} type="submit">Tạo Role</button>
          </form>

          <div className={panelClass}>
            <div className={panelHeadingClass}>
              <h2 className="m-0">Xóa Role</h2>
              <p className="m-0 text-slate-500">Flow 6: kiểm tra role đang được gán trước khi xóa.</p>
            </div>
            <p className="m-0">
              Role đang chọn: <strong>{selectedRole.name}</strong>
            </p>
            <button className="min-h-10 cursor-pointer rounded-lg border border-[#ba1a1a] bg-[#ba1a1a] px-3.5 font-extrabold text-white" onClick={handleDeleteRole} type="button">
              Xóa Role đang chọn
            </button>
          </div>

          <div className={panelClass}>
            <div className={panelHeadingClass}>
              <h2 className="m-0">Gán Role cho User</h2>
              <p className="m-0 text-slate-500">Flow 7: chọn user, chọn role, nhập Admin Code rồi xác thực.</p>
            </div>
            <select className={inputClass} value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)}>
              {users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.fullName} - {user.email}
                </option>
              ))}
            </select>
            <select className={inputClass} value={assignRoleId} onChange={(event) => setAssignRoleId(event.target.value)}>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <button className={primaryButtonClass} onClick={handleAssignRole} type="button">
              Gán Role
            </button>
          </div>
        </section>

        <section className="mt-[18px] grid grid-cols-[minmax(280px,0.35fr)_minmax(400px,0.65fr)] gap-[18px] max-[1080px]:grid-cols-1">
          <label className="grid gap-1.5 rounded-lg border border-[#d8dbe7] bg-white p-4 text-[13px] font-bold text-gray-600">
            Admin Code cho thao tác tạo/sửa/xóa/gán Role
            <input
              className={inputClass}
              onChange={(event) => setOperationCode(event.target.value)}
              placeholder="Nhập Admin Code trước khi lưu thao tác"
              type="password"
              value={operationCode}
            />
          </label>
          <div className="rounded-lg border border-[#d8dbe7] bg-white p-4">
            <h2 className="mb-2.5 mt-0">Security Log</h2>
            {securityLogs.slice(0, 5).map((log) => (
              <p className="my-2" key={log.id}>
                <strong>{log.status}</strong> - {log.action}: {log.message}
              </p>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
