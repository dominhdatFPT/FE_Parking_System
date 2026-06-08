import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../../contexts/AuthContext';
import { login } from '../../../../services/modules/authService';
import { ROUTES } from '../../../../constants/routes';
import { STORAGE_KEYS } from '../../../../constants/storageKeys';

const adminHeroImage =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80';
const adminFieldClass = 'grid gap-3';
const adminFieldLabelClass =
  'ml-1 text-xs font-bold uppercase tracking-[0.05em] text-[#45464d]';
const adminInputWrapClass = 'relative';
const adminInputIconClass =
  'material-symbols-outlined absolute top-1/2 left-5 -translate-y-1/2 text-[#76777d]';
const adminInputClass =
  'min-h-16 w-full rounded border border-[#c6c6cd] bg-white py-[18px] pr-5 pl-14 outline-none focus:border-[#316bf3] focus:shadow-[0_0_0_3px_rgba(49,107,243,0.16)]';

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
  const { setUser } = useAuth();

  const SAMPLE_ADMIN_EMAIL = 'dat@example.com';
  const SAMPLE_ADMIN_PASSWORD = 'admin2026';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (
        email.trim().toLowerCase() === SAMPLE_ADMIN_EMAIL &&
        password === SAMPLE_ADMIN_PASSWORD
      ) {
        const sampleToken = 'sample-admin-token';
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, sampleToken);
        setUser({
          id: 'u-001',
          fullName: 'Đỗ Minh Đạt',
          email: SAMPLE_ADMIN_EMAIL,
          role: 'admin',
          avatarUrl:
            'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=96&q=80',
        });

        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        navigate(ROUTES.ADMIN.DASHBOARD);
        return;
      }

      const response = await login(email, password);

      if (response.token) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);
        setUser({
          id: 'u-001',
          fullName: 'Đỗ Minh Đạt',
          email,
          role: 'admin',
          avatarUrl:
            'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=96&q=80',
        });

        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        navigate(ROUTES.ADMIN.DASHBOARD);
      }
    } catch (err) {
      setError('Email hoặc mật khẩu không chính xác');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden flex-col bg-[#f7f9fb] text-[#191c1e]">
      <main className="grid min-h-[calc(100vh-64px)] flex-1 grid-cols-[minmax(0,1fr)_minmax(440px,1fr)] overflow-hidden max-[980px]:grid-cols-1">
        <section
          className="relative flex items-center justify-center overflow-hidden bg-[#131b2e] p-12 text-white max-[980px]:hidden"
          aria-label="Thông tin hệ thống"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-[2px] grayscale"
            style={{ backgroundImage: `url(${adminHeroImage})` }}
          />
          <div className="absolute inset-0 bg-linear-to-br from-[#131b2e]/90 to-[#316bf3]/25" />

          <div className="relative z-10 w-full max-w-[540px]">
            <div className="mb-16 flex items-center gap-6">
              <img
                alt="Parking System Logo"
                className="h-40 w-40 rounded-full border-4 border-white/20 bg-white object-cover shadow-[0_24px_48px_rgba(0,0,0,0.28)]"
                src="/parking-system-logo.png"
              />
              <div>
                <h1 className="mb-2 text-2xl leading-8">Parking System</h1>
                <p className="text-xs font-bold uppercase tracking-[0.05em] text-white/70">
                  Hệ Thống Quản Trị Vận Hành
                </p>
              </div>
            </div>

            <div className="grid gap-8">
              {features.map((feature) => (
                <article className="grid grid-cols-[auto_minmax(0,1fr)] gap-5" key={feature.title}>
                  <div className="grid h-16 w-16 place-items-center rounded bg-[#316bf3] shadow-[0_16px_28px_rgba(0,0,0,0.24)]">
                    <span className="material-symbols-outlined text-[32px]">{feature.icon}</span>
                  </div>
                  <div>
                    <h2 className="mb-1.5 text-lg text-[#dbe1ff]">{feature.title}</h2>
                    <p className="text-sm leading-5 text-white/80">{feature.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="flex items-center justify-center px-6 py-8"
          aria-label="Đăng nhập quản trị viên"
        >
          <div className="w-full max-w-md">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl leading-[44px] text-black max-[720px]:text-[28px] max-[720px]:leading-9">
                Đăng nhập Quản trị viên
              </h2>
              <p className="text-[#45464d]">Vui lòng nhập thông tin để truy cập hệ thống Nexus</p>
            </div>

            {error && (
              <p className="-mt-6 mb-6 rounded border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <form className="grid gap-7" onSubmit={handleSubmit}>
              <label className={adminFieldClass} htmlFor="admin-email">
                <span className={adminFieldLabelClass}>Email / Tên đăng nhập</span>
                <div className={adminInputWrapClass}>
                  <span className={adminInputIconClass}>person</span>
                  <input
                    className={adminInputClass}
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

              <label className={adminFieldClass} htmlFor="admin-password">
                <span className={adminFieldLabelClass}>Mật khẩu</span>
                <div className={adminInputWrapClass}>
                  <span className={adminInputIconClass}>lock</span>
                  <input
                    className={adminInputClass}
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

              <div className="flex items-center justify-between gap-4 max-[720px]:flex-col max-[720px]:items-start">
                <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-[#45464d]">
                  <input
                    className="h-5 w-5 accent-[#316bf3]"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <a className="font-semibold text-[#0051d5] no-underline hover:underline" href="/forgot-password">Quên mật khẩu?</a>
              </div>

              <button
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1e3a8a] px-3 py-2.5 text-sm font-semibold shadow-sm transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                <span className="text-white">
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập hệ thống'}
                </span>
              </button>

              <p className="-mt-2 text-center text-sm text-[#45464d]">
                Chưa có tài khoản?
                <a className="ml-1.5 font-semibold text-[#0051d5] no-underline hover:underline" href="/admin/signup">
                  Đăng ký tài khoản quản trị viên
                </a>
              </p>
            </form>

            <div
              className="mt-16 flex justify-center gap-12 border-t border-[#c6c6cd] pt-10 text-[#45464d] opacity-50"
              aria-label="Thông tin bảo mật"
            >
              {securityBadges.map((badge) => (
                <div className="grid justify-items-center gap-2" key={badge.label}>
                  <span className="material-symbols-outlined text-[32px]">{badge.icon}</span>
                  <strong className="whitespace-nowrap text-[11px] uppercase tracking-[0.05em]">
                    {badge.label}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="flex min-h-16 items-center justify-between gap-6 border-t border-[#c6c6cd] bg-[#f2f4f6] px-8 text-sm text-[#45464d] max-[720px]:flex-col max-[720px]:items-start max-[720px]:py-4">
        <p>© 2024 Nexus Facility Management. Vận Hành Chính Xác.</p>
        <nav className="flex gap-8" aria-label="Liên kết hỗ trợ">
          <a className="font-semibold text-[#0051d5] no-underline hover:underline" href="/support">Hỗ Trợ Kỹ Thuật</a>
          <a className="font-semibold text-[#0051d5] no-underline hover:underline" href="/terms">Điều Khoản Sử Dụng</a>
          <a className="font-semibold text-[#0051d5] no-underline hover:underline" href="/privacy">Bảo Mật</a>
        </nav>
      </footer>
    </div>
  );
}
