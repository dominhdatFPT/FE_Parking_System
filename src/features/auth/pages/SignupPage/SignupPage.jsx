import { useState } from 'react';
import { useNavigate } from 'react-router';

const logoUrl = '/parking-system-logo.png';

const features = [
  {
    icon: 'schedule',
    title: 'Đặt chỗ nhanh',
    description: 'Tạo đơn và quản lý vị trí đỗ xe chỉ vài thao tác đơn giản.',
  },
  {
    icon: 'payments',
    title: 'Thanh toán dễ dàng',
    description: 'Theo dõi chi phí và xử lý giao dịch nhanh chóng trong một màn hình.',
  },
  {
    icon: 'shield',
    title: 'An toàn 24/7',
    description: 'Bảo mật dữ liệu, kiểm soát truy cập và giám sát toàn diện mọi lúc.',
  },
];

const fieldClass = 'flex flex-col gap-2';
const fieldLabelClass = 'text-xs font-semibold uppercase tracking-[0.18em] text-slate-600';
const inputWrapClass = 'relative';
const inputIconClass =
  'material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400 transition-colors';
const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-[15px] text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-sky-200 focus:border-sky-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(14,165,233,0.15)]';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (!username.trim()) {
      setError('Vui lòng nhập tên đăng nhập');
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
      const response = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          username,
          password,
        }),
      });

      if (response.ok) {
        setSuccess('Tạo tài khoản thành công! Đang chuyển hướng...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
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
    <main className="min-h-screen bg-[#0f172a] text-slate-100">
      <section className="grid min-h-screen w-full grid-cols-1 overflow-hidden lg:grid-cols-[1fr_1fr]">
        <aside className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#111827_45%,#172554_100%)] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_20%)]" />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative z-10">
            <div className="mb-8 flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/95 shadow-lg shadow-sky-950/30">
                <img alt="Parking System Logo" className="h-11 w-11 object-contain" src={logoUrl} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-sky-200/85">Parking System</p>
                <h1 className="text-2xl font-semibold text-white">Hệ thống quản lý bãi đỗ xe thông minh</h1>
              </div>
            </div>

            <p className="max-w-md text-base leading-6 text-slate-200/90 sm:text-lg">
              Tạo tài khoản để theo dõi bãi đỗ, quản lý giao dịch và tối ưu trải nghiệm vận hành trong một nền tảng thống nhất.
            </p>

            <div className="mt-8 grid gap-4">
              {features.map((feature) => (
                <article className="rounded-3xl border border-white/10 bg-white/8 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.35)] backdrop-blur-md" key={feature.title}>
                  <div className="flex items-start gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-400/15 text-sky-100 shadow-inner shadow-sky-500/10">
                      <span className="material-symbols-outlined text-[22px]">{feature.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-white">{feature.title}</h2>
                      <p className="mt-1 text-sm leading-5 text-slate-200/85">{feature.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-8 rounded-3xl border border-white/10 bg-white/8 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.35)] backdrop-blur-md sm:p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-sky-100/80">Lợi ích nổi bật</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {['Giám sát thời gian thực', 'Thanh toán an toàn', 'Báo cáo linh hoạt'].map((item) => (
                <span className="rounded-full border border-white/10 bg-slate-900/50 px-3 py-1.5 text-xs text-slate-100" key={item}>{item}</span>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex items-center justify-center bg-slate-50 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_25px_60px_rgba(15,23,42,0.12)] sm:p-8">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <img alt="Parking System Logo" className="h-10 w-10 rounded-xl" src={logoUrl} />
              <span className="text-lg font-semibold text-sky-600">Parking System</span>
            </div>

            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.24em] text-sky-600">Đăng ký tài khoản</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Tạo tài khoản mới</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Điền đầy đủ thông tin bên dưới để bắt đầu trải nghiệm hệ thống quản lý bãi đỗ xe.</p>
            </div>

            {error && (
              <p className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
            )}
            {success && (
              <p className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className={fieldClass} htmlFor="signup-fullname">
                <span className={fieldLabelClass}>Họ và tên</span>
                <div className={inputWrapClass}>
                  <span className={inputIconClass}>person</span>
                  <input
                    className={inputClass}
                    id="signup-fullname"
                    placeholder="Nguyễn Văn A"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                  />
                </div>
              </label>

              <label className={fieldClass} htmlFor="signup-email">
                <span className={fieldLabelClass}>Email</span>
                <div className={inputWrapClass}>
                  <span className={inputIconClass}>mail</span>
                  <input
                    className={inputClass}
                    id="signup-email"
                    placeholder="name@parking.com"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </label>

              <label className={fieldClass} htmlFor="signup-username">
                <span className={fieldLabelClass}>Tên đăng nhập</span>
                <div className={inputWrapClass}>
                  <span className={inputIconClass}>account_circle</span>
                  <input
                    className={inputClass}
                    id="signup-username"
                    placeholder="nhanvien01"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                  />
                </div>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className={fieldClass} htmlFor="signup-password">
                  <span className={fieldLabelClass}>Mật khẩu</span>
                  <div className={inputWrapClass}>
                    <span className={inputIconClass}>lock</span>
                    <input
                      className={inputClass}
                      id="signup-password"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </div>
                </label>

                <label className={fieldClass} htmlFor="signup-confirm-password">
                  <span className={fieldLabelClass}>Xác nhận mật khẩu</span>
                  <div className={inputWrapClass}>
                    <span className={inputIconClass}>lock_reset</span>
                    <input
                      className={inputClass}
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

              <button
                className="mt-2 flex w-full items-center justify-center rounded-2xl bg-[#0EA5E9] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(14,165,233,0.25)] transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang tạo tài khoản...' : 'Đăng ký tài khoản'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
              Bạn đã có tài khoản?
              <a className="ml-1 font-semibold text-sky-600 hover:text-sky-700 hover:underline" href="/login">Đăng nhập ngay</a>
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
