import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../../constants/routes';
import { apiClient } from '../../../../services/apiClient';
import { API_ENDPOINTS } from '../../../../services/endpoints';
import dayjs from 'dayjs';
import PageHeader from '../../components/PageHeader';

const VEHICLE_TYPE_ID = { MOTORBIKE: 1, CAR: 2 };

const STATUS_MAP = {
  PENDING_PAYMENT: 'feePlans.statusPending',
  ACTIVE: 'feePlans.statusActive',
  CANCELLED: 'feePlans.statusCancelled',
};

export default function DriverFeePlans() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [vehicleType, setVehicleType] = useState(location.state?.selectedType || 'CAR');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [licensePlate, setLicensePlate] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [subscriptionResult, setSubscriptionResult] = useState(null);

  const [feePackages, setFeePackages] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loadingFeePackages, setLoadingFeePackages] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const selectedPackage = feePackages.find(p => p.id === selectedPlanId);
  const selectedPackagePrice = selectedPackage ? (selectedPackage.price ?? selectedPackage.currentPrice ?? 0) : 0;
  const basePrice = Number.isFinite(Number(selectedPackagePrice)) ? Number(selectedPackagePrice) : 0;
  const totalPrice = basePrice;

  const fetchFeePackages = useCallback(async (typeId) => {
    setLoadingFeePackages(true);
    setErrorMessage('');
    try {
      const res = await apiClient.get(API_ENDPOINTS.FEE.PACKAGES, { params: { vehicleTypeId: typeId } });
      setFeePackages(res.data?.data ?? []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể tải danh sách gói cước';
      setErrorMessage(msg);
      setFeePackages([]);
    } finally {
      setLoadingFeePackages(false);
    }
  }, []);

  const fetchMyVehicles = useCallback(async (typeId) => {
    setLoadingVehicles(true);
    setErrorMessage('');
    try {
      const res = await apiClient.get(API_ENDPOINTS.FEE.MY_VEHICLES, { params: { category: typeId } });
      setVehicles(res.data?.data ?? []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể tải danh sách xe';
      setErrorMessage(msg);
      setVehicles([]);
    } finally {
      setLoadingVehicles(false);
    }
  }, []);

  useEffect(() => {
    const typeId = VEHICLE_TYPE_ID[vehicleType];
    if (typeId) {
      fetchFeePackages(typeId);
      fetchMyVehicles(typeId);
    }
    setSelectedVehicle(null);
    setLicensePlate('');
    setSelectedPlanId(null);
  }, [vehicleType, fetchFeePackages, fetchMyVehicles]);

  const handleSubmitRequest = async () => {
    if (!selectedVehicle || !selectedPlanId) return;

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await apiClient.post(API_ENDPOINTS.FEE.REGISTER, {
        vehicleId: selectedVehicle.vehicleId,
        planId: selectedPlanId,
        autoRenew: false,
      });
      const result = res.data?.data ?? res.data;
      localStorage.setItem('pending_fee_plan_request', JSON.stringify({
        ...result,
        licensePlate: selectedVehicle.licensePlate,
        planName: selectedPackage?.name,
        durationMonths: selectedPackage?.durationMonths,
        amount: selectedPackage?.price ?? selectedPackage?.currentPrice ?? 0,
      }));
      navigate(ROUTES.DRIVER.PAYMENT);
    } catch (err) {
      const msg = err.response?.data?.message || 'Đã xảy ra lỗi khi tạo đăng ký';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (currentStatus) => {
    const statusKey = STATUS_MAP[currentStatus];
    const label = statusKey ? t(statusKey) : currentStatus;
    switch (currentStatus) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 border border-green-200">
            {label}
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 border border-red-200">
            {label}
          </span>
        );
      case 'PENDING_PAYMENT':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
            {label}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700 border border-yellow-200">
            {t('feePlans.statusUnregistered')}
          </span>
        );
    }
  };

  const parsedStartDate = dayjs();
  let calculatedEndDate = '--/--/----';
  let calculatedStartDateFormatted = parsedStartDate.format('DD/MM/YYYY');
  if (selectedPackage && parsedStartDate.isValid()) {
    calculatedEndDate = parsedStartDate.add(selectedPackage.durationMonths, 'month').format('DD/MM/YYYY');
  }

  const canSubmit = !!selectedVehicle && !!selectedPlanId;
  const submitErrorText = !selectedPlanId
    ? t('feePlans.errorSelectPlan')
    : !selectedVehicle
    ? 'Vui lòng chọn biển số xe từ danh sách'
    : '';

  return (
    <div className="space-y-6">
      <PageHeader title={t('feePlans.title')} subtitle={t('feePlans.subtitle')} icon="sell" />

      {errorMessage && !submittedSuccess && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-[18px] text-red-500 mt-0.5">error</span>
          <p className="text-xs font-semibold text-red-700">{errorMessage}</p>
        </div>
      )}

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        {submittedSuccess && subscriptionResult ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in duration-300">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-[#0EA5E9] shadow-inner">
              <span className="material-symbols-outlined text-[48px] font-bold">check_circle</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800">{t('feePlans.submittedTitle')}</h3>
              <p className="text-sm text-slate-500 max-w-md">{t('feePlans.submittedDesc')}</p>
            </div>

            <div className="w-full max-w-md rounded-2xl bg-slate-50 p-6 text-left border border-slate-100 space-y-3">
              <div className="flex justify-between text-xs border-b border-slate-200/60 pb-2.5">
                <span className="text-slate-400 font-bold uppercase">{t('feePlans.method')}</span>
                <span className="font-bold text-slate-700">{t('feePlans.recurringTicket')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">{t('feePlans.plate')}</span>
                <span className="font-bold text-slate-700">{subscriptionResult.vehicleLicensePlate}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">{t('feePlans.plan')}</span>
                <span className="font-bold text-slate-700">{subscriptionResult.feePackageName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">{t('feePlans.status')}</span>
                <span>{getStatusBadge(subscriptionResult.status)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">{t('feePlans.totalAmount')}</span>
                <span className="font-black text-blue-600 text-sm">{Number(subscriptionResult.amountToPay).toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => { setSubmittedSuccess(false); setSelectedPlanId(null); setSubscriptionResult(null); }}
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
            <div className="w-full md:w-[70%] space-y-6">
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-500">{t('feePlans.step1')}</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => { setVehicleType('MOTORBIKE'); }}
                    className={`relative flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-300 ${vehicleType === 'MOTORBIKE' ? 'border-blue-600 bg-blue-50/20 text-blue-700 shadow-sm' : 'border-slate-100 hover:border-slate-200 text-slate-600 bg-white'}`}
                  >
                    <span className="text-xl">🏍</span>
                    <div className="flex-1">
                      <p className="text-xs font-black">{t('vehicleRegistration.motorbike')}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{t('feePlans.step1DescMotorbike')}</p>
                    </div>
                    {vehicleType === 'MOTORBIKE' && <span className="material-symbols-outlined text-[16px] text-blue-600 font-bold">check_circle</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setVehicleType('CAR'); }}
                    className={`relative flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-300 ${vehicleType === 'CAR' ? 'border-blue-600 bg-blue-50/20 text-blue-700 shadow-sm' : 'border-slate-100 hover:border-slate-200 text-slate-600 bg-white'}`}
                  >
                    <span className="text-xl">🚗</span>
                    <div className="flex-1">
                      <p className="text-xs font-black">{t('vehicleRegistration.car')}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{t('feePlans.step1DescCar')}</p>
                    </div>
                    {vehicleType === 'CAR' && <span className="material-symbols-outlined text-[16px] text-blue-600 font-bold">check_circle</span>}
                  </button>
                </div>
              </div>

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
                        onChange={(e) => { setLicensePlate(e.target.value); setSelectedVehicle(null); }}
                        placeholder={t('feePlans.platePlaceholder')}
                        className="w-full pl-9 pr-10 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[18px]">{showSuggestions ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</span>
                      </button>
                    </div>

                    {showSuggestions && (
                      <div className="absolute left-0 right-0 top-[52px] z-30 bg-white border border-slate-200 rounded-xl shadow-lg mt-1 overflow-hidden divide-y divide-slate-100 max-h-40 overflow-y-auto">
                        {loadingVehicles ? (
                          <div className="px-4 py-3 text-xs text-slate-400 italic text-center">Đang tải...</div>
                        ) : vehicles.length > 0 ? (
                          vehicles.map((v) => (
                            <button
                              key={v.vehicleId}
                              type="button"
                              onClick={() => { setSelectedVehicle(v); setLicensePlate(v.licensePlate); setShowSuggestions(false); }}
                              className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex justify-between items-center transition-colors"
                            >
                              <span>{v.licensePlate}</span>
                              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                {v.brand}{v.color ? ` - ${v.color}` : ''}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-xs text-slate-400 italic text-center">{t('feePlans.noVehiclesRegistered')}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-500">{t('feePlans.step3')}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {loadingFeePackages ? (
                    [1, 2, 3, 4].map(i => (
                      <div key={i} className="rounded-2xl border border-slate-100 p-4 animate-pulse bg-slate-50">
                        <div className="h-3 bg-slate-200 rounded w-16 mb-3" />
                        <div className="h-8 bg-slate-200 rounded w-20 mb-2" />
                        <div className="h-5 bg-slate-200 rounded w-24 mb-4" />
                        <div className="h-4 bg-slate-200 rounded w-full" />
                      </div>
                    ))
                  ) : feePackages.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-xs text-slate-400 italic">
                      Không có gói cước nào cho loại xe này
                    </div>
                  ) : (
                    feePackages.map((pkg) => {
                      const isSelected = selectedPlanId === pkg.id;
                      const tag = '';
                      const rawPrice = pkg.price ?? pkg.currentPrice ?? 0;
                      const price = Number.isFinite(Number(rawPrice)) ? Number(rawPrice) : 0;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPlanId(pkg.id)}
                          className={`relative flex flex-col justify-between rounded-2xl border p-4 cursor-pointer transition-all duration-300 ${isSelected ? 'border-[#0EA5E9] bg-sky-50/20 ring-2 ring-[#0EA5E9]/20 scale-[1.03] shadow-md' : 'border-slate-100 hover:border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-sm'}`}
                        >
                          {tag && (
                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                              {tag}
                            </span>
                          )}
                          <div>
                            <div className="flex items-baseline justify-between border-b border-slate-55 pb-2 mb-2">
                              <span className="text-[10px] font-black uppercase text-slate-400">{pkg.name}</span>
                            </div>
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-2xl font-black text-slate-800 tracking-tight">{pkg.durationMonths}</span>
                              <span className="text-xs font-semibold text-slate-400">{t('feePlans.planUnit')}</span>
                            </div>
                            <p className="mt-2 text-sm font-extrabold text-slate-700">{price.toLocaleString('vi-VN')} đ</p>
                          </div>
                          <div className="mt-4 border-t border-slate-50 pt-3 flex items-center justify-between">
                            <span className="text-[9px] font-medium text-slate-400 leading-tight block">{pkg.benefits}</span>
                            <span className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors text-[10px] font-bold ${isSelected ? 'border-[#0EA5E9] bg-[#0EA5E9] text-white' : 'border-slate-300 bg-white text-slate-400'}`}>
                              {isSelected ? '✓' : ''}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 border-t border-slate-100 pt-4">
                <div className="text-xs text-red-500 font-semibold">{submitErrorText}</div>
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
                    disabled={!canSubmit || submitting}
                    className={`px-6 py-3 font-bold text-sm rounded-xl flex items-center justify-center transition-all duration-300 w-full sm:w-auto ${canSubmit && !submitting ? 'bg-[#0EA5E9] hover:bg-[#0284c7] !text-white text-white shadow-md shadow-sky-500/20 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}
                  >
                    <span className="!text-white text-white">{submitting ? 'Đang xử lý...' : t('feePlans.addToPayment')}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full md:w-[30%] bg-slate-50 border-l border-slate-100 p-6 flex flex-col justify-between rounded-3xl">
              {!selectedVehicle ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12 space-y-3">
                  <span className="material-symbols-outlined text-[44px] text-slate-300">directions_car</span>
                  <p className="text-xs font-bold text-slate-700">{t('feePlans.noVehicleSelected')}</p>
                  <p className="text-[11px] text-slate-400 px-4 leading-relaxed">{t('feePlans.noVehicleSelectedDesc')}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">{t('feePlans.summaryTitle')}</h3>
                    <div className="space-y-3.5 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">{t('feePlans.plate')}</span>
                        <span className="font-bold text-slate-700">{selectedVehicle.licensePlate}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">{t('vehicleRegistration.vehicleType')}</span>
                        <span className="font-bold text-slate-700">{selectedVehicle.vehicleTypeName || (vehicleType === 'CAR' ? t('vehicleRegistration.car') : t('vehicleRegistration.motorbike'))}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">{t('feePlans.plan')}</span>
                        <span className="font-bold text-slate-700">
                          {selectedPackage ? selectedPackage.name : <span className="text-slate-400 italic font-normal">{t('vehicleRegistration.ocrNameWaiting').replace('CCCD...', '')}</span>}
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
                        <span>{getStatusBadge()}</span>
                      </div>
                    </div>
                  </div>

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
