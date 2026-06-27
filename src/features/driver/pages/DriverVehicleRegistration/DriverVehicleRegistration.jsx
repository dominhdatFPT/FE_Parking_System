import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../contexts/useAuth';
import { customerService } from '../../../../services/customerService';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';

export default function DriverVehicleRegistration() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();

  // Retrieve state passed from the pricing modal (selectedPlans is now an array)
  const preselectedType = location.state?.selectedType || 'MOTORBIKE';
  const preselectedPlans = location.state?.selectedPlans || [];

  // Form Fields State
  const [vehicleType, setVehicleType] = useState(preselectedType);
  const [selectedPlans, setSelectedPlans] = useState(preselectedPlans);
  const [licensePlate, setLicensePlate] = useState('');

  // File Upload State (CCCD requires 2 sides)
  const [cccdFrontFile, setCccdFrontFile] = useState(null);
  const [cccdBackFile, setCccdBackFile] = useState(null);
  const [driverLicenseFile, setDriverLicenseFile] = useState(null);
  const [vehicleDocsFile, setVehicleDocsFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Update when preselected info changes
  useEffect(() => {
    if (location.state?.selectedType) {
      setVehicleType(location.state.selectedType);
    }
    if (location.state?.selectedPlans) {
      setSelectedPlans(location.state.selectedPlans);
    }
  }, [location.state]);

  const validateAndSetFile = (file, setter) => {
    setError('');
    if (!file?.type?.startsWith('image/')) {
      setError('Chỉ chấp nhận ảnh CCCD, bằng lái, đăng ký xe hoặc biển số; không nhận PDF.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('Mỗi ảnh không được vượt quá 4 MB. Vui lòng chụp rõ và giảm dung lượng ảnh.');
      return;
    }
    setter(file);
  };

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) validateAndSetFile(file, setter);
    e.target.value = '';
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, setter) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file, setter);
  };

  const handleRemovePlan = (months) => {
    setSelectedPlans((prev) => prev.filter((m) => m !== months));
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!cccdFrontFile) {
      setError(t('vehicleRegistration.errorCccdFront'));
      return;
    }
    if (!cccdBackFile) {
      setError(t('vehicleRegistration.errorCccdBack'));
      return;
    }
    if (!driverLicenseFile) {
      setError(t('vehicleRegistration.errorDriverLicense'));
      return;
    }
    if (!vehicleDocsFile) {
      setError(t('vehicleRegistration.errorVehicleDocs'));
      return;
    }
    if (!licensePlate.trim()) {
      setError(t('vehicleRegistration.errorEnterPlate'));
      return;
    }
    setSubmitting(true);
    try {
    const payload = {
      vehicleTypeId: vehicleType === 'CAR' ? 2 : 1,
      licensePlate: licensePlate.trim().toUpperCase(),
      cccdFrontImage: await fileToBase64(cccdFrontFile),
      cccdBackImage: await fileToBase64(cccdBackFile),
      licenseImage: await fileToBase64(driverLicenseFile),
      vehicleDocumentImage: await fileToBase64(vehicleDocsFile),
    };

    const { error: err, message } = await customerService.registerVehicleCard(payload);
    if (err) {
      setError(message || t('vehicleRegistration.errorGeneric'));
      return;
    }

    setSubmitted(true);
    } catch {
      setError('Không thể đọc ảnh tải lên. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderFileDropzone = (label, file, setter) => {
    const id = label.replace(/\s+/g, '-').toLowerCase();
    return (
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-bold text-slate-400">{label}</label>
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, setter)}
          className={`relative flex flex-col items-center justify-center rounded-xl border border-dashed p-3 text-center transition-all duration-300 ${
            file
              ? 'border-emerald-400 bg-emerald-50/10'
              : 'border-slate-200 bg-slate-50/30 hover:border-[#0EA5E9] hover:bg-white'
          }`}
        >
          {!file && (
            <input
              type="file"
              id={id}
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFileChange(e, setter)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          )}
          {file ? (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-500 font-bold">check_circle</span>
              <span className="text-[11px] font-bold text-emerald-700 max-w-[150px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); setter(null); }}
                className="material-symbols-outlined text-[14px] text-red-500 hover:text-red-700"
              >
                delete
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 py-1">
              <span className="material-symbols-outlined text-[16px] text-slate-400">add_photo_alternate</span>
              <span className="text-[11px] font-semibold text-slate-500">{t('vehicleRegistration.uploadPhoto')}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Pricing helper
  const getPlanPrice = (months) => {
    if (vehicleType === 'CAR') {
      return months === 12 ? 12000000 : months === 9 ? 9500000 : months === 6 ? 6800000 : 3600000;
    } else {
      return months === 12 ? 1000000 : months === 9 ? 850000 : months === 6 ? 600000 : 330000;
    }
  };

  const totalPrice = selectedPlans.reduce((sum, m) => sum + getPlanPrice(m), 0);

  // Calculate completeness percentage
  const totalSteps = 4;
  const completedSteps = [cccdFrontFile, cccdBackFile, driverLicenseFile, vehicleDocsFile].filter(Boolean).length;
  const hasLicensePlate = licensePlate.trim().length > 0;

  const getFormStatus = () => {
    if (submitted) return t('vehicleRegistration.statusPending');
    if (completedSteps === totalSteps && hasLicensePlate) return t('vehicleRegistration.statusReady');
    return t('vehicleRegistration.statusIncomplete');
  };

  return (
    <div className="relative -m-4 min-h-[calc(100vh-4rem)] overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(232,121,249,0.20),transparent_46%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.25),transparent_55%),linear-gradient(135deg,#f8fafc_0%,#dbeafe_45%,#f3e8ff_100%)] p-4 lg:-m-6 lg:p-7">
      <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 opacity-30" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="vehicle-registration-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="2" fill="#818cf8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vehicle-registration-dots)" />
        </svg>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 opacity-35" aria-hidden="true">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <path d="M-20 180C40 160 80 190 120 140C160 90 130 50 210 20" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
          <path d="M-40 160C20 140 60 170 100 120C140 70 110 30 190 0" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M-60 140C0 120 40 150 80 100C120 50 90 10 170-20" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 6" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6">
        <PageHeader
          title={t('vehicleRegistration.title')}
          subtitle={t('vehicleRegistration.subtitle')}
          icon="assignment_ind"
          variant="banner"
        />
        <div className="grid gap-6 lg:grid-cols-5">

        {/* Left Side: Upload Documents Form */}
        <div className="lg:col-span-3">
          <div className="rounded-[28px] border border-white/80 bg-white/92 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            {submitted ? (
              <div className="flex flex-col items-center py-12 text-center animate-in fade-in duration-300">
                <div className="relative mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500 shadow-inner">
                    <span className="material-symbols-outlined text-[44px] animate-pulse">hourglass_empty</span>
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#0EA5E9] text-white text-[12px] font-bold ring-4 ring-white">1</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-800">{t('vehicleRegistration.submittedTitle')}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 max-w-md">
                  {t('vehicleRegistration.submittedDesc')}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-xs justify-center">
                  <Button
                    variant="primary"
                    className="w-full justify-center"
                    onClick={() => {
                      setSubmitted(false);
                      setCccdFrontFile(null);
                      setCccdBackFile(null);
                      setDriverLicenseFile(null);
                      setVehicleDocsFile(null);
                      setLicensePlate('');
                      setSelectedPlans([]);
                    }}
                  >
                    {t('vehicleRegistration.registerOther')}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800">{t('vehicleRegistration.formTitle')}</h3>
                    <p className="text-xs text-slate-400">{t('vehicleRegistration.formDesc')}</p>
                  </div>
                  <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded">
                    {t('vehicleRegistration.accountLabel')} {user?.username || user?.fullName || 'Driver'}
                  </span>
                </div>

                {/* Vehicle Type Select */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-500">{t('vehicleRegistration.vehicleType')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setVehicleType('MOTORBIKE');
                        setSelectedPlans([]); // Clear plans if vehicle type toggles
                      }}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-bold transition-all duration-200 ${
                        vehicleType === 'MOTORBIKE'
                          ? 'border-[#0EA5E9] bg-sky-50/70 text-[#0EA5E9] shadow-[0_12px_28px_rgba(14,165,233,0.12)]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50/40'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
                      {t('vehicleRegistration.motorbike')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVehicleType('CAR');
                        setSelectedPlans([]);
                      }}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-bold transition-all duration-200 ${
                        vehicleType === 'CAR'
                          ? 'border-[#0EA5E9] bg-sky-50/70 text-[#0EA5E9] shadow-[0_12px_28px_rgba(14,165,233,0.12)]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50/40'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">directions_car</span>
                      {t('vehicleRegistration.car')}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-500">
                    {t('vehicleRegistration.licensePlateNumber')}
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
                      confirmation_number
                    </span>
                    <input
                      type="text"
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                      placeholder={t('vehicleRegistration.platePlaceholder')}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white/95 pl-10 pr-4 text-sm font-bold uppercase text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-[#0EA5E9] focus:ring-4 focus:ring-sky-100"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-3 text-xs leading-relaxed text-sky-800">
                  {t('vehicleRegistration.manualPlateNotice')}
                </div>

                {/* Selected Plans List */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-500">{t('vehicleRegistration.selectedPlans')}</label>
                  {selectedPlans.length > 0 ? (
                    <div className="flex flex-wrap gap-2 rounded-xl bg-slate-50 border border-slate-200 p-3">
                      {selectedPlans.map((months) => (
                        <div
                          key={months}
                          className="flex items-center gap-1.5 bg-[#0EA5E9] text-white px-2.5 py-1 rounded-lg text-xs font-bold animate-in zoom-in-95 duration-150"
                        >
                          <span>{t('vehicleRegistration.planMonths', { months })}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePlan(months)}
                            className="material-symbols-outlined text-[14px] hover:text-red-200 transition-colors"
                          >
                            close
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-[38px] items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-4 text-xs text-slate-400 font-semibold">
                      {t('vehicleRegistration.noPlansSelected')}
                    </div>
                  )}
                </div>

                <div className="h-px bg-slate-100 my-2" />

                {/* Document Uploads */}
                <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">{t('vehicleRegistration.requiredDocs')}</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {renderFileDropzone(t('vehicleRegistration.cccdFront'), cccdFrontFile, setCccdFrontFile)}
                  {renderFileDropzone(t('vehicleRegistration.cccdBack'), cccdBackFile, setCccdBackFile)}
                  {renderFileDropzone(t('vehicleRegistration.driverLicense'), driverLicenseFile, setDriverLicenseFile)}
                  {renderFileDropzone(t('vehicleRegistration.vehicleDocs'), vehicleDocsFile, setVehicleDocsFile)}
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 p-3 text-xs text-rose-600 animate-in shake duration-200">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    <span className="font-semibold">{error}</span>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={submitting}
                    disabled={submitting}
                    className="w-full justify-center rounded-xl py-3 shadow-[0_16px_36px_rgba(14,165,233,0.24)]"
                  >
                    {t('vehicleRegistration.submit')}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Side: Summary Card */}
        <div className="lg:col-span-2 flex flex-col justify-start">
          <div className="sticky top-6 space-y-4">
            
            {/* Tóm tắt hồ sơ đăng ký Card */}
            <div className="rounded-[24px] border border-white/80 bg-white/92 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <span className="material-symbols-outlined text-[#0EA5E9] text-[20px] font-bold">assignment</span>
                <h4 className="text-xs font-bold text-slate-700">{t('vehicleRegistration.summaryTitle')}</h4>
              </div>

              {completedSteps === 0 && !hasLicensePlate ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <span className="material-symbols-outlined text-slate-300 text-[40px] mb-2">description</span>
                  <p className="text-xs text-slate-400 font-medium px-4 leading-relaxed">
                    {t('vehicleRegistration.summaryDesc')}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* General Info */}
                  <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">{t('vehicleRegistration.vehicleType')}</span>
                    <span className="font-bold text-slate-700">
                      {vehicleType === 'CAR' ? t('vehicleRegistration.car') : t('vehicleRegistration.motorbike')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">{t('vehicleRegistration.ocrPlate')}</span>
                    <span className={`font-bold ${hasLicensePlate ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                      {hasLicensePlate ? licensePlate.trim().toUpperCase() : t('vehicleRegistration.platePlaceholder')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">{t('vehicleRegistration.selectedPlans')}</span>
                    <span className="font-bold text-slate-700 text-right max-w-[150px] truncate">
                      {selectedPlans.length > 0
                        ? selectedPlans.map((m) => t('vehicleRegistration.planMonths', { months: m })).join(', ')
                        : t('vehicleRegistration.noPlansSelected')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">{t('vehicleRegistration.summaryStatus')}</span>
                    <span>
                      {getFormStatus() === t('vehicleRegistration.statusPending') && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                          {t('vehicleRegistration.statusPending')}
                        </span>
                      )}
                      {getFormStatus() === t('vehicleRegistration.statusReady') && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          {t('vehicleRegistration.statusReady')}
                        </span>
                      )}
                      {getFormStatus() === t('vehicleRegistration.statusIncomplete') && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-200">
                          {t('vehicleRegistration.statusIncomplete')}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50 pb-3">
                    <span className="text-slate-500 font-medium">{t('vehicleRegistration.uploadedPhotos')}</span>
                    <span className="font-bold text-slate-700">
                      {completedSteps}/{totalSteps}
                    </span>
                  </div>

                  {/* OCR/eKYC Section */}
                  <div className="pt-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <span className="material-symbols-outlined text-[14px]">psychology</span>
                      {t('vehicleRegistration.ocrTitle')}
                    </div>
                    <div className="rounded-xl bg-slate-50/70 p-3 space-y-2 border border-slate-100">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">{t('vehicleRegistration.ocrName')}</span>
                        <span className={`font-bold ${cccdFrontFile ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                          {cccdFrontFile ? 'Sẽ đọc khi gửi hồ sơ' : t('vehicleRegistration.ocrNameWaiting')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">{t('vehicleRegistration.ocrCccd')}</span>
                        <span className={`font-bold ${cccdFrontFile ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                          {cccdFrontFile ? 'Sẽ đọc khi gửi hồ sơ' : t('vehicleRegistration.ocrNameWaiting')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">{t('vehicleRegistration.ocrLicenseClass')}</span>
                        <span className={`font-bold ${driverLicenseFile ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                          {driverLicenseFile ? 'Sẽ đọc khi gửi hồ sơ' : t('vehicleRegistration.ocrLicenseWaiting')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">{t('vehicleRegistration.ocrPlate')}</span>
                        <span className={`font-bold ${hasLicensePlate ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                          {hasLicensePlate ? licensePlate.trim().toUpperCase() : t('vehicleRegistration.platePlaceholder')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Packages Details & Invoice summary */}
            {selectedPlans.length > 0 && (
              <div className="rounded-[24px] border border-sky-100 bg-white/78 p-5 space-y-3 shadow-[0_18px_44px_rgba(14,165,233,0.10)] backdrop-blur-xl animate-in fade-in duration-300">
                <div className="border-b border-sky-100 pb-2">
                  <p className="font-black text-sky-800 text-xs uppercase tracking-wider">{t('vehicleRegistration.summaryPackages')}</p>
                </div>
                <div className="space-y-2 text-xs">
                  {selectedPlans.map((months) => (
                    <div key={months} className="flex justify-between items-center text-slate-600">
                      <span className="font-semibold">{t('vehicleRegistration.planMonths', { months })}:</span>
                      <span className="font-bold">{getPlanPrice(months).toLocaleString('vi-VN')} đ</span>
                    </div>
                  ))}
                  <div className="h-px bg-sky-100 my-1" />
                  <div className="flex justify-between items-center text-sky-950 font-black text-xs">
                    <span>{t('vehicleRegistration.totalPriceEst')}</span>
                    <span>{totalPrice.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        </div>
      </div>
    </div>
  );
}
