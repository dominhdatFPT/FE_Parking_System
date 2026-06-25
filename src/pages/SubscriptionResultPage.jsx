import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { ROUTES } from '../constants/routes';
import { apiClient } from '../services/apiClient';
import { API_ENDPOINTS } from '../services/endpoints';

const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 10;

/**
 * Trang hiển thị kết quả thanh toán VNPay.
 *
 * BE redirect về đây sau khi xử lý return URL từ VNPay với params:
 *   ?status=success|failed&txnRef=VNP...&responseCode=00&subscriptionId=123
 */
export default function SubscriptionResultPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const status        = params.get('status') ?? '';
  const txnRef        = params.get('txnRef') ?? '';
  const responseCode  = params.get('responseCode') ?? '';
  const subscriptionId = params.get('subscriptionId') ? Number(params.get('subscriptionId')) : null;

  const isVnpaySuccess = status === 'success';

  const [verifying, setVerifying] = useState(isVnpaySuccess);
  const [dbStatus, setDbStatus] = useState(null); // 'ACTIVE' | 'PENDING_PAYMENT' | null
  const [pollCount, setPollCount] = useState(0);

  // Nếu VNPay báo thất bại → xóa pending khỏi localStorage ngay
  useEffect(() => {
    if (!isVnpaySuccess) {
      localStorage.removeItem('pending_fee_plan_request');
    }
  }, [isVnpaySuccess]);

  // Polling VNPay order status — dùng txnRef thay vì subscriptionId
  // (FE dùng /api/subscriptions/register tạo FeeSubscriptionInvoice, không phải FeeSubscription)
  const checkSubscription = useCallback(async () => {
    if (!txnRef) return null;
    try {
      const res = await apiClient.get(API_ENDPOINTS.PAYMENTS.VNPAY_ORDER_STATUS(txnRef));
      const vnpStatus = res.data?.data?.status ?? null; // PENDING | PAID | FAILED | CANCELLED
      // Map VNPay status → subscription status dùng để hiển thị
      if (vnpStatus === 'PAID') return 'ACTIVE';
      if (vnpStatus === 'FAILED' || vnpStatus === 'CANCELLED') return 'FAILED';
      return 'PENDING_PAYMENT';
    } catch {
      return null;
    }
  }, [txnRef]);

  useEffect(() => {
    if (!isVnpaySuccess) return;

    let cancelled = false;
    let attempt = 0;

    const poll = async () => {
      if (cancelled) return;
      const subStatus = await checkSubscription();
      if (cancelled) return;

      setPollCount(++attempt);

      if (subStatus === 'ACTIVE') {
        setDbStatus('ACTIVE');
        setVerifying(false);
        localStorage.removeItem('pending_fee_plan_request');
        return;
      }

      if (attempt >= MAX_POLLS) {
        setDbStatus(subStatus);
        setVerifying(false);
        return;
      }

      setTimeout(poll, POLL_INTERVAL_MS);
    };

    poll();
    return () => { cancelled = true; };
  }, [isVnpaySuccess, checkSubscription]);

  // ── Trường hợp VNPay báo thất bại / user hủy ─────────────────────────────
  if (!isVnpaySuccess) {
    const isCancelled = responseCode === '24'; // VNPay code 24 = user hủy
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-3xl bg-white shadow-lg p-8 flex flex-col items-center text-center space-y-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <span className="material-symbols-outlined text-[48px] text-red-400">cancel</span>
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-800">
              {isCancelled ? 'Bạn đã hủy giao dịch.' : 'Giao dịch không thành công. Vui lòng thử lại.'}
            </h2>
            {txnRef && (
              <p className="text-xs text-slate-400">
                Mã giao dịch: <span className="font-semibold text-slate-600">{txnRef}</span>
              </p>
            )}
            {responseCode && responseCode !== '24' && (
              <p className="text-xs text-slate-400 mt-1">
                Mã lỗi VNPay: <span className="font-mono text-red-500">{responseCode}</span>
              </p>
            )}
          </div>
          <div className="flex gap-3 pt-2 w-full">
            <button
              onClick={() => navigate(ROUTES.DRIVER.PAYMENT)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition"
            >
              Trang thanh toán
            </button>
            <button
              onClick={() => navigate(ROUTES.DRIVER.FEE_PLANS)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284c7] text-white text-sm font-bold transition shadow-md shadow-sky-500/20"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Đang xác nhận với DB (polling) ───────────────────────────────────────
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-3xl bg-white shadow-lg p-8 flex flex-col items-center text-center space-y-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-50 animate-pulse">
            <span className="material-symbols-outlined text-[48px] text-sky-400">hourglass_top</span>
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-800">Đang xác nhận thanh toán...</h2>
            <p className="text-xs text-slate-400">
              VNPay đã xác nhận, đang kích hoạt thẻ tháng ({pollCount}/{MAX_POLLS})
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Kết quả cuối cùng ─────────────────────────────────────────────────────
  const isConfirmed = dbStatus === 'ACTIVE';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-lg p-8 flex flex-col items-center text-center space-y-5">
        <div className={`flex h-20 w-20 items-center justify-center rounded-full ${isConfirmed ? 'bg-green-50' : 'bg-amber-50'}`}>
          <span className={`material-symbols-outlined text-[48px] ${isConfirmed ? 'text-green-500' : 'text-amber-400'}`}>
            {isConfirmed ? 'check_circle' : 'warning'}
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-800">
            {isConfirmed ? 'Thanh toán thành công!' : 'Đang chờ xác nhận'}
          </h2>
          {txnRef && (
            <p className="text-xs text-slate-400">
              Mã giao dịch: <span className="font-semibold text-slate-600">{txnRef}</span>
            </p>
          )}
          {!isConfirmed && (
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              VNPay đã ghi nhận giao dịch. Thẻ tháng của bạn sẽ được kích hoạt trong vài phút.
              Bạn có thể kiểm tra lại ở trang "Thanh toán".
            </p>
          )}
          {isConfirmed && (
            <p className="text-xs text-slate-500 leading-relaxed">
              Thẻ tháng đã được kích hoạt. Chúc bạn đỗ xe thuận tiện!
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2 w-full">
          <button
            onClick={() => navigate(ROUTES.DRIVER.PAYMENT)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition"
          >
            Trang thanh toán
          </button>
          <button
            onClick={() => navigate(ROUTES.DRIVER.FEE_PLANS)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284c7] text-white text-sm font-bold transition shadow-md shadow-sky-500/20"
          >
            {isConfirmed ? 'Đăng ký gói khác' : 'Về trang gói cước'}
          </button>
        </div>
      </div>
    </div>
  );
}
