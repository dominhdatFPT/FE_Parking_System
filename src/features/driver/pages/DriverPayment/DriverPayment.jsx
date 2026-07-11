import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { apiClient } from '../../../../services/apiClient';
import { API_ENDPOINTS } from '../../../../services/endpoints';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { vietnamDayjs } from '../../../../utils/dateTime';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function unwrap(response) {
  return response?.data?.data ?? response?.data;
}

function StripeSubscriptionForm({ plan, onPaid, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements || !plan.clientSecret) return;
    setPaying(true);
    onError('');
    try {
      const result = await stripe.confirmCardPayment(plan.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        onError(result.error.message || 'Thanh toán không thành công');
        return;
      }

      if (result.paymentIntent?.status === 'succeeded') {
        await apiClient.post(API_ENDPOINTS.PAYMENTS.STRIPE_ORDER_CONFIRM(result.paymentIntent.id));
        onPaid(plan);
      }
    } catch (error) {
      onError(error?.response?.data?.message || error.message || 'Không thể xác nhận thanh toán');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="mt-3 space-y-3">
      <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <Button
        variant="primary"
        size="sm"
        loading={paying}
        disabled={!stripe || paying}
        onClick={handlePay}
      >
        {paying ? 'Đang thanh toán...' : 'Thanh toán bằng thẻ'}
      </Button>
    </div>
  );
}

export default function DriverPayment() {
  const { t } = useTranslation();
  const [subscriptionInvoices, setSubscriptionInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingFeePlans, setPendingFeePlans] = useState([]);
  const [creatingPaymentId, setCreatingPaymentId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchInvoices = async () => {
    const response = await apiClient.get(API_ENDPOINTS.FEE.MY_INVOICES);
    setSubscriptionInvoices(response.data?.data ?? []);
  };

  useEffect(() => {
    const raw = localStorage.getItem('pending_fee_plan_request');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.subscriptionId && parsed.paymentIntentId && parsed.clientSecret) {
          setPendingFeePlans([parsed]);
        } else {
          localStorage.removeItem('pending_fee_plan_request');
        }
      } catch {
        localStorage.removeItem('pending_fee_plan_request');
      }
    }

    let cancelled = false;
    fetchInvoices()
      .catch(() => {
        if (!cancelled) setSubscriptionInvoices([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handlePlanPaid = async (plan) => {
    localStorage.removeItem('pending_fee_plan_request');
    setPendingFeePlans((current) => current.filter((item) => item.paymentIntentId !== plan.paymentIntentId));
    await fetchInvoices();
  };

  const handleCreateInvoicePayment = async (invoice) => {
    setCreatingPaymentId(invoice.id);
    setErrorMessage('');
    try {
      const response = await apiClient.post(API_ENDPOINTS.FEE.INVOICE_STRIPE(invoice.id));
      const result = unwrap(response);
      const pendingPlan = {
        subscriptionId: result.subscriptionId ?? invoice.subscriptionId,
        invoiceId: result.invoiceId ?? invoice.id,
        paymentIntentId: result.paymentIntentId,
        clientSecret: result.clientSecret,
        currency: result.currency,
        licensePlate: invoice.licensePlate,
        planName: invoice.planName,
        amount: result.amount ?? invoice.amount,
      };
      setPendingFeePlans((current) => [
        pendingPlan,
        ...current.filter((item) => item.invoiceId !== pendingPlan.invoiceId),
      ]);
      await fetchInvoices();
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || 'Khong the tao phien thanh toan cho hoa don nay');
    } finally {
      setCreatingPaymentId(null);
    }
  };

  const totalPaid = subscriptionInvoices
    .filter((invoice) => invoice.status === 'SUCCESS')
    .reduce((sum, invoice) => sum + Number(invoice.amount), 0);
  const totalFailed = subscriptionInvoices
    .filter((invoice) => invoice.status === 'FAILED')
    .reduce((sum, invoice) => sum + Number(invoice.amount), 0);

  return (
    <div className="space-y-6">
      <PageHeader title={t('payment.title')} subtitle="Thanh toán và theo dõi hóa đơn gói thẻ xe" icon="payments" />

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Tổng giao dịch" value={subscriptionInvoices.length} />
        <SummaryCard label="Đã thanh toán" value={`${totalPaid.toLocaleString('vi-VN')} VNĐ`} tone="text-emerald-600" />
        <SummaryCard label="Thanh toán lỗi" value={`${totalFailed.toLocaleString('vi-VN')} VNĐ`} tone="text-red-500" />
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      {pendingFeePlans.length > 0 && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h3 className="text-sm font-bold text-slate-800">Gói đang chờ thanh toán Stripe</h3>
          <div className="mt-3 space-y-3">
            {pendingFeePlans.map((plan) => {
              const stripeOptions = plan.clientSecret ? { clientSecret: plan.clientSecret } : undefined;
              return (
                <div
                  key={plan.paymentIntentId || plan.subscriptionId || plan.invoiceId}
                  className="rounded-xl border border-slate-100 bg-white p-4"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="font-bold text-slate-800">
                        {plan.planName || 'Gói thẻ xe'} - {plan.licensePlate || 'Chưa có biển số'}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">Thanh toán qua Stripe</p>
                    </div>
                    <p className="font-black text-indigo-600">
                      {Number(plan.amount || 0).toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                  {!publishableKey && (
                    <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                      Thiếu VITE_STRIPE_PUBLISHABLE_KEY ở frontend.
                    </p>
                  )}
                  {publishableKey && stripePromise && stripeOptions && (
                    <Elements stripe={stripePromise} options={stripeOptions}>
                      <StripeSubscriptionForm plan={plan} onPaid={handlePlanPaid} onError={setErrorMessage} />
                    </Elements>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-3 text-sm font-bold text-slate-800">Lịch sử thanh toán thẻ xe</h3>
        {loading ? (
          <div className="h-20 animate-pulse rounded-2xl bg-white" />
        ) : subscriptionInvoices.length === 0 ? (
          <EmptyState icon="sell" title="Chưa có giao dịch" description="Các giao dịch mua biểu phí sẽ hiển thị tại đây." />
        ) : (
          <PaymentTable
            invoices={subscriptionInvoices}
            t={t}
            onPay={handleCreateInvoicePayment}
            creatingPaymentId={creatingPaymentId}
          />
        )}
      </section>
    </div>
  );
}

function PaymentTable({ invoices, t, onPay, creatingPaymentId }) {
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
            <th className="px-5 py-3 text-right">Thao tác</th>
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
              <td className="px-5 py-3 text-indigo-600">
                {invoice.stripePaymentIntentId ? 'Stripe' : '--'}
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={invoice.status === 'SUCCESS' ? 'PAID' : invoice.status} />
              </td>
              <td className="px-5 py-3 text-slate-400">
                {invoice.createdAt ? vietnamDayjs(invoice.createdAt).format('DD/MM/YYYY HH:mm') : '--'}
              </td>
              <td className="px-5 py-3 text-right">
                {(invoice.payable || (invoice.status === 'PENDING' && invoice.subscriptionStatus === 'PENDING_PAYMENT')) ? (
                  <button
                    type="button"
                    disabled={creatingPaymentId === invoice.id}
                    onClick={() => onPay(invoice)}
                    className="inline-flex h-9 items-center justify-center rounded-xl bg-indigo-600 px-3 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {creatingPaymentId === invoice.id ? 'Đang tạo...' : 'Thanh toán'}
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-slate-300">--</span>
                )}
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
