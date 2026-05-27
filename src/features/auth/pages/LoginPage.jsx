import { useState } from 'react';
import { useNavigate } from 'react-router';
import { login } from '../services/authService';
import './LoginPage.css';

const features = [
  {
    icon: 'security',
    title: 'Bảo Mật Đa Lớp',
    description:
      'Hệ thống bảo mật chuẩn doanh nghiệp, bảo vệ dữ liệu tòa nhà tuyệt đối 24/7.',
  },
  {
    icon: 'apartment',
    title: 'Quản Lý Tập Trung',
    description:
      'Giám sát toàn bộ hạ tầng, từ bãi đỗ xe đến an ninh tòa nhà trên một giao diện duy nhất.',
  },
  {
    icon: 'monitoring',
    title: 'Độ Chính Xác Cao',
    description:
      'Dữ liệu thời gian thực giúp đưa ra các quyết định vận hành chính xác và hiệu quả.',
  },
];

const securityBadges = [
  { icon: 'verified_user', label: 'SSL Secured' },
  { icon: 'cloud_done', label: 'Cloud Synced' },
  { icon: 'admin_panel_settings', label: 'Access Control' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
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
      const response = await login(email, password);

      if (response.token) {
        localStorage.setItem('token', response.token);

        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Email hoặc mật khẩu không chính xác');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <main className="admin-login-main">
        <section className="admin-login-visual" aria-label="Thông tin hệ thống">
          <div className="admin-login-image" />
          <div className="admin-login-overlay" />

          <div className="admin-login-visual-content">
            <div className="admin-login-brand">
              <img
                alt="Parking System Logo"
                className="admin-login-logo"
                src="/parking-system-logo.png"
              />
              <div>
                <h1>Parking System</h1>
                <p>Hệ Thống Quản Trị Vận Hành</p>
              </div>
            </div>

            <div className="admin-login-feature-list">
              {features.map((feature) => (
                <article className="admin-login-feature" key={feature.title}>
                  <div className="admin-login-feature-icon">
                    <span className="material-symbols-outlined">{feature.icon}</span>
                  </div>
                  <div>
                    <h2>{feature.title}</h2>
                    <p>{feature.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-login-form-side" aria-label="Đăng nhập quản trị viên">
          <div className="admin-login-card">
            <div className="admin-login-heading">
              <h2>Đăng nhập Quản trị viên</h2>
              <p>Vui lòng nhập thông tin để truy cập hệ thống Nexus</p>
            </div>

            {error && <p className="admin-login-error">{error}</p>}

            <form className="admin-login-form" onSubmit={handleSubmit}>
              <label className="admin-login-field" htmlFor="admin-email">
                <span>Email / Tên đăng nhập</span>
                <div className="admin-login-input-wrap">
                  <span className="material-symbols-outlined">person</span>
                  <input
                    id="admin-email"
                    name="email"
                    placeholder="admin@nexusfacility.com"
                    type="text"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="admin-login-field" htmlFor="admin-password">
                <span>Mật khẩu</span>
                <div className="admin-login-input-wrap">
                  <span className="material-symbols-outlined">lock</span>
                  <input
                    id="admin-password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
              </label>

              <div className="admin-login-options">
                <label className="admin-login-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <a href="/forgot-password">Quên mật khẩu?</a>
              </div>

              <button className="admin-login-submit" type="submit" disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập hệ thống'}
              </button>

              <p className="admin-login-signup">
                Chưa có tài khoản?
                <a href="/admin/signup">Đăng ký tài khoản quản trị viên</a>
              </p>
            </form>

            <div className="admin-login-badges" aria-label="Thông tin bảo mật">
              {securityBadges.map((badge) => (
                <div className="admin-login-badge" key={badge.label}>
                  <span className="material-symbols-outlined">{badge.icon}</span>
                  <strong>{badge.label}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="admin-login-footer">
        <p>© 2024 Nexus Facility Management. Vận Hành Chính Xác.</p>
        <nav aria-label="Liên kết hỗ trợ">
          <a href="/support">Hỗ Trợ Kỹ Thuật</a>
          <a href="/terms">Điều Khoản Sử Dụng</a>
          <a href="/privacy">Bảo Mật</a>
        </nav>
      </footer>
    </div>
  );
}
