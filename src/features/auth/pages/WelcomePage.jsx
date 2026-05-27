import { useState } from 'react';
import { useNavigate } from 'react-router';
import './WelcomePage.css';

const logoUrl = '/parking-system-logo.png';

const heroCards = [
  {
    icon: 'search',
    title: 'Tìm kiếm dễ dàng',
    description:
      'Hệ thống định vị thông minh giúp bạn tìm thấy vị trí đỗ xe trống gần nhất chỉ trong vài giây qua ứng dụng di động.',
  },
  {
    icon: 'event_available',
    title: 'Đặt chỗ nhanh chóng',
    description:
      'Tính năng đặt chỗ trước đảm bảo bạn luôn có vị trí đỗ xe sẵn sàng, tiết kiệm thời gian trong giờ cao điểm.',
  },
  {
    icon: 'qr_code_2',
    title: 'Vé điện tử tiện lợi',
    description:
      'Mọi thông tin lượt gửi và thanh toán đều được tích hợp trên mã QR bảo mật, không còn lo mất vé giấy.',
  },
];

const spots = [
  ['A01', 'occupied'],
  ['A02', 'occupied'],
  ['A03', 'available'],
  ['A04', 'available'],
  ['A05', 'pending'],
  ['A06', 'available'],
  ['A07', 'occupied'],
  ['A08', 'available'],
  ['A09', 'available'],
  ['A10', 'available'],
  ['A11', 'available'],
  ['A12', 'occupied'],
  ['A13', 'available'],
  ['A14', 'available'],
  ['A15', 'occupied'],
  ['A16', 'occupied'],
  ['A17', 'pending'],
  ['A18', 'available'],
];

const stats = [
  { label: 'Tổng vị trí', value: '450', icon: 'local_parking', tone: 'primary' },
  { label: 'Vị trí trống', value: '124', icon: 'check_circle', tone: 'success' },
  { label: 'Đang hoạt động', value: '326', icon: 'sensors', tone: 'danger' },
];

const announcements = [
  {
    day: '15',
    month: 'TH05',
    badge: 'Khẩn cấp',
    tone: 'danger',
    title: 'Bảo trì hệ thống thanh toán tự động',
    description:
      'Hệ thống thanh toán qua ví điện tử sẽ tạm ngưng hoạt động từ 00:00 đến 04:00 ngày 16/05 để nâng cấp bảo mật.',
  },
  {
    day: '12',
    month: 'TH05',
    badge: 'Thông tin',
    tone: 'info',
    title: 'Mở thêm khu vực đỗ xe máy tại Tầng B3',
    description:
      'Nhằm phục vụ nhu cầu tăng cao, khu vực B3-C đã được chuyển đổi thành bãi đỗ xe máy với sức chứa thêm 200 xe.',
  },
  {
    day: '10',
    month: 'TH05',
    badge: 'Chính sách',
    tone: 'policy',
    title: 'Cập nhật biểu phí gửi xe tháng cho cư dân',
    description:
      'Bắt đầu từ tháng 06, biểu phí đăng ký thẻ tháng sẽ có sự điều chỉnh nhẹ. Vui lòng xem chi tiết tại văn phòng quản lý.',
  },
];

export default function WelcomePage() {
  const navigate = useNavigate();
  const [selectedFloor, setSelectedFloor] = useState('B1');

  return (
    <div className="welcome-page">
      <header className="welcome-header">
        <div className="welcome-brand">
          <img alt="Parking System Logo" src={logoUrl} />
          <span>Parking System</span>
        </div>

       <nav className="welcome-nav" aria-label="Điều hướng trang chủ">
          <a href="#trang-chu">Trang chủ</a>
          <a href="#thong-tin-bai">Thông tin bãi</a>
        <a href="#thong-bao">Thông báo của Admin</a>
      </nav>

        <div className="welcome-actions">
          <button className="welcome-button-secondary" type="button" onClick={() => navigate('/signup')}>
            Đăng ký
          </button>
          <button className="welcome-button-primary" type="button" onClick={() => navigate('/login')}>
            Đăng nhập
          </button>
          <button aria-label="Ngôn ngữ" className="welcome-icon-button" type="button">
            <span className="material-symbols-outlined">language</span>
          </button>
          <button aria-label="Trợ giúp" className="welcome-icon-button" type="button">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>

      <main className="welcome-main">
        <section className="welcome-hero" id="trang-chu">
          <div className="welcome-hero-layout">
            <div className="welcome-hero-copy">
              <h1>Giải Pháp Quản Lý Bãi Gửi Xe Thông Minh</h1>
              <p>
                Hệ thống Parking System cung cấp công nghệ quản lý vận hành hiện đại,
                giúp tối ưu hóa không gian đỗ xe và nâng cao trải nghiệm người dùng với
                tính chính xác tuyệt đối.
              </p>
              <a className="welcome-explore" href="#thong-tin-bai">
                Khám phá ngay
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>

            <img
              className="welcome-hero-image"
              alt="Modern parking structure"
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
            />
          </div>

          <div className="welcome-service-grid">
            {heroCards.map((card) => (
              <article className="welcome-glass-card welcome-service-card" key={card.title}>
                <span className="material-symbols-outlined">{card.icon}</span>
                <h2>{card.title}</h2>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="welcome-section" id="thong-tin-bai">
          <div className="welcome-section-heading">
            <div>
              <h2>Tình Trạng Bãi Đỗ Xe</h2>
              <p>Dữ liệu thời gian thực được cập nhật mỗi 30 giây từ hệ thống cảm biến.</p>
            </div>
            <div className="welcome-legend">
              <span><i className="spot-dot available" />Trống</span>
              <span><i className="spot-dot occupied" />Đã có xe</span>
              <span><i className="spot-dot pending" />Đã đặt</span>
            </div>
          </div>

          <div className="welcome-parking-layout">
            <article className="welcome-glass-card welcome-map-card">
              <div className="welcome-map-heading">
                <div>
                  <span className="material-symbols-outlined">apartment</span>
                  <strong>Sơ đồ Tầng {selectedFloor} - Khu vực A</strong>
                </div>
                <select value={selectedFloor} onChange={(event) => setSelectedFloor(event.target.value)}>
                  <option value="B1">Tầng B1</option>
                  <option value="B2">Tầng B2</option>
                  <option value="B3">Tầng B3</option>
                </select>
              </div>

              <div className="welcome-spot-grid">
                {spots.slice(0, 5).map(([id, status]) => (
                  <span className={`welcome-spot ${status}`} key={id}>{id}</span>
                ))}
                <span className="welcome-grid-gap" />
                {spots.slice(5, 9).map(([id, status]) => (
                  <span className={`welcome-spot ${status}`} key={id}>{id}</span>
                ))}
                <div className="welcome-aisle">Lối đi chính</div>
                {spots.slice(9, 14).map(([id, status]) => (
                  <span className={`welcome-spot ${status}`} key={id}>{id}</span>
                ))}
                <span className="welcome-grid-gap" />
                {spots.slice(14).map(([id, status]) => (
                  <span className={`welcome-spot ${status}`} key={id}>{id}</span>
                ))}
              </div>
            </article>

            <div className="welcome-stat-list">
              {stats.map((stat) => (
                <article className={`welcome-glass-card welcome-stat-card ${stat.tone}`} key={stat.label}>
                  <div>
                    <p>{stat.label}</p>
                    <strong>{stat.value}</strong>
                  </div>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="welcome-section" id="thong-bao">
          <div className="welcome-announcement-title">
            <span className="material-symbols-outlined">campaign</span>
            <h2>Thông báo của Admin</h2>
          </div>

          <div className="welcome-announcement-list">
            {announcements.map((item) => (
              <article className="welcome-glass-card welcome-announcement" key={item.title}>
                <div className="welcome-date">
                  <strong>{item.day}</strong>
                  <span>{item.month}</span>
                </div>
                <div className="welcome-announcement-body">
                  <div>
                    <span className={`welcome-badge ${item.tone}`}>{item.badge}</span>
                    <h3>{item.title}</h3>
                  </div>
                  <p>{item.description}</p>
                </div>
                <span className="material-symbols-outlined">chevron_right</span>
              </article>
            ))}
          </div>

          <div className="welcome-more-wrap">
            <button type="button">Xem tất cả thông báo</button>
          </div>
        </section>
      </main>

      <footer className="welcome-footer">
        <div className="welcome-footer-grid">
          <section>
            <div className="welcome-footer-brand">
              <img alt="Parking System Logo Small" src={logoUrl} />
              <span>Parking System</span>
            </div>
            <p>
              Operational Precision. Giải pháp quản lý bãi đỗ xe hàng đầu cho các tòa
              nhà văn phòng và trung tâm thương mại cao cấp.
            </p>
          </section>

          <section>
            <h2>Liên kết nhanh</h2>
            <a href="/privacy">Chính sách bảo mật</a>
            <a href="/terms">Điều khoản dịch vụ</a>
            <a href="/support">Hỗ trợ kỹ thuật</a>
          </section>

          <section>
            <h2>Hỗ trợ</h2>
            <p><span className="material-symbols-outlined">support_agent</span>Hotline: 1900 8888</p>
            <p><span className="material-symbols-outlined">mail</span>support@nexus.vn</p>
            <p><span className="material-symbols-outlined">location_on</span>Tòa nhà Nexus, Quận 1, TP.HCM</p>
          </section>

          <section>
            <h2>Theo dõi chúng tôi</h2>
            <div className="welcome-socials">
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#twitter" aria-label="Twitter">x</a>
            </div>
          </section>
        </div>

        <div className="welcome-footer-bottom">
          <span>© 2024 Parking System Management. Operational Precision.</span>
          <span>Hệ thống quản lý bãi đỗ xe thông minh v4.2.0</span>
        </div>
      </footer>
    </div>
  );
}
