import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { STORAGE_KEYS } from '../../../../constants/storageKeys';
import '../../../../pages/HomePage.css';
import './RolePermissionPage.css';

type RoleItem = {
  name: string;
  description: string;
  active: boolean;
};

const roles: RoleItem[] = [
  { name: 'Driver', description: 'Người dùng chính của hệ thống', active: true },
  { name: 'Admin', description: 'Toàn quyền quản trị hệ thống', active: true },
  { name: 'Manager', description: 'Quản lý cơ sở và vận hành', active: true },
  { name: 'Staff', description: 'Nhân viên điều phối bãi xe', active: true },
];

type ModulePermission = {
  name: string;
  permissions: [boolean, boolean, boolean, boolean];
  highlight?: boolean;
};

const defaultModules: ModulePermission[] = [
  { name: 'Quản lý bãi xe', permissions: [true, true, true, true] },
  { name: 'Quản lý slot', permissions: [true, true, true, false] },
  { name: 'Phiên gửi xe', permissions: [true, true, false, false] },
  { name: 'Thanh toán', permissions: [true, false, false, false] },
  { name: 'AI Smart Parking', permissions: [true, true, true, true], highlight: true },
  { name: 'Báo cáo', permissions: [true, true, false, false] },
];

const menuItems = [
  { icon: 'dashboard', label: 'Tổng quan', href: ROUTES.HOME },
  { icon: 'manage_accounts', label: 'Quản lý tài khoản', href: ROUTES.ADMIN.USERS },
  { icon: 'admin_panel_settings', label: 'Phân quyền', href: ROUTES.ADMIN.ROLES },
  { icon: 'settings', label: 'Cấu hình hệ thống', href: ROUTES.ADMIN.SYSTEM_CONFIG },
  { icon: 'history', label: 'Nhật ký và bảo mật', href: ROUTES.ADMIN.AUDIT_LOG },
];

function Icon({ name }: { name: string }) {
  return <span className="material-symbols-outlined">{name}</span>;
}

export default function RolePermissionPage() {
  const [keyword, setKeyword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Driver');
  const [modulePermissions, setModulePermissions] = useState(defaultModules);
  const [lastSavedPermissions, setLastSavedPermissions] = useState(JSON.stringify(defaultModules));
  const [saveCode, setSaveCode] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [adminId, setAdminId] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  const rawUser = window.localStorage.getItem(STORAGE_KEYS.USER) || window.sessionStorage.getItem(STORAGE_KEYS.USER);
  let currentRole = '';
  try {
    const parsed = rawUser ? JSON.parse(rawUser) : {};
    currentRole = String(parsed?.roleId || parsed?.role || '').toLowerCase();
  } catch {
    currentRole = '';
  }

  const isStaff = currentRole === 'staff';

  const filteredRoles = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter((role) => role.name.toLowerCase().includes(q) || role.description.toLowerCase().includes(q));
  }, [keyword]);

  function handleUnlock() {
    if (isStaff) {
      setAuthMessage('Tài khoản Staff không được phép sử dụng màn hình Phân quyền.');
      return;
    }

    if (adminId.trim() !== 'ADMINID') {
      setAuthMessage('ADMINID không đúng. Vui lòng nhập lại.');
      return;
    }

    setAuthMessage('');
    setIsUnlocked(true);
  }

  function togglePermission(moduleIndex: number, permissionIndex: 0 | 1 | 2 | 3) {
    setSaveMessage('');
    setModulePermissions((current) =>
      current.map((moduleItem, index) => {
        if (index !== moduleIndex) return moduleItem;
        const nextPermissions = [...moduleItem.permissions] as [boolean, boolean, boolean, boolean];
        nextPermissions[permissionIndex] = !nextPermissions[permissionIndex];
        return { ...moduleItem, permissions: nextPermissions };
      }),
    );
  }

  function handleSavePermissionChange() {
    const hasChanged = JSON.stringify(modulePermissions) !== lastSavedPermissions;
    if (!hasChanged) {
      setSaveMessage('Chưa có thay đổi nào để lưu.');
      return;
    }

    if (saveCode.trim() !== 'ADMINID') {
      setSaveMessage('Bạn phải nhập đúng ADMINID để lưu thay đổi phân quyền.');
      return;
    }

    setLastSavedPermissions(JSON.stringify(modulePermissions));
    setSaveCode('');
    setSaveMessage(`Đã lưu thay đổi phân quyền cho vai trò ${selectedRole}.`);
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar" aria-label="Dieu huong chinh">
        <div className="brand">
          <div className="brand-icon">
            <Icon name="local_parking" />
          </div>
          <div>
            <h1>Smart Parking AI</h1>
            <p>HE THONG QUAN TRI</p>
          </div>
        </div>

        <nav className="side-nav">
          {menuItems.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              end={item.href === ROUTES.HOME}
              key={item.label}
              to={item.href}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="side-footer">
          <a className="nav-link" href="#">
            <Icon name="help" />
            <span>Hỗ trợ</span>
          </a>
          <a className="nav-link logout" href="#">
            <Icon name="logout" />
            <span>Đăng xuất</span>
          </a>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <label className="search-box">
            <Icon name="search" />
            <input placeholder="Tim kiem du lieu..." type="search" />
          </label>

          <div className="topbar-actions">
            <button aria-label="Thong bao" className="icon-button" type="button">
              <Icon name="notifications" />
            </button>
            <button aria-label="Cai dat" className="icon-button" type="button">
              <Icon name="settings" />
            </button>
            <div className="divider" />
            <button className="profile-button" type="button">
              <span>
                <strong>Admin Toan Cau</strong>
                <small>QUAN TRI VIEN</small>
              </span>
              <img
                alt="Admin profile"
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=96&q=80"
              />
            </button>
          </div>
        </header>

        <section className="content-area permission-workspace">
          {!isUnlocked ? (
            <section className="permission-lock panel">
              <h2>Mở khóa màn hình phân quyền</h2>
              <p>Chỉ người dùng quản trị được phép truy cập. Vui lòng nhập ADMINID để tiếp tục.</p>
              <input
                onChange={(event) => setAdminId(event.target.value)}
                placeholder="Nhập ADMINID"
                type="password"
                value={adminId}
              />
              {authMessage ? <strong>{authMessage}</strong> : null}
              <button className="primary-button" onClick={handleUnlock} type="button">
                Xác nhận mở khóa
              </button>
            </section>
          ) : null}

          {isUnlocked ? (
            <>
          <header className="permission-header">
          <div>
            <h2>Phân quyền hệ thống</h2>
            <p>Quản lý role và ma trận quyền theo từng module một cách rõ ràng.</p>
          </div>
          <label className="search-wrap">
            <Icon name="search" />
            <input
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm kiếm vai trò..."
              type="search"
              value={keyword}
            />
          </label>
          </header>
          {saveMessage ? <p className="permission-save-message">{saveMessage}</p> : null}

          <div className="permission-overview">
            <article>
            <strong>{selectedRole}</strong>
            <span>Vai trò đang chỉnh sửa</span>
            </article>
            <article>
            <strong>Yêu cầu bảo mật</strong>
            <span>Mọi thay đổi cần nhập lại ADMINID để lưu</span>
            </article>
            <article>
            <strong>Gợi ý thao tác</strong>
            <span>Chọn vai trò bên trái, bật/tắt quyền rồi bấm Lưu thay đổi</span>
            </article>
          </div>

          <div className="permission-grid">
            <article className="permission-card panel">
                <h3>Vai trò (Roles)</h3>
                <p>Danh sách các nhóm quyền trong hệ thống</p>

            <div className="role-list">
              {filteredRoles.map((role) => (
                <button
                  className={selectedRole === role.name ? 'selected' : ''}
                  key={role.name}
                  onClick={() => setSelectedRole(role.name)}
                  type="button"
                >
                  <div>
                    <strong>{role.name}</strong>
                    <span className={role.active ? 'badge active' : 'badge inactive'}>
                      {role.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <small>{role.description}</small>
                </button>
              ))}
            </div>
            </article>

            <article className="permission-card panel">
            <div className="permission-matrix-head">
              <div>
                <h3>Ma trận phân quyền: {selectedRole}</h3>
                <p>Chi tiết quyền hạn truy cập các module</p>
              </div>
              <div className="permission-save-box">
                <input
                  onChange={(event) => setSaveCode(event.target.value)}
                  placeholder="Nhập ADMINID để lưu"
                  type="password"
                  value={saveCode}
                />
                <button className="primary-button" onClick={handleSavePermissionChange} type="button">Lưu thay đổi</button>
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Tên module</th>
                    <th>Xem</th>
                    <th>Tạo</th>
                    <th>Sửa</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {modulePermissions.map((moduleItem, moduleIndex) => (
                    <tr className={moduleItem.highlight ? 'row-highlight' : ''} key={moduleItem.name}>
                      <td>{moduleItem.name}</td>
                      <td><input checked={moduleItem.permissions[0]} onChange={() => togglePermission(moduleIndex, 0)} type="checkbox" /></td>
                      <td><input checked={moduleItem.permissions[1]} onChange={() => togglePermission(moduleIndex, 1)} type="checkbox" /></td>
                      <td><input checked={moduleItem.permissions[2]} onChange={() => togglePermission(moduleIndex, 2)} type="checkbox" /></td>
                      <td><input checked={moduleItem.permissions[3]} onChange={() => togglePermission(moduleIndex, 3)} type="checkbox" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </article>
          </div>
            </>
          ) : null}
        </section>
      </main>
    </div>
  );
}
