import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../../../constants/routes';
import dayjs from 'dayjs';
import PageHeader from '../../components/PageHeader';

export default function DriverFeePlans() {
  const navigate = useNavigate();
  const [vehicleType, setVehicleType] = useState('CAR'); // Default to CAR
  const [licensePlate, setLicensePlate] = useState('29A-123.45');
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [selectedPlan, setSelectedPlan] = useState(null); // Default to null
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [status] = useState('PENDING_REGISTRATION');

  const [registeredVehicles, setRegisteredVehicles] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Dynamic fetching from localStorage to avoid hardcoding
    const stored = localStorage.getItem('sp_registered_vehicles');
    if (stored) {
      setRegisteredVehicles(JSON.parse(stored));
    } else {
      const defaults = [
        { plate: '29A-123.45', type: 'CAR' },
        { plate: '29-D1 123.45', type: 'MOTORBIKE' },
        { plate: '30F-567.89', type: 'CAR' }
      ];
      localStorage.setItem('sp_registered_vehicles', JSON.stringify(defaults));
      setRegisteredVehicles(defaults);
    }
  }, []);

  const hasExistingTicket = licensePlate.trim() === '29A-123.45';
  const existingExpiryDate = '15/07/2026';

  const pricingData = {
    MOTORBIKE: [
      { months: 1, name: 'Gói Tháng', price: 150000, save: 0, tag: '', desc: 'Phù hợp sử dụng ngắn hạn' },
      { months: 3, name: 'Gói Quý', price: 420000, save: 7, tag: '', desc: 'Tiết kiệm 7%' },
      { months: 6, name: 'Gói Nửa Năm', price: 800000, save: 10, tag: '⭐ PHỔ BIẾN NHẤT', desc: 'Tiết kiệm 10%' },
      { months: 12, name: 'Gói Năm', price: 1500000, save: 16, tag: '🔥 TIẾT KIỆM NHẤT', desc: 'Tiết kiệm 16%' },
    ],
    CAR: [
      { months: 1, name: 'Gói Tháng', price: 500000, save: 0, tag: '', desc: 'Phù hợp sử dụng ngắn hạn' },
      { months: 3, name: 'Gói Quý', price: 1400000, save: 7, tag: '', desc: 'Tiết kiệm 7%' },
      { months: 6, name: 'Gói Nửa Năm', price: 2700000, save: 10, tag: '⭐ PHỔ BIẾN NHẤT', desc: 'Tiết kiệm 10%' },
      { months: 12, name: 'Gói Năm', price: 5000000, save: 16, tag: '🔥 TIẾT KIỆM NHẤT', desc: 'Tiết kiệm 16%' },
    ],
  };

  const currentPlans = pricingData[vehicleType];
  const activePlanDetails = selectedPlan ? currentPlans.find((p) => p.months === selectedPlan) : null;

  // Pricing calculations
  const basePrice = activePlanDetails ? activePlanDetails.price : 0;
  const discountAmount = (activePlanDetails && activePlanDetails.save > 0) ? 200000 : 0; 
  const totalPrice = activePlanDetails ? Math.max(0, basePrice - discountAmount) : 0;

  // Date calculations
  let calculatedEndDate = '--/--/----';
  let calculatedStartDateFormatted = '--/--/----';

  const parsedStartDate = dayjs(startDate);
  if (selectedPlan && parsedStartDate.isValid()) {
    calculatedStartDateFormatted = parsedStartDate.format('DD/MM/YYYY');
    calculatedEndDate = parsedStartDate.add(selectedPlan, 'month').format('DD/MM/YYYY');
  }

  const handleSubmitRequest = () => {
    if (!selectedPlan || !licensePlate.trim()) return;
    
    // Save to localStorage so DriverPayment can show this pending payment
    const requestPayload = {
      id: Math.floor(100000 + Math.random() * 900000),
      vehicleType,
      licensePlate,
      selectedPlan,
      amount: totalPrice,
      startDate: parsedStartDate.isValid() ? startDate : dayjs().format('YYYY-MM-DD'),
      endDate: calculatedEndDate,
      status: 'PENDING_PAYMENT',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('pending_fee_plan_request', JSON.stringify(requestPayload));

    // Show success view
    setSubmittedSuccess(true);
  };

  const getStatusBadge = (currentStatus) => {
    switch (currentStatus) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 border border-green-200">
            🟢 Đang hoạt động
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 border border-red-200">
            🔴 Hết hạn
          </span>
        );
      case 'PENDING_PAYMENT':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
            🔵 Chờ thanh toán
          </span>
        );
      case 'PENDING_REGISTRATION':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700 border border-yellow-200">
            🟡 Chưa đăng ký
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Biểu phí thẻ xe"
        subtitle="Chọn gói vé phù hợp với nhu cầu sử dụng của bạn"
        icon="sell"
      />

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        {submittedSuccess ? (
          /* SUCCESS SUBMISSION SCREEN */
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in duration-300">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-[#0EA5E9] shadow-inner">
              <span className="material-symbols-outlined text-[48px] font-bold">mail</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800">Yêu cầu đã được gửi thành công!</h3>
              <p className="text-sm text-slate-500 max-w-md">
                Đơn đăng ký gói đỗ xe định kỳ của bạn đã được tiếp nhận trên hệ thống. Trạng thái hiện tại là <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">CHỜ THANH TOÁN</span>. Vui lòng di chuyển qua trang <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Thanh toán</span> để quét mã QR hoàn tất giao dịch.
              </p>
            </div>

            <div className="w-full max-w-md rounded-2xl bg-slate-50 p-6 text-left border border-slate-100 space-y-3">
              <div className="flex justify-between text-xs border-b border-slate-200/60 pb-2.5">
                <span className="text-slate-400 font-bold uppercase">Phương thức</span>
                <span className="font-bold text-slate-700">Vé đỗ xe định kỳ (Đăng ký/Gia hạn)</span>
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
                <span className="text-slate-500 font-medium">Tổng tiền cần thanh toán</span>
                <span className="font-black text-blue-600 text-sm">{totalPrice.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSubmittedSuccess(false);
                  setSelectedPlan(null);
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Đăng ký gói khác
              </button>
              <button
                onClick={() => navigate(ROUTES.DRIVER.PAYMENT)}
                className="px-6 py-2.5 bg-[#0EA5E9] hover:bg-[#0284c7] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-500/25"
              >
                Đi tới trang Thanh toán
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
          
          {/* Left Content (Form Đăng Ký) - 70% */}
          <div className="w-full md:w-[70%] space-y-6">
            
            {/* Step 1: Vehicle selection */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-500">Bước 1 - Chọn loại xe</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => { setVehicleType('MOTORBIKE'); setSelectedPlan(null); }}
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
                  onClick={() => { setVehicleType('CAR'); setSelectedPlan(null); }}
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
              <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 relative">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Biển số xe</span>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs">{vehicleType === 'CAR' ? '🚗' : '🏍'}</span>
                    <input
                      type="text"
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value)}
                      placeholder="Nhập biển số xe..."
                      className="w-full pl-9 pr-10 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSuggestions(!showSuggestions)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showSuggestions ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                      </span>
                    </button>
                  </div>

                  {showSuggestions && (
                    <div className="absolute left-0 right-0 top-[52px] z-30 bg-white border border-slate-200 rounded-xl shadow-lg mt-1 overflow-hidden divide-y divide-slate-100 max-h-40 overflow-y-auto">
                      {registeredVehicles.length > 0 ? (
                        registeredVehicles.map((v) => (
                          <button
                            key={v.plate}
                            type="button"
                            onClick={() => {
                              setLicensePlate(v.plate);
                              setVehicleType(v.type);
                              setSelectedPlan(null);
                              setShowSuggestions(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex justify-between items-center transition-colors"
                          >
                            <span>{v.plate}</span>
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              {v.type === 'CAR' ? '🚗 Ô tô' : '🏍 Xe máy'}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-xs text-slate-400 italic text-center">
                          Chưa có xe nào được đăng ký
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Ngày bắt đầu</span>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs">📅</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none"
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
                          ? 'border-[#0EA5E9] bg-sky-50/20 ring-2 ring-[#0EA5E9]/20 scale-[1.03] shadow-md'
                          : 'border-slate-100 hover:border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-sm'
                      }`}
                    >
                      {plan.tag && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                          {plan.tag}
                        </span>
                      )}

                      <div>
                        <div className="flex items-baseline justify-between border-b border-slate-50 pb-2 mb-2">
                          <span className="text-[10px] font-black uppercase text-slate-400">{plan.name}</span>
                          <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-1 rounded">{plan.save > 0 ? `-${plan.save}%` : 'Gói chuẩn'}</span>
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
                          isSelected ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white' : 'border-slate-300 bg-white text-slate-400'
                        }`}>
                          {isSelected ? '✓' : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
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
                  onClick={() => navigate(ROUTES.DRIVER.DASHBOARD)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition w-full sm:w-auto text-center"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSubmitRequest}
                  disabled={!selectedPlan || !licensePlate.trim()}
                  className={`px-6 py-3 font-bold text-sm rounded-xl flex items-center justify-center transition-all duration-300 w-full sm:w-auto ${
                    selectedPlan && licensePlate.trim()
                      ? 'bg-[#0EA5E9] hover:bg-[#0284c7] !text-white text-white shadow-md shadow-sky-500/20 active:scale-95'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  }`}
                >
                  <span className="!text-white text-white">Gửi yêu cầu xét duyệt</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar (Tóm Tắt Đăng Ký) - 30% */}
          <div className="w-full md:w-[30%] bg-slate-50 border-l border-slate-100 p-6 flex flex-col justify-between rounded-3xl">
            
            {!licensePlate.trim() ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 space-y-3">
                <span className="material-symbols-outlined text-[44px] text-slate-300">directions_car</span>
                <p className="text-xs font-bold text-slate-700">Chưa có phương tiện được chọn</p>
                <p className="text-[11px] text-slate-400 px-4 leading-relaxed">
                  Vui lòng chọn hoặc nhập biển số phương tiện trước khi mua vé tháng.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* TÓM TẮT ĐĂNG KÝ */}
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

                {/* RENEW NOTE */}
                {hasExistingTicket && (
                  <div className="rounded-2xl bg-amber-50 p-4 border border-amber-100 space-y-2">
                    <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      Phát hiện vé đang hoạt động
                    </p>
                    <div className="text-[10px] leading-relaxed text-amber-700 font-medium space-y-1">
                      <div>• Ngày hết hạn hiện tại: <span className="font-bold">{existingExpiryDate}</span></div>
                      {selectedPlan && (
                        <div>• Gia hạn thêm: <span className="font-bold">+{selectedPlan} tháng</span></div>
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
                    <div className="flex justify-between items-center text-xs text-rose-600">
                      <span>Khuyến mãi</span>
                      <span>-{discountAmount.toLocaleString('vi-VN')} đ</span>
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

            <div className="mt-8 pt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
