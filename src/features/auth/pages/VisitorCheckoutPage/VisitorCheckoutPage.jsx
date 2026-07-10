import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { ArrowRight, BadgeCheck, Car, CreditCard, Loader2, LogIn, Search, ShieldCheck } from 'lucide-react';
import { apiClient } from '../../../../services/apiClient';
import { API_ENDPOINTS } from '../../../../services/endpoints';
import { ROUTES } from '../../../../constants/routes';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

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

function formatTime(value) {
  if (!value) return '--';
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

function CheckoutForm({ checkout, onPaid, onError }) {
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
        onError(result.error.message || 'Thanh toán không thành công');
        return;
      }

      if (result.paymentIntent?.status === 'succeeded') {
        const response = await apiClient.post(
          API_ENDPOINTS.VISITOR_CHECKOUT.STRIPE_CONFIRM(result.paymentIntent.id),
        );
        onPaid(unwrap(response));
      }
    } catch (error) {
      onError(error?.response?.data?.message || error.message || 'Không thể xác nhận thanh toán');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded border border-slate-200 bg-white px-3 py-3">
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
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        {paying ? 'Đang thanh toán' : `Thanh toán ${formatMoney(checkout.amount)}`}
      </button>
    </div>
  );
}

export default function VisitorCheckoutPage() {
  const navigate = useNavigate();
  const [orderCode, setOrderCode] = useState('');
  const [checkout, setCheckout] = useState(null);
  const [clientReady, setClientReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPaid = checkout?.paymentStatus === 'PAID';
  const canPay = checkout && !isPaid && checkout.clientSecret;
  const stripeOptions = useMemo(
    () => (checkout?.clientSecret ? { clientSecret: checkout.clientSecret } : undefined),
    [checkout?.clientSecret],
  );

  const handleLookup = async (event) => {
    event.preventDefault();
    if (!orderCode.trim()) {
      setError('Vui lòng nhập mã phiên gửi xe');
      return;
    }
    setLoading(true);
    setError('');
    setClientReady(false);
    try {
      const response = await apiClient.post(API_ENDPOINTS.VISITOR_CHECKOUT.LOOKUP, {
        orderCode: orderCode.trim(),
      });
      setCheckout(unwrap(response));
    } catch (err) {
      setCheckout(null);
      setError(err?.response?.data?.message || 'Không tìm thấy phiên gửi xe');
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
      setError(err?.response?.data?.message || 'Không tạo được phiên thanh toán');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="mx-auto grid min-h-screen max-w-5xl items-center gap-6 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Smart Parking Checkout
          </div>
          <div className="space-y-3">
            <h1 className="max-w-lg text-3xl font-bold leading-tight tracking-normal text-slate-950 md:text-4xl">
              Thanh toán phí gửi xe trước khi ra cổng
            </h1>
            <p className="max-w-lg text-sm leading-6 text-slate-600">
              Nhập mã phiên trên vé/thẻ gửi xe để thanh toán online. Khi rời bãi, bạn chỉ cần trả lại thẻ tại quầy.
            </p>
          </div>
          <div className="grid max-w-lg gap-2 sm:grid-cols-3">
            {[
              ['1', 'Nhập mã phiên'],
              ['2', 'Thanh toán thẻ'],
              ['3', 'Trả thẻ tại quầy'],
            ].map(([step, label]) => (
              <div key={step} className="rounded border border-slate-200 bg-white p-3">
                <div className="mb-2 grid h-7 w-7 place-items-center rounded bg-slate-900 text-xs font-bold text-white">
                  {step}
                </div>
                <p className="text-xs font-semibold text-slate-700">{label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate(ROUTES.WELCOME)}
              className="inline-flex h-10 items-center gap-2 rounded border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Vào trang giới thiệu
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="inline-flex h-10 items-center gap-2 rounded bg-white px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              <LogIn className="h-4 w-4" />
              Đăng nhập
            </button>
          </div>
        </div>

        <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
          <form onSubmit={handleLookup} className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="order-code">
              Mã phiên gửi xe
            </label>
            <div className="flex gap-2">
              <input
                id="order-code"
                value={orderCode}
                onChange={(event) => setOrderCode(event.target.value.toUpperCase())}
                placeholder="VD: PO-178..."
                className="h-10 min-w-0 flex-1 rounded border border-slate-300 px-3 text-sm font-semibold uppercase outline-none transition focus:border-slate-900"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded bg-slate-900 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-400"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Kiểm tra
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {checkout && (
            <div className="mt-5 space-y-4">
              <div className="rounded border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Phiên gửi xe</p>
                    <p className="mt-1 text-xl font-bold text-slate-950">{checkout.orderCode}</p>
                  </div>
                  <div className="grid h-11 w-11 place-items-center rounded bg-white text-slate-900">
                    <Car className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-slate-500">Biển số</p>
                    <p className="font-semibold text-slate-900">{checkout.licensePlate}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Thẻ</p>
                    <p className="font-semibold text-slate-900">{checkout.visitorCardCode || '--'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Giờ vào</p>
                    <p className="font-semibold text-slate-900">{formatTime(checkout.entryTime)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Thời lượng</p>
                    <p className="font-semibold text-slate-900">{checkout.durationMinutes} phút</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded border border-slate-200 p-4">
                <div>
                  <p className="text-sm text-slate-500">Số tiền cần thanh toán</p>
                  <p className="text-3xl font-bold text-slate-950">{formatMoney(checkout.amount)}</p>
                </div>
                {isPaid && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                    <BadgeCheck className="h-4 w-4" />
                    Đã thanh toán
                  </div>
                )}
              </div>

              {!isPaid && !clientReady && (
                <button
                  type="button"
                  onClick={handleCreatePayment}
                  disabled={loading}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-400"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                  Thanh toán online
                </button>
              )}

              {!isPaid && clientReady && !publishableKey && (
                <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                  Thiếu VITE_STRIPE_PUBLISHABLE_KEY ở frontend.
                </div>
              )}

              {!isPaid && canPay && stripePromise && stripeOptions && (
                <Elements stripe={stripePromise} options={stripeOptions}>
                  <CheckoutForm checkout={checkout} onPaid={setCheckout} onError={setError} />
                </Elements>
              )}

              {isPaid && (
                <div className="rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                  Bạn đã thanh toán {formatMoney(checkout.paidAmount || checkout.amount)}. Khi ra cổng, vui lòng trả lại thẻ cho nhân viên.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
