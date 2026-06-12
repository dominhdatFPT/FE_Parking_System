import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Headphones,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Timer,
  TriangleAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router';

const DEMO_OTP = '123456';

const featureCards = [
  {
    icon: ShieldCheck,
    title: 'Bảo mật cao',
    description: 'Mã OTP được xác thực trước khi cho phép đổi mật khẩu.',
  },
  {
    icon: Timer,
    title: 'Khôi phục nhanh',
    description: 'Nhận mã xác thực qua email chỉ trong vài phút.',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ 24/7',
    description: 'Luôn có đội ngũ hỗ trợ khi bạn cần trợ giúp.',
  },
];

const stepCopy = {
  email: {
    title: 'Quên mật khẩu?',
    description: 'Nhập email của bạn, chúng tôi sẽ gửi mã OTP để xác thực tài khoản.',
    button: 'Gửi mã OTP',
  },
  otp: {
    title: 'Nhập mã OTP',
    description: 'Mã xác thực đã được gửi tới email của bạn. Vui lòng nhập mã gồm 6 chữ số.',
    button: 'Xác thực OTP',
  },
  password: {
    title: 'Tạo mật khẩu mới',
    description: 'Chọn mật khẩu mới đủ mạnh để bảo vệ tài khoản Parking System của bạn.',
    button: 'Đổi mật khẩu',
  },
  done: {
    title: 'Đổi mật khẩu thành công',
    description: 'Bạn có thể quay lại trang đăng nhập bằng mật khẩu mới.',
    button: 'Quay lại đăng nhập',
  },
};

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function StepIndicator({ currentStep }) {
  const steps = [
    { key: 'email', label: 'Email' },
    { key: 'otp', label: 'OTP' },
    { key: 'password', label: 'Mật khẩu' },
  ];
  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.key === currentStep),
  );

  return (
    <div className="mb-6 grid grid-cols-3 gap-2" aria-label="Tiến trình khôi phục mật khẩu">
      {steps.map((step, index) => {
        const isComplete = currentStep === 'done' || index < currentIndex;
        const isActive = step.key === currentStep;

        return (
          <div
            className={`h-1.5 rounded-full transition ${
              isComplete || isActive ? 'bg-[#0EA5E9]' : 'bg-slate-200'
            }`}
            key={step.key}
            title={step.label}
          />
        );
      })}
    </div>
  );
}

export default function ResetPassword() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const copy = stepCopy[step];
  const maskedEmail = useMemo(() => email.trim(), [email]);

  const runWithLoading = (callback) => {
    setLoading(true);
    window.setTimeout(() => {
      callback();
      setLoading(false);
    }, 700);
  };

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Vui lòng nhập email đã đăng ký.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('Email chưa đúng định dạng. Vui lòng kiểm tra lại.');
      return;
    }

    runWithLoading(() => {
      setEmail(trimmedEmail);
      setStep('otp');
      setMessage('Mã OTP đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
    });
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (otp.length !== 6) {
      setError('Vui lòng nhập đủ 6 chữ số OTP.');
      return;
    }

    runWithLoading(() => {
      if (otp !== DEMO_OTP) {
        setError('Mã OTP không chính xác. Vui lòng thử lại.');
        return;
      }

      setStep('password');
      setMessage('OTP hợp lệ. Vui lòng tạo mật khẩu mới.');
    });
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    runWithLoading(() => {
      setStep('done');
      setMessage('Mật khẩu mới đã được cập nhật thành công.');
    });
  };

  const handleBack = () => {
    if (step === 'email' || step === 'done') {
      navigate('/login');
      return;
    }

    setError('');
    setMessage('');
    setStep(step === 'password' ? 'otp' : 'email');
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#07111f_0%,#0f172a_45%,#111827_100%)] text-[#e5eefb]">
      <section className="grid min-h-screen w-full grid-cols-1 overflow-hidden lg:grid-cols-[0.46fr_0.54fr]">
        <aside
          className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-[#263241] px-6 py-7 text-white md:flex lg:px-8 lg:py-8"
          aria-label="Khôi phục tài khoản Parking System"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(38,50,65,0.96)_0%,rgba(15,23,42,0.88)_52%,rgba(2,132,199,0.42)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.20),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(2,132,199,0.20),_transparent_32%)]" />

          <div className="relative z-10 flex h-full flex-col justify-center gap-7">
            <div className="flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/8 px-3 py-2 shadow-[0_8px_30px_rgba(15,23,42,0.35)] backdrop-blur-md lg:px-4">
              <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-white/95 shadow-inner">
                <img alt="Parking System Logo" className="h-full w-full object-cover" src="/parking-system-logo.png" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-sky-100/80">Parking System</p>
                <p className="text-sm text-white/85">Quản lý bãi đỗ xe thông minh</p>
              </div>
            </div>

            <div className="max-w-xl space-y-3">
              <p className="text-[10px] uppercase tracking-[0.35em] text-sky-100/80">Truy cập an toàn</p>
              <h1 className="max-w-md text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Khôi phục tài khoản
              </h1>
              <p className="max-w-md text-sm leading-6 text-slate-200/90 sm:text-[15px]">
                Nhập email đã đăng ký, xác thực OTP và tạo mật khẩu mới chỉ trong vài bước.
              </p>
            </div>

            <div className="grid max-w-md gap-3">
              {featureCards.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    className="rounded-2xl border border-white/10 bg-white/8 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.35)] backdrop-blur-md"
                    key={feature.title}
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-400 to-[#0284C7] text-white shadow-[0_10px_25px_rgba(14,165,233,0.25)]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h2 className="flex items-center gap-2 text-[14px] font-semibold text-white">
                          <Check className="h-4 w-4 text-sky-200" aria-hidden="true" />
                          {feature.title}
                        </h2>
                        <p className="mt-1 text-[12px] leading-5 text-slate-200/85">{feature.description}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="flex min-h-screen items-center justify-center overflow-y-auto bg-[#F3F4F6] px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-[32px] border border-slate-200/80 bg-white/95 p-5 text-black shadow-[0_28px_70px_rgba(15,23,42,0.14)] backdrop-blur-md sm:p-7 lg:p-8">
            <StepIndicator currentStep={step} />

            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-[#0284C7] to-[#0EA5E9] text-white shadow-[0_14px_30px_rgba(14,165,233,0.28)]">
                {step === 'otp' ? <KeyRound className="h-8 w-8" aria-hidden="true" /> : <LockKeyhole className="h-8 w-8" aria-hidden="true" />}
              </div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#0EA5E9]">Parking System</p>
              <h2 className="mt-3 text-2xl font-semibold text-black sm:text-3xl">{copy.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{copy.description}</p>
            </div>

            {message && (
              <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                  <p className="leading-5">{message}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
                <p className="leading-5">{error}</p>
              </div>
            )}

            {step === 'email' && (
              <form className="grid gap-4" onSubmit={handleEmailSubmit} noValidate>
                <label className="grid gap-1.5 text-left" htmlFor="reset-email">
                  <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-black">Email</span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#76777d]" aria-hidden="true" />
                    <input
                      className={`min-h-12 w-full rounded-xl border bg-[#f2f4f6] py-3 pr-3.5 pl-10 text-sm leading-5 text-[#111827] outline-none transition placeholder:text-slate-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)] ${
                        error ? 'border-red-300 focus:border-red-400' : 'border-[#c6c6cd] focus:border-[#0EA5E9]'
                      }`}
                      id="reset-email"
                      name="email"
                      placeholder="yourname@gmail.com"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (error) setError('');
                      }}
                      disabled={loading}
                      aria-invalid={!!error}
                    />
                  </div>
                </label>

                <button
                  className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-4 text-[15px] font-semibold text-white shadow-[0_14px_26px_rgba(14,165,233,0.25)] transition hover:bg-[#0284C7] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-65"
                  type="submit"
                  disabled={loading}
                >
                  {loading && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {loading ? 'Đang gửi mã...' : copy.button}
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form className="grid gap-4" onSubmit={handleOtpSubmit} noValidate>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-600">
                  Mã OTP đã gửi tới <span className="font-semibold text-slate-900">{maskedEmail}</span>
                </div>

                <label className="grid gap-1.5 text-left" htmlFor="reset-otp">
                  <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-black">Mã OTP</span>
                  <input
                    className={`min-h-14 w-full rounded-xl border bg-[#f2f4f6] px-4 text-center text-2xl font-semibold tracking-[0.45em] text-[#111827] outline-none transition placeholder:tracking-normal placeholder:text-slate-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)] ${
                      error ? 'border-red-300 focus:border-red-400' : 'border-[#c6c6cd] focus:border-[#0EA5E9]'
                    }`}
                    id="reset-otp"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(event) => {
                      setOtp(event.target.value.replace(/\D/g, '').slice(0, 6));
                      if (error) setError('');
                    }}
                    disabled={loading}
                    aria-invalid={!!error}
                  />
                </label>

                <button
                  className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-4 text-[15px] font-semibold text-white shadow-[0_14px_26px_rgba(14,165,233,0.25)] transition hover:bg-[#0284C7] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-65"
                  type="submit"
                  disabled={loading}
                >
                  {loading && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {loading ? 'Đang xác thực...' : copy.button}
                </button>

                <button
                  className="text-sm font-semibold text-[#0EA5E9] transition hover:text-[#0284C7]"
                  type="button"
                  onClick={() => {
                    setOtp('');
                    setMessage('Mã OTP mới đã được gửi lại.');
                  }}
                >
                  Gửi lại mã OTP
                </button>
              </form>
            )}

            {step === 'password' && (
              <form className="grid gap-4" onSubmit={handlePasswordSubmit} noValidate>
                <label className="grid gap-1.5 text-left" htmlFor="new-password">
                  <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-black">Mật khẩu mới</span>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#76777d]" aria-hidden="true" />
                    <input
                      className="min-h-12 w-full rounded-xl border border-[#c6c6cd] bg-[#f2f4f6] py-3 pr-11 pl-10 text-sm leading-5 text-[#111827] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:bg-white focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
                      id="new-password"
                      placeholder="Ít nhất 8 ký tự"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        if (error) setError('');
                      }}
                      disabled={loading}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-[#0EA5E9]"
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                    </button>
                  </div>
                </label>

                <label className="grid gap-1.5 text-left" htmlFor="confirm-new-password">
                  <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-black">Xác nhận mật khẩu</span>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#76777d]" aria-hidden="true" />
                    <input
                      className="min-h-12 w-full rounded-xl border border-[#c6c6cd] bg-[#f2f4f6] py-3 pr-3.5 pl-10 text-sm leading-5 text-[#111827] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:bg-white focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
                      id="confirm-new-password"
                      placeholder="Nhập lại mật khẩu mới"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);
                        if (error) setError('');
                      }}
                      disabled={loading}
                    />
                  </div>
                </label>

                <button
                  className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-4 text-[15px] font-semibold text-white shadow-[0_14px_26px_rgba(14,165,233,0.25)] transition hover:bg-[#0284C7] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-65"
                  type="submit"
                  disabled={loading}
                >
                  {loading && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {loading ? 'Đang cập nhật...' : copy.button}
                </button>
              </form>
            )}

            {step === 'done' && (
              <button
                className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-4 text-[15px] font-semibold text-white shadow-[0_14px_26px_rgba(14,165,233,0.25)] transition hover:bg-[#0284C7] active:scale-[0.99]"
                type="button"
                onClick={() => navigate('/login')}
              >
                {copy.button}
              </button>
            )}

            {step !== 'done' && (
              <button
                className="mt-5 inline-flex w-full items-center justify-center gap-2 border-t border-slate-200 pt-5 text-sm font-semibold text-slate-700 transition hover:text-[#0EA5E9]"
                type="button"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {step === 'email' ? 'Quay lại đăng nhập' : 'Quay lại bước trước'}
              </button>
            )}

            {step === 'otp' && (
              <p className="mt-3 text-center text-xs text-slate-500">
                Mã OTP demo hiện tại: <span className="font-semibold text-slate-700">{DEMO_OTP}</span>
              </p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
