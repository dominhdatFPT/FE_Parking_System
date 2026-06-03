import { NavLink } from 'react-router';
import Icon from './Icon';
import NotificationDropdown from './NotificationDropdown';
import SettingsDropdown from './SettingsDropdown';
import { ROUTES } from '../constants/routes';
const menuItems = [
    { icon: 'dashboard', label: 'Tổng quan', href: ROUTES.HOME },
    { icon: 'manage_accounts', label: 'Quản lý tài khoản', href: ROUTES.ADMIN.USERS },
    { icon: 'security', label: 'Quyền truy cập', href: ROUTES.ADMIN.ROLES },
    { icon: 'settings', label: 'Cấu hình hệ thống', href: ROUTES.ADMIN.SYSTEM_CONFIG },
    { icon: 'history', label: 'Nhật ký hệ thống', href: ROUTES.ADMIN.AUDIT_LOG },
];
import { useAuth } from '../contexts/AuthContext';
export default function DashboardShell({ title, description, children }) {
    const { user, role } = useAuth();
    return (<div className="dashboard-shell">
      <aside className="sidebar" aria-label="Điều hướng chính">
        <div className="brand">
          <div className="brand-icon">
            <Icon name="local_parking"/>
          </div>
          <div>
            <h1>Smart Parking AI</h1>
            <p>Hệ thống quản trị</p>
          </div>
        </div>

        <nav className="side-nav">
          {menuItems.map((item) => (<NavLink key={item.label} to={item.href} end={item.href === ROUTES.HOME} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <Icon name={item.icon}/>
              <span>{item.label}</span>
            </NavLink>))}
        </nav>

        <div className="side-footer">
          <a className="nav-link" href="#">
            <Icon name="help"/>
            <span>Hỗ trợ</span>
          </a>
          <a className="nav-link logout" href="#">
            <Icon name="logout"/>
            <span>Đăng xuất</span>
          </a>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <label className="search-box">
            <Icon name="search"/>
            <input placeholder="Tìm kiếm dữ liệu, cấu hình..." type="search"/>
          </label>

          <div className="topbar-actions">
            <NotificationDropdown />
            <div className="divider"/>
            <SettingsDropdown trigger={<button className="profile-button" type="button">
                  <span>
                      <small>{role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</small>
                      <strong>{user.fullName}</strong>
                  </span>
                  <img alt="User profile" src={user.avatarUrl ?? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=96&q=80'}/>
                </button>}/>
          </div>
        </header>

        <section className="content-area">
          <div className="page-heading">
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </div>

          {children}
        </section>
      </main>
    </div>);
}
