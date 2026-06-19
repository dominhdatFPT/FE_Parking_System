import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { bookingService } from '../../../../services/bookingService';
import { systemDataService } from '../../../../services/systemDataService';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';

export default function DriverPayment() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    const [bookingResult, subscriptionResult] = await Promise.allSettled([
      bookingService.getMyBookings(), systemDataService.getMySubscriptions(),
    ]);
    if (bookingResult.status === 'fulfilled') setBookings(bookingResult.value.data || []);
    else setError('Không thể tải booking từ database.');
    if (subscriptionResult.status === 'fulfilled') setSubscriptions(subscriptionResult.value || []);
    else setError(current => current || 'Không thể tải đăng ký gói từ database.');
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const payBooking = async (booking) => {
    setProcessing(`booking-${booking.id}`); setError('');
    const result = await bookingService.createPayment({ bookingId: booking.id, method: 'STAFF_CONFIRMATION' });
    if (result.error) setError(result.error.message || 'Thanh toán booking thất bại.');
    await load(); setProcessing(null);
  };
  const paySubscription = async (subscription) => {
    setProcessing(`subscription-${subscription.id}`); setError('');
    try { await systemDataService.paySubscription(subscription.id); await load(); }
    catch (err) { setError(err.response?.data?.message || 'Thanh toán gói thất bại.'); }
    finally { setProcessing(null); }
  };

  const unpaidBookings = bookings.filter(x => x.status === 'CONFIRMED' && x.paymentStatus === 'UNPAID');
  const pendingSubscriptions = subscriptions.filter(x => x.status === 'PENDING_PAYMENT');
  const history = [
    ...bookings.filter(x => x.paymentStatus === 'PAID').map(x => ({ id:`BOOKING-${x.id}`, type:'Booking', description:x.parkingAreaName, amount:null, status:x.paymentStatus, createdAt:x.paidAt || x.updatedAt })),
    ...subscriptions.filter(x => x.status !== 'PENDING_PAYMENT').map(x => ({ id:`SUB-${x.id}`, type:'Gói tháng', description:`${x.feePackageName} · ${x.vehicleLicensePlate}`, amount:Number(x.amountToPay), status:x.status, createdAt:x.startDate || x.createdAt })),
  ].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  return <div className="space-y-6">
    <PageHeader title={t('payment.title')} subtitle="Toàn bộ dữ liệu thanh toán được lấy từ database" icon="payments" />
    {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>}
    <section className="rounded-2xl border bg-white p-5"><h3 className="font-bold">Gói đang chờ thanh toán ({pendingSubscriptions.length})</h3><div className="mt-3 space-y-2">{pendingSubscriptions.map(x=><Row key={x.id} title={`${x.feePackageName} · ${x.vehicleLicensePlate}`} detail={`${Number(x.amountToPay).toLocaleString('vi-VN')} VNĐ`}><Button loading={processing===`subscription-${x.id}`} onClick={()=>paySubscription(x)}>Xác nhận thanh toán</Button></Row>)}{!loading && pendingSubscriptions.length===0 && <p className="text-sm text-slate-500">Database không có gói chờ thanh toán.</p>}</div></section>
    <section className="rounded-2xl border bg-white p-5"><h3 className="font-bold">Booking đang chờ thanh toán ({unpaidBookings.length})</h3><div className="mt-3 space-y-2">{unpaidBookings.map(x=><Row key={x.id} title={`#${x.id} · ${x.parkingAreaName}`} detail="Số tiền chưa được lưu trong booking"><Button loading={processing===`booking-${x.id}`} onClick={()=>payBooking(x)}>Xác nhận thanh toán</Button></Row>)}{!loading && unpaidBookings.length===0 && <p className="text-sm text-slate-500">Database không có booking chờ thanh toán.</p>}</div></section>
    <section><h3 className="mb-3 font-bold">Lịch sử trong database</h3>{loading ? <p>Đang tải...</p> : history.length===0 ? <EmptyState icon="payments" title={t('payment.noPayments')} description={t('payment.noPaymentsDesc')} /> : <div className="overflow-x-auto rounded-2xl border bg-white"><table className="w-full text-sm"><thead className="bg-slate-50 text-left"><tr><th className="p-4">Mã</th><th className="p-4">Loại</th><th className="p-4">Nội dung</th><th className="p-4">Số tiền</th><th className="p-4">Trạng thái</th><th className="p-4">Ngày</th></tr></thead><tbody className="divide-y">{history.map(x=><tr key={x.id}><td className="p-4 font-bold">{x.id}</td><td className="p-4">{x.type}</td><td className="p-4">{x.description}</td><td className="p-4">{x.amount == null ? 'Chưa có dữ liệu' : `${x.amount.toLocaleString('vi-VN')} VNĐ`}</td><td className="p-4">{x.status}</td><td className="p-4">{dayjs(x.createdAt).format('DD/MM/YYYY HH:mm')}</td></tr>)}</tbody></table></div>}</section>
  </div>;
}

function Row({ title, detail, children }) { return <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"><div><p className="font-bold">{title}</p><p className="text-sm text-slate-500">{detail}</p></div>{children}</div>; }
