import { useState } from 'react';
import { useNavigate } from 'react-router';
import './SignupPage.css';

const logoUrl = '/parking-system-logo.png';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!fullName.trim()) {
      setError('Vui lòng nhập họ và tên');
      return false;
    }

    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }

    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return false;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }

    if (!agreeTerms) {
      setError('Vui lòng chấp nhận Điều khoản & Điều kiện');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
        }),
      });

      if (response.ok) {
        setSuccess('Tạo tài khoản thành công! Đang chuyển hướng...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Có lỗi kết nối, vui lòng thử lại');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup-page">
      <section className="signup-shell">
        <aside className="signup-visual" aria-label="Thông tin hệ thống">
          <div className="signup-bg-image" />

          <div className="signup-brand-block">
            <div className="signup-brand">
              <div className="signup-brand-logo">
                <img alt="Parking System Logo" src={logoUrl} />
              </div>
              <span>Parking System</span>
            </div>

            <h1>Giải pháp Quản lý Bãi đậu xe Thông minh</h1>
            <p>
              Nâng tầm trải nghiệm vận hành với hệ thống tự động hóa chuẩn doanh
              nghiệp. Chính xác, bảo mật và hiệu quả vượt trội cho mọi cơ sở hạ tầng.
            </p>
          </div>

          <div className="signup-security-card">
            <div className="signup-security-heading">
              <div>
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <section>
                <h2>Tiêu chuẩn an ninh</h2>
                <p>Mã hóa dữ liệu 256-bit chuẩn quốc tế</p>
              </section>
            </div>

            <div className="signup-status-grid">
              <div>
                <h3>Trạng thái</h3>
                <p>
                  <i />
                  Trực tuyến
                </p>
              </div>
              <div>
                <h3>Phiên bản</h3>
                <p>v4.2.0-PRO</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="signup-form-panel" aria-label="Tạo tài khoản mới">
          <div className="signup-form-wrap">
            <div className="signup-mobile-brand">
              <img alt="Parking System Logo" src={logoUrl} />
              <span>Parking System</span>
            </div>

            <div className="signup-heading">
              <h2>Tạo Tài Khoản Mới</h2>
              <p>Chào mừng bạn đến với hệ thống quản lý bãi xe.</p>
            </div>

            {error && <p className="signup-alert signup-alert-error">{error}</p>}
            {success && <p className="signup-alert signup-alert-success">{success}</p>}

            <form className="signup-form" onSubmit={handleSubmit}>
              <label className="signup-field" htmlFor="signup-fullname">
                <span>Họ và tên</span>
                <div className="signup-input-wrap">
                  <span className="material-symbols-outlined">person</span>
                  <input
                    id="signup-fullname"
                    placeholder="Nguyễn Văn A"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="signup-field" htmlFor="signup-email">
                <span>Email công việc</span>
                <div className="signup-input-wrap">
                  <span className="material-symbols-outlined">mail</span>
                  <input
                    id="signup-email"
                    placeholder="example@nexus.com"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="signup-field" htmlFor="signup-phone">
                <span>Số điện thoại</span>
                <div className="signup-input-wrap">
                  <span className="material-symbols-outlined">call</span>
                  <input
                    id="signup-phone"
                    placeholder="090 123 4567"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                  />
                </div>
              </label>

              <div className="signup-password-grid">
                <label className="signup-field" htmlFor="signup-password">
                  <span>Mật khẩu</span>
                  <div className="signup-input-wrap">
                    <span className="material-symbols-outlined">lock</span>
                    <input
                      id="signup-password"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </div>
                </label>

                <label className="signup-field" htmlFor="signup-confirm-password">
                  <span>Xác nhận</span>
                  <div className="signup-input-wrap">
                    <span className="material-symbols-outlined">lock_reset</span>
                    <input
                      id="signup-confirm-password"
                      placeholder="••••••••"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      required
                    />
                  </div>
                </label>
              </div>

              <label className="signup-terms" htmlFor="signup-terms">
                <input
                  id="signup-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(event) => setAgreeTerms(event.target.checked)}
                />
                <span>
                  Tôi đồng ý với các <a href="/terms">Điều khoản & Điều kiện</a> và{' '}
                  <a href="/privacy">Chính sách Bảo mật</a> của Parking System.
                </span>
              </label>

              <button className="signup-submit" type="submit" disabled={loading}>
                {loading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản'}
                {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
              </button>
            </form>

            <div className="signup-login-link">
              <p>
                Đã có tài khoản?
                <a href="/login">Đăng nhập ngay</a>
              </p>
            </div>

            <div className="signup-badges" aria-label="Thông tin bảo mật">
              <div>
                <span className="material-symbols-outlined">security</span>
                <strong>Secure SSL</strong>
              </div>
              <div>
                <span className="material-symbols-outlined">database</span>
                <strong>GDPR Ready</strong>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
