import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../../constants/routes';
import dayjs from 'dayjs';
import PageHeader from '../../components/PageHeader';

export default function DriverFeePlans() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      { months: 1, name: t('feePlans.planName'), price: 150000, save: 0, tag: '', desc: t('feePlans.planDescShort') },
      { months: 3, name: t('feePlans.planNameQuarter'), price: 420000, save: 7, tag: '', desc: '' },
      { months: 6, name: t('feePlans.planNameHalfYear'), price: 800000, save: 10, tag: t('feePlans.popularTag'), desc: '' },
      { months: 12, name: t('feePlans.planNameYear'), price: 1500000, save: 16, tag: t('feePlans.saveTag'), desc: '' },
    ],
    CAR: [
      { months: 1, name: t('feePlans.planName'), price: 500000, save: 0, tag: '', desc: t('feePlans.planDescShort') },
      { months: 3, name: t('feePlans.planNameQuarter'), price: 1400000, save: 7, tag: '', desc: '' },
      { months: 6, name: t('feePlans.planNameHalfYear'), price: 2700000, save: 10, tag: t('feePlans.popularTag'), desc: '' },
      { months: 12, name: t('feePlans.planNameYear'), price: 5000000, save: 16, tag: t('feePlans.saveTag'), desc: '' },
    ],
  };

  const currentPlans = pricingData[vehicleType];
  const activePlanDetails = selectedPlan ? currentPlans.find((p) => p.months === selectedPlan) : null;

  // Pricing calculations
  const basePrice = activePlanDetails ? activePlanDetails.price : 0;
  const discountAmount = 0; 
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
            {t('feePlans.statusActive')}
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 border border-red-200">
            {t('feePlans.statusExpired')}
          </span>
        );
      case 'PENDING_PAYMENT':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
            {t('feePlans.statusPending')}
          </span>
        );
      case 'PENDING_REGISTRATION':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700 border border-yellow-200">
            {t('feePlans.statusUnregistered')}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('feePlans.title')}
        subtitle={t('feePlans.subtitle')}
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
              <h3 className="text-2xl font-black text-slate-800">{t('feePlans.submittedTitle')}</h3>
              <p className="text-sm text-slate-500 max-w-md">
                {t('feePlans.submittedDesc')}
              </p>
            </div>

            <div className="w-full max-w-md rounded-2xl bg-slate-50 p-6 text-left border border-slate-100 space-y-3">
              <div className="flex justify-between text-xs border-b border-slate-200/60 pb-2.5">
                <span className="text-slate-400 font-bold uppercase">{t('feePlans.method')}</span>
                <span className="font-bold text-slate-700">{t('feePlans.recurringTicket')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">{t('feePlans.plate')}</span>
                <span className="font-bold text-slate-700">{licensePlate}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">{t('feePlans.plan')}</span>
                <span className="font-bold text-slate-700">{t('feePlans.planVal', { months: selectedPlan })}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">{t('feePlans.totalAmount')}</span>
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
                {t('feePlans.registerOther')}
              </button>
              <button
                onClick={() => navigate(ROUTES.DRIVER.PAYMENT)}
                className="px-6 py-3 bg-[#0EA5E9] hover:bg-[#0284c7] !text-white text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-sky-500/20 active:scale-95"
              >
                {t('feePlans.goToPayment')}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
          
          {/* Left Content (Form Đăng Ký) - 70% */}
          <div className="w-full md:w-[70%] space-y-6">
            
            {/* Step 1: Vehicle selection */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-500">{t('feePlans.step1')}</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setVehicleType('MOTORBIKE');
                    setSelectedPlan(null);
                    const matching = registeredVehicles.find(v => v.type === 'MOTORBIKE');
                    if (matching) setLicensePlate(matching.plate);
                    else setLicensePlate('');
                  }}
                  className={`relative flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                    vehicleType === 'MOTORBIKE'
                      ? 'border-blue-600 bg-blue-50/20 text-blue-700 shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 text-slate-600 bg-white'
                  }`}
                >
                  <span className="text-xl">🏍</span>
                  <div className="flex-1">
                    <p className="text-xs font-black">{t('vehicleRegistration.motorbike')}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{t('feePlans.step1DescMotorbike')}</p>
                  </div>
                  {vehicleType === 'MOTORBIKE' && (
                    <span className="material-symbols-outlined text-[16px] text-blue-600 font-bold">check_circle</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVehicleType('CAR');
                    setSelectedPlan(null);
                    const matching = registeredVehicles.find(v => v.type === 'CAR');
                    if (matching) setLicensePlate(matching.plate);
                    else setLicensePlate('');
                  }}
                  className={`relative flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                    vehicleType === 'CAR'
                      ? 'border-blue-600 bg-blue-50/20 text-blue-700 shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 text-slate-600 bg-white'
                  }`}
                >
                  <span className="text-xl">🚗</span>
                  <div className="flex-1">
                    <p className="text-xs font-black">{t('vehicleRegistration.car')}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{t('feePlans.step1DescCar')}</p>
                  </div>
                  {vehicleType === 'CAR' && (
                    <span className="material-symbols-outlined text-[16px] text-blue-600 font-bold">check_circle</span>
                  )}
                </button>
              </div>
            </div>

            {/* Step 2: Vehicle details */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-500">{t('feePlans.step2')}</label>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-4">
                <div className="space-y-1 relative max-w-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{t('feePlans.plate')}</span>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs">{vehicleType === 'CAR' ? '🚗' : '🏍'}</span>
                    <input
                      type="text"
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value)}
                      placeholder={t('feePlans.platePlaceholder')}
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
                      {registeredVehicles.filter(v => v.type === vehicleType).length > 0 ? (
                        registeredVehicles.filter(v => v.type === vehicleType).map((v) => (
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
                              {v.type === 'CAR' ? `🚗 ${t('vehicleRegistration.car')}` : `🏍 ${t('vehicleRegistration.motorbike')}`}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-xs text-slate-400 italic text-center">
                          {t('feePlans.noVehiclesRegistered')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Subscription Packages */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-500">{t('feePlans.step3')}</label>
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
                        <div className="flex items-baseline justify-between border-b border-slate-55 pb-2 mb-2">
                          <span className="text-[10px] font-black uppercase text-slate-400">{plan.name}</span>
                        </div>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl font-black text-slate-800 tracking-tight">{plan.months}</span>
                          <span className="text-xs font-semibold text-slate-400">{t('feePlans.planUnit')}</span>
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
                {!selectedPlan && t('feePlans.errorSelectPlan')}
                {!licensePlate.trim() && selectedPlan && t('feePlans.errorEnterPlate')}
              </div>
              <div className="flex gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.DRIVER.DASHBOARD)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition w-full sm:w-auto text-center"
                >
                  {t('feePlans.cancel')}
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
                  <span className="!text-white text-white">{t('feePlans.addToPayment')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar (Tóm Tắt Đăng Ký) - 30% */}
          <div className="w-full md:w-[30%] bg-slate-50 border-l border-slate-100 p-6 flex flex-col justify-between rounded-3xl">
            
            {!licensePlate.trim() ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 space-y-3">
                <span className="material-symbols-outlined text-[44px] text-slate-300">directions_car</span>
                <p className="text-xs font-bold text-slate-700">{t('feePlans.noVehicleSelected')}</p>
                <p className="text-[11px] text-slate-400 px-4 leading-relaxed">
                  {t('feePlans.noVehicleSelectedDesc')}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* TÓM TẮT ĐĂNG KÝ */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">{t('feePlans.summaryTitle')}</h3>
                  <div className="space-y-3.5 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">{t('feePlans.plate')}</span>
                      <span className="font-bold text-slate-700">{licensePlate}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">{t('vehicleRegistration.vehicleType')}</span>
                      <span className="font-bold text-slate-700">{vehicleType === 'CAR' ? t('vehicleRegistration.car') : t('vehicleRegistration.motorbike')}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">{t('feePlans.plan')}</span>
                      <span className="font-bold text-slate-700">
                        {selectedPlan ? t('feePlans.planVal', { months: selectedPlan }) : <span className="text-slate-400 italic font-normal">{t('vehicleRegistration.ocrNameWaiting').replace('CCCD...', '')}</span>}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">{t('feePlans.startDate')}</span>
                      <span className="font-bold text-slate-700">{calculatedStartDateFormatted}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">{t('feePlans.endDate')}</span>
                      <span className="font-bold text-slate-700">{calculatedEndDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
                      <span className="text-slate-400 font-medium">{t('feePlans.status')}</span>
                      <span>{getStatusBadge(status)}</span>
                    </div>
                  </div>
                </div>

                {/* RENEW NOTE */}
                {hasExistingTicket && (
                  <div className="rounded-2xl bg-amber-50 p-4 border border-amber-100 space-y-2">
                    <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      {t('feePlans.detectedActiveTicket')}
                    </p>
                    <div className="text-[10px] leading-relaxed text-amber-700 font-medium space-y-1">
                      <div>{t('feePlans.existingExpiry')} <span className="font-bold">{existingExpiryDate}</span></div>
                      {selectedPlan && (
                        <div>{t('feePlans.renewAdd', { months: selectedPlan })}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* CHI TIẾT THANH TOÁN */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('feePlans.paymentDetails')}</h4>
                  <div className="space-y-2.5 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">{t('feePlans.packagePrice')}</span>
                      <span className="font-semibold text-slate-700">{basePrice.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">{t('feePlans.vat')}</span>
                      <span className="font-semibold text-slate-700">0 đ</span>
                    </div>
                    <div className="h-px bg-slate-100 my-1" />
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-800 font-black">{t('feePlans.total')}</span>
                      <span className="font-black text-blue-600 text-sm">{totalPrice.toLocaleString('vi-VN')} đ</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px] text-blue-600">security</span>
              <span>{t('feePlans.securePayment')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}
