import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
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
  const [success, setSuccess] = useState(null);
  const [pendingFeePlan, setPendingFeePlan] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrStatus, setQrStatus] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('pending_fee_plan_request');
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (!parsed.subscriptionId) {
        localStorage.removeItem('pending_fee_plan_request');
        return;
      }

      apiClient.get(API_ENDPOINTS.FEE.MY_SUBSCRIPTIONS)
        .then((response) => {
          const subscriptions = response.data?.data ?? [];
          const subscription = subscriptions.find((item) => item.id === parsed.subscriptionId);
          if (subscription?.status === 'PENDING_PAYMENT') {
            setPendingFeePlan(parsed);
          } else {
            localStorage.removeItem('pending_fee_plan_request');
          }
        })
        .catch(() => setPendingFeePlan(parsed));
    } catch {
      localStorage.removeItem('pending_fee_plan_request');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    apiClient.get(API_ENDPOINTS.FEE.MY_INVOICES)
      .then((response) => {
        if (!cancelled) setSubscriptionInvoices(response.data?.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setSubscriptionInvoices([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!showQrModal || !pendingFeePlan?.momoOrderId) return undefined;

    let cancelled = false;
    setQrStatus('PENDING');

    const poll = async () => {
      if (cancelled) return;
      try {
        const response = await apiClient.get(API_ENDPOINTS.PAYMENTS.MOMO_ORDER_STATUS(pendingFeePlan.momoOrderId));
        const status = response.data?.paymentStatus ?? response.data?.data?.paymentStatus;
        if (cancelled) return;

        if (status === 'PAID') {
          setQrStatus('PAID');
          setSuccess({
            id: pendingFeePlan.subscriptionId,
            amount: Number(pendingFeePlan.amount),
            status: 'PAID',
          });
          setShowQrModal(false);
          setPendingFeePlan(null);
          localStorage.removeItem('pending_fee_plan_request');
          return;
        }
        if (status === 'CANCELLED') {
          setQrStatus('CANCELLED');
          return;
        }
      } catch {
        // Tiếp tục kiểm tra khi kết nối tạm thời gián đoạn.
      }
      if (!cancelled) window.setTimeout(poll, 5000);
    };

    poll();
    return () => { cancelled = true; };
  }, [showQrModal, pendingFeePlan]);

  const handlePayFeePlan = (plan) => {
    if (plan.payUrl) {
      window.location.href = plan.payUrl;
      return;
    }
    setQrStatus(null);
    setShowQrModal(true);
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

      {success && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
          <span className="material-symbols-outlined">check_circle</span>
          Thanh toán thành công #{success.id} - {success.amount.toLocaleString('vi-VN')} VNĐ
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Tổng giao dịch" value={subscriptionInvoices.length} />
        <SummaryCard label="Đã thanh toán" value={`${totalPaid.toLocaleString('vi-VN')} VNĐ`} tone="text-emerald-600" />
        <SummaryCard label="Thanh toán lỗi" value={`${totalFailed.toLocaleString('vi-VN')} VNĐ`} tone="text-red-500" />
      </div>

      {pendingFeePlan && (
        <section className="rounded-2xl border border-sky-100 bg-sky-50/30 p-5">
          <h3 className="text-sm font-bold text-slate-800">Gói đang chờ thanh toán</h3>
          <div className="mt-3 flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-bold text-slate-800">{pendingFeePlan.planName || 'Gói thẻ xe'} · {pendingFeePlan.licensePlate}</p>
              <p className="mt-1 text-xs text-slate-500">
                {pendingFeePlan.durationMonths || pendingFeePlan.selectedPlan} tháng
                {pendingFeePlan.startDate ? ` · Bắt đầu ${dayjs(pendingFeePlan.startDate).format('DD/MM/YYYY')}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-black text-sky-600">{Number(pendingFeePlan.amount).toLocaleString('vi-VN')} đ</p>
              <Button variant="primary" size="sm" icon="qr_code" onClick={() => handlePayFeePlan(pendingFeePlan)}>
                Thanh toán
              </Button>
            </div>
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
          <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Hóa đơn</th>
                  <th className="px-5 py-3">Biển số / Gói</th>
                  <th className="px-5 py-3">Số tiền</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3">Ngày</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {subscriptionInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-5 py-3 font-bold">#{invoice.id}</td>
                    <td className="px-5 py-3">
                      <p className="font-semibold">{invoice.licensePlate}</p>
                      <p className="text-xs text-slate-400">{invoice.planName}</p>
                    </td>
                    <td className="px-5 py-3 font-bold">{Number(invoice.amount).toLocaleString('vi-VN')} VNĐ</td>
                    <td className="px-5 py-3"><StatusBadge status={invoice.status === 'SUCCESS' ? 'PAID' : invoice.status} /></td>
                    <td className="px-5 py-3 text-slate-400">{vietnamDayjs(invoice.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showQrModal && pendingFeePlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowQrModal(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Thanh toán MoMo</h3>
              <button type="button" onClick={() => setShowQrModal(false)} className="material-symbols-outlined">close</button>
            </div>
            <div className="mt-4 flex flex-col items-center rounded-2xl bg-slate-50 p-4">
              {pendingFeePlan.qrCodeData ? (
                <img src={pendingFeePlan.qrCodeData} alt="QR MoMo" className="h-60 w-60 rounded-xl" />
              ) : (
                <span className="material-symbols-outlined text-[100px] text-slate-300">qr_code_2</span>
              )}
              <p className="mt-2 text-xs text-slate-500">
                {qrStatus === 'CANCELLED' ? 'Đơn hàng đã hết hạn' : 'Đang chờ thanh toán...'}
              </p>
            </div>
          </div>
        </div>
      )}
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
