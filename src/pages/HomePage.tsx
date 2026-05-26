import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import './HomePage.css';

const menuItems = [
  { icon: 'dashboard', label: 'Tổng quan', active: true },
  { icon: 'manage_accounts', label: 'Quản lý tài khoản' },
  { icon: 'security', label: 'Quyền truy cập' },
  { icon: 'settings', label: 'Cấu hình hệ thống' },
  { icon: 'history', label: 'Nhật ký hệ thống' },
];

const metrics = [
  {
    icon: 'directions_car',
    label: 'Tổng chỗ đỗ',
    value: '1,250',
    trend: '+2.5%',
    tone: 'blue',
  },
  {
    icon: 'event_seat',
    label: 'Chỗ trống hiện tại',
    value: '184',
    trend: '85% đầy',
    tone: 'slate',
  },
  {
    icon: 'payments',
    label: 'Doanh thu hôm nay',
    value: '42.5M',
    trend: '+12%',
    tone: 'orange',
    featured: true,
  },
  {
    icon: 'sync_alt',
    label: 'Lượt xe ra/vào',
    value: '3,892',
    trend: '-0.8%',
    tone: 'gray',
    negative: true,
  },
];

const chartBars = [40, 60, 85, 55, 95, 70, 30, 50];

const activities = [
  ['30F-123.45', '14:20:05', 'Vào', 'Tầng B1 - A05', 'Thành công', 'success'],
  ['51G-888.88', '14:18:22', 'Ra', 'Cổng Chính 1', 'Thành công', 'success'],
  ['29A-555.21', '14:15:10', 'Vào', 'Tầng B2 - C12', 'Chờ duyệt', 'warning'],
  ['43C-990.01', '14:12:45', 'Ra', 'Cổng Phụ 2', 'Lỗi thẻ', 'error'],
];

const devices = [
  ['videocam', 'Hệ thống Camera AI', '24/24 Online', 'online'],
  ['door_front', 'Cổng Barrier', '8/8 hoạt động', 'online'],
  ['point_of_sale', 'Trạm thu phí POS', '1 trạm đang bảo trì', 'offline'],
  ['router', 'Hệ thống mạng & server', 'Độ trễ: 12ms', 'online'],
];

function Icon({ name }: { name: string }) {
  return (
    <span className="material-symbols-outlined" aria-hidden="true">
      {name}
    </span>
  );
}

function getMenuRoute(icon: string) {
  if (icon === 'security') {
    return ROUTES.ADMIN.ROLES;
  }

  if (icon === 'dashboard') {
    return ROUTES.HOME;
  }

  if (icon === 'manage_accounts') {
    return ROUTES.ADMIN.USERS;
  }

  if (icon === 'settings') {
    return ROUTES.ADMIN.SYSTEM_CONFIG;
  }

  if (icon === 'history') {
    return ROUTES.ADMIN.AUDIT_LOG;
  }

  return ROUTES.HOME;
}

export default function HomePage() {
  return (
    <div className="dashboard-shell">
      <aside className="sidebar" aria-label="Điều hướng chính">
        <div className="brand">
          <div className="brand-icon">
            <Icon name="local_parking" />
          </div>
          <div>
            <h1>Smart Parking AI</h1>
            <p>Hệ thống quản trị</p>
          </div>
        </div>

        <nav className="side-nav">
          {menuItems.map((item) => (
            <Link className={item.active ? 'nav-link active' : 'nav-link'} to={getMenuRoute(item.icon)} key={item.label}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Link>
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
            <input placeholder="Tìm kiếm dữ liệu, biển số xe..." type="search" />
          </label>

          <div className="topbar-actions">
            <button aria-label="Thông báo" className="icon-button" type="button">
              <Icon name="notifications" />
            </button>
            <button aria-label="Cài đặt" className="icon-button" type="button">
              <Icon name="settings" />
            </button>
            <div className="divider" />
            <button className="profile-button" type="button">
              <span>
                <strong>Admin Toàn Cầu</strong>
                <small>Quản trị viên</small>
              </span>
              <img
                alt="Admin profile"
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=96&q=80"
              />
            </button>
          </div>
        </header>

        <section className="content-area">
          <div className="page-heading">
            <div>
              <h2>Tổng quan hệ thống</h2>
              <p>Chào mừng trở lại. Đây là tình trạng bãi đỗ xe của bạn hôm nay.</p>
            </div>
            <div className="heading-actions">
              <button className="secondary-button" type="button">
                <Icon name="calendar_today" />
                Hôm nay: 20/05/2026
              </button>
              <button className="primary-button" type="button">
                <Icon name="download" />
                Xuất báo cáo
              </button>
            </div>
          </div>

          <section className="metric-grid" aria-label="Chỉ số tổng quan">
            {metrics.map((metric) => (
              <article className={`metric-card ${metric.featured ? 'featured' : ''}`} key={metric.label}>
                <div className="metric-top">
                  <div className={`metric-icon ${metric.tone}`}>
                    <Icon name={metric.icon} />
                  </div>
                  <span className={metric.negative ? 'trend negative' : 'trend'}>{metric.trend}</span>
                </div>
                <p>{metric.label}</p>
                <strong>{metric.value}</strong>
              </article>
            ))}
          </section>

          <section className="analytics-grid">
            <article className="panel traffic-panel">
              <div className="panel-header">
                <h3>
                  Lưu lượng xe 24h qua
                  <Icon name="auto_awesome" />
                </h3>
                <select aria-label="Chọn bãi xe">
                  <option>Tất cả bãi xe</option>
                  <option>Bãi xe A1</option>
                  <option>Bãi xe B2</option>
                </select>
              </div>
              <div className="bar-chart" aria-label="Biểu đồ lưu lượng xe">
                {chartBars.map((height, index) => (
                  <div className="bar" key={`${height}-${index}`} style={{ height: `${height}%` }}>
                    {index === 0 ? <span>450</span> : null}
                  </div>
                ))}
              </div>
              <div className="chart-times">
                <span>00:00</span>
                <span>04:00</span>
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span>20:00</span>
                <span>23:59</span>
              </div>
            </article>

            <article className="panel vehicle-panel">
              <h3>Phân loại phương tiện</h3>
              <div className="donut-wrap">
                <div className="donut">
                  <div>
                    <strong>3.8K</strong>
                    <span>Tổng xe</span>
                  </div>
                </div>
              </div>
              <div className="legend">
                <div>
                  <span className="dot car" />
                  <p>Ô tô</p>
                  <strong>62%</strong>
                </div>
                <div>
                  <span className="dot motorbike" />
                  <p>Xe máy</p>
                  <strong>25%</strong>
                </div>
                <div>
                  <span className="dot electric" />
                  <p>Xe điện</p>
                  <strong>13%</strong>
                </div>
              </div>
            </article>
          </section>

          <section className="bottom-grid">
            <article className="panel activity-panel">
              <div className="panel-header table-header">
                <h3>Hoạt động gần đây</h3>
                <button type="button">Xem tất cả</button>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Biển số xe</th>
                      <th>Thời gian</th>
                      <th>Loại</th>
                      <th>Vị trí bãi</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map(([plate, time, type, place, status, state]) => (
                      <tr key={`${plate}-${time}`}>
                        <td>{plate}</td>
                        <td>{time}</td>
                        <td>{type}</td>
                        <td>{place}</td>
                        <td>
                          <span className={`status ${state}`}>{status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="panel device-panel">
              <h3>Trạng thái thiết bị</h3>
              <div className="device-list">
                {devices.map(([icon, title, subtitle, state]) => (
                  <div className="device-item" key={title}>
                    <div className="device-icon">
                      <Icon name={icon} />
                    </div>
                    <div>
                      <strong>{title}</strong>
                      <p className={state === 'offline' ? 'danger-text' : ''}>{subtitle}</p>
                    </div>
                    <span className={`signal ${state}`} />
                  </div>
                ))}
              </div>
              <button className="diagnose-button" type="button">
                Chẩn đoán hệ thống
              </button>
            </article>
          </section>
        </section>

        <footer className="dashboard-footer">
          <p>© 2026 Smart Parking AI. Toàn bộ quyền được bảo hộ.</p>
          <div>
            <a href="#">Điều khoản</a>
            <a href="#">Bảo mật</a>
            <span>
              <i /> Trạng thái hệ thống: Hoạt động
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
