import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import i18n from 'i18next';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import {
  ArrowRight,
  BadgeCheck,
  Car,
  Clock,
  CreditCard,
  Globe,
  Loader2,
  LockKeyhole,
  LogIn,
  Search,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { apiClient } from '../../../../services/apiClient';
import { API_ENDPOINTS } from '../../../../services/endpoints';
import { ROUTES } from '../../../../constants/routes';
import Logo from '../../../../components/Logo';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const hasStripePublishableKey = typeof publishableKey === 'string' && publishableKey.trim().length > 0;
const stripeKeyLooksValid = hasStripePublishableKey
  && /^pk_(test|live)_[A-Za-z0-9]/.test(publishableKey)
  && !publishableKey.includes('*');
const stripePromise = stripeKeyLooksValid ? loadStripe(publishableKey) : null;

const checkoutTranslations = {
  vi: {
    nav: {
      home: 'Trang chủ',
      dashboard: 'Bảng điều khiển',
      notice: 'Thông báo',
      explore: 'Khám phá',
      checkout: 'Thanh toán',
      login: 'Đăng nhập',
      signup: 'Đăng ký',
      ariaHome: 'Trang chủ',
      ariaNav: 'Điều hướng trang chủ',
      language: 'Đổi ngôn ngữ sang tiếng Anh',
    },
    hero: {
      badge: 'Smart Parking Checkout',
      title: 'Thanh toán phí gửi xe trước khi ra cổng',
      desc: 'Nhập mã phiên trên vé hoặc thẻ gửi xe để thanh toán online. Khi rời bãi, bạn chỉ cần trả lại thẻ tại quầy.',
      intro: 'Vào trang giới thiệu',
    },
    steps: {
      code: 'Nhập mã phiên',
      card: 'Thanh toán thẻ',
      returnCard: 'Trả thẻ tại quầy',
    },
    lookup: {
      title: 'Mã phiên gửi xe',
      desc: 'Nhập mã in trên vé hoặc thẻ từ để kiểm tra phí cần thanh toán.',
      placeholder: 'VD: PMJ4K8Z2',
      checking: 'Đang kiểm tra...',
      check: 'Kiểm tra',
      help: 'Mã phiên gồm 6-8 ký tự, in trên vé giấy hoặc thẻ từ.',
      required: 'Vui lòng nhập mã phiên gửi xe',
      invalid: 'Mã phiên không hợp lệ. Vui lòng nhập 6-8 ký tự trên vé hoặc thẻ từ.',
      notFound: 'Không tìm thấy mã phiên. Vui lòng kiểm tra lại.',
      statusPaid: 'Đã thanh toán',
      statusParking: 'Đang gửi',
      session: 'Phiên gửi xe',
      plate: 'Biển số xe',
      duration: 'Thời gian đã gửi',
      amount: 'Số tiền cần thanh toán',
      payNow: 'Thanh toán ngay',
      paying: 'Đang thanh toán...',
      paidMessage: (amount) => `Bạn đã thanh toán ${amount}. Khi ra cổng, vui lòng trả lại thẻ cho nhân viên.`,
      ssl: 'Giao dịch được bảo mật SSL',
      createPaymentError: 'Không tạo được phiên thanh toán',
      paymentFailed: 'Thanh toán không thành công',
      confirmFailed: 'Không thể xác nhận thanh toán',
    },
    time: {
      minute: 'phút',
      hour: 'giờ',
    },
  },
  en: {
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      notice: 'Notices',
      explore: 'Explore',
      checkout: 'Checkout',
      login: 'Login',
      signup: 'Sign Up',
      ariaHome: 'Home',
      ariaNav: 'Home navigation',
      language: 'Switch language to Vietnamese',
    },
    hero: {
      badge: 'Smart Parking Checkout',
      title: 'Pay your parking fee before exiting',
      desc: 'Enter the session code printed on your ticket or parking card to pay online. When leaving, simply return the card at the counter.',
      intro: 'Go to introduction',
    },
    steps: {
      code: 'Enter code',
      card: 'Card payment',
      returnCard: 'Return card',
    },
    lookup: {
      title: 'Parking session code',
      desc: 'Enter the code printed on your ticket or card to check the fee due.',
      placeholder: 'E.g. PMJ4K8Z2',
      checking: 'Checking...',
      check: 'Check',
      help: 'Session codes are 6-8 characters and are printed on the paper ticket or parking card.',
      required: 'Please enter a parking session code',
      invalid: 'Invalid session code. Please enter 6-8 characters from the ticket or parking card.',
      notFound: 'Session code was not found. Please check again.',
      statusPaid: 'Paid',
      statusParking: 'In parking',
      session: 'Parking session',
      plate: 'License plate',
      duration: 'Parked time',
      amount: 'Amount due',
      payNow: 'Pay now',
      paying: 'Processing payment...',
      paidMessage: (amount) => `You have paid ${amount}. Please return the card to staff when exiting.`,
      ssl: 'Transaction secured with SSL',
      createPaymentError: 'Could not create payment session',
      paymentFailed: 'Payment was not successful',
      confirmFailed: 'Could not confirm payment',
    },
    time: {
      minute: 'min',
      hour: 'hr',
    },
  },
};

function unwrap(response) {
  return response?.data?.data ?? response?.data;
}

function formatMoney(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDuration(minutes, entryTime, t) {
  const totalMinutes = Number.isFinite(Number(minutes))
    ? Number(minutes)
    : entryTime
      ? Math.max(0, Math.floor((Date.now() - new Date(entryTime).getTime()) / 60000))
      : 0;
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (hours <= 0) return `${remainingMinutes} ${t.time.minute}`;
  return `${hours} ${t.time.hour} ${remainingMinutes} ${t.time.minute}`;
}

function CheckoutHeader({ navigate, lang, setLang, t }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToWelcomeSection = (hash = '') => {
    navigate(`${ROUTES.WELCOME}${hash}`);
  };

  const handleLanguageToggle = () => {
    setLang(lang === 'vi' ? 'en' : 'vi');
  };

  const navClass = 'inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg px-3 text-sm font-bold leading-none text-slate-600 transition-all duration-200 hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100 xl:px-4';

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full border-b border-[rgba(14,165,233,0.12)] bg-[#F0F9FF] transition-all duration-300 ${
        isScrolled
          ? 'shadow-[0_8px_24px_rgba(14,165,233,0.08)] backdrop-blur-md'
          : ''
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => goToWelcomeSection()}
          className="shrink-0 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-400/20"
          aria-label={t.nav.ariaHome}
        >
          <Logo variant="horizontal" size="md" theme="brand" />
        </button>

        <nav
          className="hidden items-center gap-1 rounded-xl border border-transparent bg-transparent p-1 lg:flex"
          aria-label={t.nav.ariaNav}
        >
          <button type="button" onClick={() => goToWelcomeSection()} className={navClass}>
            {t.nav.home}
          </button>
          <button type="button" onClick={() => goToWelcomeSection('#dashboard')} className={navClass}>
            {t.nav.dashboard}
          </button>
          <button type="button" onClick={() => goToWelcomeSection('#thong-bao')} className={navClass}>
            {t.nav.notice}
          </button>
          <button type="button" onClick={() => goToWelcomeSection('#kham-pha')} className={navClass}>
            {t.nav.explore}
          </button>
        </nav>

        <div className="flex shrink-0 items-center gap-2 xl:gap-3">
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="hidden h-10 items-center gap-1.5 whitespace-nowrap rounded-lg border border-sky-100 bg-white/65 px-3 text-sm font-bold leading-none text-slate-700 transition-all hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100 sm:inline-flex"
            aria-label={t.nav.language}
            title={t.nav.language}
          >
            <Globe className="h-4 w-4" />
            <span>{lang === 'vi' ? 'VN' : 'EN'}</span>
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border border-sky-200 bg-white px-3 text-sm font-bold leading-none text-sky-700 transition hover:bg-sky-50 focus:outline-none focus:ring-4 focus:ring-sky-100 sm:px-4"
            aria-current="page"
          >
            <CreditCard className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{t.nav.checkout}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.LOGIN)}
            className="hidden h-10 items-center gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-bold leading-none text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100 sm:flex xl:px-4"
          >
            <LogIn className="h-4 w-4" />
            <span>{t.nav.login}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.SIGNUP)}
            className="flex h-10 items-center gap-2 whitespace-nowrap rounded-lg bg-[#0EA5E9] px-4 text-sm font-bold leading-none !text-white transition-all hover:-translate-y-0.5 hover:bg-[#0284c7] focus:outline-none focus:ring-4 focus:ring-sky-100 active:scale-[0.98] xl:px-5 [&_*]:!text-white"
          >
            <UserPlus className="h-4 w-4 text-white" />
            <span className="hidden sm:inline">{t.nav.signup}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function StepProgress({ t }) {
  const steps = [
    { number: '1', label: t.steps.code, active: true },
    { number: '2', label: t.steps.card, active: false },
    { number: '3', label: t.steps.returnCard, active: false },
  ];

  return (
    <div className="max-w-lg">
      <div className="relative grid grid-cols-3 gap-2">
        <div className="absolute left-[16.66%] right-[16.66%] top-5 h-px bg-sky-200" />
        {steps.map((step) => (
          <div key={step.number} className="relative z-10 flex min-w-0 flex-col items-center text-center">
            <div
              className={`grid h-10 w-10 place-items-center rounded-xl border text-sm font-black transition-colors ${
                step.active
                  ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white'
                  : 'border-sky-200 bg-white text-slate-400'
              }`}
            >
              {step.number}
            </div>
            <p
              className={`mt-2 text-xs font-bold leading-snug ${
                step.active ? 'text-[#0EA5E9]' : 'text-slate-400'
              }`}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckoutForm({ checkout, onPaid, onError, t }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements || !checkout?.clientSecret) return;
    setPaying(true);
    onError('');
    try {
      const result = await stripe.confirmCardPayment(checkout.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        onError(result.error.message || t.lookup.paymentFailed);
        return;
      }

      if (result.paymentIntent?.status === 'succeeded') {
        const response = await apiClient.post(
          API_ENDPOINTS.VISITOR_CHECKOUT.STRIPE_CONFIRM(result.paymentIntent.id),
        );
        onPaid(unwrap(response));
      }
    } catch (error) {
      onError(error?.response?.data?.message || error.message || t.lookup.confirmFailed);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="min-w-0 overflow-hidden rounded-xl border border-sky-200 bg-white px-3 py-3">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '16px',
                color: '#0f172a',
                '::placeholder': { color: '#94a3b8' },
              },
            },
          }}
        />
      </div>
      <button
        type="button"
        onClick={handlePay}
        disabled={!stripe || paying}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-4 text-sm font-bold !text-white transition hover:bg-[#0284c7] focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:!text-slate-400 [&_*]:!text-white disabled:[&_*]:!text-slate-400"
      >
        {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        {paying ? t.lookup.paying : `${t.lookup.payNow} ${formatMoney(checkout.amount)}`}
      </button>
    </div>
  );
}

function LookupCard({
  orderCode,
  setOrderCode,
  loading,
  error,
  checkout,
  isPaid,
  canPay,
  clientReady,
  stripeConfigError,
  stripeOptions,
  onLookup,
  onCreatePayment,
  onPaid,
  onError,
  t,
}) {
  const statusLabel = isPaid ? t.lookup.statusPaid : t.lookup.statusParking;

  return (
    <section className="min-w-0 rounded-xl border border-sky-100 bg-white p-5 shadow-[0_18px_44px_rgba(14,165,233,0.10)]">
      <form onSubmit={onLookup} className="space-y-3" noValidate>
        <div>
          <label className="block text-sm font-bold text-slate-800" htmlFor="order-code">
            {t.lookup.title}
          </label>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {t.lookup.desc}
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
          <input
            id="order-code"
            value={orderCode}
            onChange={(event) => setOrderCode(event.target.value.toUpperCase())}
            placeholder={t.lookup.placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby="order-code-help order-code-error"
            className="h-11 min-w-0 flex-1 rounded-xl border border-sky-200 bg-sky-50/50 px-3 text-sm font-bold uppercase text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-4 text-sm font-bold !text-white transition hover:bg-[#0284c7] focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:!text-slate-400 sm:min-w-[132px] [&_*]:!text-white disabled:[&_*]:!text-slate-400"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {loading ? t.lookup.checking : t.lookup.check}
          </button>
        </div>

        <p id="order-code-help" className="text-xs font-medium text-slate-500">
          {t.lookup.help}
        </p>
        {error && (
          <p id="order-code-error" className="text-xs font-bold text-red-600">
            {error}
          </p>
        )}
      </form>

      {checkout && (
        <div className="mt-5 border-t border-sky-100 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-black text-teal-700 ring-1 ring-teal-200">
                {statusLabel}
              </span>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                {t.lookup.session}
              </p>
              <p className="mt-1 text-lg font-black text-slate-900">{checkout.orderCode}</p>
            </div>
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-sky-100 bg-sky-50 text-[#0EA5E9]">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-xl bg-sky-50/60 p-3">
              <Car className="h-4 w-4 shrink-0 text-slate-500" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">{t.lookup.plate}</p>
                <p className="truncate font-bold text-slate-900">
                  {checkout.licensePlate || '--'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-sky-50/60 p-3">
              <Clock className="h-4 w-4 shrink-0 text-slate-500" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">{t.lookup.duration}</p>
                <p className="truncate font-bold text-slate-900">
                  {formatDuration(checkout.durationMinutes, checkout.entryTime, t)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">{t.lookup.amount}</p>
              <p className="mt-1 text-[22px] font-black leading-none text-emerald-700">
                {formatMoney(checkout.amount)}
              </p>
            </div>
            {isPaid && <BadgeCheck className="h-6 w-6 shrink-0 text-emerald-600" />}
          </div>

          {!isPaid && !clientReady && (
            <button
              type="button"
              onClick={onCreatePayment}
              disabled={loading}
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-4 text-sm font-bold !text-white transition hover:bg-[#0284c7] focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:!text-slate-400 [&_*]:!text-white disabled:[&_*]:!text-slate-400"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
              {t.lookup.payNow}
            </button>
          )}

          {!isPaid && clientReady && stripeConfigError && (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
              {stripeConfigError}
            </p>
          )}

          {!isPaid && canPay && stripePromise && stripeOptions && !stripeConfigError && (
            <div className="mt-4">
              <Elements stripe={stripePromise} options={stripeOptions}>
                <CheckoutForm checkout={checkout} onPaid={onPaid} onError={onError} t={t} />
              </Elements>
            </div>
          )}

          {isPaid && (
            <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
              {t.lookup.paidMessage(formatMoney(checkout.paidAmount || checkout.amount))}
            </p>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center justify-center gap-2 border-t border-sky-100 pt-4 text-xs font-semibold text-slate-400">
        <LockKeyhole className="h-4 w-4 shrink-0" />
        <span>{t.lookup.ssl}</span>
      </div>
    </section>
  );
}

export default function VisitorCheckoutPage() {
  const navigate = useNavigate();
  const getInitialLang = () => {
    const current = i18n.language || localStorage.getItem('language') || 'vi';
    return current.startsWith('en') ? 'en' : 'vi';
  };

  const [lang, setLangState] = useState(getInitialLang);
  const t = checkoutTranslations[lang];
  const [orderCode, setOrderCode] = useState('');
  const [checkout, setCheckout] = useState(null);
  const [clientReady, setClientReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPaid = checkout?.paymentStatus === 'PAID';
  const canPay = checkout && !isPaid && checkout.clientSecret;
  const stripeConfigError = !hasStripePublishableKey
    ? 'Thiếu VITE_STRIPE_PUBLISHABLE_KEY ở frontend.'
    : !stripeKeyLooksValid
      ? 'VITE_STRIPE_PUBLISHABLE_KEY không hợp lệ. Hãy dùng key thật từ Stripe Dashboard, dạng pk_test_... hoặc pk_live_..., không dùng key bị che bằng dấu *.'
      : '';
  const stripeOptions = useMemo(
    () => (checkout?.clientSecret ? { clientSecret: checkout.clientSecret } : undefined),
    [checkout?.clientSecret],
  );

  const setLang = (newLang) => {
    setLangState(newLang);
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const handleLangChange = (lng) => {
      setLangState(lng.startsWith('en') ? 'en' : 'vi');
    };
    i18n.on('languageChanged', handleLangChange);
    return () => {
      i18n.off('languageChanged', handleLangChange);
    };
  }, []);

  const handleLookup = async (event) => {
    event.preventDefault();
    const normalizedCode = orderCode.trim().toUpperCase();

    if (!normalizedCode) {
      setCheckout(null);
      setError(t.lookup.required);
      return;
    }

    if (!/^[A-Z0-9]{6,8}$/.test(normalizedCode)) {
      setCheckout(null);
      setError(t.lookup.invalid);
      return;
    }

    setLoading(true);
    setError('');
    setClientReady(false);
    try {
      const response = await apiClient.post(API_ENDPOINTS.VISITOR_CHECKOUT.LOOKUP, {
        orderCode: normalizedCode,
      });
      setCheckout(unwrap(response));
    } catch (err) {
      setCheckout(null);
      setError(err?.response?.data?.message || t.lookup.notFound);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.post(API_ENDPOINTS.VISITOR_CHECKOUT.STRIPE, {
        orderCode: checkout.orderCode,
      });
      setCheckout(unwrap(response));
      setClientReady(true);
    } catch (err) {
      setError(err?.response?.data?.message || t.lookup.createPaymentError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-sky-50 text-slate-900">
      <CheckoutHeader navigate={navigate} lang={lang} setLang={setLang} t={t} />
      <section className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-6 px-4 pb-8 pt-28 md:grid-cols-[minmax(0,0.82fr)_minmax(320px,1fr)] lg:gap-8">
        <div className="order-2 min-w-0 space-y-6 md:order-1">
          <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
            <ShieldCheck className="h-4 w-4 text-amber-600" />
            {t.hero.badge}
          </div>

          <div className="space-y-3">
            <h1 className="max-w-lg text-3xl font-black leading-tight tracking-normal text-slate-900 md:text-4xl">
              {t.hero.title}
            </h1>
            <p className="max-w-lg text-sm font-medium leading-6 text-slate-600">
              {t.hero.desc}
            </p>
          </div>

          <StepProgress t={t} />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate(ROUTES.WELCOME)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-sky-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:bg-sky-50 focus:outline-none focus:ring-4 focus:ring-sky-100"
            >
              {t.hero.intro}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-sky-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:bg-sky-50 focus:outline-none focus:ring-4 focus:ring-sky-100"
            >
              <LogIn className="h-4 w-4" />
              {t.nav.login}
            </button>
          </div>
        </div>

        <div className="order-1 min-w-0 md:order-2">
          <LookupCard
            key={lang}
            orderCode={orderCode}
            setOrderCode={setOrderCode}
            loading={loading}
            error={error}
            checkout={checkout}
            isPaid={isPaid}
            canPay={canPay}
            clientReady={clientReady}
            stripeConfigError={stripeConfigError}
            stripeOptions={stripeOptions}
            onLookup={handleLookup}
            onCreatePayment={handleCreatePayment}
            onPaid={setCheckout}
            onError={setError}
            t={t}
          />
        </div>
      </section>
    </main>
  );
}
