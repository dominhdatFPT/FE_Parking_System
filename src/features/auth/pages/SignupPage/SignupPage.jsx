import { useState } from 'react';
import { useNavigate } from 'react-router';

const logoUrl = '/parking-system-logo.png';
const heroImageUrl =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCwkE0leAOdDu1ZrgB3fe58r3k3LvFLxvIpy2DzouynWB4N4wF-PnhdxlhybeIJ3f6tS45eCSvv5WN9zlOeUzMBNBWEG_sp33AtqxuaFzmJ3hMjKT3LJ7Zi4nb5tAdcGKcQ3Wilkuh5PXelVXfVJeHbV6HDUgbEhGQZ7W441xDDLaKBV0Fa1F1oeVHLCfyY6XhNK4xORM42fGGZBt7QLv2UGqbKhU1-ewog2GnDOCHJOM7bmDDZyo0-lK_GHAQ-sCGaf3nVJgIRa_Oa';

const fieldClass = 'flex cursor-pointer flex-col gap-1';
const fieldLabelClass =
  'text-[11px] font-bold uppercase leading-[14px] tracking-[0.05em] text-[#45464d] max-sm:text-[10px]';
const inputWrapClass =
  'relative flex items-center focus-within:[&_.material-symbols-outlined]:text-[#0051d5]';
const inputIconClass =
  'material-symbols-outlined pointer-events-none absolute left-3 text-[18px] text-[#76777d] transition-colors';
const inputClass =
  'w-full appearance-none rounded-lg border border-[#c6c6cd] bg-[#eceef0] py-2 pr-3 pl-[38px] text-[15px] leading-5 text-[#191c1e] outline-none transition placeholder:text-[#76777d] focus:border-[#0051d5] focus:shadow-[0_0_0_2px_rgba(0,81,213,0.20)] max-sm:pl-9 max-sm:text-sm';

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
    <main className="flex h-screen min-h-screen flex-col overflow-hidden bg-[#f7f9fb] text-[#191c1e]">

      <section className="flex min-h-0 flex-1 overflow-hidden border-t border-[#c6c6cd] bg-white max-[980px]:border-t-0">
        <aside
          className="relative flex w-1/2 flex-col justify-between overflow-hidden bg-[#131b2e] px-6 py-8 text-white max-[980px]:hidden"
          aria-label="Thông tin hệ thống"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20 grayscale"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
          />

          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-white/95">
                <img
                  alt="Parking System Logo"
                  className="h-full w-full object-cover"
                  src={logoUrl}
                />
              </div>
              <span className="text-2xl font-semibold leading-8 text-white">Parking System</span>
            </div>

            <h1 className="mb-3 text-[22px] font-semibold leading-7 text-[#dbe1ff]">
              Giải pháp Quản lý Bãi đậu xe Thông minh
            </h1>
            <p className="max-w-[400px] text-sm leading-5 text-[#7c839b] opacity-90">
              Nâng tầm trải nghiệm vận hành với hệ thống tự động hóa chuẩn doanh
              nghiệp. Chính xác, bảo mật và hiệu quả vượt trội cho mọi cơ sở hạ tầng.
            </p>
          </div>

          <div className="relative z-10 mt-auto rounded-xl border border-white/10 bg-[#f7f9fb]/10 p-3 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0051d5]">
                <span className="material-symbols-outlined text-[18px] text-white">
                  verified_user
                </span>
              </div>
              <section>
                <h2 className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.05em] text-[#dbe1ff]">
                  Tiêu chuẩn an ninh
                </h2>
                <p className="text-xs leading-4 text-white">
                  Mã hóa dữ liệu 256-bit chuẩn quốc tế
                </p>
              </section>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/5 p-2">
                <h3 className="mb-0.5 text-[10px] font-bold uppercase leading-[14px] tracking-[0.05em] text-[#dbe1ff]">
                  Trạng thái
                </h3>
                <p className="flex items-center gap-1 font-mono text-xs font-medium leading-4 text-green-400">
                  <i className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  Trực tuyến
                </p>
              </div>
              <div className="rounded-lg bg-white/5 p-2">
                <h3 className="mb-0.5 text-[10px] font-bold uppercase leading-[14px] tracking-[0.05em] text-[#dbe1ff]">
                  Phiên bản
                </h3>
                <p className="font-mono text-xs font-medium leading-4 text-white">v4.2.0-PRO</p>
              </div>
            </div>
          </div>
        </aside>

        <section
          className="flex min-h-0 w-1/2 flex-1 flex-col justify-center overflow-y-auto overflow-x-hidden bg-white px-6 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[980px]:w-full max-[980px]:px-6 max-[980px]:py-5 max-sm:px-4 max-sm:py-4"
          aria-label="Tạo tài khoản mới"
        >
          <div className="mx-auto w-full max-w-md max-sm:max-w-full">
            <div className="mb-6 hidden items-center gap-3 max-[980px]:flex">
              <img
                alt="Parking System Logo"
                className="h-8 w-8 rounded-full"
                src={logoUrl}
              />
              <span className="text-2xl font-semibold leading-8 text-[#0051d5]">
                Parking System
              </span>
            </div>

            <div className="mb-3 max-[980px]:mb-4">
              <h2 className="mb-1 text-[22px] font-semibold leading-7 text-[#191c1e] max-sm:text-lg max-sm:leading-6">
                Tạo Tài Khoản Mới
              </h2>
              <p className="text-sm leading-5 text-[#45464d]">
                Chào mừng bạn đến với hệ thống quản lý bãi xe.
              </p>
            </div>

            {error && (
              <p className="mb-3 rounded-lg border border-[#ba1a1a] bg-[#ffdad6] px-3 py-2.5 text-[13px] leading-[18px] text-[#93000a]">
                {error}
              </p>
            )}
            {success && (
              <p className="mb-3 rounded-lg border border-green-300 bg-green-100 px-3 py-2.5 text-[13px] leading-[18px] text-green-800">
                {success}
              </p>
            )}

            <form className="flex flex-col gap-1.5" onSubmit={handleSubmit}>
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
                <span className={fieldLabelClass}>Email công việc</span>
                <div className={inputWrapClass}>
                  <span className={inputIconClass}>mail</span>
                  <input
                    className={inputClass}
                    id="signup-email"
                    placeholder="example@nexus.com"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </label>

              <label className={fieldClass} htmlFor="signup-phone">
                <span className={fieldLabelClass}>Số điện thoại</span>
                <div className={inputWrapClass}>
                  <span className={inputIconClass}>call</span>
                  <input
                    className={inputClass}
                    id="signup-phone"
                    placeholder="090 123 4567"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                  />
                </div>
              </label>

              <div className="grid grid-cols-2 gap-2 max-[980px]:grid-cols-1">
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
                  <span className={fieldLabelClass}>Xác nhận</span>
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

              <label
                className="flex cursor-pointer items-start gap-2 pt-1"
                htmlFor="signup-terms"
              >
                <input
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#0051d5]"
                  id="signup-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(event) => setAgreeTerms(event.target.checked)}
                />
                <span className="text-[13px] leading-[18px] text-[#45464d] max-sm:text-xs max-sm:leading-4">
                  Tôi đồng ý với các{' '}
                  <a className="font-bold text-[#0051d5] hover:underline" href="/terms">
                    Điều khoản & Điều kiện
                  </a>{' '}
                  và{' '}
                  <a className="font-bold text-[#0051d5] hover:underline" href="/privacy">
                    Chính sách Bảo mật
                  </a>{' '}
                  của Parking System.
                </span>
              </label>

              <button
                className="mt-0.5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1e3a8a] p-[11px] text-base font-semibold leading-6 transition hover:bg-blue-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 max-sm:p-2.5 max-sm:text-sm max-sm:leading-5 shadow-sm"
                type="submit"
                disabled={loading}
              >
                <span className="text-white">
                  {loading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản'}
                </span>
                {!loading && (
                  <span className="material-symbols-outlined text-[18px] text-white">
                    arrow_forward
                  </span>
                )}
              </button>
            </form>

            <div className="mt-1.5 border-t border-[#c6c6cd] pt-1.5 text-center">
              <p className="text-[13px] leading-[18px] text-[#45464d]">
                Đã có tài khoản?
                <a className="ml-1 font-bold text-[#0051d5] hover:underline" href="/login">
                  Đăng nhập ngay
                </a>
              </p>
            </div>

            <div
              className="mt-1.5 flex justify-center gap-4 opacity-40 grayscale max-sm:gap-3"
              aria-label="Thông tin bảo mật"
            >
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base max-sm:text-sm">security</span>
                <strong className="text-[10px] font-bold uppercase leading-[14px] tracking-[0.05em] max-sm:text-[9px]">
                  Secure SSL
                </strong>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base max-sm:text-sm">database</span>
                <strong className="text-[10px] font-bold uppercase leading-[14px] tracking-[0.05em] max-sm:text-[9px]">
                  GDPR Ready
                </strong>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
