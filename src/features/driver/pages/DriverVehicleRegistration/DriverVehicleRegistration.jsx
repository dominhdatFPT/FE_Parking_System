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

  // File Upload State (optional proof documents, no license-plate photo required)
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
      setError('Chỉ chấp nhận ảnh CCCD, bằng lái hoặc đăng ký xe; không nhận PDF.');
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
      const reader = new window.FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const submittedLicensePlate = licensePlate.trim().toUpperCase().replace(/\s+/g, '');
    if (!submittedLicensePlate) {
      setError(t('vehicleRegistration.errorEnterPlate'));
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        vehicleTypeId: vehicleType === 'CAR' ? 2 : 1,
        licensePlate: submittedLicensePlate,
        cccdFrontImage: cccdFrontFile ? await fileToBase64(cccdFrontFile) : null,
        cccdBackImage: cccdBackFile ? await fileToBase64(cccdBackFile) : null,
        licenseImage: driverLicenseFile ? await fileToBase64(driverLicenseFile) : null,
        vehicleDocumentImage: vehicleDocsFile ? await fileToBase64(vehicleDocsFile) : null,
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

  // Only the plate is required. Photos are optional evidence for staff review.
  const totalSteps = 1;
  const completedSteps = licensePlate.trim() ? 1 : 0;
  const uploadedPhotoCount = [cccdFrontFile, cccdBackFile, driverLicenseFile, vehicleDocsFile].filter(Boolean).length;
  const totalPhotoSlots = 4;
  const getFormStatus = () => {
    if (submitted) return t('vehicleRegistration.statusPending');
    if (completedSteps === totalSteps) return t('vehicleRegistration.statusReady');
    return t('vehicleRegistration.statusIncomplete');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('vehicleRegistration.title')}
        subtitle={t('vehicleRegistration.subtitle')}
        icon="assignment_ind" variant="banner"
      />

      <div className="grid gap-6 lg:grid-cols-5">
        
        {/* Left Side: Upload Documents Form */}
        <div className="lg:col-span-3">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
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
                          ? 'border-[#0EA5E9] bg-sky-50/50 text-[#0EA5E9]'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
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
                          ? 'border-[#0EA5E9] bg-sky-50/50 text-[#0EA5E9]'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">directions_car</span>
                      {t('vehicleRegistration.car')}
                    </button>
                  </div>
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-500">
                    {t('vehicleRegistration.licensePlateNumber')}
                  </span>
                  <span className="relative block">
                    <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
                      pin
                    </span>
                    <input
                      type="text"
                      value={licensePlate}
                      onChange={(event) => setLicensePlate(event.target.value.toUpperCase())}
                      placeholder={t('vehicleRegistration.platePlaceholder')}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/40 pl-10 pr-3 text-sm font-bold uppercase tracking-wide text-slate-900 outline-none transition focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                  </span>
                </label>

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
                <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">{t('vehicleRegistration.optionalDocs')}</h4>
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
                    className="w-full justify-center py-3 rounded-xl"
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
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <span className="material-symbols-outlined text-[#0EA5E9] text-[20px] font-bold">assignment</span>
                <h4 className="text-xs font-bold text-slate-700">{t('vehicleRegistration.summaryTitle')}</h4>
              </div>

              {completedSteps === 0 ? (
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
                    <span className="text-slate-500 font-medium">{t('vehicleRegistration.licensePlateNumber')}</span>
                    <span className="max-w-[150px] truncate text-right font-bold uppercase text-slate-700">
                      {licensePlate.trim() || '---'}
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
                      {uploadedPhotoCount}/{totalPhotoSlots}
                    </span>
                  </div>

                </div>
              )}
            </div>

            {/* Selected Packages Details & Invoice summary */}
            {selectedPlans.length > 0 && (
              <div className="rounded-2xl bg-sky-50/50 border border-sky-100 p-5 space-y-3 animate-in fade-in duration-300">
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
  );
}
