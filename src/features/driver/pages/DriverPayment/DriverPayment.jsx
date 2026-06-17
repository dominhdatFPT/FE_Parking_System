import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { bookingService } from '../../../../services/bookingService';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

export default function DriverPayment() {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('MoMo');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(null);
  const [pendingFeePlan, setPendingFeePlan] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrMethod, setQrMethod] = useState('MoMo');

  useEffect(() => {
    const raw = localStorage.getItem('pending_fee_plan_request');
    if (raw) {
      try {
        setPendingFeePlan(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handlePayFeePlan = (plan) => {
    setQrMethod('MoMo');
    setShowQrModal(true);
  };

  const handleConfirmFeePlanPayment = async () => {
    if (!pendingFeePlan) return;
    setProcessing(true);
    
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const mockPaymentRecord = {
      id: pendingFeePlan.id,
      bookingId: `SUB-${pendingFeePlan.id}`,
      amount: pendingFeePlan.amount,
      method: qrMethod,
      status: 'PAID',
      createdAt: new Date().toISOString()
    };

    setProcessing(false);
    setSuccess(mockPaymentRecord);
    setShowQrModal(false);
    
    // Clear request
    localStorage.removeItem('pending_fee_plan_request');
    setPendingFeePlan(null);

    // Add payment to list
    setPayments((prev) => [mockPaymentRecord, ...prev]);
    
    setTimeout(() => setSuccess(null), 3000);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [payRes, bookRes] = await Promise.all([
        bookingService.getPayments(),
        bookingService.getMyBookings(),
      ]);
      if (!cancelled) {
        setPayments(Array.isArray(payRes.data) ? payRes.data : []);
        setBookings(Array.isArray(bookRes.data) ? bookRes.data : []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

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

  const totalPaid = payments.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const totalFailed = payments.filter((p) => p.status === 'FAILED').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title={t('payment.title')} subtitle={t('payment.subtitle')} icon="payments" />

      {success && (
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

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] text-white shadow-sm">
            <span className="material-symbols-outlined text-[16px]">history</span>
          </span>
          {t('payment.paymentHistory')}
        </h3>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-white shadow-sm" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <EmptyState icon="payments" title={t('payment.noPayments')} description={t('payment.noPaymentsDesc')} />
        ) : (
          <div className="rounded-2xl border border-slate-100/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">{t('payment.invoiceId')}</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">{t('payment.bookingId')}</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">{t('payment.amount')}</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">{t('payment.method')}</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">{t('payment.status')}</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">{t('payment.date')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {payments.map((p) => (
                    <tr key={p.id} className="transition hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 font-bold text-slate-700">#{p.id}</td>
                      <td className="px-5 py-3.5 text-slate-500">#{p.bookingId}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">{p.amount.toLocaleString('vi-VN')} VNĐ</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {p.method}
                        </span>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                      <td className="px-5 py-3.5 text-slate-400">{dayjs(p.createdAt).format('DD/MM/YYYY')}</td>
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
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">{t('payment.qrTitle')}</h3>
              <Button variant="ghost" size="icon-sm" icon="close" onClick={() => setShowQrModal(false)} />
            </div>

            <div className="rounded-xl bg-slate-50 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('payment.qrPlate')}</span>
                <span className="font-bold text-slate-800">{pendingFeePlan.licensePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('payment.qrPlan')}</span>
                <span className="font-bold text-slate-800">{t('payment.qrPlanVal', { months: pendingFeePlan.selectedPlan })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('payment.qrTotal')}</span>
                <span className="font-black text-sky-600">{pendingFeePlan.amount.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase">{t('payment.selectGateway')}</p>
              <div className="grid grid-cols-3 gap-2">
                {['MoMo', 'VNPay', 'ZaloPay'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setQrMethod(method)}
                    className={`rounded-xl border p-2 text-center text-xs font-bold transition-all ${
                      qrMethod === method ? 'border-sky-500 bg-sky-50 text-sky-600' : 'border-slate-200 text-slate-500 hover:border-sky-300'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <span className="material-symbols-outlined text-[72px] text-slate-700 font-light">qr_code_2</span>
              </div>
              <p className="text-[10px] text-slate-400 text-center font-medium leading-relaxed">
                {t('payment.qrInstruction', { method: qrMethod })}
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              icon="check_circle"
              loading={processing}
              disabled={processing}
              onClick={handleConfirmFeePlanPayment}
              className="w-full justify-center bg-[#0EA5E9] hover:bg-[#0284c7] !text-white text-white shadow-md shadow-sky-500/25 py-2.5 rounded-xl text-xs"
            >
              {t('payment.qrConfirmBtn')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
