import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

export default function VehicleCardPricingModal({ isOpen, onClose }) {
  const [vehicleType, setVehicleType] = useState('CAR'); // Default to CAR
  const [licensePlate, setLicensePlate] = useState('29A-123.45');
  const [startDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [selectedPlan, setSelectedPlan] = useState(null); // Default to null (no plan selected at first)
  
  // Checkout & Simulation states
  const [isPaying, setIsPaying] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [status, setStatus] = useState('PENDING_REGISTRATION'); // PENDING_REGISTRATION, PENDING_PAYMENT, ACTIVE, EXPIRED

  // Check if plate has existing subscription (simulation)
  // Let's assume the default plate '29A-123.45' already has an active subscription expiring on 15/07/2026
  const hasExistingTicket = licensePlate.trim() === '29A-123.45';
  const existingExpiryDate = '15/07/2026';

  useEffect(() => {
    if (isOpen) {
      setIsPaying(false);
      setIsProcessingPayment(false);
      setPaymentSuccess(false);
      setSelectedPlan(null); // Default state: no plan selected
      setStatus('PENDING_REGISTRATION');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const pricingData = {
    MOTORBIKE: [
      { months: 1, name: 'Gói Tháng', price: 150000, save: 0, tag: '', desc: 'Phù hợp sử dụng ngắn hạn' },
      { months: 3, name: 'Gói Quý', price: 420000, save: 7, tag: '', desc: '' },
      { months: 6, name: 'Gói Nửa Năm', price: 800000, save: 10, tag: '⭐ PHỔ BIẾN NHẤT', desc: '' },
      { months: 12, name: 'Gói Năm', price: 1500000, save: 16, tag: '🔥 TIẾT KIỆM NHẤT', desc: '' },
    ],
    CAR: [
      { months: 1, name: 'Gói Tháng', price: 500000, save: 0, tag: '', desc: 'Phù hợp sử dụng ngắn hạn' },
      { months: 3, name: 'Gói Quý', price: 1400000, save: 7, tag: '', desc: '' },
      { months: 6, name: 'Gói Nửa Năm', price: 2700000, save: 10, tag: '⭐ PHỔ BIẾN NHẤT', desc: '' },
      { months: 12, name: 'Gói Năm', price: 5000000, save: 16, tag: '🔥 TIẾT KIỆM NHẤT', desc: '' },
    ],
  };

  const currentPlans = pricingData[vehicleType];
  const activePlanDetails = selectedPlan ? currentPlans.find((p) => p.months === selectedPlan) : null;

  // Pricing calculations
  const basePrice = activePlanDetails ? activePlanDetails.price : 0;
  const vatAmount = 0;
  const discountAmount = 0; 
  const totalPrice = activePlanDetails ? Math.max(0, basePrice + vatAmount - discountAmount) : 0;

  // Date calculations
  let calculatedEndDate = '--/--/----';
  let calculatedStartDateFormatted = '--/--/----';

  if (selectedPlan) {
    if (hasExistingTicket) {
      // Renew: Start Date is the day after existing expiry (15/07/2026)
      const baseDate = dayjs('2026-07-15');
      calculatedStartDateFormatted = '16/07/2026';
      calculatedEndDate = baseDate.add(selectedPlan, 'month').format('DD/MM/YYYY');
    } else {
      // New: Start Date is the selected start date
      const parsedStartDate = dayjs(startDate);
      if (parsedStartDate.isValid()) {
        calculatedStartDateFormatted = parsedStartDate.format('DD/MM/YYYY');
        calculatedEndDate = parsedStartDate.add(selectedPlan, 'month').format('DD/MM/YYYY');
      }
    }
  }

  const handleProceedPayment = () => {
    if (!selectedPlan || !licensePlate.trim()) return;
    setStatus('PENDING_PAYMENT');
    setIsPaying(true);
  };

  const handleConfirmPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      setStatus('ACTIVE');
    }, 2000); // 2 seconds delay with loading spinner
  };

  const getStatusBadge = (currentStatus) => {
    switch (currentStatus) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 border border-green-200">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            🟢 Đang hoạt động
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 border border-red-200">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            🔴 Hết hạn
          </span>
        );
      case 'PENDING_PAYMENT':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            🔵 Chờ thanh toán
          </span>
        );
      case 'PENDING_REGISTRATION':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700 border border-yellow-200">
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            🟡 Chưa đăng ký
          </span>
        );
    }
  };

  const isFormDisabled = isProcessingPayment;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md transition-opacity duration-300">
      <div className="relative flex w-full max-w-6xl flex-col rounded-3xl bg-white border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 min-h-[580px] max-h-[90vh]">
        
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          disabled={isFormDisabled}
          className="absolute top-5 right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {paymentSuccess ? (
          /* SUCCESS SCREEN */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-6 animate-in fade-in duration-300 overflow-y-auto">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-inner">
              <span className="material-symbols-outlined text-[48px] font-bold">check_circle</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800">Đăng ký thành công!</h3>
              <p className="text-sm text-slate-500 max-w-md">
                Gói đỗ xe định kỳ của bạn đã được kích hoạt thành công. Biên lai điện tử đã được lưu vào lịch sử giao dịch.
              </p>
            </div>

            <div className="w-full max-w-md rounded-2xl bg-slate-50 p-6 text-left border border-slate-100 space-y-3">
              <div className="flex justify-between text-xs border-b border-slate-200/60 pb-2.5">
                <span className="text-slate-400 font-bold uppercase">Mã giao dịch</span>
                <span className="font-mono font-bold text-slate-700">#SP-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Loại xe</span>
                <span className="font-bold text-slate-700">{vehicleType === 'CAR' ? '🚗 Ô tô' : '🏍 Xe máy'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Biển số</span>
                <span className="font-bold text-slate-700">{licensePlate}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Gói đăng ký</span>
                <span className="font-bold text-slate-700">{selectedPlan} tháng</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Thời hạn</span>
                <span className="font-bold text-slate-700">{calculatedStartDateFormatted} - {calculatedEndDate}</span>
              </div>
              <div className="flex justify-between text-xs border-t border-slate-200/60 pt-3">
                <span className="text-slate-800 font-bold">Tổng thanh toán</span>
                <span className="font-black text-blue-600 text-sm">{totalPrice.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all"
            >
              Quay lại Dashboard
            </button>
          </div>
        ) : isPaying ? (
          /* SIMULATED CHECKOUT SCREEN */
          <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
            {/* Left Content (Checkout fields) */}
            <div className="w-full md:w-[70%] p-6 lg:p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-slate-800">Thanh toán hóa đơn</h2>
                  <p className="text-xs font-medium text-slate-400 mt-1">Chọn phương thức và xác nhận thanh toán an toàn qua cổng bảo mật</p>
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-500">Chọn phương thức thanh toán</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      disabled={isFormDisabled}
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        paymentMethod === 'credit_card' 
                          ? 'border-blue-600 bg-blue-50/20 text-blue-600 shadow-sm' 
                          : 'border-slate-100 hover:border-slate-200 text-slate-500'
                      } disabled:opacity-50`}
                    >
                      <span className="material-symbols-outlined text-[28px] mb-1">credit_card</span>
                      <span className="text-xs font-bold">Thẻ Quốc Tế</span>
                    </button>
                    <button
                      disabled={isFormDisabled}
                      onClick={() => setPaymentMethod('momo')}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        paymentMethod === 'momo' 
                          ? 'border-blue-600 bg-blue-50/20 text-blue-600 shadow-sm' 
                          : 'border-slate-100 hover:border-slate-200 text-slate-500'
                      } disabled:opacity-50`}
                    >
                      <span className="material-symbols-outlined text-[28px] mb-1">account_balance_wallet</span>
                      <span className="text-xs font-bold">Ví MoMo</span>
                    </button>
                    <button
                      disabled={isFormDisabled}
                      onClick={() => setPaymentMethod('vnpay')}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        paymentMethod === 'vnpay' 
                          ? 'border-blue-600 bg-blue-50/20 text-blue-600 shadow-sm' 
                          : 'border-slate-100 hover:border-slate-200 text-slate-500'
                      } disabled:opacity-50`}
                    >
                      <span className="material-symbols-outlined text-[28px] mb-1">qr_code_2</span>
                      <span className="text-xs font-bold">VNPAY-QR</span>
                    </button>
                  </div>

                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100/80 animate-in fade-in duration-200">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Số thẻ</label>
                        <div className="relative">
                          <input disabled={isFormDisabled} type="text" placeholder="4111 2222 3333 4444" defaultValue="4111 2222 3333 4444" className="w-full pl-10 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-medium text-slate-700 disabled:opacity-60" />
                          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[16px] text-slate-400">credit_card</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hạn dùng</label>
                          <input disabled={isFormDisabled} type="text" placeholder="MM/YY" defaultValue="12/29" className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-medium text-slate-700 disabled:opacity-60" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">CVC / CVV</label>
                          <input disabled={isFormDisabled} type="password" placeholder="•••" defaultValue="123" className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-medium text-slate-700 disabled:opacity-60" />
                        </div>
                      </div>
                    </div>
                  )}

                  {(paymentMethod === 'momo' || paymentMethod === 'vnpay') && (
                    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100/80 space-y-3 text-center animate-in fade-in duration-200">
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                        <span className="material-symbols-outlined text-[64px] text-slate-700">qr_code_2</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Mở ứng dụng tài chính quét mã QR để thực hiện giao dịch nhanh.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-8 border-t border-slate-100 pt-4">
                <button
                  disabled={isFormDisabled}
                  onClick={() => {
                    setIsPaying(false);
                    setStatus('PENDING_REGISTRATION');
                  }}
                  className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition disabled:opacity-55"
                >
                  Quay lại
                </button>
                <button
                  disabled={isFormDisabled}
                  onClick={handleConfirmPayment}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition active:scale-95 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>⏳ Đang xử lý thanh toán...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>Xác nhận thanh toán</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Summary Panel */}
            <div className="w-full md:w-[30%] bg-slate-50 border-l border-slate-100 p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-6">Chi tiết đơn hàng</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-xs pb-3 border-b border-slate-200/60">
                    <span className="text-slate-500">Phương tiện</span>
                    <span className="font-bold text-slate-800">{vehicleType === 'CAR' ? '🚗 Ô tô' : '🏍 Xe máy'}</span>
                  </div>
                  <div className="flex justify-between text-xs pb-3 border-b border-slate-200/60">
                    <span className="text-slate-500">Biển số</span>
                    <span className="font-bold text-slate-800">{licensePlate}</span>
                  </div>
                  <div className="flex justify-between text-xs pb-3 border-b border-slate-200/60">
                    <span className="text-slate-500">Gói đăng ký</span>
                    <span className="font-bold text-slate-800">{selectedPlan} tháng</span>
                  </div>
                  <div className="flex justify-between text-xs pb-3 border-b border-slate-200/60">
                    <span className="text-slate-500">Tổng cộng</span>
                    <span className="font-black text-blue-600">{totalPrice.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-medium text-center">
                Bằng việc hoàn thành, bạn đồng ý với các điều khoản dịch vụ gửi xe định kỳ.
              </div>
            </div>
          </div>
        ) : (
          /* FORM & PRICING SELECTION SCREEN (MAIN LAYOUT) */
          <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
            
            {/* Left Content (Form Đăng Ký) - 70% */}
            <div className="w-full md:w-[70%] p-6 lg:p-8 flex flex-col justify-between">
              
              <div>
                {/* Header */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">local_parking</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Đăng ký vé đỗ xe định kỳ</h2>
                    <p className="text-xs font-semibold text-slate-400">Chọn phương tiện và gói phù hợp với nhu cầu sử dụng của bạn</p>
                  </div>
                </div>

                <div className="space-y-6">
                  
                  {/* Step 1: Vehicle selection */}
                  <div className="space-y-2.5">
                    <label className="block text-xs font-bold text-slate-500">Bước 1 - Chọn loại xe</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setVehicleType('MOTORBIKE');
                          setSelectedPlan(null); // Reset package selection
                          if (licensePlate === '29A-123.45' || licensePlate === '30F-567.89') {
                            setLicensePlate('29-D1 123.45');
                          }
                        }}
                        className={`relative flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                          vehicleType === 'MOTORBIKE'
                            ? 'border-blue-600 bg-blue-50/20 text-blue-700 shadow-sm'
                            : 'border-slate-100 hover:border-slate-200 text-slate-600 bg-white'
                        }`}
                      >
                        <span className="text-xl">🏍</span>
                        <div className="flex-1">
                          <p className="text-xs font-black">Xe máy</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Tiết kiệm, linh hoạt</p>
                        </div>
                        {vehicleType === 'MOTORBIKE' && (
                          <span className="material-symbols-outlined text-[16px] text-blue-600 font-bold">check_circle</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setVehicleType('CAR');
                          setSelectedPlan(null); // Reset package selection
                          if (licensePlate === '29-D1 123.45') {
                            setLicensePlate('29A-123.45');
                          }
                        }}
                        className={`relative flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                          vehicleType === 'CAR'
                            ? 'border-blue-600 bg-blue-50/20 text-blue-700 shadow-sm'
                            : 'border-slate-100 hover:border-slate-200 text-slate-600 bg-white'
                        }`}
                      >
                        <span className="text-xl">🚗</span>
                        <div className="flex-1">
                          <p className="text-xs font-black">Ô tô</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Rộng rãi, an toàn</p>
                        </div>
                        {vehicleType === 'CAR' && (
                          <span className="material-symbols-outlined text-[16px] text-blue-600 font-bold">check_circle</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Vehicle details */}
                  <div className="space-y-2.5">
                    <label className="block text-xs font-bold text-slate-500">Bước 2 - Thông tin phương tiện</label>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-4">
                      <div className="space-y-1 relative max-w-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Biển số xe</span>
                        <div className="relative">
                          <span className="absolute left-3.5 top-2.5 text-xs">{vehicleType === 'CAR' ? '🚗' : '🏍'}</span>
                          <input
                            type="text"
                            value={licensePlate}
                            onChange={(e) => setLicensePlate(e.target.value)}
                            placeholder="Nhập biển số xe..."
                            className="w-full pl-9 pr-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Subscription Packages */}
                  <div className="space-y-2.5">
                    <label className="block text-xs font-bold text-slate-500">Bước 3 - Danh sách gói</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {currentPlans.map((plan) => {
                        const isSelected = selectedPlan === plan.months;
                        return (
                          <div
                            key={plan.months}
                            onClick={() => setSelectedPlan(plan.months)}
                            className={`relative flex flex-col justify-between rounded-2xl border p-4 cursor-pointer transition-all duration-300 ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50/20 ring-2 ring-blue-500/20 scale-[1.03] shadow-md shadow-blue-500/5'
                                : 'border-slate-100 hover:border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-sm'
                            }`}
                          >
                            {/* Top Badge Tag */}
                            {plan.tag && (
                              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm shadow-blue-500/20">
                                {plan.tag}
                              </span>
                            )}

                            <div>
                              <div className="flex items-baseline justify-between border-b border-slate-55 pb-2 mb-2">
                                <span className="text-[10px] font-black uppercase text-slate-400">{plan.name}</span>
                              </div>
                              <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-2xl font-black text-slate-800 tracking-tight">{plan.months}</span>
                                <span className="text-xs font-semibold text-slate-400">THÁNG</span>
                              </div>
                              <p className="mt-2 text-sm font-extrabold text-slate-700">
                                {plan.price.toLocaleString('vi-VN')} đ
                              </p>
                            </div>

                            <div className="mt-4 border-t border-slate-50 pt-3 flex items-center justify-between">
                              <span className="text-[9px] font-medium text-slate-400 leading-tight block">{plan.desc}</span>
                              <span className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors text-[10px] font-bold ${
                                isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-400'
                              }`}>
                                {isSelected ? '✓' : ''}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 border-t border-slate-100 pt-4">
                <div className="text-xs text-red-500 font-semibold">
                  {!selectedPlan && '⚠️ Vui lòng chọn gói đăng ký trước khi thanh toán'}
                  {!licensePlate.trim() && selectedPlan && '⚠️ Vui lòng nhập biển số xe'}
                </div>
                <div className="flex gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition w-full sm:w-auto text-center"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedPayment}
                    disabled={!selectedPlan || !licensePlate.trim()}
                    className={`px-6 py-2.5 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition active:scale-95 w-full sm:w-auto ${
                      selectedPlan && licensePlate.trim()
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-95 text-white shadow-md shadow-blue-500/20'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">credit_card</span>
                    <span>{hasExistingTicket ? 'Gia hạn vé' : 'Tiếp tục thanh toán'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar (Tóm Tắt Đăng Ký) - 30% */}
            <div className="w-full md:w-[30%] bg-slate-50 border-l border-slate-100 p-6 lg:p-8 flex flex-col justify-between overflow-y-auto">
              
              {!licensePlate.trim() ? (
                /* EMPTY STATE IF NO VEHICLE PLATE */
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12 space-y-3">
                  <span className="material-symbols-outlined text-[44px] text-slate-300">directions_car</span>
                  <p className="text-xs font-bold text-slate-700">Chưa có phương tiện được chọn</p>
                  <p className="text-[11px] text-slate-400 px-4 leading-relaxed">
                    Vui lòng chọn hoặc nhập biển số phương tiện trước khi mua vé tháng.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* TÓM TẮT ĐĂNG KÝ (Single unified block) */}
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Tóm tắt đăng ký</h3>
                    <div className="space-y-3.5 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Biển số xe</span>
                        <span className="font-bold text-slate-700">{licensePlate}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Loại xe</span>
                        <span className="font-bold text-slate-700">{vehicleType === 'CAR' ? 'Ô tô' : 'Xe máy'}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Gói đăng ký</span>
                        <span className="font-bold text-slate-700">
                          {selectedPlan ? `${selectedPlan} tháng` : <span className="text-slate-400 italic font-normal">Chưa chọn</span>}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Ngày bắt đầu</span>
                        <span className="font-bold text-slate-700">{calculatedStartDateFormatted}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Ngày hết hạn</span>
                        <span className="font-bold text-slate-700">{calculatedEndDate}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
                        <span className="text-slate-400 font-medium">Trạng thái</span>
                        <span>{getStatusBadge(status)}</span>
                      </div>
                    </div>
                  </div>

                  {/* RENEW NOTE IF APPLICABLE */}
                  {hasExistingTicket && (
                    <div className="rounded-2xl bg-amber-50 p-4 border border-amber-100 space-y-2 animate-in fade-in duration-200">
                      <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">info</span>
                        Phát hiện vé đang hoạt động
                      </p>
                      <div className="text-[10px] leading-relaxed text-amber-700 font-medium space-y-1">
                        <div>• Ngày hết hạn hiện tại: <span className="font-bold">{existingExpiryDate}</span></div>
                        {selectedPlan && (
                          <div>• Gia hạn thêm: <span className="font-bold">+{selectedPlan} tháng</span> (Hiệu lực từ 16/07/2026)</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CHI TIẾT THANH TOÁN */}
                  <div className="space-y-2.5">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chi tiết thanh toán</h4>
                    <div className="space-y-2.5 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Giá gói</span>
                        <span className="font-semibold text-slate-700">{basePrice.toLocaleString('vi-VN')} đ</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">VAT (0%)</span>
                        <span className="font-semibold text-slate-700">0 đ</span>
                      </div>
                      <div className="h-px bg-slate-100 my-1" />
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-800 font-black">Tổng cộng</span>
                        <span className="font-black text-blue-600 text-sm">{totalPrice.toLocaleString('vi-VN')} đ</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Safety Badges */}
              <div className="mt-8 pt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 md:border-t-0">
                <span className="material-symbols-outlined text-[16px] text-blue-600">security</span>
                <span>Thanh toán bảo mật SSL</span>
              </div>
            </div>
            
          </div>
        )}

      </div>
    </div>
  );
}
