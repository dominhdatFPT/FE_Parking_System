import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { STORAGE_KEYS } from '../../../../constants/storageKeys';
import { ADMIN_CODE, permissionActions, permissionModules } from '../data';
import { getSecurityLogs, getStoredPermissions, getStoredRoles, getStoredUsers, saveRolePermissionState, writeSecurityLog, } from '../services/rolePermissionStorage';
import './RolePermissionPage.css';
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
function Icon({ name }) {
    return (<span className="material-symbols-outlined" aria-hidden="true">
      {name}
    </span>);
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
    function rejectOperation(action, reason) {
        writeSecurityLog({ action, status: 'Failed', message: reason });
        refreshLogs();
        setMessage(reason);
    }
    function requireOperationCode(action) {
        if (!verifyAdminCode(operationCode)) {
            rejectOperation(action, 'Admin Code không hợp lệ. Thao tác đã bị từ chối và ghi log bảo mật.');
            return false;
        }
        setOperationCode('');
        return true;
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
        pendingAction == null ? null : pendingAction();
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
        return (<main className="rbac-access">
        <form className="rbac-access__card" onSubmit={handleAccessSubmit}>
          <button className="rbac-back-button rbac-access__back" aria-label="Quay lại" onClick={handleBack} type="button">
            <Icon name="arrow_back" />
          </button>
          <div className="rbac-access__intro">
            <span className="rbac-eyebrow">ADMIN CODE REQUIRED</span>
            <h1>Nhập Admin Code để mở màn hình phân quyền</h1>
            <p className="rbac-access__description">Nếu nhập sai, hệ thống sẽ từ chối truy cập và ghi log bảo mật.</p>
          </div>
          <div className="rbac-access__field">
            <div className="rbac-input-group">
              <input
                autoFocus
                onChange={(event) => setAdminCode(event.target.value)}
                placeholder="Ví dụ: ADMIN2026"
                type={showAdminAccess ? 'text' : 'password'}
                value={adminCode}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="rbac-password-toggle"
                aria-label={showAdminAccess ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                onClick={() => setShowAdminAccess((value) => !value)}
                disabled={isSubmitting}
              >
                <span className="material-symbols-outlined">{showAdminAccess ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            <div className="rbac-access__meta">
              <div className="rbac-access__security-pill">
                <span className="material-symbols-outlined">security</span>
                <p>Tất cả hoạt động truy cập phân quyền đều được ghi log và bảo vệ.</p>
              </div>
            </div>
            {authError ? <div className="rbac-alert rbac-alert--error">{authError}</div> : null}
            {authSuccess ? <div className="rbac-alert rbac-alert--success">Xác thực thành công. Đang mở màn hình phân quyền…</div> : null}
            <button className="rbac-access__submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xác thực...' : 'Xác thực'}
            </button>
          </div>
        </form>
      </main>);
    }
    return (<div className="rbac-page">
      <AdminCodeModal open={showAdminModal} title={pendingActionName} onCancel={handleModalCancel} onConfirm={handleModalConfirm} />
      <aside className="rbac-sidebar">
        <div className="rbac-sidebar__brand">
          <div className="rbac-sidebar__logo">
            <Icon name="local_parking"/>
          </div>
          <div>
            <strong>Smart Parking AI</strong>
            <span>System Administrator</span>
          </div>
        </div>
        <nav>
          <Link to={ROUTES.ADMIN.DASHBOARD}>
            <Icon name="dashboard"/>
            Tổng quan
          </Link>
          <Link to={ROUTES.ADMIN.USERS}>
            <Icon name="manage_accounts"/>
            Quản lý tài khoản
          </Link>
          <Link className="active" to={ROUTES.ADMIN.ROLES}>
            <Icon name="security"/>
            Phân quyền
          </Link>
          <Link to={ROUTES.ADMIN.SYSTEM_CONFIG}>
            <Icon name="settings"/>
            Cấu hình hệ thống
          </Link>
          <Link to={ROUTES.ADMIN.AUDIT_LOG}>
            <Icon name="history"/>
            Audit Log & Bảo mật
          </Link>
        </nav>
        <div className="rbac-sidebar__footer">
          <Link to={ROUTES.HOME}>
            <Icon name="help"/>
            Hỗ trợ
          </Link>
          <button className="rbac-sidebar__logout" onClick={handleLogout} type="button">
            <Icon name="logout"/>
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="rbac-main">
        <header className="rbac-header">
          <div className="rbac-header__title-group">
            <button className="rbac-back-button" aria-label="Quay lại" onClick={handleBack} type="button">
              <Icon name="arrow_back" />
            </button>
            <div>
              <p className="rbac-eyebrow">RBAC Management</p>
              <h1>Phân quyền hệ thống</h1>
            </div>
          </div>
          <label>
            Tìm kiếm Role
            <input onChange={(event) => setSearchValue(event.target.value)} placeholder="Admin, Manager, Staff, Driver..." type="search" value={searchValue}/>
          </label>
        </header>

        {message ? <p className="rbac-message">{message}</p> : null}

        <section className="rbac-grid">
          <div className="rbac-panel">
            <div className="rbac-panel__heading">
              <h2>Danh sách Role</h2>
              <p>Flow 2 và 8: xem, tìm kiếm và chọn role.</p>
            </div>
            <RoleList
              roles={filteredRoles}
              selectedRoleId={selectedRole.id}
              onSelect={(id) => {
                setSelectedRoleId(id);
                setMessage('');
              }}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
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
            <PermissionMatrix
              permissionModules={permissionModules}
              permissionActions={permissionActions}
              selectedPermissions={selectedPermissions}
              togglePermission={togglePermission}
            />
          </div>
        </section>

        <section className="rbac-actions">
          <RoleForm
            newRoleName={newRoleName}
            setNewRoleName={setNewRoleName}
            newRoleDescription={newRoleDescription}
            setNewRoleDescription={setNewRoleDescription}
            onCreateRole={handleCreateRole}
          />

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

        <section className="rbac-bottom">
          <label className="rbac-code">
            Admin Code cho thao tác tạo/sửa/xóa/gán Role
            <div className="rbac-password-field">
              <input onChange={(event) => setOperationCode(event.target.value)} placeholder="Nhập Admin Code trước khi lưu thao tác" type={showOperationCode ? 'text' : 'password'} value={operationCode} />
              <button type="button" className="rbac-password-toggle" aria-label={showOperationCode ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} onClick={() => setShowOperationCode((value) => !value)}>
                <span className="material-symbols-outlined">{showOperationCode ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </label>
          <SecurityLog securityLogs={securityLogs} />
        </section>
      </main>
    </div>);
}
