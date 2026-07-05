import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { apiClient } from '../../../../services/apiClient';
import { API_ENDPOINTS } from '../../../../services/endpoints';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { vietnamDayjs } from '../../../../utils/dateTime';
import StripeCheckoutModal from '../../../../components/stripe/StripeCheckoutModal';

export default function DriverPayment() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [subscriptionInvoices, setSubscriptionInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successPiId, setSuccessPiId] = useState(null);

  // ── Gói chờ chọn phương thức (từ DriverFeePlans, chưa gọi API) ─────────
  const [pendingSelection, setPendingSelection] = useState(null);
  const [processingMethod, setProcessingMethod] = useState(''); // 'stripe' | 'vnpay' | ''

  // ── VNPay pending (đã tạo đơn, chờ redirect) ───────────────────────────
  const [pendingFeePlans, setPendingFeePlans] = useState([]);
  const [redirecting, setRedirecting] = useState(false);

  // ── Stripe pending (đã tạo PaymentIntent, chờ nhập thẻ) ───────────────
  const [pendingStripePlan, setPendingStripePlan] = useState(null);
  const [stripeModal, setStripeModal] = useState({
    open: false, clientSecret: '', paymentIntentId: '', planName: '', amount: 0, currency: 'vnd',
  });

  // Đọc pending_plan_selection (gói mới từ DriverFeePlans, chưa chọn phương thức)
  useEffect(() => {
    const raw = localStorage.getItem('pending_plan_selection');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.vehicleId && parsed.planId) setPendingSelection(parsed);
      else localStorage.removeItem('pending_plan_selection');
    } catch {
      localStorage.removeItem('pending_plan_selection');
    }
  }, []);

  // Đọc pending_stripe_request (đã tạo PaymentIntent nhưng chưa thanh toán)
  useEffect(() => {
    const raw = localStorage.getItem('pending_stripe_request');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.clientSecret || !parsed.paymentIntentId) {
        localStorage.removeItem('pending_stripe_request');
        return;
      }
      apiClient.get(API_ENDPOINTS.PAYMENTS.STRIPE_ORDER_STATUS(parsed.paymentIntentId))
        .then(res => {
          if (res.data?.data?.status === 'PENDING') setPendingStripePlan(parsed);
          else localStorage.removeItem('pending_stripe_request');
        })
        .catch(() => setPendingStripePlan(parsed));
    } catch {
      localStorage.removeItem('pending_stripe_request');
    }
  }, []);

  // Đọc pending_fee_plan_request (VNPay đã tạo link, chờ redirect)
  useEffect(() => {
    const raw = localStorage.getItem('pending_fee_plan_request');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.subscriptionId || !parsed.paymentUrl) {
        localStorage.removeItem('pending_fee_plan_request');
        return;
      }
      apiClient.get(API_ENDPOINTS.FEE.MY_SUBSCRIPTIONS)
        .then((response) => {
          const subs = response.data?.data ?? [];
          const sub = subs.find(s => s.id === parsed.subscriptionId);
          if (sub?.status === 'PENDING_PAYMENT') {
            setPendingFeePlans(cur => {
              const key = parsed.vnpTxnRef || parsed.subscriptionId;
              return [parsed, ...cur.filter(i => (i.vnpTxnRef || i.subscriptionId) !== key)];
            });
          } else {
            localStorage.removeItem('pending_fee_plan_request');
          }
        })
        .catch(() => setPendingFeePlans(cur => {
          const key = parsed.vnpTxnRef || parsed.subscriptionId;
          return [parsed, ...cur.filter(i => (i.vnpTxnRef || i.subscriptionId) !== key)];
        }));
    } catch {
      localStorage.removeItem('pending_fee_plan_request');
    }
  }, []);

  // Tải lịch sử hóa đơn + cập nhật danh sách VNPay pending từ DB
  const fetchInvoices = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    apiClient.get(API_ENDPOINTS.FEE.MY_INVOICES)
      .then(async (response) => {
        const invoices = response.data?.data ?? [];
        if (!cancelled) setSubscriptionInvoices(invoices);

        const pendingVnp = invoices.filter(inv => inv.status === 'PENDING' && inv.vnpTxnRef);
        const plans = await Promise.all(pendingVnp.map(async inv => {
          try {
            const r = await apiClient.get(API_ENDPOINTS.PAYMENTS.VNPAY_ORDER_STATUS(inv.vnpTxnRef));
            const order = r.data?.data ?? r.data;
            if (order?.status !== 'PENDING' || !order?.paymentUrl) return null;
            return { invoiceId: inv.id, vnpTxnRef: inv.vnpTxnRef, paymentUrl: order.paymentUrl, expiredAt: order.expiredAt, licensePlate: inv.licensePlate, planName: inv.planName, amount: inv.amount };
          } catch { return null; }
        }));

        if (!cancelled) {
          setPendingFeePlans(cur => {
            const merged = [...cur];
            plans.filter(Boolean).forEach(p => {
              const idx = merged.findIndex(i => i.vnpTxnRef === p.vnpTxnRef);
              if (idx >= 0) merged[idx] = { ...merged[idx], ...p };
              else merged.push(p);
            });
            return merged.filter(p => p.paymentUrl);
          });
        }
      })
      .catch(() => { if (!cancelled) setSubscriptionInvoices([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  // Đọc ?status=success&piId=... sau khi Stripe redirect về
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('status') === 'success' && params.get('piId')) {
      setSuccessPiId(params.get('piId'));
      // Xóa query params khỏi URL (không reload trang)
      navigate(location.pathname, { replace: true });
      // Reload hóa đơn để hiển thị giao dịch mới
      fetchInvoices();
    }
  }, [location.search, location.pathname, navigate, fetchInvoices]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  // User chọn Stripe → gọi register-stripe → mở modal thẻ
  const handlePayWithStripe = async () => {
    if (!pendingSelection) return;
    setProcessingMethod('stripe');
    try {
      const res = await apiClient.post(API_ENDPOINTS.SUBSCRIPTIONS.REGISTER_STRIPE, {
        vehicleId: pendingSelection.vehicleId,
        planId: pendingSelection.planId,
        autoRenew: false,
      });
      const result = res.data?.data ?? res.data;
      localStorage.removeItem('pending_plan_selection');
      localStorage.setItem('pending_stripe_request', JSON.stringify({
        subscriptionId: result.subscriptionId,
        invoiceId: result.invoiceId,
        paymentIntentId: result.paymentIntentId,
        clientSecret: result.clientSecret,
        amount: result.amount,
        currency: result.currency,
        licensePlate: pendingSelection.licensePlate,
        planName: pendingSelection.planName,
        durationMonths: pendingSelection.durationMonths,
      }));
      setPendingSelection(null);
      setStripeModal({
        open: true,
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
        planName: pendingSelection.planName,
        amount: result.amount,
        currency: result.currency,
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể khởi tạo thanh toán Stripe');
    } finally {
      setProcessingMethod('');
    }
  };

  // User chọn VNPay → gọi register → redirect
  const handlePayWithVNPay = async () => {
    if (!pendingSelection) return;
    setProcessingMethod('vnpay');
    try {
      const res = await apiClient.post(API_ENDPOINTS.FEE.REGISTER, {
        vehicleId: pendingSelection.vehicleId,
        planId: pendingSelection.planId,
        autoRenew: false,
      });
      const result = res.data?.data ?? res.data;
      localStorage.removeItem('pending_plan_selection');
      localStorage.setItem('pending_fee_plan_request', JSON.stringify({
        subscriptionId: result.subscriptionId,
        invoiceId: result.invoiceId,
        vnpTxnRef: result.vnpTxnRef,
        paymentUrl: result.paymentUrl,
        expiredAt: result.expiredAt,
        licensePlate: pendingSelection.licensePlate,
        planName: pendingSelection.planName,
        durationMonths: pendingSelection.durationMonths,
        amount: pendingSelection.amount,
      }));
      setRedirecting(true);
      window.location.href = result.paymentUrl;
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể khởi tạo thanh toán VNPay');
      setProcessingMethod('');
    }
  };

  const handlePayVNPayPending = (plan) => {
    if (!plan.paymentUrl) return;
    setRedirecting(true);
    window.location.href = plan.paymentUrl;
  };

  const totalPaid = subscriptionInvoices
    .filter(inv => inv.status === 'SUCCESS')
    .reduce((sum, inv) => sum + Number(inv.amount), 0);
  const totalFailed = subscriptionInvoices
    .filter(inv => inv.status === 'FAILED')
    .reduce((sum, inv) => sum + Number(inv.amount), 0);

  return (
    <div className="space-y-6">
      <PageHeader title={t('payment.title')} subtitle="Thanh toán và theo dõi hóa đơn gói thẻ xe" icon="payments" />

      {/* Banner thanh toán Stripe thành công */}
      {successPiId && (
        <div className="flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
            <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-emerald-800">Thanh toán Stripe thành công!</p>
            <p className="mt-0.5 text-xs text-emerald-600">
              Gói thẻ xe đã được kích hoạt. Mã giao dịch: <span className="font-mono font-bold">{successPiId}</span>
            </p>
          </div>
          <button
            onClick={() => setSuccessPiId(null)}
            className="text-emerald-400 hover:text-emerald-600 transition text-lg leading-none"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Tổng giao dịch" value={subscriptionInvoices.length} />
        <SummaryCard label="Đã thanh toán" value={`${totalPaid.toLocaleString('vi-VN')} VNĐ`} tone="text-emerald-600" />
        <SummaryCard label="Thanh toán lỗi" value={`${totalFailed.toLocaleString('vi-VN')} VNĐ`} tone="text-red-500" />
      </div>

      {/* ── Chờ chọn phương thức thanh toán (từ DriverFeePlans) ──────────── */}
      {pendingSelection && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Chọn phương thức thanh toán</h3>
          <p className="text-xs text-slate-500 mb-5">
            {pendingSelection.planName} · {pendingSelection.licensePlate} ·{' '}
            <span className="font-bold text-slate-700">
              {Number(pendingSelection.amount || 0).toLocaleString('vi-VN')} đ
            </span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nút Stripe */}
            <button
              onClick={handlePayWithStripe}
              disabled={!!processingMethod}
              className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-indigo-100 bg-indigo-50/40 p-6 text-center transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Logo Stripe */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#635bff] shadow-lg shadow-indigo-500/30">
                <svg viewBox="0 0 60 25" className="h-5 w-auto fill-white">
                  <path d="M0 6.402C0 2.916 2.976 0 6.6 0h46.8C57.024 0 60 2.916 60 6.402v12.196C60 22.084 57.024 25 53.4 25H6.6C2.976 25 0 22.084 0 18.598V6.402zM27.6 7c-1.92 0-3.12 1.008-3.12 2.52v.288h-1.8V7.06h-2.04v10.88h2.04v-4.512c0-1.464.816-2.208 2.064-2.208.384 0 .72.048.984.12V9.268A4.46 4.46 0 0027.6 7zm4.476 11.16c1.176 0 2.04-.456 2.568-1.152l.048 1.008h1.824V11.98c0-3.12-1.872-4.98-4.92-4.98-1.896 0-3.48.72-4.44 1.704l1.056 1.368c.792-.768 1.8-1.2 3.072-1.2 1.56 0 2.28.792 2.28 2.016v.384c-.576-.12-1.224-.192-1.896-.192-2.472 0-4.2 1.008-4.2 3.12 0 1.92 1.44 3.096 3.504 3.096l.104-.136zm.168-1.608c-.912 0-1.68-.384-1.68-1.272 0-.936.864-1.392 2.208-1.392.504 0 1.032.072 1.464.192v.552c0 1.056-.888 1.92-1.992 1.92z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">Thẻ quốc tế (Stripe)</p>
                <p className="text-xs text-slate-500 mt-0.5">Visa, Mastercard · Thanh toán ngay trên trang</p>
              </div>
              {processingMethod === 'stripe' && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/70">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                </div>
              )}
            </button>

            {/* Nút VNPay */}
            <button
              onClick={handlePayWithVNPay}
              disabled={!!processingMethod}
              className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-sky-100 bg-sky-50/40 p-6 text-center transition-all duration-200 hover:border-sky-400 hover:bg-sky-50 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0EA5E9] shadow-lg shadow-sky-500/30">
                <span className="text-xs font-black text-white tracking-tight">VNPay</span>
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">VNPay</p>
                <p className="text-xs text-slate-500 mt-0.5">ATM, QR Code · Chuyển sang cổng VNPay</p>
              </div>
              {processingMethod === 'vnpay' && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/70">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600" />
                </div>
              )}
            </button>
          </div>

          <button
            onClick={() => { localStorage.removeItem('pending_plan_selection'); setPendingSelection(null); }}
            className="mt-4 text-xs text-slate-400 hover:text-slate-600 transition"
          >
            Hủy bỏ
          </button>
        </section>
      )}

      {/* ── Stripe pending (đã tạo PaymentIntent, chưa nhập thẻ) ─────────── */}
      {pendingStripePlan && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5">
          <h3 className="text-sm font-bold text-slate-800">Gói đang chờ thanh toán Stripe</h3>
          <div className="mt-3 flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-bold text-slate-800">
                {pendingStripePlan.planName || 'Gói thẻ xe'} · {pendingStripePlan.licensePlate || '--'}
              </p>
              <p className="mt-1 text-xs text-slate-500">Thanh toán qua Stripe · Nhấn để tiếp tục nhập thẻ</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-black text-indigo-600">
                {Number(pendingStripePlan.amount || 0).toLocaleString('vi-VN')} đ
              </p>
              <button
                onClick={() => setStripeModal({ open: true, clientSecret: pendingStripePlan.clientSecret, paymentIntentId: pendingStripePlan.paymentIntentId, planName: pendingStripePlan.planName, amount: pendingStripePlan.amount, currency: pendingStripePlan.currency || 'vnd' })}
                className="rounded-xl bg-[#635bff] hover:bg-[#5851ea] px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition active:scale-95"
              >
                Tiếp tục thanh toán
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── VNPay pending (đã tạo link, chờ redirect) ────────────────────── */}
      {pendingFeePlans.length > 0 && (
        <section className="rounded-2xl border border-sky-100 bg-sky-50/30 p-5">
          <h3 className="text-sm font-bold text-slate-800">Gói đang chờ thanh toán VNPay</h3>
          <div className="mt-3 space-y-3">
            {pendingFeePlans.map((plan) => (
              <div
                key={plan.vnpTxnRef || plan.subscriptionId || plan.invoiceId}
                className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-bold text-slate-800">
                    {plan.planName || 'Gói thẻ xe'} · {plan.licensePlate || '--'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    VNPay{plan.expiredAt ? ` · Hết hạn: ${vietnamDayjs(plan.expiredAt).format('DD/MM/YYYY HH:mm')}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-black text-sky-600">
                    {Number(plan.amount || 0).toLocaleString('vi-VN')} đ
                  </p>
                  <Button
                    variant="primary" size="sm" icon="open_in_new"
                    loading={redirecting} disabled={redirecting}
                    onClick={() => handlePayVNPayPending(plan)}
                  >
                    {redirecting ? 'Đang chuyển...' : 'Thanh toán ngay'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">Bạn sẽ được chuyển sang VNPay và quay lại hệ thống sau khi hoàn tất.</p>
        </section>
      )}

      {/* ── Lịch sử hóa đơn ─────────────────────────────────────────────── */}
      <section>
        <h3 className="mb-3 text-sm font-bold text-slate-800">Lịch sử thanh toán thẻ xe</h3>
        {loading ? (
          <div className="h-20 animate-pulse rounded-2xl bg-white" />
        ) : subscriptionInvoices.length === 0 ? (
          <EmptyState icon="sell" title="Chưa có giao dịch" description="Các giao dịch mua biểu phí sẽ hiển thị tại đây." />
        ) : (
          <PaymentTable invoices={subscriptionInvoices} t={t} />
        )}
      </section>

      {/* ── Stripe modal ─────────────────────────────────────────────────── */}
      <StripeCheckoutModal
        isOpen={stripeModal.open}
        clientSecret={stripeModal.clientSecret}
        paymentIntentId={stripeModal.paymentIntentId}
        planName={stripeModal.planName}
        amount={stripeModal.amount}
        currency={stripeModal.currency}
        onClose={() => setStripeModal(s => ({ ...s, open: false }))}
      />
    </div>
  );
}

function PaymentTable({ invoices, t }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-5 py-3">Hóa đơn</th>
            <th className="px-5 py-3">Biển số / Gói</th>
            <th className="px-5 py-3">{t('payment.amount')}</th>
            <th className="px-5 py-3">{t('payment.method')}</th>
            <th className="px-5 py-3">{t('payment.status')}</th>
            <th className="px-5 py-3">{t('payment.date')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="px-5 py-3 font-bold">#{invoice.id}</td>
              <td className="px-5 py-3">
                <p className="font-semibold">{invoice.licensePlate || '--'}</p>
                <p className="text-xs text-slate-400">{invoice.planName || '--'}</p>
              </td>
              <td className="px-5 py-3 font-bold">{Number(invoice.amount || 0).toLocaleString('vi-VN')} VNĐ</td>
              <td className="px-5 py-3">
                {invoice.stripePaymentIntentId
                  ? <span className="font-semibold text-indigo-600">Stripe</span>
                  : <span className="font-semibold text-blue-600">VNPay</span>
                }
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={invoice.status === 'SUCCESS' ? 'PAID' : invoice.status} />
              </td>
              <td className="px-5 py-3 text-slate-400">
                {invoice.createdAt ? vietnamDayjs(invoice.createdAt).format('DD/MM/YYYY HH:mm') : '--'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SummaryCard({ label, value, tone = 'text-slate-800' }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}
