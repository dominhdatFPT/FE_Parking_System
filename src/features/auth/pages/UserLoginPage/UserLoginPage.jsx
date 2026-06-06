import { useState } from 'react';
import { useNavigate } from 'react-router';
import { login } from '../../../../services/modules/authService';
import { ROUTES } from '../../../../constants/routes';
import { useAuth } from '../../../../contexts/AuthContext';

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
  const { setUser } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(phone, password);

      if (response.token) {
        localStorage.setItem('access_token', response.token);
        localStorage.setItem('userRole', 'driver');
        
        // Cập nhật AuthContext
        setUser({ id: 'driver-placeholder', role: 'driver', ...response.user });

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
    <main className="flex h-screen min-h-screen flex-col overflow-hidden bg-[#f7f9fb] text-[#191c1e]">
      <section className="flex min-h-0 flex-1 overflow-hidden border-t border-[#c6c6cd] bg-white max-[980px]:border-t-0">
        <aside
          className="relative flex w-1/2 flex-col justify-between overflow-hidden bg-[#131b2e] px-6 py-8 text-white max-[980px]:hidden"
          aria-label="Dịch vụ bãi xe"
        >
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-white/95">
                  <img
                    alt="Parking System Logo"
                    className="h-full w-full object-cover"
                    src="/parking-system-logo.png"
                  />
                </div>
                <span className="text-2xl font-semibold leading-8 text-white">Parking System</span>
              </div>

              <h1 className="mb-3 text-[26px] font-bold leading-9 text-[#dbe1ff]">
                Giải pháp Quản lý Bãi đậu xe Thông minh
              </h1>
              <p className="mb-8 max-w-[420px] text-[15px] leading-relaxed text-[#7c839b] opacity-90">
                Nâng tầm trải nghiệm vận hành với hệ thống tự động hóa chuẩn doanh
                nghiệp. Chính xác, bảo mật và hiệu quả vượt trội cho mọi cơ sở hạ tầng.
              </p>

              <div className="grid gap-4">
                {benefits.map((benefit) => (
                  <article 
                    className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl" 
                    key={benefit.title}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#316bf3] to-[#003ea8] text-white shadow-[0_0_15px_rgba(49,107,243,0.4)]">
                      <span className="material-symbols-outlined text-[22px]">{benefit.icon}</span>
                    </div>
                    <div>
                      <h2 className="mb-1 text-[15px] font-semibold leading-5 text-white tracking-wide">{benefit.title}</h2>
                      <p className="text-[13px] leading-[18px] text-[#a5adc6]">{benefit.description}</p>
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
        </aside>

        <section
          className="flex min-h-0 w-1/2 flex-1 flex-col justify-center overflow-y-auto overflow-x-hidden bg-white px-6 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[980px]:w-full max-[980px]:px-6 max-[980px]:py-5 max-sm:px-4 max-sm:py-4"
          aria-label="Đăng nhập cư dân"
        >
          <div className="mx-auto w-full max-w-md max-sm:max-w-full">
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
              <button
                className="mt-3 inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded border border-[#c6c6cd] bg-white text-[15px] font-bold leading-5 text-[#45464d] transition hover:border-[#0051d5] hover:text-[#0051d5]"
                type="button"
                onClick={() => navigate(ROUTES.ADMIN_LOGIN)}
              >
                Đăng nhập quản trị viên
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
