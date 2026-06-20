import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { ROUTES } from '../constants/routes';
import { apiClient } from '../services/apiClient';
import { API_ENDPOINTS } from '../services/endpoints';

const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 8;

export default function SubscriptionResultPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const resultCode = params.get('resultCode') ?? '';
  const orderId    = params.get('orderId') ?? '';
  const momoSuccess = resultCode === '0';

  const [verifying, setVerifying] = useState(momoSuccess);
  const [dbStatus, setDbStatus] = useState(null); // 'ACTIVE' | 'PENDING_PAYMENT' | null
  const [pollCount, setPollCount] = useState(0);

  // Khi MoMo báo hủy/thất bại → xóa ngay pendingFeePlan cũ khỏi localStorage
  useEffect(() => {
    if (!momoSuccess) {
      localStorage.removeItem('pending_fee_plan_request');
    }
  }, [momoSuccess]);

  const checkSubscription = useCallback(async () => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.FEE.SUBSCRIPTIONS);
      const list = res.data?.data ?? [];
      // Lấy subscription mới nhất liên quan đến orderId này (SUB{id}_timestamp)
      const subIdStr = orderId.replace('SUB', '').split('_')[0];
      const subId = Number(subIdStr);
      const found = !isNaN(subId)
        ? list.find(s => s.id === subId)
        : list.find(s => s.status === 'ACTIVE' || s.status === 'PENDING_PAYMENT');
      return found?.status ?? null;
    } catch {
      return null;
    }
  }, [orderId]);

  useEffect(() => {
    if (!momoSuccess) return;

    let cancelled = false;
    let attempt = 0;

    const poll = async () => {
      if (cancelled) return;
      const status = await checkSubscription();
      if (cancelled) return;

      setPollCount(++attempt);

      if (status === 'ACTIVE') {
        setDbStatus('ACTIVE');
        setVerifying(false);
        return;
      }

      if (attempt >= MAX_POLLS) {
        setDbStatus(status);
        setVerifying(false);
        return;
      }

      setTimeout(poll, POLL_INTERVAL_MS);
    };

    poll();
    return () => { cancelled = true; };
  }, [momoSuccess, checkSubscription]);

  // MoMo báo thất bại / hủy → không cần poll
  if (!momoSuccess) {
    const isCancelled = resultCode === '1006';
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
            {orderId && (
              <p className="text-xs text-slate-400">Mã đơn: <span className="font-semibold text-slate-600">{orderId}</span></p>
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

  // MoMo báo thành công → đang xác nhận DB
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
              Đang chờ xác nhận từ cổng thanh toán ({pollCount}/{MAX_POLLS})
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isConfirmed = dbStatus === 'ACTIVE';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-lg p-8 flex flex-col items-center text-center space-y-5">
        <div className={`flex h-20 w-20 items-center justify-center rounded-full ${isConfirmed ? 'bg-green-50' : 'bg-amber-50'}`}>
          <span className={`material-symbols-outlined text-[48px] ${isConfirmed ? 'text-green-500' : 'text-amber-400'}`}>
            {isConfirmed ? 'check_circle' : 'warning'}
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-800">
            {isConfirmed ? 'Thanh toán thành công!' : 'Đang chờ xác nhận'}
          </h2>
          {orderId && (
            <p className="text-xs text-slate-400">Mã đơn: <span className="font-semibold text-slate-600">{orderId}</span></p>
          )}
          {!isConfirmed && (
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Giao dịch đang chờ xác nhận từ cổng thanh toán. Gói của bạn sẽ được kích hoạt trong vài phút.
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
