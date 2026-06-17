import { useEffect, useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Car,
  CarFront,
  Check,
  CircleAlert,
  CreditCard,
  Eye,
  EyeOff,
  Globe,
  LockKeyhole,
  Mail,
  MapPinned,
  ParkingCircle,
  RadioTower,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../../../../contexts/useAuth';
import { auth, googleProvider } from '../../../../config/firebase';
import { STORAGE_KEYS } from '../../../../constants/storageKeys';
import { ROUTES } from '../../../../constants/routes';
import { login } from '../../../../services/modules/authService';

import { googleLoginApi } from '../../services/authApi';

const LOGIN_LANGUAGE_KEY = 'language';

const trustSignals = [
  { icon: Camera, labelKey: 'trust.lpr' },
  { icon: RadioTower, labelKey: 'trust.monitoring' },
  { icon: ParkingCircle, labelKey: 'trust.barrier' },
  { icon: ShieldCheck, labelKey: 'trust.cloud' },
];

const loginTranslations = {
  vi: {
    nav: {
      contact: 'Liên hệ',
      signup: 'Đăng ký',
    },
    brand: {
      tagline: 'Quản lý bãi đỗ xe thông minh',
    },
    hero: {
      title: 'Chào mừng trở lại',
      subtitle: 'Giám sát phương tiện, nhận diện biển số và quản lý chỗ đỗ theo thời gian thực',
      support: 'Giải pháp Smart Parking dành cho chung cư, tòa nhà văn phòng và trung tâm thương mại.',
    },
    badges: {
      lpr: 'Nhận diện biển số LPR',
      occupancy: 'Giám sát chỗ đỗ',
      barrier: 'Điều khiển Barrier',
      zone: 'Phân tích khu vực',
      payment: 'Thanh toán không chạm',
    },
    form: {
      email: 'Email',
      password: 'Mật khẩu',
      forgot: 'Quên mật khẩu?',
      remember: 'Ghi nhớ đăng nhập',
      submit: 'Đăng nhập',
      submitting: 'Đang đăng nhập...',
      or: 'Hoặc',
      google: 'Đăng nhập bằng Google',
      googleLoading: 'Đang đăng nhập...',
      noAccount: 'Chưa có tài khoản?',
      signupNow: 'Đăng ký ngay',
      hidePassword: 'Ẩn mật khẩu',
      showPassword: 'Hiện mật khẩu',
    },
    trust: {
      lpr: 'AI nhận diện biển số',
      monitoring: 'Giám sát bãi xe thời gian thực',
      barrier: 'Điều khiển Barrier thông minh',
      cloud: 'Hạ tầng Cloud bảo mật',
    },
    background: {
      available: 'Còn trống 42%',
      occupied: 'Đã sử dụng 58%',
      zoneFull: 'Zone B2 - 86% đầy',
      plateDetected: 'Đã nhận diện biển số',
      spacesOccupied: '324 / 500 chỗ đang sử dụng',
      paymentReady: 'Sẵn sàng thanh toán',
    },
    errors: {
      missingToken: 'Không nhận được token từ máy chủ',
      loginFailed: 'Email hoặc mật khẩu không chính xác.',
      googleFailed: 'Đăng nhập Google thất bại. Vui lòng thử lại.',
      defaultUser: 'Người dùng',
    },
  },
  en: {
    nav: {
      contact: 'Contact',
      signup: 'Sign Up',
    },
    brand: {
      tagline: 'Smart parking management',
    },
    hero: {
      title: 'Welcome back',
      subtitle: 'Monitor vehicles, recognize license plates, and manage parking spaces in real time',
      support: 'Smart Parking solution for apartments, office buildings, and commercial centers.',
    },
    badges: {
      lpr: 'LPR License Plate Recognition',
      occupancy: 'Parking Space Monitoring',
      barrier: 'Barrier Control',
      zone: 'Zone Analytics',
      payment: 'Contactless Payment',
    },
    form: {
      email: 'Email',
      password: 'Password',
      forgot: 'Forgot password?',
      remember: 'Remember me',
      submit: 'Login',
      submitting: 'Logging in...',
      or: 'Or',
      google: 'Login with Google',
      googleLoading: 'Logging in...',
      noAccount: 'No account yet?',
      signupNow: 'Sign up now',
      hidePassword: 'Hide password',
      showPassword: 'Show password',
    },
    trust: {
      lpr: 'AI license plate recognition',
      monitoring: 'Real-time parking monitoring',
      barrier: 'Smart Barrier control',
      cloud: 'Secure Cloud infrastructure',
    },
    background: {
      available: 'Available 42%',
      occupied: 'Occupied 58%',
      zoneFull: 'Zone B2 - 86% full',
      plateDetected: 'Plate detected',
      spacesOccupied: '324 / 500 Spaces Occupied',
      paymentReady: 'Payment ready',
    },
    errors: {
      missingToken: 'No token received from server',
      loginFailed: 'Email or password is incorrect.',
      googleFailed: 'Google login failed. Please try again.',
      defaultUser: 'User',
    },
  },
};

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'vi';
  const savedLanguage = window.localStorage.getItem(LOGIN_LANGUAGE_KEY) || 'vi';
  return savedLanguage.startsWith('en') ? 'en' : 'vi';
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      vi: { translation: loginTranslations.vi },
      en: { translation: loginTranslations.en },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'vi',
    interpolation: { escapeValue: false },
  });
} else {
  i18n.addResourceBundle('vi', 'translation', loginTranslations.vi, true, true);
  i18n.addResourceBundle('en', 'translation', loginTranslations.en, true, true);
}

function getDashboardPath(role) {
  const normalizedRole = role?.toLowerCase();

  if (normalizedRole === 'admin') {
    return ROUTES.ADMIN.DASHBOARD;
  }

  return '/driver-dashboard';
}

function BrandLogo({ compact = false }) {
  return (
    <Link className="flex items-center gap-3" to={ROUTES.WELCOME} aria-label="SmartParking">
      <div className="bg-sky-600 p-1.5 rounded-lg shadow-sm shadow-sky-600/20">
        <Car className="text-white w-6 h-6" />
      </div>
      <span className={compact ? 'text-xl font-extrabold text-slate-800 tracking-tight' : 'text-xl font-extrabold text-slate-800 tracking-tight'}>
        Smart<span className="text-sky-600">Parking</span>
      </span>
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
            className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284c7] px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-sky-500/20 transition-all hover:-translate-y-0.5"
            to={ROUTES.SIGNUP}
          >
            <UserPlus className="w-4 h-4 text-white" style={{ color: '#FFFFFF' }} />
            <span className="text-white" style={{ color: '#FFFFFF' }}>{t('nav.signup')}</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}

function ParkingLineIllustrations({ t }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden text-slate-900" aria-hidden="true">
      <div className="absolute left-[-4rem] top-28 h-72 w-72 rounded-full border border-sky-200/45" />
      <div className="absolute bottom-[-7rem] right-[-5rem] h-96 w-96 rounded-full border border-emerald-200/60" />
      <svg className="absolute left-3 top-24 h-[470px] w-[560px] opacity-[0.16]" viewBox="0 0 560 470" fill="none">
        <rect x="58" y="72" width="392" height="300" rx="34" stroke="currentColor" strokeWidth="3" />
        <path d="M92 222H416M92 342H416" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M132 96V198M192 96V198M252 96V198M312 96V198M372 96V198" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M132 246V318M192 246V318M252 246V318M312 246V318M372 246V318" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M132 364V426M192 364V426M252 364V426M312 364V426M372 364V426" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <rect x="100" y="108" width="50" height="78" rx="14" stroke="currentColor" strokeWidth="2.8" />
        <rect x="280" y="108" width="50" height="78" rx="14" stroke="currentColor" strokeWidth="2.8" />
        <rect x="338" y="254" width="54" height="58" rx="13" stroke="currentColor" strokeWidth="2.8" />
        <rect x="158" y="254" width="54" height="58" rx="13" stroke="currentColor" strokeWidth="2.8" />
        <path d="M110 147H140M290 147H320M350 283H380M170 283H200" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
        <circle cx="112" cy="176" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="138" cy="176" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="292" cy="176" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="318" cy="176" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="350" cy="304" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="380" cy="304" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="170" cy="304" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="200" cy="304" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="424" cy="118" r="10" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="424" cy="280" r="10" stroke="currentColor" strokeWidth="2.4" />
        <path d="M452 118H492M452 280H506" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M86 420H424" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M76 46H158M76 390H170" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M456 338C426 316 424 268 454 244C482 221 492 187 466 158" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="7 10" />
        <circle cx="456" cy="338" r="8" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="466" cy="158" r="8" stroke="currentColor" strokeWidth="2.4" />
      </svg>
      <svg className="absolute right-5 top-16 hidden h-[430px] w-[500px] opacity-[0.16] lg:block" viewBox="0 0 500 430" fill="none">
        <path d="M54 342H198M282 342H450" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M234 326L270 342L234 358" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M108 300H210C236 300 258 318 270 342C284 370 318 384 352 384H430" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="7 10" />
        <rect x="72" y="270" width="88" height="52" rx="14" stroke="currentColor" strokeWidth="3" />
        <path d="M88 296H144" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
        <circle cx="92" cy="320" r="5" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="140" cy="320" r="5" stroke="currentColor" strokeWidth="2.2" />
        <rect x="70" y="74" width="168" height="102" rx="22" stroke="currentColor" strokeWidth="3" />
        <path d="M96 108H210M96 138H162" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M102 52L116 74M186 52L172 74" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <rect x="274" y="60" width="72" height="48" rx="12" stroke="currentColor" strokeWidth="3" />
        <path d="M310 108V160M274 160H346" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M346 78L422 112" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M280 76L238 126" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="6 8" />
        <rect x="394" y="92" width="72" height="44" rx="11" stroke="currentColor" strokeWidth="3" />
        <path d="M408 114H452" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <rect x="346" y="198" width="44" height="98" rx="14" stroke="currentColor" strokeWidth="3" />
        <circle cx="368" cy="224" r="7" stroke="currentColor" strokeWidth="2.4" />
        <path d="M388 212L458 178" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M342 308H394" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M368 296V342" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <rect x="198" y="216" width="98" height="42" rx="12" stroke="currentColor" strokeWidth="2.8" />
        <path d="M214 238H280" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M160 296C186 266 204 258 226 258M296 236C326 226 342 224 368 224M368 224C386 248 386 278 368 300" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="7 10" />
        <circle cx="116" cy="270" r="9" stroke="currentColor" strokeWidth="2.6" />
        <circle cx="226" cy="258" r="9" stroke="currentColor" strokeWidth="2.6" />
        <circle cx="368" cy="224" r="9" stroke="currentColor" strokeWidth="2.6" />
        <circle cx="368" cy="300" r="9" stroke="currentColor" strokeWidth="2.6" />
        <path d="M74 202H160M74 226H138" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <rect x="60" y="190" width="118" height="54" rx="16" stroke="currentColor" strokeWidth="2.6" />
      </svg>
      <div className="absolute left-12 top-[34rem] hidden rounded-2xl border border-slate-300/70 bg-white/45 px-4 py-3 text-xs font-semibold text-slate-700 opacity-[0.16] shadow-sm md:block">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          {t('background.available')}
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
          {t('background.occupied')}
        </div>
      </div>
      <div className="absolute right-24 bottom-28 hidden rounded-2xl border border-slate-300/70 bg-white/45 px-4 py-3 text-xs font-semibold text-slate-700 opacity-[0.15] shadow-sm lg:block">
        <div className="mb-2">{t('background.zoneFull')}</div>
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4" />
          {t('background.plateDetected')}
        </div>
      </div>
      <div className="absolute right-14 top-[29rem] hidden rounded-2xl border border-slate-300/70 bg-white/45 px-4 py-3 text-xs font-semibold text-slate-700 opacity-[0.15] shadow-sm lg:block">
        <div className="mb-2 flex items-center gap-2">
          <ParkingCircle className="h-4 w-4" />
          {t('background.spacesOccupied')}
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          {t('background.paymentReady')}
        </div>
      </div>
      <div className="absolute bottom-20 left-1/2 hidden -translate-x-1/2 items-center gap-8 opacity-[0.13] md:flex">
        <CarFront className="h-14 w-14" strokeWidth={1.4} />
        <Camera className="h-12 w-12" strokeWidth={1.4} />
        <BadgeCheck className="h-12 w-12" strokeWidth={1.4} />
        <ParkingCircle className="h-14 w-14" strokeWidth={1.4} />
        <MapPinned className="h-12 w-12" strokeWidth={1.4} />
      </div>
    </div>
  );
}

function AuthInput({ icon: Icon, id, label, rightAddon, ...props }) {
  return (
    <label className="grid gap-1.5 text-left" htmlFor={id}>
      <span className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
        {label}
        {rightAddon}
      </span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          className="h-11 w-full rounded-[15px] border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pl-12 pr-4 text-[15px] text-slate-950 outline-none transition duration-200 placeholder:text-slate-400 hover:border-sky-200 hover:bg-white focus:border-[#0EA5E9] focus:bg-white focus:shadow-[0_0_0_4px_rgba(14,165,233,0.14)]"
          id={id}
          {...props}
        />
      </span>
    </label>
  );
}

function PasswordInput({ showPassword, onTogglePassword, t, ...props }) {
  return (
    <label className="grid gap-1.5 text-left" htmlFor="login-password">
      <span className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
        {t('form.password')}
        <Link className="text-xs font-semibold normal-case tracking-normal text-sky-600 transition hover:text-sky-700" to="/reset-password">
          {t('form.forgot')}
        </Link>
      </span>
      <span className="relative block">
        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          className="h-11 w-full rounded-[15px] border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pl-12 pr-12 text-[15px] text-slate-950 outline-none transition duration-200 placeholder:text-slate-400 hover:border-sky-200 hover:bg-white focus:border-[#0EA5E9] focus:bg-white focus:shadow-[0_0_0_4px_rgba(14,165,233,0.14)]"
          id="login-password"
          type={showPassword ? 'text' : 'password'}
          {...props}
        />
        <button
          aria-label={showPassword ? t('form.hidePassword') : t('form.showPassword')}
          className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          type="button"
          onClick={onTogglePassword}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </span>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06 0.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c0.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function LoginPage() {
  const { t, i18n: loginI18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const currentLanguage = loginI18n.language.startsWith('en') ? 'en' : 'vi';

  useEffect(() => {
    localStorage.setItem(LOGIN_LANGUAGE_KEY, currentLanguage);
  }, [currentLanguage]);

  const handleLanguageChange = (nextLanguage) => {
    loginI18n.changeLanguage(nextLanguage);
    localStorage.setItem(LOGIN_LANGUAGE_KEY, nextLanguage);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(email, password);

      if (!response?.token) {
        throw new Error(t('errors.missingToken'));
      }

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);

      const authenticatedUser = {
        id: response.user?.id ?? response.userId ?? email,
        fullName: response.user?.fullName ?? response.fullName ?? response.user?.name ?? t('errors.defaultUser'),
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
      setError(t('errors.loginFailed'));
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
      setError(t('errors.googleFailed'));
      console.error('Google login error:', err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative h-screen h-dvh overflow-hidden bg-[#F8FAFC] text-slate-950">
      <ParkingLineIllustrations t={t} />
      <TopNavigation currentLanguage={currentLanguage} onLanguageChange={handleLanguageChange} t={t} />

      <section className="relative z-10 flex h-full items-center justify-center overflow-hidden px-4 pb-3 pt-16 sm:px-6 sm:pb-4 sm:pt-20 lg:px-10">
        <div className="w-full max-w-[500px] -translate-y-2 sm:-translate-y-3">
          <section className="max-h-[calc(100dvh-4.5rem)] overflow-hidden rounded-[30px] border border-white/80 bg-white/95 p-5 shadow-[0_28px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 backdrop-blur-xl sm:p-6">
            <div className="text-center">
              <div className="flex justify-center">
                <BrandLogo compact />
              </div>
              <h1 className="mt-1 text-[28px] font-semibold leading-tight tracking-normal text-slate-950 sm:text-[34px]">{t('hero.title')}</h1>
              <p className="mx-auto mt-1 max-w-md text-xs font-medium leading-5 text-slate-400">
                {t('hero.support')}
              </p>
            </div>

            {error && (
              <div className="mt-3 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="leading-5">{error}</p>
              </div>
            )}

            <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
              <AuthInput
                icon={Mail}
                id="login-email"
                label={t('form.email')}
                name="email"
                placeholder="yourname@company.com"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <PasswordInput
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((current) => !current)}
                t={t}
                required
              />

              <div className="flex items-center justify-between gap-3 rounded-[15px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2">
                <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700" htmlFor="remember-me">
                  <span className="relative grid h-5 w-5 place-items-center">
                    <input
                      className="peer h-5 w-5 appearance-none rounded-md border border-slate-300 bg-white transition checked:border-sky-500 checked:bg-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100"
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                    />
                    <Check className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition peer-checked:opacity-100" />
                  </span>
                  {t('form.remember')}
                </label>
              </div>

              <button
                className="mt-0.5 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0EA5E9] px-5 text-[15px] font-bold text-white shadow-[0_10px_30px_rgba(14,165,233,0.25)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-[0_16px_38px_rgba(14,165,233,0.32)] focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-70"
                type="submit"
                disabled={loading}
              >
                {loading ? t('form.submitting') : t('form.submit')}
                {!loading && <ArrowRight className="h-5 w-5" />}
              </button>

              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                <span>{t('form.or')}</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-5 text-[15px] font-semibold text-slate-800 shadow-sm shadow-slate-200/60 transition duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50/40 focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-70"
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
              >
                <GoogleIcon />
                {googleLoading ? t('form.googleLoading') : t('form.google')}
              </button>

              <p className="text-center text-sm font-medium text-slate-500">
                {t('form.noAccount')}
                <Link className="ml-1 font-bold text-sky-600 transition hover:text-sky-700 hover:underline" to={ROUTES.SIGNUP}>
                  {t('form.signupNow')}
                </Link>
              </p>

              <div className="grid grid-cols-1 gap-1 rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 text-left sm:grid-cols-2 max-[760px]:hidden">
                {trustSignals.map(({ icon: Icon, labelKey }) => (
                  <div className="flex items-center gap-2 text-[11px] font-medium leading-4 text-slate-500" key={labelKey}>
                    <Icon className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    <span>{t(labelKey)}</span>
                  </div>
                ))}
              </div>
            </form>

          </section>
        </div>
      </section>
    </main>
  );
}
