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
  const [pendingFeePlan, setPendingFeePlan] = useState(null);
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
  }, [showQrModal, pendingFeePlan?.momoOrderId, pendingFeePlan?.subscriptionId, pendingFeePlan?.amount]);

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

      {pendingFeePlan && (
        <section className="rounded-2xl border border-sky-100 bg-sky-50/30 p-5">
          <h3 className="text-sm font-bold text-slate-800">Gói đang chờ thanh toán VNPay</h3>
          <div className="mt-3 flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-bold text-slate-800">
                {pendingFeePlan.planName || 'Gói thẻ xe'} · {pendingFeePlan.licensePlate}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {pendingFeePlan.durationMonths} tháng · Thanh toán qua VNPay
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-black text-sky-600">
                {Number(pendingFeePlan.amount).toLocaleString('vi-VN')} đ
              </p>
              <Button
                variant="primary"
                size="sm"
                icon="open_in_new"
                loading={redirecting}
                disabled={redirecting}
                onClick={() => handlePayFeePlan(pendingFeePlan)}
              >
                {redirecting ? 'Đang chuyển...' : 'Thanh toán ngay'}
              </Button>
            </div>
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
          <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Hóa đơn</th>
                  <th className="px-5 py-3">Biển số / Gói</th>
                  <th className="px-5 py-3">Số tiền</th>
                  <th className="px-5 py-3">Phương thức</th>
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
                    <td className="px-5 py-3 text-blue-600">VNPay</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={invoice.status === 'SUCCESS' ? 'PAID' : invoice.status} />
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      {vietnamDayjs(invoice.createdAt).format('DD/MM/YYYY HH:mm')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lịch sử thanh toán thẻ tháng */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sm">
            <span className="material-symbols-outlined text-[16px]">sell</span>
          </span>
          Lịch sử thanh toán thẻ tháng
        </h3>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-white shadow-sm" />
            ))}
          </div>
        ) : subscriptionInvoices.length === 0 ? (
          <EmptyState icon="sell" title="Chưa có giao dịch thẻ tháng" description="Các giao dịch đăng ký gói thẻ tháng sẽ hiển thị tại đây." />
        ) : (
          <div className="rounded-2xl border border-slate-100/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Hoá đơn</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Biển số / Gói</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">{t('payment.amount')}</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">{t('payment.method')}</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">{t('payment.status')}</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">{t('payment.date')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {subscriptionInvoices.map((inv) => (
                    <tr key={inv.id} className="transition hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 font-bold text-slate-700">#{inv.id}</td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-700 text-xs">{inv.licensePlate}</p>
                        <p className="text-[10px] text-slate-400">{inv.planName}</p>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">{Number(inv.amount).toLocaleString('vi-VN')} VNĐ</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-pink-50 px-2 py-0.5 text-xs font-medium text-pink-600">
                          MoMo
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={inv.status === 'SUCCESS' ? 'PAID' : inv.status} />
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">{dayjs(inv.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">{t('payment.paymentFor')}</h3>
              <Button variant="ghost" size="icon-sm" icon="close" onClick={() => setShowModal(false)} />
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 space-y-2 ring-1 ring-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{t('payment.bookingId')}</span>
                <span className="font-bold text-slate-800">#{selectedBooking.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{t('booking.parkingLot')}</span>
                <span className="font-semibold text-slate-700">{selectedBooking.parkingAreaName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{t('payment.amount')}</span>
                <span className="font-bold text-sky-600">{(selectedBooking.vehicleType === 'MOTORBIKE' ? 15000 : 30000).toLocaleString('vi-VN')} VNĐ</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-slate-500">{t('payment.selectMethod')}</p>
              <div className="grid grid-cols-3 gap-2">
                {['MoMo', 'VNPay', 'ZaloPay'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`rounded-xl border-2 p-3 text-center text-sm font-semibold transition-all ${
                      paymentMethod === m ? 'border-sky-500 bg-sky-50 text-sky-600' : 'border-slate-200 text-slate-500 hover:border-sky-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon="payment"
              loading={processing}
              disabled={processing}
              onClick={handleConfirmPayment}
              className="mt-6 w-full justify-center"
            >
              {t('payment.confirmPayment')}
            </Button>
          </div>
        </div>
      )}

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
