import './HomePage.css';
import './AccountManagementPage.css';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';
import Icon from '../components/Icon';
import NotificationDropdown from '../components/NotificationDropdown';
import SettingsDropdown from '../components/SettingsDropdown';
const menuItems = [
    { icon: 'dashboard', label: 'Tổng quan', href: ROUTES.HOME },
    { icon: 'manage_accounts', label: 'Quản lý tài khoản', href: ROUTES.ADMIN.USERS },
    { icon: 'security', label: 'Quyền truy cập', href: ROUTES.ADMIN.ROLES },
    { icon: 'settings', label: 'Cấu hình hệ thống', href: ROUTES.ADMIN.SYSTEM_CONFIG },
    { icon: 'history', label: 'Nhật ký hệ thống', href: ROUTES.ADMIN.AUDIT_LOG },
];
const summaryCards = [
    { icon: 'group', label: 'Tổng tài khoản', value: '248', detail: '+12 tài khoản mới', tone: 'blue' },
    { icon: 'verified_user', label: 'Đang hoạt động', value: '221', detail: '89% tổng hệ thống', tone: 'green' },
    { icon: 'admin_panel_settings', label: 'Quản trị viên', value: '18', detail: '4 nhóm quyền', tone: 'slate' },
    { icon: 'lock_clock', label: 'Tạm khóa', value: '9', detail: 'Cần rà soát', tone: 'orange' },
];
const users = [
    {
        name: 'Nguyễn Minh Anh',
        email: 'minhanh@parking.ai',
        role: 'Quản trị viên',
        department: 'Vận hành',
        lastActive: '20/05/2026 19:42',
        status: 'Hoạt động',
        state: 'success',
    },
    {
        name: 'Trần Quốc Huy',
        email: 'quochuy@parking.ai',
        role: 'Quản lý bãi xe',
        department: 'Bãi xe A1',
        lastActive: '20/05/2026 18:15',
        status: 'Hoạt động',
        state: 'success',
    },
    {
        name: 'Lê Hoàng Vy',
        email: 'hoangvy@parking.ai',
        role: 'Nhân viên cổng',
        department: 'Cổng chính',
        lastActive: '20/05/2026 16:08',
        status: 'Chờ xác minh',
        state: 'warning',
    },
    {
        name: 'Phạm Đức Long',
        email: 'duclong@parking.ai',
        role: 'Kế toán',
        department: 'Tài chính',
        lastActive: '18/05/2026 09:30',
        status: 'Tạm khóa',
        state: 'error',
    },
    {
        name: 'Vũ Thanh Hà',
        email: 'thanhha@parking.ai',
        role: 'Giám sát camera',
        department: 'An ninh',
        lastActive: '20/05/2026 13:22',
        status: 'Hoạt động',
        state: 'success',
    },
];
function initials(name) {
    return name
        .split(' ')
        .slice(-2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}
export default function AccountManagementPage() {
    const { user, role } = useAuth();
    return (<div className="dashboard-shell account-page">
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
            <input placeholder="Tìm kiếm tài khoản, email, vai trò..." type="search"/>
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
              <h2>Quản lý tài khoản</h2>
              <p>Quản trị người dùng, vai trò truy cập và trạng thái tài khoản trong hệ thống.</p>
            </div>
            <div className="heading-actions">
              <button className="secondary-button" type="button">
                <Icon name="upload_file"/>
                Nhập danh sách
              </button>
              <button className="primary-button" type="button">
                <Icon name="person_add"/>
                Thêm tài khoản
              </button>
            </div>
          </div>

          <section className="account-summary-grid" aria-label="Tổng quan tài khoản">
            {summaryCards.map((card) => (<article className="account-summary-card" key={card.label}>
                <div className={`account-summary-icon ${card.tone}`}>
                  <Icon name={card.icon}/>
                </div>
                <div>
                  <p>{card.label}</p>
                  <strong>{card.value}</strong>
                  <span>{card.detail}</span>
                </div>
              </article>))}
          </section>

          <section className="account-tools panel">
            <div className="account-filter-grid">
              <label>
                <span>Tìm kiếm</span>
                <div className="field-with-icon">
                  <Icon name="search"/>
                  <input placeholder="Tên, email hoặc bộ phận" type="search"/>
                </div>
              </label>
              <label>
                <span>Vai trò</span>
                <select>
                  <option>Tất cả vai trò</option>
                  <option>Quản trị viên</option>
                  <option>Quản lý bãi xe</option>
                  <option>Nhân viên cổng</option>
                </select>
              </label>
              <label>
                <span>Trạng thái</span>
                <select>
                  <option>Tất cả trạng thái</option>
                  <option>Hoạt động</option>
                  <option>Chờ xác minh</option>
                  <option>Tạm khóa</option>
                </select>
              </label>
              <button className="secondary-button account-filter-button" type="button">
                <Icon name="filter_alt"/>
                Lọc dữ liệu
              </button>
            </div>
          </section>

          <section className="panel account-table-panel">
            <div className="account-table-heading">
              <div>
                <h3>Danh sách tài khoản</h3>
                <p>5 tài khoản hiển thị trong hệ thống quản trị.</p>
              </div>
              <button className="secondary-button" type="button">
                <Icon name="download"/>
                Xuất dữ liệu
              </button>
            </div>

            <div className="table-scroll">
              <table className="account-table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Vai trò</th>
                    <th>Bộ phận</th>
                    <th>Hoạt động cuối</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (<tr key={user.email}>
                      <td>
                        <div className="user-cell">
                          <span className="avatar">{initials(user.name)}</span>
                          <div>
                            <strong>{user.name}</strong>
                            <p>{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>{user.role}</td>
                      <td>{user.department}</td>
                      <td>{user.lastActive}</td>
                      <td>
                        <span className={`status ${user.state}`}>{user.status}</span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button aria-label={`Sửa ${user.name}`} type="button">
                            <Icon name="edit"/>
                          </button>
                          <button aria-label={`Khóa ${user.name}`} type="button">
                            <Icon name="lock"/>
                          </button>
                          <button aria-label={`Xem thêm ${user.name}`} type="button">
                            <Icon name="more_horiz"/>
                          </button>
                        </div>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </section>
        </section>

        <footer className="dashboard-footer">
          <p>© 2024 Smart Parking AI. Toàn bộ quyền được bảo hộ.</p>
          <div>
            <a href="#">Điều khoản</a>
            <a href="#">Bảo mật</a>
            <span><i /> Trạng thái hệ thống: Hoạt động</span>
          </div>
        </footer>
      </main>
    </div>);
}
