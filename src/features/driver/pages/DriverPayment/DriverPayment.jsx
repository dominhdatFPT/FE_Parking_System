import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { bookingService } from '../../../../services/bookingService';
import { apiClient } from '../../../../services/apiClient';
import { API_ENDPOINTS } from '../../../../services/endpoints';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

export default function DriverPayment() {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [subscriptionInvoices, setSubscriptionInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('MoMo');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(null);
  const [pendingFeePlan, setPendingFeePlan] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrStatus, setQrStatus] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('pending_fee_plan_request');
    if (!raw) return;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      localStorage.removeItem('pending_fee_plan_request');
      return;
    }

    // Kiểm tra trạng thái thực tế trên DB — tránh hiện payUrl đã hết hạn/bị hủy
    const subscriptionId = parsed.subscriptionId;
    if (!subscriptionId) {
      localStorage.removeItem('pending_fee_plan_request');
      return;
    }

    apiClient.get(API_ENDPOINTS.FEE.SUBSCRIPTIONS)
      .then(res => {
        const list = res.data?.data ?? [];
        const sub = list.find(s => s.id === subscriptionId);
        if (!sub || sub.status !== 'PENDING_PAYMENT') {
          // Subscription đã hủy, hết hạn, hoặc đã active → không hiện nút thanh toán nữa
          localStorage.removeItem('pending_fee_plan_request');
        } else {
          setPendingFeePlan(parsed);
        }
      })
      .catch(() => {
        // Không kết nối được → vẫn hiện để user tự xử lý
        setPendingFeePlan(parsed);
      });
  }, []);

  const handlePayFeePlan = (plan) => {
    if (plan.payUrl) {
      window.location.href = plan.payUrl;
    } else {
      setQrStatus(null);
      setShowQrModal(true);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [payRes, bookRes, invRes] = await Promise.all([
        bookingService.getPayments(),
        bookingService.getMyBookings(),
        apiClient.get(API_ENDPOINTS.FEE.MY_INVOICES).catch(() => ({ data: { data: [] } })),
      ]);
      if (!cancelled) {
        setPayments(Array.isArray(payRes.data) ? payRes.data : []);
        setBookings(Array.isArray(bookRes.data) ? bookRes.data : []);
        setSubscriptionInvoices(invRes.data?.data ?? []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!showQrModal) return;
    const momoOrderId = pendingFeePlan?.momoOrderId;
    if (!momoOrderId) return;

    let cancelled = false;
    setQrStatus('PENDING');

    const poll = async () => {
      if (cancelled) return;
      try {
        const res = await apiClient.get(API_ENDPOINTS.PAYMENTS.MOMO_ORDER_STATUS(momoOrderId));
        const status = res.data?.paymentStatus ?? res.data?.data?.paymentStatus;
        if (cancelled) return;

        if (status === 'PAID') {
          setQrStatus('PAID');
          const record = {
            id: pendingFeePlan.subscriptionId,
            bookingId: `SUB-${pendingFeePlan.subscriptionId}`,
            amount: Number(pendingFeePlan.amount),
            method: 'MoMo',
            status: 'PAID',
            createdAt: new Date().toISOString(),
          };
          setSuccess(record);
          setPayments(prev => [record, ...prev]);
          setShowQrModal(false);
          localStorage.removeItem('pending_fee_plan_request');
          setPendingFeePlan(null);
          setTimeout(() => setSuccess(null), 4000);
          return;
        }
        if (status === 'CANCELLED') {
          setQrStatus('CANCELLED');
          return;
        }
      } catch {
        // network error, retry
      }
      if (!cancelled) setTimeout(poll, 5000);
    };

    poll();
    return () => { cancelled = true; };
  }, [showQrModal, pendingFeePlan?.momoOrderId, pendingFeePlan?.subscriptionId, pendingFeePlan?.amount]);

  const paidBookingIds = new Set(payments.filter((p) => p.status === 'PAID').map((p) => p.bookingId));
  const unpaidBookings = bookings.filter((b) => b.status === 'CONFIRMED' && !paidBookingIds.has(b.id));

  const handlePay = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedBooking) return;
    setProcessing(true);
    const { data } = await bookingService.createPayment({
      bookingId: selectedBooking.id,
      amount: selectedBooking.vehicleType === 'MOTORBIKE' ? 15000 : 30000,
      method: paymentMethod,
      description: `Phí gửi xe - ${selectedBooking.parkingAreaName}`,
    });
    setProcessing(false);
    if (data) {
      setSuccess(data);
      setShowModal(false);
      setSelectedBooking(null);
      setPayments((prev) => [data, ...prev]);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const subPaid = subscriptionInvoices
    .filter(i => i.status === 'SUCCESS')
    .reduce((sum, i) => sum + Number(i.amount), 0);
  const totalPaid = payments.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0) + subPaid;
  const totalFailed = payments.filter((p) => p.status === 'FAILED').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title={t('payment.title')} subtitle={t('payment.subtitle')} icon="payments" />

      {success && success.status === 'PENDING' && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700 shadow-sm ring-1 ring-amber-100">
          <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
          {success.message}
        </div>
      )}
      {success && success.status !== 'PENDING' && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700 shadow-sm ring-1 ring-emerald-100">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          {t('payment.paymentSuccess')} <span className="font-bold">#{success.id}</span> - {success.amount?.toLocaleString('vi-VN')} VNĐ
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-xs font-medium text-slate-400">{t('payment.totalTransactions')}</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{payments.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-xs font-medium text-slate-400">{t('payment.totalPaid')}</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{totalPaid.toLocaleString('vi-VN')} VNĐ</p>
        </div>
        <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-xs font-medium text-slate-400">{t('payment.totalFailed')}</p>
          <p className="mt-1 text-2xl font-bold text-red-500">{totalFailed.toLocaleString('vi-VN')} VNĐ</p>
        </div>
      </div>

      {pendingFeePlan && (
        <div className="rounded-2xl border border-sky-100 bg-sky-50/20 p-5 ring-1 ring-sky-100/50 space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-[#0EA5E9]">
              <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span>
            </span>
            {t('payment.pendingRequestTitle')}
          </h3>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-[#0EA5E9]">
                <span className="material-symbols-outlined text-[20px]">sell</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{t('payment.monthlyTicketLabel', { plate: pendingFeePlan.licensePlate })}</p>
                <p className="text-xs text-slate-500">
                  {t('payment.monthlyTicketDesc', {
                    months: pendingFeePlan.selectedPlan,
                    type: pendingFeePlan.vehicleType === 'CAR' ? t('booking.car') : t('booking.motorcycle'),
                    date: dayjs(pendingFeePlan.startDate).format('DD/MM/YYYY')
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <p className="text-sm font-black text-sky-600">{pendingFeePlan.amount.toLocaleString('vi-VN')} đ</p>
              <Button
                variant="primary"
                size="sm"
                icon="qr_code"
                className="bg-[#0EA5E9] hover:bg-[#0284c7] !text-white text-white shadow-md shadow-sky-500/20"
                onClick={() => handlePayFeePlan(pendingFeePlan)}
              >
                {t('payment.payNow')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {unpaidBookings.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <span className="material-symbols-outlined text-[16px]">pending</span>
            </span>
            {t('payment.needPayment')} ({unpaidBookings.length})
          </h3>
          <div className="space-y-2">
            {unpaidBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50/50 p-4 ring-1 ring-amber-100/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <span className="material-symbols-outlined text-[20px]">receipt</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">#{b.id} - {b.parkingAreaName}</p>
                    <p className="text-xs text-slate-500">{t('booking.floor')} {b.floorNumber} - {b.vehicleType === 'MOTORBIKE' ? t('booking.motorcycle') : t('booking.car')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-sky-600">{(b.vehicleType === 'MOTORBIKE' ? 15000 : 30000).toLocaleString('vi-VN')} VNĐ</p>
                  <Button variant="primary" size="sm" icon="payment" onClick={() => handlePay(b)}>
                    {t('payment.pay')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowQrModal(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Thanh toán MoMo</h3>
              <Button variant="ghost" size="icon-sm" icon="close" onClick={() => setShowQrModal(false)} />
            </div>

            <div className="flex flex-col items-center bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
              {pendingFeePlan.qrCodeData ? (
                <img
                  src={pendingFeePlan.qrCodeData}
                  alt="QR MoMo"
                  className="rounded-xl border border-slate-200 shadow-sm"
                  style={{ width: '240px', height: '240px' }}
                />
              ) : (
                <div className="w-[240px] h-[240px] flex items-center justify-center bg-white rounded-xl border border-slate-200">
                  <span className="material-symbols-outlined text-[64px] text-slate-300 animate-pulse">qr_code_2</span>
                </div>
              )}
              {qrStatus === 'PENDING' && (
                <p className="text-[10px] text-slate-400 animate-pulse">Đang chờ thanh toán...</p>
              )}
              {qrStatus === 'CANCELLED' && (
                <p className="text-xs font-bold text-red-500">Đơn hàng đã hết hạn</p>
              )}
            </div>

            <div className="rounded-xl bg-slate-50 p-4 space-y-2.5 text-xs border border-slate-100">
              {pendingFeePlan.momoName && (
                <div className="flex justify-between items-start gap-2">
                  <span className="text-slate-400 shrink-0">Chuyển đến</span>
                  <span className="font-bold text-slate-700 text-right">{pendingFeePlan.momoName} – {pendingFeePlan.momoAccount}</span>
                </div>
              )}
              {pendingFeePlan.momoOrderId && (
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400 shrink-0">Nội dung</span>
                  <span className="font-bold text-slate-700 font-mono tracking-wide">{pendingFeePlan.momoOrderId}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Số tiền</span>
                <span className="font-black text-sky-600">{Number(pendingFeePlan.amount).toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Hết hạn sau</span>
                <span className="font-bold text-amber-600">10 phút</span>
              </div>
            </div>

            {qrStatus === 'CANCELLED' ? (
              <button
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold transition hover:bg-slate-200"
              >
                Đóng
              </button>
            ) : (
              <p className="text-center text-[10px] text-slate-400 leading-relaxed">
                Quét mã QR bằng ứng dụng MoMo để thanh toán. Trang sẽ tự động cập nhật khi nhận được tiền.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
