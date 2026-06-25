import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  CircleAlert,
  Cloud,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  LockKeyhole,
  LogIn,
  Mail,
  RadioTower,
  ShieldCheck,
} from 'lucide-react';
import Logo from '../../../../components/Logo';
import { ROUTES } from '../../../../constants/routes';
import { requestPasswordResetApi, resetPasswordApi, verifyResetOtpApi } from '../../services/authApi';

const LANGUAGE_KEY = 'language';
const OTP_LENGTH = 6;

const resources = {
  vi: {
    translation: {
      login: 'Đăng nhập',
      steps: {
        email: 'Email',
        otp: 'Xác thực OTP',
        password: 'Mật khẩu mới',
      },
      email: {
        title: 'Quên mật khẩu?',
        desc: 'Nhập email đã đăng ký để nhận mã OTP xác thực.',
        label: 'Email',
        placeholder: 'yourname@company.com',
        button: 'Tiếp tục',
        loading: 'Đang gửi mã...',
      },
      otp: {
        title: 'Xác thực OTP',
        desc: 'Mã OTP đã được gửi đến email của bạn.',
        sentTo: 'Mã OTP đã gửi tới',
        button: 'Xác nhận OTP',
        loading: 'Đang xác thực...',
        resend: 'Gửi lại mã',
        countdownPrefix: 'Có thể gửi lại sau',
      },
      password: {
        title: 'Tạo mật khẩu mới',
        desc: 'Tạo mật khẩu đủ mạnh để bảo vệ tài khoản SmartParking.',
        newLabel: 'Mật khẩu mới',
        confirmLabel: 'Xác nhận mật khẩu',
        placeholder: 'Ít nhất 8 ký tự',
        confirmPlaceholder: 'Nhập lại mật khẩu mới',
        button: 'Cập nhật mật khẩu',
        loading: 'Đang cập nhật...',
        strength: 'Độ mạnh mật khẩu',
        weak: 'Yếu',
        medium: 'Trung bình',
        strong: 'Mạnh',
        show: 'Hiện mật khẩu',
        hide: 'Ẩn mật khẩu',
      },
      done: {
        title: 'Đặt lại mật khẩu thành công',
        desc: 'Bạn có thể đăng nhập bằng mật khẩu mới.',
        button: 'Đăng nhập ngay',
      },
      messages: {
        otpSent: 'Mã OTP đã được gửi. Vui lòng kiểm tra hộp thư của bạn.',
        otpResent: 'Mã OTP mới đã được gửi lại.',
        otpValid: 'OTP hợp lệ. Vui lòng tạo mật khẩu mới.',
        passwordUpdated: 'Mật khẩu mới đã được cập nhật thành công.',
      },
      errors: {
        emailRequired: 'Vui lòng nhập email đã đăng ký.',
        emailInvalid: 'Email chưa đúng định dạng. Vui lòng kiểm tra lại.',
        otpRequired: 'Vui lòng nhập đủ 6 chữ số OTP.',
        otpInvalid: 'Mã OTP không chính xác. Vui lòng thử lại.',
        passwordLength: 'Mật khẩu mới phải có ít nhất 8 ký tự.',
        passwordMismatch: 'Mật khẩu xác nhận không khớp.',
      },
      trust: {
        otp: 'Xác thực OTP bảo mật',
        encryption: 'Mã hóa dữ liệu',
        cloud: 'Hạ tầng Cloud an toàn',
        account: 'Bảo vệ tài khoản SmartParking',
      },
      background: {
        secure: 'Secure recovery',
        email: 'Email verification',
        cloud: 'Cloud security',
        access: 'Smart access control',
      },
      back: {
        login: 'Quay lại đăng nhập',
        previous: 'Quay lại bước trước',
      },
    },
  },
  en: {
    translation: {
      login: 'Login',
      steps: {
        email: 'Email',
        otp: 'OTP Verification',
        password: 'New password',
      },
      email: {
        title: 'Forgot password?',
        desc: 'Enter your registered email to receive a verification OTP.',
        label: 'Email',
        placeholder: 'yourname@company.com',
        button: 'Continue',
        loading: 'Sending code...',
      },
      otp: {
        title: 'Verify OTP',
        desc: 'The OTP code has been sent to your email.',
        sentTo: 'OTP sent to',
        button: 'Verify OTP',
        loading: 'Verifying...',
        resend: 'Resend code',
        countdownPrefix: 'Resend available in',
      },
      password: {
        title: 'Create a new password',
        desc: 'Create a strong password to protect your SmartParking account.',
        newLabel: 'New password',
        confirmLabel: 'Confirm password',
        placeholder: 'At least 8 characters',
        confirmPlaceholder: 'Re-enter new password',
        button: 'Update password',
        loading: 'Updating...',
        strength: 'Password strength',
        weak: 'Weak',
        medium: 'Medium',
        strong: 'Strong',
        show: 'Show password',
        hide: 'Hide password',
      },
      done: {
        title: 'Password reset successful',
        desc: 'You can now log in with your new password.',
        button: 'Login now',
      },
      messages: {
        otpSent: 'OTP has been sent. Please check your inbox.',
        otpResent: 'A new OTP has been sent.',
        otpValid: 'OTP verified. Please create a new password.',
        passwordUpdated: 'Your new password has been updated successfully.',
      },
      errors: {
        emailRequired: 'Please enter your registered email.',
        emailInvalid: 'Email format is invalid. Please check again.',
        otpRequired: 'Please enter all 6 OTP digits.',
        otpInvalid: 'OTP code is incorrect. Please try again.',
        passwordLength: 'New password must be at least 8 characters.',
        passwordMismatch: 'Password confirmation does not match.',
      },
      trust: {
        otp: 'Secure OTP verification',
        encryption: 'Encrypted data',
        cloud: 'Safe Cloud infrastructure',
        account: 'SmartParking account protection',
      },
      background: {
        secure: 'Secure recovery',
        email: 'Email verification',
        cloud: 'Cloud security',
        access: 'Smart access control',
      },
      back: {
        login: 'Back to login',
        previous: 'Back to previous step',
      },
    },
  },
};

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'vi';
  const savedLanguage = window.localStorage.getItem(LANGUAGE_KEY) || 'vi';
  return savedLanguage.startsWith('en') ? 'en' : 'vi';
};

const getResetText = (language, key) => {
  const dictionary = resources[language]?.translation || resources.vi.translation;
  return key.split('.').reduce((value, part) => value?.[part], dictionary) ?? key;
};

const translate = (language, key) => {
  const dictionary = resources[language]?.translation ?? resources.vi.translation;
  return key.split('.').reduce((value, part) => value?.[part], dictionary) ?? key;
};

const stepOrder = ['email', 'otp', 'password'];

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getApiErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback;
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

function SecurityBackground({ t }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden text-slate-900" aria-hidden="true">
      <div className="absolute left-[-5rem] top-24 h-80 w-80 rounded-full border border-sky-200/60" />
      <div className="absolute bottom-[-8rem] right-[-6rem] h-[26rem] w-[26rem] rounded-full border border-emerald-200/70" />
      <svg className="absolute left-8 top-28 h-[430px] w-[520px] opacity-[0.13]" viewBox="0 0 520 430" fill="none">
        <rect x="78" y="82" width="190" height="126" rx="28" stroke="currentColor" strokeWidth="3" />
        <path d="M104 120L174 166L244 120" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="322" y="70" width="78" height="106" rx="22" stroke="currentColor" strokeWidth="3" />
        <path d="M346 112H376M346 140H366" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M268 148C298 148 300 124 322 124" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="7 10" />
        <path d="M134 282C146 232 214 216 250 254C276 220 344 234 350 286C390 290 416 316 416 352C416 388 386 408 350 408H146C108 408 78 378 78 340C78 306 102 282 134 282Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M166 342H318M166 372H254" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M220 208V250M310 176V238" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="7 10" />
      </svg>
      <svg className="absolute right-8 top-24 hidden h-[420px] w-[520px] opacity-[0.13] lg:block" viewBox="0 0 520 420" fill="none">
        <path d="M260 66L378 112V204C378 284 322 342 260 364C198 342 142 284 142 204V112L260 66Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <rect x="216" y="180" width="88" height="70" rx="18" stroke="currentColor" strokeWidth="3" />
        <path d="M232 180V152C232 136 244 124 260 124C276 124 288 136 288 152V180" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="260" cy="216" r="8" stroke="currentColor" strokeWidth="2.6" />
        <path d="M260 224V238" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <rect x="64" y="264" width="116" height="58" rx="16" stroke="currentColor" strokeWidth="3" />
        <rect x="340" y="264" width="116" height="58" rx="16" stroke="currentColor" strokeWidth="3" />
        <path d="M180 294H216M304 294H340" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="7 10" />
        <path d="M88 294H154M364 294H430" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <div className="absolute left-12 bottom-24 hidden rounded-2xl border border-slate-300/70 bg-white/45 px-4 py-3 text-xs font-semibold text-slate-700 opacity-[0.15] shadow-sm md:block">
        <div className="mb-2 flex items-center gap-2">
          <Mail className="h-4 w-4" />
          {t('background.email')}
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          {t('background.secure')}
        </div>
      </div>
      <div className="absolute right-20 bottom-28 hidden rounded-2xl border border-slate-300/70 bg-white/45 px-4 py-3 text-xs font-semibold text-slate-700 opacity-[0.15] shadow-sm lg:block">
        <div className="mb-2 flex items-center gap-2">
          <Cloud className="h-4 w-4" />
          {t('background.cloud')}
        </div>
        <div className="flex items-center gap-2">
          <RadioTower className="h-4 w-4" />
          {t('background.access')}
        </div>
      </div>
      <div className="absolute bottom-20 left-1/2 hidden -translate-x-1/2 items-center gap-8 opacity-[0.12] md:flex">
        <Mail className="h-12 w-12" strokeWidth={1.4} />
        <KeyRound className="h-12 w-12" strokeWidth={1.4} />
        <ShieldCheck className="h-14 w-14" strokeWidth={1.4} />
        <Cloud className="h-14 w-14" strokeWidth={1.4} />
        <Camera className="h-12 w-12" strokeWidth={1.4} />
      </div>
    </div>
  );
}

function StepIndicator({ currentStep, t }) {
  const currentIndex = currentStep === 'done' ? stepOrder.length : stepOrder.indexOf(currentStep);

  return (
    <div className="mb-3 overflow-hidden pb-1" aria-label="Password reset progress">
      <div className="grid w-full grid-cols-[1fr_1fr_1fr] items-center gap-1 sm:gap-2">
        {stepOrder.map((stepKey, index) => {
          const isComplete = index < currentIndex || currentStep === 'done';
          const isActive = stepKey === currentStep;

          return (
            <div className="relative flex items-center" key={stepKey}>
              {index > 0 && (
                <span className={`absolute right-1/2 top-4 h-0.5 w-full ${index <= currentIndex ? 'bg-sky-500' : 'bg-slate-200'}`} />
              )}
              <div className="relative z-10 mx-auto flex flex-col items-center gap-1.5">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full border text-xs font-bold transition ${
                    isComplete
                      ? 'border-sky-500 bg-sky-500 text-white'
                      : isActive
                        ? 'border-sky-500 bg-sky-50 text-sky-600'
                        : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                <span className={`max-w-full truncate text-[10px] font-bold sm:text-xs ${isActive || isComplete ? 'text-sky-700' : 'text-slate-400'}`}>
                  {t(`steps.${stepKey}`)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PasswordStrength({ password, t }) {
  const score = useMemo(() => {
    let value = 0;
    if (password.length >= 8) value += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) value += 1;
    if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) value += 1;
    return value;
  }, [password]);

  const label = score <= 1 ? t('password.weak') : score === 2 ? t('password.medium') : t('password.strong');
  const color = score <= 1 ? 'bg-rose-500' : score === 2 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
        <span>{t('password.strength')}</span>
        <span>{password ? label : '-'}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((item) => (
          <span className={`h-1.5 rounded-full ${password && item < score ? color : 'bg-slate-200'}`} key={item} />
        ))}
      </div>
    </div>
  );
}

export default function ResetPassword() {
  const { i18n: resetI18n } = useTranslation();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(59);
  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const currentLanguage = resetI18n.language.startsWith('en') ? 'en' : 'vi';
  const t = (key) => getResetText(currentLanguage, key);

  const otp = otpDigits.join('');
  const maskedEmail = email.trim();

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    if (step !== 'otp') return undefined;
    setCountdown(59);
    const intervalId = window.setInterval(() => {
      setCountdown((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [step, message]);

  const handleLanguageChange = (nextLanguage) => {
    setCurrentLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError(t('errors.emailRequired'));
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setError(t('errors.emailInvalid'));
      return;
    }

    setLoading(true);
    try {
      await requestPasswordResetApi(trimmedEmail);
      setEmail(trimmedEmail);
      setStep('otp');
      setMessage(t('messages.otpSent'));
      window.setTimeout(() => otpRefs.current[0]?.focus(), 50);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, t('errors.emailInvalid')));
    } finally {
      setLoading(false);
    }
  };

  const fillOtpFromIndex = (startIndex, rawValue) => {
    const digits = rawValue.replace(/\D/g, '').slice(0, OTP_LENGTH - startIndex);
    const nextOtp = [...otpDigits];

    if (!digits) {
      nextOtp[startIndex] = '';
      setOtpDigits(nextOtp);
      return;
    }

    digits.split('').forEach((digit, offset) => {
      nextOtp[startIndex + offset] = digit;
    });

    setOtpDigits(nextOtp);
    setError('');

    const nextFocusIndex = Math.min(startIndex + digits.length, OTP_LENGTH - 1);
    window.requestAnimationFrame(() => {
      otpRefs.current[nextFocusIndex]?.focus();
      otpRefs.current[nextFocusIndex]?.select();
    });
  };

  const handleOtpChange = (index, event) => {
    const digits = event.target.value.replace(/\D/g, '');
    if (!digits) {
      const nextOtp = [...otpDigits];
      nextOtp[index] = '';
      setOtpDigits(nextOtp);
      return;
    }

    if (index === 0 && digits.length === OTP_LENGTH) {
      fillOtpFromIndex(0, digits);
      return;
    }

    const nextOtp = [...otpDigits];
    nextOtp[index] = digits.slice(-1);
    setOtpDigits(nextOtp);
    setError('');

    if (index < OTP_LENGTH - 1) {
      window.requestAnimationFrame(() => {
        otpRefs.current[index + 1]?.focus();
        otpRefs.current[index + 1]?.select();
      });
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      const nextOtp = [...otpDigits];

      if (nextOtp[index]) {
        nextOtp[index] = '';
        setOtpDigits(nextOtp);
        return;
      }

      if (index > 0) {
        nextOtp[index - 1] = '';
        setOtpDigits(nextOtp);
        otpRefs.current[index - 1]?.focus();
      }
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      otpRefs.current[index - 1]?.focus();
    }

    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      event.preventDefault();
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (index, event) => {
    event.preventDefault();
    fillOtpFromIndex(index, event.clipboardData.getData('text'));
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (otpDigits.some((digit) => !digit)) {
      setError(t('errors.otpRequired'));
      return;
    }

    setLoading(true);
    try {
      await verifyResetOtpApi({ email: maskedEmail, otp });
      setStep('password');
      setMessage(t('messages.otpValid'));
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, t('errors.otpInvalid')));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 8) {
      setError(t('errors.passwordLength'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('errors.passwordMismatch'));
      return;
    }

    setLoading(true);
    try {
      await resetPasswordApi({
        email: maskedEmail,
        otp,
        newPassword: password,
        confirmPassword,
      });
      setStep('done');
      setMessage(t('messages.passwordUpdated'));
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, t('errors.passwordLength')));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'email' || step === 'done') {
      navigate(ROUTES.LOGIN);
      return;
    }
    setError('');
    setMessage('');
    setStep(step === 'password' ? 'otp' : 'email');
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || loading) return;
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await requestPasswordResetApi(maskedEmail);
      setMessage(t('messages.otpResent'));
      setCountdown(59);
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      window.setTimeout(() => otpRefs.current[0]?.focus(), 50);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, t('errors.emailInvalid')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative h-screen overflow-hidden bg-[#F8FAFC] text-slate-950">
      <SecurityBackground t={t} />
      <TopNavigation currentLanguage={currentLanguage} onLanguageChange={handleLanguageChange} t={t} />

      <section className="relative z-10 flex h-full items-center justify-center px-4 pb-3 pt-20 sm:px-6 lg:px-10">
        <div className="w-full max-w-[580px]">
          <StepIndicator currentStep={step} t={t} />

          <section className="rounded-[28px] border border-white/80 bg-white/95 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 backdrop-blur-xl sm:p-5">
            <div className="text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-500/20">
                {step === 'done' ? <Check className="h-7 w-7" /> : step === 'otp' ? <KeyRound className="h-7 w-7" /> : <LockKeyhole className="h-7 w-7" />}
              </div>
              <h1 className="mt-3 text-[26px] font-semibold leading-tight tracking-normal text-slate-950 sm:text-[32px]">
                {t(`${step}.title`)}
              </h1>
              <p className="mx-auto mt-1.5 max-w-md text-sm font-medium leading-5 text-slate-500">
                {t(`${step}.desc`)}
              </p>
            </div>

            {message && step !== 'done' && (
              <div className="mt-3 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="leading-5">{message}</p>
              </div>
            )}
            {error && (
              <div className="mt-3 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="leading-5">{error}</p>
              </div>
            )}

            {step === 'email' && (
              <form className="mt-4 grid gap-3" onSubmit={handleEmailSubmit} noValidate>
                <label className="grid gap-1.5 text-left" htmlFor="reset-email">
                  <span className="text-sm font-medium text-slate-700">{t('email.label')}</span>
                  <span className="relative block">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      className="h-11 w-full rounded-[15px] border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pl-12 pr-4 text-[15px] text-slate-950 outline-none transition duration-200 placeholder:text-slate-400 hover:border-sky-200 hover:bg-white focus:border-[#0EA5E9] focus:bg-white focus:shadow-[0_0_0_4px_rgba(14,165,233,0.14)]"
                      id="reset-email"
                      placeholder={t('email.placeholder')}
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (error) setError('');
                      }}
                      disabled={loading}
                    />
                  </span>
                </label>
                <button className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0EA5E9] px-5 text-[15px] font-bold text-white shadow-[0_10px_30px_rgba(14,165,233,0.25)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-[0_16px_38px_rgba(14,165,233,0.32)] disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={loading}>
                  {loading ? t('email.loading') : t('email.button')}
                  {!loading && <ArrowRight className="h-5 w-5" />}
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form className="mt-4 grid gap-3" onSubmit={handleOtpSubmit} noValidate>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-sm text-slate-600">
                  {t('otp.sentTo')} <span className="font-semibold text-slate-900">{maskedEmail}</span>
                </div>
                <div className="grid grid-cols-6 gap-2 sm:gap-3">
                  {otpDigits.map((digit, index) => (
                    <input
                      className="h-11 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] text-center text-lg font-bold text-slate-950 outline-none transition focus:border-[#0EA5E9] focus:bg-white focus:shadow-[0_0_0_4px_rgba(14,165,233,0.14)]"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      key={`otp-${index}`}
                      maxLength={1}
                      ref={(node) => {
                        otpRefs.current[index] = node;
                      }}
                      value={digit}
                      onChange={(event) => handleOtpChange(index, event)}
                      onKeyDown={(event) => handleOtpKeyDown(index, event)}
                      onPaste={(event) => handleOtpPaste(index, event)}
                      onFocus={(event) => event.target.select()}
                      disabled={loading}
                      aria-label={`OTP digit ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <button className="font-bold text-sky-600 transition hover:text-sky-700 disabled:cursor-not-allowed disabled:text-slate-400" type="button" onClick={handleResendOtp} disabled={countdown > 0 || loading}>
                    {t('otp.resend')}
                  </button>
                  <span className="font-medium text-slate-500">
                    {countdown > 0 ? `${t('otp.countdownPrefix')} 00:${String(countdown).padStart(2, '0')}` : '00:00'}
                  </span>
                </div>
                <button className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0EA5E9] px-5 text-[15px] font-bold text-white shadow-[0_10px_30px_rgba(14,165,233,0.25)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-[0_16px_38px_rgba(14,165,233,0.32)] disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={loading}>
                  {loading ? t('otp.loading') : t('otp.button')}
                </button>
              </form>
            )}

            {step === 'password' && (
              <form className="mt-4 grid gap-3" onSubmit={handlePasswordSubmit} noValidate>
                <label className="grid gap-1.5 text-left" htmlFor="new-password">
                  <span className="text-sm font-medium text-slate-700">{t('password.newLabel')}</span>
                  <span className="relative block">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input className="h-11 w-full rounded-[15px] border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pl-12 pr-12 text-[15px] text-slate-950 outline-none transition duration-200 placeholder:text-slate-400 hover:border-sky-200 hover:bg-white focus:border-[#0EA5E9] focus:bg-white focus:shadow-[0_0_0_4px_rgba(14,165,233,0.14)]" id="new-password" placeholder={t('password.placeholder')} type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} disabled={loading} />
                    <button className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? t('password.hide') : t('password.show')}>
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </span>
                </label>
                <label className="grid gap-1.5 text-left" htmlFor="confirm-new-password">
                  <span className="text-sm font-medium text-slate-700">{t('password.confirmLabel')}</span>
                  <span className="relative block">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input className="h-11 w-full rounded-[15px] border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pl-12 pr-4 text-[15px] text-slate-950 outline-none transition duration-200 placeholder:text-slate-400 hover:border-sky-200 hover:bg-white focus:border-[#0EA5E9] focus:bg-white focus:shadow-[0_0_0_4px_rgba(14,165,233,0.14)]" id="confirm-new-password" placeholder={t('password.confirmPlaceholder')} type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} disabled={loading} />
                  </span>
                </label>
                <PasswordStrength password={password} t={t} />
                <button className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0EA5E9] px-5 text-[15px] font-bold text-white shadow-[0_10px_30px_rgba(14,165,233,0.25)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-[0_16px_38px_rgba(14,165,233,0.32)] disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={loading}>
                  {loading ? t('password.loading') : t('password.button')}
                </button>
              </form>
            )}

            {step === 'done' && (
              <div className="mt-4 grid gap-3 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                  <Check className="h-8 w-8" />
                </div>
                <p className="text-sm font-medium leading-6 text-slate-500">{message || t('messages.passwordUpdated')}</p>
                <button className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0EA5E9] px-5 text-[15px] font-bold text-white shadow-[0_10px_30px_rgba(14,165,233,0.25)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-[0_16px_38px_rgba(14,165,233,0.32)]" type="button" onClick={() => navigate(ROUTES.LOGIN)}>
                  {t('done.button')}
                </button>
              </div>
            )}

            {step !== 'done' && (
              <button className="mt-4 inline-flex w-full items-center justify-center gap-2 border-t border-slate-200 pt-3 text-sm font-bold text-slate-600 transition hover:text-sky-600" type="button" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
                {step === 'email' ? t('back.login') : t('back.previous')}
              </button>
            )}
          </section>

        </div>
      </section>
    </main>
  );
}
