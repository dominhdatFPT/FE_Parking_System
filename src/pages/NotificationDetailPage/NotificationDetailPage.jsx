import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import Icon from '../../components/Icon';
import NotificationDropdown from '../../components/NotificationDropdown';
import SettingsDropdown from '../../components/SettingsDropdown';
import { useAuth } from '../../contexts/AuthContext';
import { getNotificationById } from '../../features/notifications/notifications';
import { formatDate } from '../../utils/formatDate';
import { NavLink } from 'react-router';
import { ROUTES } from '../../constants/routes';
const menuItems = [
    { icon: 'dashboard', label: 'Tổng quan', href: '/home' },
    { icon: 'manage_accounts', label: 'Quản lý tài khoản', href: ROUTES.ADMIN.USERS },
    { icon: 'security', label: 'Quyền truy cập', href: ROUTES.ADMIN.ROLES },
    { icon: 'settings', label: 'Cấu hình hệ thống', href: ROUTES.ADMIN.SYSTEM_CONFIG },
    { icon: 'history', label: 'Nhật ký hệ thống', href: ROUTES.ADMIN.AUDIT_LOG },
];
export default function NotificationDetailPage() {
    const { user, role } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const currentRole = role === 'admin' ? 'admin' : 'staff';
    const notification = useMemo(() => (id ? getNotificationById(id) : undefined), [id]);
    const hasAccess = notification?.roles.includes(currentRole);
    return (<div className="dashboard-shell notification-detail-page">
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
          {menuItems.map((item) => (<NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end={item.href === ROUTES.HOME} key={item.label} to={item.href}>
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
            <input placeholder="Tìm kiếm thông báo..." type="search"/>
          </label>

          <div className="topbar-actions">
            <NotificationDropdown />
            <SettingsDropdown trigger={<button className="profile-button" type="button">
                  <span>
                    <strong>{user.fullName}</strong>
                    <small>{role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</small>
                  </span>
                  <img alt="User profile" src={user.avatarUrl ?? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=96&q=80'}/>
                </button>}/>
          </div>
        </header>

        <section className="content-area">
          <div className="page-heading">
            <div>
              <h2>Chi tiết thông báo</h2>
              <p>Xem nội dung thông báo đầy đủ mà không rời khỏi giao diện quản trị.</p>
            </div>
            <div className="heading-actions">
              <button className="secondary-button" type="button" onClick={() => navigate(-1)}>
                <Icon name="arrow_back"/>
                Quay lại
              </button>
            </div>
          </div>

          <section className="panel notification-detail-panel">
            {notification && hasAccess ? (<>
                <div className="notification-detail-header">
                  <div>
                    <h3>{notification.title}</h3>
                    <time>{formatDate(notification.createdAt)}</time>
                  </div>
                  <div className="notification-sender">Gửi bởi: {notification.sender}</div>
                </div>

                <div className="notification-detail-content">
                  <p>{notification.content}</p>
                </div>
              </>) : (<div className="notification-detail-empty">
                <h3>Không tìm thấy thông báo</h3>
                <p>Thông báo này không tồn tại hoặc bạn không có quyền xem nội dung.</p>
              </div>)}
          </section>
        </section>
      </main>
    </div>);
}
