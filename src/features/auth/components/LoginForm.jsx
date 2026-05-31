import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../../constants/routes';
import { useAuth } from '../hooks/useAuth';

export default function LoginForm() {
  const navigate = useNavigate();
  const { error, loading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();

    await login({ email, password, rememberMe });
    navigate(ROUTES.DASHBOARD, { replace: true });
  };

  return (
    <div>
      <div className="mb-8 lg:hidden">
        <div className="mb-5 flex items-center gap-3">
          <img
            alt="Parking System Logo"
            className="h-11 w-11 rounded-full object-cover"
            src="/parking-system-logo.png"
          />
          <span className="text-xl font-semibold text-[#0051d5]">Parking System</span>
        </div>
      </div>

      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#0051d5]">
          Welcome back
        </p>
        <h2 className="text-3xl font-semibold text-[#101828]">Đăng nhập</h2>
        <p className="mt-3 text-sm leading-6 text-[#586174]">
          Truy cập bảng điều khiển để quản lý vận hành bãi xe.
        </p>
      </div>

      {error && (
        <p className="mb-5 rounded border border-[#ffd1d1] bg-[#fff1f1] px-3 py-2.5 text-sm text-[#b42318]">
          {error}
        </p>
      )}

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <label className="grid gap-2" htmlFor="login-email">
          <span className="text-sm font-semibold text-[#344054]">Email</span>
          <div className="relative">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">
              mail
            </span>
            <input
              className="h-12 w-full rounded border border-[#c9d2df] bg-white px-3 pl-10 text-sm text-[#101828] outline-none transition focus:border-[#0051d5] focus:shadow-[0_0_0_3px_rgba(0,81,213,0.12)]"
              id="login-email"
              placeholder="admin@parking.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </label>

        <label className="grid gap-2" htmlFor="login-password">
          <span className="text-sm font-semibold text-[#344054]">Mật khẩu</span>
          <div className="relative">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">
              lock
            </span>
            <input
              className="h-12 w-full rounded border border-[#c9d2df] bg-white px-3 pl-10 text-sm text-[#101828] outline-none transition focus:border-[#0051d5] focus:shadow-[0_0_0_3px_rgba(0,81,213,0.12)]"
              id="login-password"
              placeholder="Nhập mật khẩu"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
        </label>

        <div className="flex items-center justify-between gap-4">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#475467]">
            <input
              className="h-4 w-4 accent-[#0051d5]"
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            Ghi nhớ đăng nhập
          </label>
          <a className="text-sm font-semibold text-[#0051d5] hover:underline" href="/recovery">
            Quên mật khẩu?
          </a>
        </div>

        <button
          className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded bg-[#0051d5] px-4 text-sm font-semibold text-white transition hover:bg-[#003ea8] disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
        </button>
      </form>
    </div>
  );
}
