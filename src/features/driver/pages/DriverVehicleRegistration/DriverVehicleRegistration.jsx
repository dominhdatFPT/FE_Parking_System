import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../contexts/useAuth';
import { bookingService } from '../../../../services/bookingService';
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

  // File Upload State (CCCD requires 2 sides)
  const [cccdFrontFile, setCccdFrontFile] = useState(null);
  const [cccdBackFile, setCccdBackFile] = useState(null);
  const [driverLicenseFile, setDriverLicenseFile] = useState(null);
  const [vehicleDocsFile, setVehicleDocsFile] = useState(null);
  const [licensePlateFile, setLicensePlateFile] = useState(null);

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

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) setter(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, setter) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setter(file);
  };

  const handleRemovePlan = (months) => {
    setSelectedPlans((prev) => prev.filter((m) => m !== months));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!cccdFrontFile) {
      setError('Vui lòng tải lên ảnh Mặt trước CCCD.');
      return;
    }
    if (!cccdBackFile) {
      setError('Vui lòng tải lên ảnh Mặt sau CCCD.');
      return;
    }
    if (!driverLicenseFile) {
      setError('Vui lòng tải lên bằng lái xe.');
      return;
    }
    if (!vehicleDocsFile) {
      setError('Vui lòng tải lên giấy tờ đăng ký xe.');
      return;
    }
    if (!licensePlateFile) {
      setError('Vui lòng tải lên ảnh biển số xe.');
      return;
    }

    setSubmitting(true);
    const payload = {
      username: user?.username || user?.fullName || 'driver_user',
      vehicleType,
      selectedPlans,
      cccdFront: cccdFrontFile.name,
      cccdBack: cccdBackFile.name,
      driverLicenseFile: driverLicenseFile.name,
      vehicleDocsFile: vehicleDocsFile.name,
      licensePlateFile: licensePlateFile.name,
    };

    const { error: err } = await bookingService.registerVehicleCard(payload);
    setSubmitting(false);

    if (err) {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
      return;
    }

    setSubmitted(true);
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
              accept="image/*,application/pdf"
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
              <span className="text-[11px] font-semibold text-slate-500">Tải ảnh lên</span>
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
  const totalSteps = 5;
  const completedSteps = [cccdFrontFile, cccdBackFile, driverLicenseFile, vehicleDocsFile, licensePlateFile].filter(Boolean).length;
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Đăng ký thẻ xe"
        subtitle="Cung cấp hồ sơ ảnh chụp minh chứng để đăng ký thẻ xe tháng"
        icon="assignment_ind"
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
                <h3 className="text-xl font-extrabold text-slate-800">Yêu cầu đang chờ duyệt</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 max-w-md">
                  Thông tin hồ sơ đăng ký thẻ xe của bạn đã được gửi lên hệ thống. Trạng thái hiện tại là <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">CHỜ DUYỆT</span>. Nhân viên sẽ tiến hành trích xuất thông tin từ ảnh chụp để xác minh hồ sơ và kích hoạt gói đăng ký cho bạn trong vòng 24h.
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
                      setLicensePlateFile(null);
                      setSelectedPlans([]);
                    }}
                  >
                    Đăng ký hồ sơ khác
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800">Hồ Sơ Minh Chứng</h3>
                    <p className="text-xs text-slate-400">Tải ảnh chụp rõ nét để hệ thống tự động nhận diện</p>
                  </div>
                  <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded">
                    Tài khoản: {user?.username || user?.fullName || 'Driver'}
                  </span>
                </div>

                {/* Vehicle Type Select */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-500">Loại phương tiện</label>
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
                      Xe máy
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
                      Ô tô
                    </button>
                  </div>
                </div>

                {/* Selected Plans List */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-500">Các gói đăng ký đã chọn</label>
                  {selectedPlans.length > 0 ? (
                    <div className="flex flex-wrap gap-2 rounded-xl bg-slate-50 border border-slate-200 p-3">
                      {selectedPlans.map((months) => (
                        <div
                          key={months}
                          className="flex items-center gap-1.5 bg-[#0EA5E9] text-white px-2.5 py-1 rounded-lg text-xs font-bold animate-in zoom-in-95 duration-150"
                        >
                          <span>Gói {months} tháng</span>
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
                      Chưa chọn gói (Mua trực tiếp tại bãi)
                    </div>
                  )}
                </div>

                <div className="h-px bg-slate-100 my-2" />

                {/* Document Uploads */}
                <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Hình ảnh minh chứng yêu cầu</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {renderFileDropzone("Mặt trước CCCD *", cccdFrontFile, setCccdFrontFile)}
                  {renderFileDropzone("Mặt sau CCCD *", cccdBackFile, setCccdBackFile)}
                  {renderFileDropzone("Bằng lái xe (Mặt trước) *", driverLicenseFile, setDriverLicenseFile)}
                  {renderFileDropzone("Ảnh đăng ký / Cà vẹt xe *", vehicleDocsFile, setVehicleDocsFile)}
                  <div className="sm:col-span-2">
                    {renderFileDropzone("Ảnh biển số xe thực tế *", licensePlateFile, setLicensePlateFile)}
                  </div>
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
                    Gửi yêu cầu xét duyệt
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Side: Checklist and Visual State */}
        <div className="lg:col-span-2 flex flex-col justify-start">
          <div className="sticky top-6 space-y-4">
            
            {/* Visual Smart Card Container */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-sky-950 p-6 text-white shadow-xl min-h-[220px] transition-all duration-300 hover:shadow-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col justify-between h-full">
                
                {/* Card Top Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                      <span className="material-symbols-outlined text-[20px] text-sky-400">smart_card</span>
                    </div>
                    <div>
                      <h4 className="text-[12px] font-black tracking-wide uppercase text-white/90">SmartParking Card</h4>
                      <p className="text-[8px] font-bold text-sky-400/80 tracking-widest uppercase">Member Pass</p>
                    </div>
                  </div>

                  <span className={`rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider ${
                    submitted ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  }`}>
                    {submitted ? 'Chờ duyệt' : 'Đang tải hồ sơ'}
                  </span>
                </div>

                {/* Center Content: Progress ring or checklist indicator */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Trạng thái hồ sơ</p>
                    <p className="text-sm font-black text-white">
                      {completedSteps === totalSteps ? 'Hoàn thành hồ sơ' : `Đang tải: ${completedSteps}/${totalSteps} ảnh`}
                    </p>
                  </div>
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 border-2 border-slate-700 font-bold text-xs">
                    {completionPercentage}%
                  </div>
                </div>

                {/* Plan Info Card if Selected */}
                <div className="mt-5 flex items-end justify-between text-[10px] border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Chủ tài khoản</p>
                    <p className="font-extrabold tracking-wide text-white">
                      {user?.username || user?.fullName || 'driver_user'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Loại xe</p>
                    <p className="font-extrabold text-sky-400">
                      {vehicleType === 'CAR' ? 'Ô TÔ' : 'XE MÁY'}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Selected Packages Details & Invoice summary */}
            {selectedPlans.length > 0 && (
              <div className="rounded-2xl bg-sky-50/50 border border-sky-100 p-5 space-y-3 animate-in fade-in duration-300">
                <div className="border-b border-sky-100 pb-2">
                  <p className="font-black text-sky-800 text-xs uppercase tracking-wider">Tóm tắt các gói đăng ký</p>
                </div>
                <div className="space-y-2 text-xs">
                  {selectedPlans.map((months) => (
                    <div key={months} className="flex justify-between items-center text-slate-600">
                      <span className="font-semibold">Gói {months} tháng:</span>
                      <span className="font-bold">{getPlanPrice(months).toLocaleString('vi-VN')} đ</span>
                    </div>
                  ))}
                  <div className="h-px bg-sky-100 my-1" />
                  <div className="flex justify-between items-center text-sky-950 font-black text-xs">
                    <span>Tổng phí dự kiến:</span>
                    <span>{totalPrice.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>
            )}

            {/* Checklist of Uploaded Docs */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-700">Tiến trình hồ sơ của bạn</h4>
              <div className="space-y-2.5">
                {[
                  { name: 'Mặt trước CCCD', uploaded: !!cccdFrontFile },
                  { name: 'Mặt sau CCCD', uploaded: !!cccdBackFile },
                  { name: 'Bằng lái xe', uploaded: !!driverLicenseFile },
                  { name: 'Ảnh đăng ký xe', uploaded: !!vehicleDocsFile },
                  { name: 'Ảnh biển số xe', uploaded: !!licensePlateFile }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-xs font-semibold">
                    <span className={item.uploaded ? 'text-slate-700' : 'text-slate-400'}>{item.name}</span>
                    <span className={`material-symbols-outlined text-[16px] ${item.uploaded ? 'text-emerald-500 font-bold' : 'text-slate-200'}`}>
                      {item.uploaded ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
