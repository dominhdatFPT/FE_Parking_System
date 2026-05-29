import { useState } from 'react';
import { useNavigate } from 'react-router';
import { login } from '../../services/authService';

const userFieldClass = 'grid gap-1.5';
const userLabelClass =
  'text-[11px] font-bold uppercase leading-[14px] tracking-[0.05em] text-[#45464d]';
const userInputWrapClass = 'relative';
const userInputIconClass =
  'material-symbols-outlined pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-[#76777d]';
const userInputClass =
  'min-h-11 w-full rounded border border-[#c6c6cd] bg-[#f2f4f6] py-2.5 pr-3.5 pl-10 text-sm leading-5 text-[#191c1e] outline-none transition focus:border-[#0051d5] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,81,213,0.12)]';

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
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#f7f9fb] text-[#191c1e]">
      <header className="z-10 flex h-16 items-center justify-between border-b border-[#c6c6cd] bg-[#f7f9fb] px-6 max-[720px]:px-4">
        <div className="flex items-center gap-2">
          <img
            alt="Parking System Logo"
            className="h-12 w-12 rounded-full object-cover"
            src="/parking-system-logo.png"
          />
          <span className="text-2xl font-bold leading-8 text-[#0051d5] max-[720px]:text-lg">
            Parking System
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            aria-label="Ngôn ngữ"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded bg-transparent text-[#45464d] transition hover:bg-[#eceef0] hover:text-[#0051d5]"
            type="button"
          >
            <span className="material-symbols-outlined">language</span>
          </button>
          <button
            aria-label="Trợ giúp"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded bg-transparent text-[#45464d] transition hover:bg-[#eceef0] hover:text-[#0051d5]"
            type="button"
          >
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center overflow-hidden p-4 max-[720px]:px-4 max-[720px]:py-3">
        <div className="grid h-full max-h-[600px] w-full max-w-6xl grid-cols-[minmax(0,1fr)_minmax(380px,1fr)] overflow-hidden rounded-lg border border-[#c6c6cd] bg-white shadow-[0_12px_28px_rgba(19,27,46,0.08)] max-[980px]:max-h-none max-[980px]:grid-cols-1 max-[720px]:rounded">
          <section
            className="flex flex-col justify-between gap-5 bg-[#131b2e] p-8 text-white max-[980px]:hidden"
            aria-label="Dịch vụ bãi xe"
          >
            <div>
              <h1 className="mb-3 text-[32px] font-bold leading-10">Quản lý bãi xe thông minh</h1>
              <p className="mb-7 text-sm leading-5 text-[#c6c6cd]">
                Hệ thống Nexus mang lại trải nghiệm đỗ xe tự động, an toàn và minh bạch
                tuyệt đối cho cư dân.
              </p>

              <div className="grid gap-5">
                {benefits.map((benefit) => (
                  <article className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3" key={benefit.title}>
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded bg-[#316bf3]/20 text-[#dbe1ff]">
                      <span className="material-symbols-outlined">{benefit.icon}</span>
                    </div>
                    <div>
                      <h2 className="mb-0.5 text-[15px] leading-5 text-white">{benefit.title}</h2>
                      <p className="text-[13px] leading-[18px] text-[#c6c6cd]">{benefit.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="h-[140px] overflow-hidden rounded-lg border border-[#c6c6cd]/30">
              <img
                alt="Underground parking garage"
                className="block h-full w-full object-cover opacity-65"
                src="https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80"
              />
            </div>
          </section>

          <section
            className="flex flex-col justify-start overflow-y-auto overflow-x-hidden p-7 [scrollbar-width:thin] [scrollbar-color:#c6c6cd_transparent] max-[980px]:px-6 max-[980px]:py-8 max-[720px]:px-4 max-[720px]:py-5"
            aria-label="Đăng nhập cư dân"
          >
            <div className="mb-7">
              <h2 className="mb-1.5 text-[22px] font-semibold leading-7 text-[#191c1e] max-[720px]:text-lg max-[720px]:leading-6">
                Chào mừng cư dân
              </h2>
              <p className="text-sm leading-5 text-[#45464d]">Vui lòng đăng nhập để truy cập dịch vụ bãi xe.</p>
            </div>

            {error && <p className="mb-[18px] rounded border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-700">{error}</p>}

            <form className="grid gap-4" onSubmit={handleSubmit}>
              <label className={userFieldClass} htmlFor="resident-login">
                <span className={userLabelClass}>Số điện thoại / Email</span>
                <div className={userInputWrapClass}>
                  <span className={userInputIconClass}>person</span>
                  <input
                    className={userInputClass}
                    id="resident-login"
                    placeholder="Nhập thông tin của bạn"
                    type="text"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                  />
                </div>
              </label>

              <label className={userFieldClass} htmlFor="resident-password">
                <div className="flex items-center justify-between gap-3 max-[720px]:flex-col max-[720px]:items-start">
                  <span className={userLabelClass}>Mật khẩu</span>
                  <a className="text-xs text-[#0051d5] no-underline transition hover:text-[#003ea8] hover:underline" href="/forgot-password">Quên mật khẩu?</a>
                </div>
                <div className={userInputWrapClass}>
                  <span className={userInputIconClass}>lock</span>
                  <input
                    className={userInputClass}
                    id="resident-password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="inline-flex cursor-pointer items-center gap-2 py-1.5 text-[13px] text-[#45464d]">
                <input
                  className="h-4 w-4 accent-[#0051d5]"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>

              <button
                className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded bg-[#0051d5] text-[15px] font-bold leading-5 text-white shadow-[0_12px_24px_rgba(0,81,213,0.18)] transition hover:bg-[#003ea8] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-65"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập ngay'}
              </button>
            </form>

            <div className="mt-5 border-t border-[#c6c6cd] pt-5 text-center">
              <p className="mb-3 text-[13px] leading-[18px] text-[#45464d]">Bạn chưa có tài khoản?</p>
              <a
                className="inline-flex min-h-12 w-full items-center justify-center rounded border-2 border-[#0051d5] bg-transparent text-[15px] font-bold leading-5 text-[#0051d5] no-underline hover:bg-[#0051d5]/10"
                href="/signup"
              >
                Đăng ký tài khoản mới
              </a>
            </div>
          </section>
        </div>
      </main>

      <footer className="flex min-h-[60px] items-center justify-between gap-4 border-t border-[#c6c6cd] bg-[#f2f4f6] px-6 py-3 text-xs max-[720px]:min-h-0 max-[720px]:flex-col">
        <div className="flex items-center gap-1.5">
          <strong className="text-[11px] tracking-[0.05em] text-[#0051d5]">NEXUS</strong>
          <span className="text-xs leading-4 text-[#45464d]">© 2024 Nexus Facility Management. Operational Precision.</span>
        </div>
        <nav className="flex gap-4 max-[720px]:w-full max-[720px]:flex-wrap max-[720px]:gap-x-4 max-[720px]:gap-y-3" aria-label="Liên kết hỗ trợ">
          <a className="text-xs leading-4 text-[#45464d] no-underline hover:text-[#003ea8] hover:underline" href="/support">Trung tâm trợ giúp</a>
          <a className="text-xs leading-4 text-[#45464d] no-underline hover:text-[#003ea8] hover:underline" href="/terms">Điều khoản dịch vụ</a>
          <a className="text-xs leading-4 text-[#45464d] no-underline hover:text-[#003ea8] hover:underline" href="/privacy">Chính sách bảo mật</a>
        </nav>
      </footer>
    </div>
  );
}
