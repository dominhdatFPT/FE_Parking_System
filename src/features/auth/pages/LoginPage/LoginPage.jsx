import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../../contexts/useAuth';
import { auth, googleProvider } from '../../../../config/firebase';
import { STORAGE_KEYS } from '../../../../constants/storageKeys';
import { ROUTES } from '../../../../constants/routes';
import { login } from '../../../../services/modules/authService';

import { googleLoginApi } from '../../services/authApi';

const benefits = [
  {
    icon: 'event_available',
    title: 'Đặt chỗ nhanh',
    description: 'Giữ chỗ đỗ xe chỉ trong vài giây qua ứng dụng di động.',
  },
  {
    icon: 'account_balance_wallet',
    title: 'Thanh toán dễ dàng',
    description: 'Tích hợp ví điện tử và thanh toán nhanh, minh bạch.',
  },
  {
    icon: 'verified_user',
    title: 'An toàn 24/7',
    description: 'Giám sát AI và camera an ninh bảo vệ phương tiện mọi lúc.',
  },
];

function getDashboardPath(role) {
  const normalizedRole = role?.toLowerCase();

  if (normalizedRole === 'admin') {
    return ROUTES.ADMIN.DASHBOARD;
  }

  return '/driver-dashboard';
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(email, password);

      if (!response?.token) {
        throw new Error('Không nhận được token từ máy chủ');
      }

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);

      const authenticatedUser = {
        id: response.user?.id ?? response.userId ?? email,
        fullName: response.user?.fullName ?? response.fullName ?? response.user?.name ?? 'Người dùng',
        email: response.user?.email ?? response.email ?? email,
        role: response.user?.role ?? response.role ?? 'driver',
        avatarUrl: response.user?.avatarUrl ?? response.avatarUrl ?? '',
      };

      setUser(authenticatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authenticatedUser));
      localStorage.setItem('userRole', authenticatedUser.role || 'driver');

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      navigate(getDashboardPath(authenticatedUser.role));
    } catch (err) {
      setError('Email hoặc mật khẩu không chính xác.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await googleLoginApi(idToken);

      if (response.token) {
        const nextUser = {
          id: response.userId,
          role: response.role,
          email: response.email,
          fullName: response.fullName,
          customerId: response.customerId,
          employeeId: response.employeeId,
          avatarUrl: response.avatarUrl ?? '',
        };

        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(nextUser));
        localStorage.setItem('userRole', response.role || 'driver');
        setUser(nextUser);
        navigate(getDashboardPath(response.role));
      }
    } catch (err) {
      setError('Đăng nhập Google thất bại. Vui lòng thử lại.');
      console.error('Google login error:', err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-[linear-gradient(135deg,#07111f_0%,#0f172a_45%,#111827_100%)] text-[#e5eefb]">
      <section className="grid h-screen w-full grid-cols-1 overflow-hidden lg:grid-cols-[0.98fr_1.02fr]">
        <aside className="relative flex h-full flex-col justify-between overflow-hidden bg-[#1F2937] px-5 py-5 text-white sm:px-6 sm:py-6 lg:px-8 lg:py-8" aria-label="Dịch vụ bãi xe">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_30%)]" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-10" />

          <div className="relative z-10 flex h-full flex-col justify-between gap-6 lg:justify-center">
            <div className="space-y-5">
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-3 py-2 shadow-[0_8px_30px_rgba(15,23,42,0.35)] backdrop-blur-md lg:px-4">
                <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-white/95 shadow-inner sm:h-13 sm:w-13">
                  <img alt="Parking System Logo" className="h-full w-full object-cover" src="/parking-system-logo.png" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-sky-100/80">Parking System</p>
                  <p className="text-sm text-white/85">Quản lý bãi đỗ xe thông minh</p>
                </div>
              </div>

              <div className="max-w-xl space-y-2.5">
                <p className="text-[10px] uppercase tracking-[0.35em] text-sky-100/80">Truy cập nhanh</p>
                <h1 className="max-w-md text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-[2rem]">
                  Hệ thống quản lý bãi đỗ xe hiện đại, gọn và an toàn.
                </h1>
                <p className="max-w-md text-[13px] leading-5 text-slate-200/90 sm:text-[14px]">
                  Theo dõi chỗ đỗ, xử lý thanh toán và kiểm soát bảo mật từ một giao diện duy nhất.
                </p>
              </div>

              <div className="grid gap-3 lg:grid-cols-1">
                {benefits.slice(0, 3).map((benefit) => (
                  <article
                    className="rounded-2xl border border-white/10 bg-white/8 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.35)] backdrop-blur-md"
                    key={benefit.title}
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white shadow-[0_10px_25px_rgba(56,189,248,0.25)]">
                      <span className="material-symbols-outlined text-[20px]">{benefit.icon}</span>
                    </div>
                    <h2 className="mb-1 text-[14px] font-semibold text-white">{benefit.title}</h2>
                    <p className="text-[12px] leading-5 text-slate-200/85">{benefit.description}</p>
                  </article>
                ))}
              </div>
            </div>

          </div>
        </aside>

        <section className="flex h-full items-center justify-center overflow-hidden bg-[#F3F4F6] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200/80 bg-white/95 p-5 text-black shadow-[0_22px_60px_rgba(15,23,42,0.12)] backdrop-blur-md sm:p-6 lg:p-7">
            <div className="mb-5 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 shadow-[0_12px_28px_rgba(37,99,235,0.25)]">
                <span className="material-symbols-outlined text-[28px] text-white">shield_locked</span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#0EA5E9]">Parking System</p>
              <h2 className="mt-3 text-2xl font-semibold text-black sm:text-3xl">Chào mừng trở lại</h2>
              <p className="mt-2 text-sm text-slate-700">Đăng nhập để tiếp tục</p>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700 shadow-sm">
                <span className="material-symbols-outlined text-[18px] text-red-500">warning</span>
                <p className="leading-5">{error}</p>
              </div>
            )}

            <form className="grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-1.5 text-left" htmlFor="login-email">
                <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-black">Email / Gmail</span>
                <div className="relative">
                  <span className="material-symbols-outlined pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-[#76777d]">mail</span>
                  <input
                    className="min-h-11 w-full rounded-xl border border-[#c6c6cd] bg-[#f2f4f6] py-2.75 pr-3.5 pl-10 text-sm leading-5 text-[#111827] outline-none transition focus:border-[#0EA5E9] focus:bg-white focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
                    id="login-email"
                    name="email"
                    placeholder="yourname@gmail.com"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="grid gap-1.5 text-left" htmlFor="login-password">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-black">Mật khẩu</span>
                  <a className="text-xs font-semibold text-[#0EA5E9] hover:underline" href="/reset-password">Quên mật khẩu?</a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-[#76777d]">lock</span>
                  <input
                    className="min-h-11 w-full rounded-xl border border-[#c6c6cd] bg-[#f2f4f6] py-2.75 pr-3.5 pl-10 text-sm leading-5 text-[#111827] outline-none transition focus:border-[#0EA5E9] focus:bg-white focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
                    id="login-password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
              </label>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-black">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    className="h-4 w-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9]"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  <span className="text-black">Ghi nhớ đăng nhập</span>
                </label>
              </div>

              <button
                className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-[#0EA5E9] px-4 text-[15px] font-semibold text-white shadow-[0_14px_26px_rgba(14,165,233,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-65"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập ngay'}
              </button>
            </form>

            <div className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-700">
              <span className="h-px flex-1 bg-slate-200" />
              <span>Hoặc</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              className="mt-4 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-semibold text-black shadow-sm transition hover:border-[#0EA5E9] hover:text-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-65"
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {googleLoading ? 'Đang đăng nhập...' : 'Đăng nhập bằng Google'}
            </button>

            <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-200 pt-4 text-center text-sm text-slate-700">
              <span>Chưa có tài khoản?</span>
              <a className="font-semibold text-[#0EA5E9] hover:underline" href="/signup">Đăng ký ngay</a>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
