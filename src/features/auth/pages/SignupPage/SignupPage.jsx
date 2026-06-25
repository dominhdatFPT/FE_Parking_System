import { useEffect, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  CircleAlert,
  Cloud,
  Eye,
  EyeOff,
  Globe,
  IdCard,
  LockKeyhole,
  LogIn,
  Mail,
  QrCode,
  Smartphone,
  User,
} from 'lucide-react';
import Logo from '../../../../components/Logo';
import { ROUTES } from '../../../../constants/routes';
import { useAuth } from '../../../../contexts/useAuth';
import { registerApi } from '../../services/authApi';
import { STORAGE_KEYS } from '../../../../constants/storageKeys';

const LANGUAGE_KEY = 'language';

const resources = {
  vi: {
    translation: {
      login: 'Đăng nhập',
      title: 'Tạo tài khoản mới',
      message: 'Tạo tài khoản để quản lý bãi đỗ xe thông minh, nhận diện biển số AI và theo dõi phương tiện theo thời gian thực.',
      fullName: 'Họ và tên',
      email: 'Email',
      username: 'Tên đăng nhập',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
      placeholders: {
        fullName: 'Nguyễn Văn A',
        email: 'yourname@company.com',
        username: 'nhanvien01',
      },
      terms: {
        prefix: 'Tôi đồng ý với',
        usage: 'Điều khoản sử dụng',
        connector: 'và',
        privacy: 'Chính sách bảo mật',
      },
      modals: {
        termsTitle: 'Điều khoản sử dụng',
        privacyTitle: 'Chính sách bảo mật',
        read: 'Tôi đã đọc',
        close: 'Đóng',
        termsContent: [
          'Bằng việc tạo tài khoản SmartParking, bạn đồng ý sử dụng nền tảng đúng mục đích quản lý bãi đỗ xe, phương tiện, phiên gửi xe và các dịch vụ liên quan.',
          'Bạn chịu trách nhiệm bảo mật thông tin đăng nhập, không chia sẻ tài khoản cho người không được ủy quyền và thông báo cho quản trị viên khi phát hiện truy cập bất thường.',
          'SmartParking có thể ghi nhận hoạt động hệ thống như đăng nhập, tạo phiên gửi xe, thanh toán và thay đổi thông tin vận hành nhằm đảm bảo an toàn, minh bạch và hỗ trợ kiểm toán.',
          'Các tính năng như nhận diện biển số, điều khiển Barrier và giám sát thời gian thực cần được sử dụng theo quy định của đơn vị vận hành bãi xe.',
        ],
        privacyContent: [
          'SmartParking thu thập các thông tin cần thiết để vận hành hệ thống như họ tên, email, tên đăng nhập, vai trò người dùng, thông tin phương tiện và dữ liệu phiên gửi xe.',
          'Dữ liệu được sử dụng để xác thực tài khoản, quản lý quyền truy cập, hỗ trợ nhận diện biển số, theo dõi chỗ đỗ, xử lý thanh toán và cải thiện chất lượng dịch vụ.',
          'Chúng tôi áp dụng các biện pháp bảo mật phù hợp để bảo vệ dữ liệu trên hạ tầng Cloud, bao gồm kiểm soát truy cập, ghi nhận nhật ký và mã hóa trong các luồng phù hợp.',
          'Dữ liệu chỉ được chia sẻ với các bên liên quan khi cần thiết cho vận hành hệ thống, tuân thủ yêu cầu pháp lý hoặc theo cấu hình của đơn vị quản lý bãi xe.',
        ],
      },
      submit: 'Đăng ký',
      submitting: 'Đang tạo tài khoản...',
      or: 'Hoặc',
      google: 'Đăng ký bằng Google',
      googleLoading: 'Đang đăng ký...',
      hasAccount: 'Đã có tài khoản?',
      loginNow: 'Đăng nhập ngay',
      trust: {
        identity: 'Định danh tài khoản bảo mật',
        cloud: 'Kết nối Cloud Platform',
        device: 'Đồng bộ thiết bị thông minh',
        vehicle: 'Quản lý phương tiện số',
      },
      background: {
        account: 'Account setup',
        verified: 'Identity verified',
        cloud: 'Cloud connected',
        device: 'Device linked',
      },
      errors: {
        fullName: 'Vui lòng nhập họ và tên',
        email: 'Vui lòng nhập email',
        username: 'Vui lòng nhập tên đăng nhập',
        passwordLength: 'Mật khẩu phải có ít nhất 6 ký tự',
        passwordMismatch: 'Mật khẩu xác nhận không khớp',
        terms: 'Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật',
        generic: 'Có lỗi xảy ra',
        network: 'Có lỗi kết nối, vui lòng thử lại',
        google: 'Đăng ký Google thất bại. Vui lòng thử lại.',
      },
      success: 'Tạo tài khoản thành công! Đang chuyển hướng...',
      passwordA11y: { show: 'Hiện mật khẩu', hide: 'Ẩn mật khẩu' },
    },
  },
  en: {
    translation: {
      login: 'Login',
      title: 'Create your account',
      message: 'Create an account to manage smart parking, AI license plate recognition, and real-time vehicle monitoring.',
      fullName: 'Full name',
      email: 'Email',
      username: 'Username',
      password: 'Password',
      confirmPassword: 'Confirm password',
      placeholders: {
        fullName: 'Alex Nguyen',
        email: 'yourname@company.com',
        username: 'operator01',
      },
      terms: {
        prefix: 'I agree to the',
        usage: 'Terms of Use',
        connector: 'and',
        privacy: 'Privacy Policy',
      },
      modals: {
        termsTitle: 'Terms of Use',
        privacyTitle: 'Privacy Policy',
        read: 'I have read',
        close: 'Close',
        termsContent: [
          'By creating a SmartParking account, you agree to use the platform for parking operations, vehicle management, parking sessions, and related services.',
          'You are responsible for protecting your credentials, avoiding unauthorized account sharing, and reporting suspicious access to the system administrator.',
          'SmartParking may record system activities such as sign-ins, parking sessions, payments, and operational changes for security, transparency, and audit purposes.',
          'Features such as license plate recognition, Barrier control, and real-time monitoring must be used according to the parking operator’s policies.',
        ],
        privacyContent: [
          'SmartParking collects the information needed to operate the platform, including name, email, username, role, vehicle data, and parking session data.',
          'Data is used for account authentication, access control, license plate recognition, parking monitoring, payment processing, and service improvement.',
          'We apply appropriate security measures to protect Cloud-hosted data, including access controls, activity logs, and encryption where applicable.',
          'Data is shared only when needed for system operation, legal compliance, or parking operator configuration.',
        ],
      },
      submit: 'Sign up',
      submitting: 'Creating account...',
      or: 'Or',
      google: 'Sign up with Google',
      googleLoading: 'Signing up...',
      hasAccount: 'Already have an account?',
      loginNow: 'Login now',
      trust: {
        identity: 'Secure account identity',
        cloud: 'Cloud Platform connection',
        device: 'Smart device sync',
        vehicle: 'Digital vehicle management',
      },
      background: {
        account: 'Account setup',
        verified: 'Identity verified',
        cloud: 'Cloud connected',
        device: 'Device linked',
      },
      errors: {
        fullName: 'Please enter your full name',
        email: 'Please enter your email',
        username: 'Please enter your username',
        passwordLength: 'Password must be at least 6 characters',
        passwordMismatch: 'Password confirmation does not match',
        terms: 'Please agree to the Terms of Use and Privacy Policy',
        generic: 'Something went wrong',
        network: 'Connection error, please try again',
        google: 'Google signup failed. Please try again.',
      },
      success: 'Account created successfully! Redirecting...',
      passwordA11y: { show: 'Show password', hide: 'Hide password' },
    },
  },
};

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'vi';
  const savedLanguage = window.localStorage.getItem(LANGUAGE_KEY) || 'vi';
  return savedLanguage.startsWith('en') ? 'en' : 'vi';
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      vi: { translation: resources.vi.translation },
      en: { translation: resources.en.translation },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'vi',
    interpolation: { escapeValue: false },
  });
} else {
  i18n.addResourceBundle('vi', 'translation', resources.vi.translation, true, true);
  i18n.addResourceBundle('en', 'translation', resources.en.translation, true, true);
}

function BrandLogo() {
  return (
    <Link to={ROUTES.WELCOME} aria-label="Parking System">
      <Logo variant="horizontal" size="md" />
    </Link>
  );
}

function TopNavigation({ currentLanguage, onLanguageChange, t }) {
  const nextLanguage = currentLanguage === 'vi' ? 'en' : 'vi';

  return (
    <header className="absolute inset-x-0 top-0 z-20 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 transition-all">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <BrandLogo />
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors bg-slate-100 px-3 py-1.5 rounded-lg"
            type="button"
            onClick={() => onLanguageChange(nextLanguage)}
            aria-label={nextLanguage === 'vi' ? 'VN' : 'EN'}
          >
            <Globe className="w-4 h-4" />
            <span>{currentLanguage === 'vi' ? 'VN' : 'EN'}</span>
          </button>
          <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
          <Link
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-colors"
            to={ROUTES.LOGIN}
          >
            <LogIn className="w-4 h-4" />
            {t('login')}
          </Link>
        </div>
      </nav>
    </header>
  );
}

function OnboardingBackground({ t }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden text-slate-900" aria-hidden="true">
      <div className="absolute left-[-5rem] top-24 h-80 w-80 rounded-full border border-sky-200/60" />
      <div className="absolute bottom-[-8rem] right-[-6rem] h-[26rem] w-[26rem] rounded-full border border-emerald-200/70" />
      <svg className="absolute left-10 top-28 h-[420px] w-[500px] opacity-[0.13]" viewBox="0 0 500 420" fill="none">
        <rect x="62" y="62" width="170" height="220" rx="34" stroke="currentColor" strokeWidth="3" />
        <circle cx="147" cy="124" r="34" stroke="currentColor" strokeWidth="3" />
        <path d="M100 206C116 180 178 180 194 206" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M102 248H192M102 274H170" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <rect x="302" y="70" width="92" height="164" rx="24" stroke="currentColor" strokeWidth="3" />
        <path d="M326 112H370M326 144H370M326 176H350" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <rect x="328" y="254" width="84" height="84" rx="18" stroke="currentColor" strokeWidth="3" />
        <path d="M348 274H362M378 274H392M348 292H392M348 310H362M378 310H392" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M232 168C268 168 272 138 302 138M232 238C286 238 286 296 328 296" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="7 10" />
        <circle cx="232" cy="168" r="8" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="302" cy="138" r="8" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="328" cy="296" r="8" stroke="currentColor" strokeWidth="2.4" />
      </svg>
      <svg className="absolute right-6 top-24 hidden h-[420px] w-[520px] opacity-[0.13] lg:block" viewBox="0 0 520 420" fill="none">
        <path d="M160 138C172 88 236 74 270 112C294 80 358 92 362 144C402 148 428 176 428 212C428 250 398 280 360 280H160C120 280 88 248 88 208C88 168 120 138 160 138Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M182 214H334M182 244H278" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <rect x="86" y="306" width="108" height="58" rx="16" stroke="currentColor" strokeWidth="3" />
        <rect x="306" y="306" width="108" height="58" rx="16" stroke="currentColor" strokeWidth="3" />
        <path d="M140 280V306M360 280V306M194 334H306" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="7 10" />
        <rect x="78" y="58" width="88" height="58" rx="16" stroke="currentColor" strokeWidth="3" />
        <path d="M100 88H144" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <rect x="380" y="62" width="62" height="46" rx="12" stroke="currentColor" strokeWidth="3" />
        <path d="M398 86H424" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M166 88C220 96 232 112 252 128M380 88C336 98 320 112 294 132" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="7 10" />
      </svg>
      <div className="absolute left-12 bottom-24 hidden rounded-2xl border border-slate-300/70 bg-white/45 px-4 py-3 text-xs font-semibold text-slate-700 opacity-[0.15] shadow-sm md:block">
        <div className="mb-2 flex items-center gap-2">
          <BadgeCheck className="h-4 w-4" />
          {t('background.verified')}
        </div>
        <div className="flex items-center gap-2">
          <IdCard className="h-4 w-4" />
          {t('background.account')}
        </div>
      </div>
      <div className="absolute right-20 bottom-28 hidden rounded-2xl border border-slate-300/70 bg-white/45 px-4 py-3 text-xs font-semibold text-slate-700 opacity-[0.15] shadow-sm lg:block">
        <div className="mb-2 flex items-center gap-2">
          <Cloud className="h-4 w-4" />
          {t('background.cloud')}
        </div>
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4" />
          {t('background.device')}
        </div>
      </div>
      <div className="absolute bottom-20 left-1/2 hidden -translate-x-1/2 items-center gap-8 opacity-[0.12] md:flex">
        <User className="h-12 w-12" strokeWidth={1.4} />
        <Smartphone className="h-12 w-12" strokeWidth={1.4} />
        <QrCode className="h-12 w-12" strokeWidth={1.4} />
        <Cloud className="h-14 w-14" strokeWidth={1.4} />
        <Camera className="h-12 w-12" strokeWidth={1.4} />
      </div>
    </div>
  );
}

function Field({ icon: Icon, id, label, ...props }) {
  return (
    <label className="grid gap-1.5 text-left" htmlFor={id}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input className="h-11 w-full rounded-[15px] border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pl-12 pr-4 text-[15px] text-slate-950 outline-none transition duration-200 placeholder:text-slate-400 hover:border-sky-200 hover:bg-white focus:border-[#0EA5E9] focus:bg-white focus:shadow-[0_0_0_4px_rgba(14,165,233,0.14)]" id={id} {...props} />
      </span>
    </label>
  );
}

function PasswordField({ icon: Icon, id, label, showPassword, onTogglePassword, t, ...props }) {
  return (
    <label className="grid gap-1.5 text-left" htmlFor={id}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input className="h-11 w-full rounded-[15px] border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pl-12 pr-12 text-[15px] text-slate-950 outline-none transition duration-200 placeholder:text-slate-400 hover:border-sky-200 hover:bg-white focus:border-[#0EA5E9] focus:bg-white focus:shadow-[0_0_0_4px_rgba(14,165,233,0.14)]" id={id} type={showPassword ? 'text' : 'password'} {...props} />
        <button aria-label={showPassword ? t('passwordA11y.hide') : t('passwordA11y.show')} className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" type="button" onClick={onTogglePassword}>
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </span>
    </label>
  );
}

function Checkbox({ id, checked, onChange, children }) {
  return (
    <label className="inline-flex cursor-pointer items-start gap-3 text-xs font-medium leading-5 text-slate-600" htmlFor={id}>
      <span className="relative grid h-4.5 w-4.5 place-items-center">
        <input className="peer h-4.5 w-4.5 appearance-none rounded border border-slate-300 bg-white transition checked:border-sky-500 checked:bg-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100" id={id} type="checkbox" checked={checked} onChange={onChange} />
        <Check className="pointer-events-none absolute h-3 w-3 text-white opacity-0 transition peer-checked:opacity-100" />
      </span>
      <span>{children}</span>
    </label>
  );
}

function InlinePolicyLink({ children, onClick }) {
  return (
    <button
      className="cursor-pointer font-medium !text-sky-600 transition-colors hover:!text-sky-700 hover:underline"
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
    >
      {children}
    </button>
  );
}

function PolicyModal({ content, onClose, title, t }) {
  if (!content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm transition-opacity">
      <section className="flex max-h-[86vh] w-full max-w-[760px] scale-100 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.25)] transition-transform">
        <header className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-bold text-slate-950">{title}</h2>
        </header>
        <div className="overflow-y-auto px-6 py-5 text-sm leading-7 text-slate-600">
          <div className="space-y-4">
            {content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <footer className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:text-sky-600"
            type="button"
            onClick={onClose}
          >
            {t('modals.close')}
          </button>
          <button
            className="rounded-xl bg-[#0EA5E9] px-4 py-2 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-[#0284C7]"
            type="button"
            onClick={onClose}
          >
            {t('modals.read')}
          </button>
        </footer>
      </section>
    </div>
  );
}

export default function SignupPage() {
  const { t, i18n: signupI18n } = useTranslation();
  const { setUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedAgreement, setAcceptedAgreement] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const currentLanguage = signupI18n.language.startsWith('en') ? 'en' : 'vi';

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  }, [currentLanguage]);

  const handleLanguageChange = (nextLanguage) => {
    signupI18n.changeLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);
  };

  const validateForm = () => {
    if (!fullName.trim()) return setError(t('errors.fullName')) || false;
    if (!email.trim()) return setError(t('errors.email')) || false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(currentLanguage === 'vi' ? 'Định dạng email không hợp lệ.' : 'Invalid email format.');
      return false;
    }
    if (password.length < 6) return setError(t('errors.passwordLength')) || false;
    if (password !== confirmPassword) return setError(t('errors.passwordMismatch')) || false;
    if (!acceptedAgreement) return setError(t('errors.terms')) || false;
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await registerApi({ fullName, email, password });

      if (!response?.token) {
        throw new Error(currentLanguage === 'vi' ? 'Không nhận được token từ máy chủ' : 'No token received from server');
      }

      sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);

      const registeredUser = {
        id: response.userId,
        fullName: response.fullName,
        email: response.email,
        role: (response.role || 'USER').toLowerCase(),
        avatarUrl: '',
      };

      setUser(registeredUser);
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(registeredUser));
      localStorage.setItem('userRole', registeredUser.role);

      setSuccess(t('success'));
      setTimeout(() => navigate(ROUTES.DRIVER.DASHBOARD), 1500);
    } catch (err) {
      const message = err?.response?.data?.message || t('errors.generic');
      setError(message);
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative h-screen h-dvh overflow-hidden bg-[#F8FAFC] text-slate-950">
      <OnboardingBackground t={t} />
      <TopNavigation currentLanguage={currentLanguage} onLanguageChange={handleLanguageChange} t={t} />

      <section className="relative z-10 flex h-full items-center justify-center overflow-hidden px-4 pb-3 pt-16 sm:px-6 sm:pb-4 sm:pt-20 lg:px-10">
        <div className="w-full max-w-[640px] -translate-y-1 sm:-translate-y-2">
          <section className="max-h-[calc(100dvh-4.5rem)] overflow-hidden rounded-[30px] border border-white/80 bg-white/95 p-4 shadow-[0_28px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 backdrop-blur-xl sm:p-5">
            <div className="text-center">
              <div className="flex justify-center">
                <BrandLogo />
              </div>
            </div>

            {error && (
              <div className="mt-3 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="leading-5">{error}</p>
              </div>
            )}
            {success && (
              <div className="mt-3 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
                <Check className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="leading-5">{success}</p>
              </div>
            )}

            <form className="mt-3 grid gap-2.5" onSubmit={handleSubmit}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field icon={User} id="signup-fullname" label={t('fullName')} placeholder={t('placeholders.fullName')} type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
                <Field icon={Mail} id="signup-email" label={t('email')} placeholder={t('placeholders.email')} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <PasswordField icon={LockKeyhole} id="signup-password" label={t('password')} placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} showPassword={showPassword} onTogglePassword={() => setShowPassword((current) => !current)} t={t} required />
                <PasswordField icon={LockKeyhole} id="signup-confirm-password" label={t('confirmPassword')} placeholder="••••••••" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} showPassword={showConfirmPassword} onTogglePassword={() => setShowConfirmPassword((current) => !current)} t={t} required />
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                <Checkbox id="signup-agreement" checked={acceptedAgreement} onChange={(event) => setAcceptedAgreement(event.target.checked)}>
                  {t('terms.prefix')}{' '}
                  <InlinePolicyLink onClick={() => setActiveModal('terms')}>
                    {t('terms.usage')}
                  </InlinePolicyLink>{' '}
                  {t('terms.connector')}{' '}
                  <InlinePolicyLink onClick={() => setActiveModal('privacy')}>
                    {t('terms.privacy')}
                  </InlinePolicyLink>
                </Checkbox>
              </div>

              <button className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0EA5E9] px-5 text-[15px] font-bold !text-white shadow-[0_10px_30px_rgba(14,165,233,0.25)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-[0_16px_38px_rgba(14,165,233,0.32)] focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-70" type="submit" disabled={loading}>
                {loading ? t('submitting') : t('submit')}
                {!loading && <ArrowRight className="h-5 w-5 !text-white" />}
              </button>

            </form>

            <p className="mt-3 text-center text-sm text-slate-500">
              {t('hasAccount')}
              <Link className="ml-1 font-bold text-sky-600 transition hover:text-sky-700" to={ROUTES.LOGIN}>
                {t('loginNow')}
              </Link>
            </p>
          </section>
        </div>
      </section>
      <PolicyModal
        content={activeModal === 'terms' ? t('modals.termsContent', { returnObjects: true }) : activeModal === 'privacy' ? t('modals.privacyContent', { returnObjects: true }) : null}
        onClose={() => setActiveModal(null)}
        title={activeModal === 'terms' ? t('modals.termsTitle') : t('modals.privacyTitle')}
        t={t}
      />
    </main>
  );
}
