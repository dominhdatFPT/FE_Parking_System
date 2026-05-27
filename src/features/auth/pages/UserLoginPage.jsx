import { useState } from 'react';
import { useNavigate } from 'react-router';
import { login } from '../services/authService';
import './UserLoginPage.css';

const benefits = [
  {
    icon: 'event_available',
    title: 'Đặt chỗ nhanh',
    description: 'Giữ chỗ đỗ xe chỉ trong vài giây qua ứng dụng di động.',
  },
  {
    icon: 'account_balance_wallet',
    title: 'Thanh toán dễ dàng',
    description: 'Tích hợp ví điện tử và thẻ ngân hàng, thanh toán không chạm.',
  },
  {
    icon: 'verified_user',
    title: 'An toàn 24/7',
    description: 'Giám sát AI và camera an ninh bảo vệ phương tiện mọi lúc.',
  },
];

export default function UserLoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(phone, password);

      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', 'driver');

        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        navigate('/driver/welcome');
      }
    } catch (err) {
      setError('Số điện thoại hoặc mật khẩu không chính xác');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-login-page">
      <header className="user-login-header">
        <div className="user-login-header-brand">
          <img
            alt="Parking System Logo"
            src="/parking-system-logo.png"
          />
          <span>Parking System</span>
        </div>
        <div className="user-login-header-actions">
          <button aria-label="Ngôn ngữ" type="button">
            <span className="material-symbols-outlined">language</span>
          </button>
          <button aria-label="Trợ giúp" type="button">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>

      <main className="user-login-main">
        <div className="user-login-shell">
          <section className="user-login-visual" aria-label="Dịch vụ bãi xe">
            <div className="user-login-copy">
              <h1>Quản lý bãi xe thông minh</h1>
              <p>
                Hệ thống Nexus mang lại trải nghiệm đỗ xe tự động, an toàn và minh bạch
                tuyệt đối cho cư dân.
              </p>

              <div className="user-login-benefits">
                {benefits.map((benefit) => (
                  <article className="user-login-benefit" key={benefit.title}>
                    <div className="user-login-benefit-icon">
                      <span className="material-symbols-outlined">{benefit.icon}</span>
                    </div>
                    <div>
                      <h2>{benefit.title}</h2>
                      <p>{benefit.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="user-login-parking-photo">
              <img
                alt="Underground parking garage"
                src="https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80"
              />
            </div>
          </section>

          <section className="user-login-form-panel" aria-label="Đăng nhập cư dân">
            <div className="user-login-form-heading">
              <h2>Chào mừng cư dân</h2>
              <p>Vui lòng đăng nhập để truy cập dịch vụ bãi xe.</p>
            </div>

            {error && <p className="user-login-error">{error}</p>}

            <form className="user-login-form" onSubmit={handleSubmit}>
              <label className="user-login-field" htmlFor="resident-login">
                <span>Số điện thoại / Email</span>
                <div className="user-login-input-wrap">
                  <span className="material-symbols-outlined">person</span>
                  <input
                    id="resident-login"
                    placeholder="Nhập thông tin của bạn"
                    type="text"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="user-login-field" htmlFor="resident-password">
                <div className="user-login-label-row">
                  <span>Mật khẩu</span>
                  <a href="/forgot-password">Quên mật khẩu?</a>
                </div>
                <div className="user-login-input-wrap">
                  <span className="material-symbols-outlined">lock</span>
                  <input
                    id="resident-password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="user-login-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>

              <button className="user-login-submit" type="submit" disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập ngay'}
              </button>
            </form>

            <div className="user-login-register">
              <p>Bạn chưa có tài khoản?</p>
              <a href="/signup">Đăng ký tài khoản mới</a>
            </div>
          </section>
        </div>
      </main>

      <footer className="user-login-footer">
        <div>
          <strong>NEXUS</strong>
          <span>© 2024 Nexus Facility Management. Operational Precision.</span>
        </div>
        <nav aria-label="Liên kết hỗ trợ">
          <a href="/support">Trung tâm trợ giúp</a>
          <a href="/terms">Điều khoản dịch vụ</a>
          <a href="/privacy">Chính sách bảo mật</a>
        </nav>
      </footer>
    </div>
  );
}
