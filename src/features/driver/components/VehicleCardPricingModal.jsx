import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../../constants/routes';

export default function VehicleCardPricingModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [vehicleType, setVehicleType] = useState('MOTORBIKE'); // MOTORBIKE or CAR
  const [selectedPlans, setSelectedPlans] = useState([]); // Array of plan durations, e.g., [3, 12]

  if (!isOpen) return null;

  const pricingData = {
    MOTORBIKE: [
      { months: 3, name: 'Gói Tiết Kiệm', price: 330000, oldPrice: 360000, save: 'Tiết kiệm 8%', tag: '' },
      { months: 6, name: 'Gói Tiêu Chuẩn', price: 600000, oldPrice: 720000, save: 'Tiết kiệm 17%', tag: '' },
      { months: 9, name: 'Gói Phổ Biến', price: 850000, oldPrice: 1080000, save: 'Tiết kiệm 21%', tag: 'Phổ biến nhất' },
      { months: 12, name: 'Gói Toàn Diện', price: 1000000, oldPrice: 1440000, save: 'Tiết kiệm 30%', tag: 'Giá trị tốt nhất', featured: true },
    ],
    CAR: [
      { months: 3, name: 'Gói Tiết Kiệm', price: 3600000, oldPrice: 3900000, save: 'Tiết kiệm 8%', tag: '' },
      { months: 6, name: 'Gói Tiêu Chuẩn', price: 6800000, oldPrice: 7800000, save: 'Tiết kiệm 13%', tag: '' },
      { months: 9, name: 'Gói Phổ Biến', price: 9500000, oldPrice: 11700000, save: 'Tiết kiệm 19%', tag: 'Phổ biến nhất' },
      { months: 12, name: 'Gói Toàn Diện', price: 12000000, oldPrice: 15600000, save: 'Tiết kiệm 23%', tag: 'Giá trị tốt nhất', featured: true },
    ],
  };

  const currentPlans = pricingData[vehicleType];

  const handleTogglePlan = (plan) => {
    setSelectedPlans((prev) => {
      if (prev.includes(plan.months)) {
        return prev.filter((m) => m !== plan.months);
      } else {
        return [...prev, plan.months];
      }
    });
  };

  const handleProceed = () => {
    onClose();
    navigate(ROUTES.DRIVER.VEHICLE_REGISTRATION, {
      state: { selectedType: vehicleType, selectedPlans: selectedPlans },
    });
    // Clear selection state after proceeding
    setSelectedPlans([]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative flex w-full max-w-5xl flex-col rounded-3xl bg-slate-50 border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-[#0EA5E9]">
              <span className="material-symbols-outlined text-[24px]">sell</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">Biểu Phí Thẻ Xe Định Kỳ</h3>
              <p className="text-xs font-semibold text-slate-400">Chọn một hoặc nhiều gói đăng ký phù hợp để nhận ưu đãi</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedPlans([]);
              onClose();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 focus:outline-none"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Vehicle Toggle Selector & Selection Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-6 py-4 border-b border-slate-100/55">
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => {
                setVehicleType('MOTORBIKE');
                setSelectedPlans([]); // Clear selection when type changes
              }}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all duration-300 ${
                vehicleType === 'MOTORBIKE'
                  ? 'bg-[#0EA5E9] !text-white shadow-md shadow-sky-400/20'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
              Xe máy
            </button>
            <button
              onClick={() => {
                setVehicleType('CAR');
                setSelectedPlans([]); // Clear selection when type changes
              }}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all duration-300 ${
                vehicleType === 'CAR'
                  ? 'bg-[#0EA5E9] !text-white shadow-md shadow-sky-400/20'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">directions_car</span>
              Ô tô
            </button>
          </div>

          {selectedPlans.length > 0 && (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-300">
              <span className="text-xs font-bold text-slate-500">
                Đã chọn <span className="text-[#0EA5E9] font-black">{selectedPlans.length}</span> gói
              </span>
              <button
                onClick={handleProceed}
                className="flex items-center gap-1.5 bg-[#0EA5E9] hover:bg-[#0284c7] !text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-sky-500/20 transition-all active:scale-95"
              >
                <span>Tiếp tục đăng ký</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-6 max-h-[60vh]">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {currentPlans.map((plan) => {
              const isSelected = selectedPlans.includes(plan.months);
              return (
                <div
                  key={plan.months}
                  className={`relative flex flex-col justify-between rounded-2xl border bg-white p-5 transition-all duration-300 hover:shadow-xl ${
                    isSelected
                      ? 'border-[#0EA5E9] ring-2 ring-[#0EA5E9]/20 bg-sky-50/5 scale-[1.01]'
                      : plan.featured
                        ? 'border-slate-300/80 scale-[1.01]'
                        : 'border-slate-100 shadow-sm hover:-translate-y-0.5'
                  }`}
                >
                  {/* Featured Badge */}
                  {plan.tag && (
                    <span className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white shadow-sm shadow-sky-300/30'
                        : plan.featured
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                    }`}>
                      {plan.tag}
                    </span>
                  )}

                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wide text-slate-400">{plan.name}</h4>
                    
                    {/* Plan Duration */}
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-800 tracking-tight">{plan.months}</span>
                      <span className="text-sm font-bold text-slate-500">tháng</span>
                    </div>

                    {/* Pricing Details */}
                    <div className="mt-3 space-y-0.5">
                      <p className="text-[17px] font-extrabold text-[#0EA5E9]">
                        {plan.price.toLocaleString('vi-VN')} đ
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400 line-through">
                          {plan.oldPrice.toLocaleString('vi-VN')} đ
                        </span>
                        <span className="font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {plan.save}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits / Info */}
                  <div className="mt-6 space-y-2.5 border-t border-slate-50 pt-4 flex-1">
                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
                      <span className="material-symbols-outlined text-[14px] text-emerald-500 font-bold">check</span>
                      <span>Ra vào không giới hạn</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
                      <span className="material-symbols-outlined text-[14px] text-emerald-500 font-bold">check</span>
                      <span>Ưu tiên luồng ra vào thẻ</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
                      <span className="material-symbols-outlined text-[14px] text-emerald-500 font-bold">check</span>
                      <span>Hỗ trợ sự cố khẩn cấp</span>
                    </div>
                  </div>

                  {/* Action button */}
                  <button
                    type="button"
                    onClick={() => handleTogglePlan(plan)}
                    className={`mt-6 w-full rounded-xl py-2.5 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#0EA5E9] hover:bg-[#0284c7] !text-white shadow-md shadow-sky-500/25'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {isSelected && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
                    {isSelected ? 'Đã chọn gói' : 'Chọn gói này'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-100 px-6 py-4 text-center text-[10px] font-medium text-slate-500 border-t border-slate-200">
          * Phí gửi xe sẽ được ghi nhận và thanh toán trực tiếp qua cổng thanh toán sau khi hồ sơ của bạn được phê duyệt thành công.
        </div>
      </div>
    </div>
  );
}
