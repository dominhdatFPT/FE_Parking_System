import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ROUTES } from '../../constants/routes';
import { API_ENDPOINTS } from '../../services/endpoints';
import stripePromise from '../../config/stripe';

// Tuỳ chỉnh giao diện CardElement cho khớp với Tailwind
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      color: '#1e293b',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      '::placeholder': { color: '#94a3b8' },
      iconColor: '#0ea5e9',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
};

/**
 * Form nhập thẻ nằm trong modal — dùng Stripe Elements.
 * Được bọc bởi <Elements> provider ở component cha (StripeCheckoutModal).
 */
function CheckoutForm({ clientSecret, planName, amount, currency, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setCardError('');

    const cardElement = elements.getElement(CardElement);

    // Xác nhận thanh toán với thẻ — Stripe xử lý 3D Secure nếu cần
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      // Lỗi từ Stripe (thẻ bị từ chối, thẻ hết hạn, v.v.)
      setCardError(error.message || 'Thanh toán thất bại. Vui lòng kiểm tra thông tin thẻ.');
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      // Gọi BE confirm để kích hoạt subscription ngay (không chờ webhook)
      try {
        await fetch(API_ENDPOINTS.PAYMENTS.STRIPE_ORDER_CONFIRM(paymentIntent.id), { method: 'POST' });
      } catch (_) { /* ignore — webhook sẽ xử lý sau nếu confirm lỗi */ }
      onSuccess(paymentIntent.id);
    } else {
      // Trạng thái không xác định (requires_action, processing...)
      setCardError(`Trạng thái thanh toán: ${paymentIntent.status}. Vui lòng thử lại.`);
      setProcessing(false);
    }
  };

  const formatAmount = (amt, curr) => {
    if (!amt) return '--';
    if (curr === 'vnd') return `${Number(amt).toLocaleString('vi-VN')} VNĐ`;
    // Khi currency=usd: Stripe nhận số VNĐ dưới dạng cents → chia 100 để hiển thị dollar
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr?.toUpperCase() || 'USD',
    }).format(amt / 100);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Thông tin đơn hàng */}
      <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Gói</span>
          <span className="font-bold text-slate-700">{planName || 'Thẻ tháng'}</span>
        </div>
        <div className="flex justify-between text-xs border-t border-slate-100 pt-2">
          <span className="text-slate-500 font-black">Tổng tiền</span>
          <span className="font-black text-sky-600 text-sm">{formatAmount(amount, currency)}</span>
        </div>
      </div>

      {/* Stripe CardElement */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
          Thông tin thẻ
        </label>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 transition-all">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        {/* Gợi ý thẻ test */}
        <p className="text-[10px] text-slate-400">
          Test: <span className="font-mono">4242 4242 4242 4242</span> · bất kỳ ngày tương lai · bất kỳ CVC
        </p>
      </div>

      {/* Thông báo lỗi */}
      {cardError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-xs font-semibold text-red-600">{cardError}</p>
        </div>
      )}

      {/* Nút hành động */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition disabled:opacity-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold transition shadow-md shadow-sky-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Đang xử lý...
            </span>
          ) : (
            `Thanh toán ${formatAmount(amount, currency)}`
          )}
        </button>
      </div>

      {/* Badge bảo mật */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>Thanh toán an toàn qua Stripe</span>
      </div>
    </form>
  );
}

/**
 * Modal thanh toán Stripe.
 *
 * Props:
 * - isOpen: boolean — hiển thị/ẩn modal
 * - clientSecret: string — từ /api/subscriptions/register-stripe
 * - paymentIntentId: string — pi_xxx
 * - planName: string — tên gói
 * - amount: number — số tiền
 * - currency: string — "vnd"
 * - onClose: () => void — đóng modal
 */
export default function StripeCheckoutModal({
  isOpen,
  clientSecret,
  paymentIntentId,
  planName,
  amount,
  currency,
  onClose,
}) {
  const navigate = useNavigate();

  if (!isOpen || !clientSecret) return null;

  const handleSuccess = (piId) => {
    localStorage.removeItem('pending_stripe_request');
    onClose(); // Đóng modal trước khi navigate cùng route
    navigate(`${ROUTES.DRIVER.PAYMENT}?status=success&piId=${piId}`);
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-800">Thanh toán bằng thẻ</h2>
            <p className="text-xs text-slate-400 mt-0.5">Powered by Stripe</p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition"
          >
            ✕
          </button>
        </div>

        {/* Stripe Elements provider — bọc form để có quyền truy cập stripe instance */}
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm
            clientSecret={clientSecret}
            planName={planName}
            amount={amount}
            currency={currency}
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        </Elements>
      </div>
    </div>
  );
}
