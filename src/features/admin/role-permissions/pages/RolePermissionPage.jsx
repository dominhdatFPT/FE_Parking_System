import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../../../constants/routes';
import { ADMIN_CODE, permissionActions, permissionModules } from '../data';
import { getSecurityLogs, getStoredPermissions, getStoredRoles, getStoredUsers, saveRolePermissionState, writeSecurityLog, } from '../services/rolePermissionStorage';
import RoleList from '../components/RoleList';
import PermissionMatrix from '../components/PermissionMatrix';
import RoleForm from '../components/RoleForm';
import AssignUserForm from '../components/AssignUserForm';
import SecurityLog from '../components/SecurityLog';
import AdminCodeModal from '../components/AdminCodeModal';
const emptyPermissionRow = { view: false, create: false, edit: false, delete: false };
function createEmptyMatrix() {
    return permissionModules.reduce((matrix, moduleItem) => {
        matrix[moduleItem.key] = { ...emptyPermissionRow };
        return matrix;
    }, {});
}
function verifyAdminCode(code) {
    return code.trim() === ADMIN_CODE;
}
export default function RolePermissionPage() {
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);
    const [adminCode, setAdminCode] = useState('');
    const [showAdminAccess, setShowAdminAccess] = useState(false);
    const [showOperationCode, setShowOperationCode] = useState(false);
    const [authError, setAuthError] = useState('');
    const [authSuccess, setAuthSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [roles, setRoles] = useState(getStoredRoles);
    const [permissions, setPermissions] = useState(getStoredPermissions);
    const [users, setUsers] = useState(getStoredUsers);
    const [securityLogs, setSecurityLogs] = useState(getSecurityLogs);
    const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id ?? 'admin');
    const [searchValue, setSearchValue] = useState('');
    const [message, setMessage] = useState('');
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleDescription, setNewRoleDescription] = useState('');
    const [operationCode, setOperationCode] = useState('');
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [pendingActionName, setPendingActionName] = useState('');
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
    function rejectOperation(action, reason) {
        writeSecurityLog({ action, status: 'Failed', message: reason });
        refreshLogs();
        setMessage(reason);
    }
    function openAdminModal(actionName, actionCallback) {
      setPendingAction(() => actionCallback);
      setPendingActionName(actionName);
      setShowAdminModal(true);
    }

    function handleModalCancel() {
      setShowAdminModal(false);
      setPendingAction(null);
      setPendingActionName('');
    }

    function handleModalConfirm(code) {
      setShowAdminModal(false);
      if (!verifyAdminCode(code)) {
        rejectOperation(pendingActionName, 'Admin Code không hợp lệ. Thao tác đã bị từ chối và ghi log bảo mật.');
        setPendingAction(null);
        setPendingActionName('');
        return;
      }
      // run the pending action
      try {
        if (pendingAction) {
          pendingAction();
        }
      }
      catch (e) {
        // swallow errors locally and write log
        writeSecurityLog({ action: pendingActionName, status: 'Failed', message: String(e) });
        refreshLogs();
        setMessage('Có lỗi khi thực hiện hành động.');
      }
      setPendingAction(null);
      setPendingActionName('');
    }
    function persist(nextRoles = roles, nextPermissions = permissions, nextUsers = users) {
        saveRolePermissionState(nextRoles, nextPermissions, nextUsers);
    }
    function handleAccessSubmit(event) {
        event.preventDefault();
        if (isSubmitting) {
            return;
        }
        setAuthError('');
        setAuthSuccess(false);
        setIsSubmitting(true);
        setTimeout(() => {
            if (!verifyAdminCode(adminCode)) {
                writeSecurityLog({
                    action: 'Access role permission screen',
                    status: 'Blocked',
                    message: 'Nhập sai Admin Code khi truy cập màn hình phân quyền.',
                });
                refreshLogs();
                setAuthError('Admin Code không đúng. Bạn không được phép truy cập màn hình này.');
                setIsSubmitting(false);
                return;
            }
            writeSecurityLog({
                action: 'Access role permission screen',
                status: 'Success',
                message: 'Xác thực Admin Code thành công.',
            });
            refreshLogs();
            setAuthSuccess(true);
            setIsVerified(true);
            setIsSubmitting(false);
        }, 650);
    }
    function togglePermission(moduleKey, actionKey) {
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
    function createRoleConfirmed() {
      const trimmedName = newRoleName.trim();
      if (!trimmedName) {
        setMessage('Tên Role không được để trống.');
        return;
      }
      const newRole = {
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

    function handleCreateRole(event) {
      event.preventDefault();
      openAdminModal('Create role', createRoleConfirmed);
    }
    function savePermissionsConfirmed() {
      persist();
      writeSecurityLog({
        action: 'Update role permissions',
        status: 'Success',
        message: `Đã cập nhật quyền cho role ${selectedRole.name}.`,
      });
      refreshLogs();
      setMessage('Đã lưu thay đổi phân quyền.');
    }

    function handleSavePermissions() {
      openAdminModal('Update role permissions', savePermissionsConfirmed);
    }
    function deleteRoleConfirmed() {
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
      openAdminModal('Delete role', deleteRoleConfirmed);
    }
    function assignRoleConfirmed() {
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

    function handleAssignRole() {
      openAdminModal('Assign role to user', assignRoleConfirmed);
    }
    if (!isVerified) {
        return (
            <div className="grid min-h-[calc(100vh-7rem)] place-items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <form className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl p-8 space-y-6" onSubmit={handleAccessSubmit}>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Admin Code Required</p>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nhập Admin Code</h1>
                        <p className="text-gray-600">Xác thực quyền truy cập. Nếu nhập sai, hệ thống sẽ ghi log bảo mật.</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <input
                                autoFocus
                                onChange={(event) => setAdminCode(event.target.value)}
                                placeholder="Ví dụ: ADMIN2026"
                                type={showAdminAccess ? 'text' : 'password'}
                                value={adminCode}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition disabled:bg-gray-100"
                            />
                            <button
                                type="button"
                                className="px-3 py-3 text-gray-600 hover:text-gray-900 disabled:text-gray-300"
                                aria-label={showAdminAccess ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                onClick={() => setShowAdminAccess((value) => !value)}
                                disabled={isSubmitting}
                            >
                                <span className="material-symbols-outlined text-xl">{showAdminAccess ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex gap-2">
                            <span className="material-symbols-outlined text-blue-600 flex-shrink-0 mt-0.5">security</span>
                            <p className="text-sm text-blue-700">Tất cả hoạt động truy cập đều được ghi log và bảo vệ.</p>
                        </div>
                    </div>

                    {authError && <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700 font-medium">{authError}</div>}
                    {authSuccess && <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-green-700 font-medium">Xác thực thành công. Đang mở màn hình...</div>}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                        >
                            Quay lại
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
                        >
                            {isSubmitting ? 'Đang xác thực...' : 'Xác thực'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
    return (
        <>
            <AdminCodeModal open={showAdminModal} title={pendingActionName} onCancel={handleModalCancel} onConfirm={handleModalConfirm} />
            <div className="space-y-6">
                <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">RBAC Management</p>
                        <h1 className="text-3xl font-bold text-gray-900">Phân quyền hệ thống</h1>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button
                            onClick={handleBack}
                            type="button"
                            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            Quay lại
                        </button>
                        <label className="flex-1 sm:flex-none">
                            <span className="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm Role</span>
                            <input
                                onChange={(event) => setSearchValue(event.target.value)}
                                placeholder="Admin, Manager, Staff, Driver..."
                                type="search"
                                value={searchValue}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                            />
                        </label>
                    </div>
                </header>

                {message && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700 font-medium">
                        {message}
                    </div>
                )}

                <section className="grid gap-6 lg:grid-cols-[1fr_1.8fr]">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Danh sách Role</h2>
                            <p className="text-sm text-gray-600">Xem, tìm kiếm và chọn role</p>
                        </div>
                        <RoleList
                            roles={filteredRoles}
                            selectedRoleId={selectedRole.id}
                            onSelect={(id) => {
                                setSelectedRoleId(id);
                                setMessage('');
                            }}
                        />
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Permission Matrix: {selectedRole.name}</h2>
                                <p className="text-sm text-gray-600">Quản lý quyền View/Create/Edit/Delete</p>
                            </div>
                            <button
                                onClick={handleSavePermissions}
                                type="button"
                                className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 whitespace-nowrap"
                            >
                                Lưu quyền
                            </button>
                        </div>
                        <PermissionMatrix
                            permissionModules={permissionModules}
                            permissionActions={permissionActions}
                            selectedPermissions={selectedPermissions}
                            togglePermission={togglePermission}
                        />
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                    <RoleForm
                        newRoleName={newRoleName}
                        setNewRoleName={setNewRoleName}
                        newRoleDescription={newRoleDescription}
                        setNewRoleDescription={setNewRoleDescription}
                        onCreateRole={handleCreateRole}
                    />

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Xóa Role</h2>
                            <p className="text-sm text-gray-600">Kiểm tra trước khi xóa</p>
                        </div>
                        <p className="mb-4 text-gray-700">
                            Role đang chọn: <strong>{selectedRole.name}</strong>
                        </p>
                        <button
                            onClick={handleDeleteRole}
                            type="button"
                            className="w-full rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700"
                        >
                            Xóa Role đang chọn
                        </button>
                    </div>

                    <AssignUserForm
                        users={users}
                        roles={roles}
                        selectedUserId={selectedUserId}
                        setSelectedUserId={setSelectedUserId}
                        assignRoleId={assignRoleId}
                        setAssignRoleId={setAssignRoleId}
                        onAssign={handleAssignRole}
                    />
                </section>

                <section className="grid gap-6 lg:grid-cols-[300px_1fr]">
                    <label className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <span className="block text-sm font-bold text-gray-700 mb-3">Admin Code</span>
                        <div className="flex gap-2">
                            <input
                                onChange={(event) => setOperationCode(event.target.value)}
                                placeholder="Admin Code"
                                type={showOperationCode ? 'text' : 'password'}
                                value={operationCode}
                                className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm"
                            />
                            <button
                                type="button"
                                className="px-2 text-gray-600 hover:text-gray-900"
                                aria-label={showOperationCode ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                onClick={() => setShowOperationCode((value) => !value)}
                            >
                                <span className="material-symbols-outlined">
                                    {showOperationCode ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </label>

                    <SecurityLog securityLogs={securityLogs} />
                </section>
            </div>
        </>
    );
}
