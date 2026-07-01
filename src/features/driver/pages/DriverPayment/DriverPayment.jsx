import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../../../services/apiClient';
import { API_ENDPOINTS } from '../../../../services/endpoints';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { vietnamDayjs } from '../../../../utils/dateTime';

export default function DriverPayment() {
  const { t } = useTranslation();
  const [subscriptionInvoices, setSubscriptionInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingFeePlans, setPendingFeePlans] = useState([]);
  const [redirecting, setRedirecting] = useState(false);

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
          const subscriptions = response.data?.data ?? [];
          const subscription = subscriptions.find((item) => item.id === parsed.subscriptionId);
          if (subscription?.status === 'PENDING_PAYMENT') {
            setPendingFeePlans((current) => {
              const key = parsed.vnpTxnRef || parsed.subscriptionId;
              const withoutDuplicate = current.filter((item) => (item.vnpTxnRef || item.subscriptionId) !== key);
              return [parsed, ...withoutDuplicate];
            });
          } else {
            localStorage.removeItem('pending_fee_plan_request');
          }
        })
        .catch(() => {
          setPendingFeePlans((current) => {
            const key = parsed.vnpTxnRef || parsed.subscriptionId;
            const withoutDuplicate = current.filter((item) => (item.vnpTxnRef || item.subscriptionId) !== key);
            return [parsed, ...withoutDuplicate];
          });
        });
    } catch {
      localStorage.removeItem('pending_fee_plan_request');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    apiClient.get(API_ENDPOINTS.FEE.MY_INVOICES)
      .then(async (response) => {
        const invoices = response.data?.data ?? [];
        if (!cancelled) setSubscriptionInvoices(invoices);

        const pendingInvoices = invoices.filter((invoice) => invoice.status === 'PENDING' && invoice.vnpTxnRef);
        const pendingPlans = await Promise.all(pendingInvoices.map(async (invoice) => {
          try {
            const orderResponse = await apiClient.get(API_ENDPOINTS.PAYMENTS.VNPAY_ORDER_STATUS(invoice.vnpTxnRef));
            const order = orderResponse.data?.data ?? orderResponse.data;
            if (order?.status !== 'PENDING' || !order?.paymentUrl) return null;
            return {
              invoiceId: invoice.id,
              vnpTxnRef: invoice.vnpTxnRef,
              paymentUrl: order.paymentUrl,
              expiredAt: order.expiredAt,
              licensePlate: invoice.licensePlate,
              planName: invoice.planName,
              amount: invoice.amount,
            };
          } catch {
            return null;
          }
        }));

        if (!cancelled) {
          setPendingFeePlans((current) => {
            const merged = [...current];
            pendingPlans.filter(Boolean).forEach((plan) => {
              const existingIndex = merged.findIndex((item) => item.vnpTxnRef === plan.vnpTxnRef);
              if (existingIndex >= 0) {
                merged[existingIndex] = { ...merged[existingIndex], ...plan };
              } else {
                merged.push(plan);
              }
            });
            return merged.filter((plan) => plan.paymentUrl);
          });
        }
      })
      .catch(() => {
        if (!cancelled) setSubscriptionInvoices([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handlePayFeePlan = (plan) => {
    if (!plan.paymentUrl) return;
    setRedirecting(true);
    window.location.href = plan.paymentUrl;
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
                    {plan.planName || 'Gói thẻ xe'} - {plan.licensePlate || 'Chưa có biển số'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Thanh toán qua VNPay{plan.expiredAt ? ` - Hết hạn: ${vietnamDayjs(plan.expiredAt).format('DD/MM/YYYY HH:mm')}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-black text-sky-600">
                    {Number(plan.amount || 0).toLocaleString('vi-VN')} đ
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    icon="open_in_new"
                    loading={redirecting}
                    disabled={redirecting}
                    onClick={() => handlePayFeePlan(plan)}
                  >
                    {redirecting ? 'Đang chuyển...' : 'Thanh toán ngay'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Bạn sẽ được chuyển sang VNPay và quay lại hệ thống sau khi hoàn tất.
          </p>
        </section>
      )}

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
              <td className="px-5 py-3 text-blue-600">VNPay</td>
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
