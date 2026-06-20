import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Bike,
  Car,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  FileImage,
  LoaderCircle,
  MessageCircle,
  Minus,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { ROUTES } from '../constants/routes';
import { apiClient } from '../services/apiClient';
import { bookingService } from '../services/bookingService';

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const EMPTY_FILES = {
  cccdFrontImage: null,
  cccdBackImage: null,
  licenseImage: null,
  vehicleDocumentImage: null,
  plateImage: null,
};

const DOCUMENTS = [
  { key: 'cccdFrontImage', label: 'CCCD mặt trước' },
  { key: 'cccdBackImage', label: 'CCCD mặt sau' },
  { key: 'licenseImage', label: 'Bằng lái xe' },
  { key: 'vehicleDocumentImage', label: 'Giấy đăng ký xe / cà vẹt' },
  { key: 'plateImage', label: 'Ảnh biển số xe thực tế' },
];

const VEHICLE_TYPES = [
  { id: 1, code: 'MOTORBIKE', label: 'Xe máy', icon: Bike },
  { id: 2, code: 'CAR', label: 'Ô tô', icon: Car },
];

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new window.FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error(`Không thể đọc ảnh ${file.name}`));
  reader.readAsDataURL(file);
});

const formatPrice = (value) => {
  const price = Number(value);
  return `${(Number.isFinite(price) ? price : 0).toLocaleString('vi-VN')} đ`;
};

export default function AiChatWidget() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [vehicleType, setVehicleType] = useState(null);
  const [feePackages, setFeePackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [files, setFiles] = useState(EMPTY_FILES);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [registrationId, setRegistrationId] = useState(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const resetFlow = () => {
    setStep(0);
    setVehicleType(null);
    setFeePackages([]);
    setSelectedPackage(null);
    setFiles(EMPTY_FILES);
    setLoadingPackages(false);
    setSubmitting(false);
    setError('');
    setRegistrationId(null);
  };

  const fetchFeePackages = async (type) => {
    setStep(2);
    setVehicleType(type);
    setSelectedPackage(null);
    setFeePackages([]);
    setError('');
    setLoadingPackages(true);
    try {
      const response = await apiClient.get('/api/v1/fee-packages', {
        params: { vehicleTypeId: type.id },
      });
      setFeePackages(response.data?.data ?? response.data ?? []);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Không thể tải danh sách gói cước. Vui lòng thử lại.');
    } finally {
      setLoadingPackages(false);
    }
  };

  const validateAndSetFile = (key, file) => {
    setError('');
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Chỉ chấp nhận ảnh JPEG, PNG hoặc WEBP; không nhận PDF.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Mỗi ảnh không được vượt quá 4 MB. Vui lòng giảm dung lượng ảnh.');
      return;
    }
    setFiles((current) => ({ ...current, [key]: file }));
  };

  const handleFileChange = (key, event) => {
    const file = event.target.files?.[0];
    if (file) validateAndSetFile(key, file);
    event.target.value = '';
  };

  const handleDrop = (key, event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) validateAndSetFile(key, file);
  };

  const removeFile = (key) => {
    setFiles((current) => ({ ...current, [key]: null }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!vehicleType || !DOCUMENTS.every(({ key }) => files[key]) || submitting) return;
    setSubmitting(true);
    setError('');

    try {
      const encodedFiles = await Promise.all(
        DOCUMENTS.map(async ({ key }) => [key, await fileToBase64(files[key])]),
      );
      const payload = {
        vehicleTypeId: vehicleType.id,
        ...Object.fromEntries(encodedFiles),
      };
      const result = await bookingService.registerVehicleCard(payload);
      if (result.error) {
        setError(
          result.message
          || result.error?.response?.data?.message
          || result.error?.message
          || 'Không thể gửi hồ sơ. Vui lòng thử lại.',
        );
        return;
      }
      setRegistrationId(result.data?.registrationId ?? result.data?.id ?? null);
      setStep(4);
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message
        || submitError?.message
        || 'Không thể đọc hoặc gửi ảnh. Vui lòng thử lại.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    setError('');
    if (step === 3) setStep(2);
    if (step === 2) setStep(1);
    if (step === 1) setStep(0);
  };

  const goToFeePlans = () => {
    navigate(ROUTES.DRIVER.FEE_PLANS, {
      state: {
        selectedType: vehicleType?.code,
        selectedPackage,
        selectedPlanId: selectedPackage?.id,
      },
    });
    setIsOpen(false);
  };

  const completedFileCount = DOCUMENTS.filter(({ key }) => files[key]).length;
  const allFilesSelected = completedFileCount === DOCUMENTS.length;

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Mở trung tâm dịch vụ"
            className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-600/30 ring-2 ring-white/30 sm:bottom-6 sm:right-6"
          >
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
            <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-widget-title"
            className="fixed bottom-4 right-4 z-50 flex h-[min(720px,calc(100vh-2rem))] w-[calc(100vw-2rem)] max-w-md origin-bottom-right flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 sm:bottom-24 sm:right-6 sm:h-[min(680px,calc(100vh-7rem))]"
          >
            <header className="flex items-start justify-between bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-4 text-white">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Car className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 id="service-widget-title" className="text-sm font-semibold">Dịch vụ Smart Parking</h2>
                  <p className="mt-0.5 truncate text-xs text-blue-100">
                    {step === 0 ? 'Chọn dịch vụ bạn cần' : `Đăng ký thẻ xe · Bước ${Math.min(step, 4)}/4`}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={resetFlow}
                    disabled={submitting}
                    aria-label="Làm lại từ đầu"
                    title="Làm lại từ đầu"
                    className="rounded-lg p-1.5 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Thu nhỏ cửa sổ dịch vụ"
                  className="rounded-lg p-1.5 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Đóng cửa sổ dịch vụ"
                  className="rounded-lg p-1.5 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </header>

            {step > 0 && step < 4 && (
              <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-4 py-3">
                {[1, 2, 3, 4].map((number) => (
                  <div key={number} className="flex flex-1 items-center gap-2">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                        number <= step ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {number}
                    </span>
                    {number < 4 && <span className={`h-0.5 flex-1 ${number < step ? 'bg-blue-500' : 'bg-slate-200'}`} />}
                  </div>
                ))}
              </div>
            )}

            <main className="flex-1 overflow-y-auto bg-slate-50/70 p-4">
              {step === 0 && (
                <div>
                  <div className="mb-4 rounded-2xl border border-slate-100 bg-white p-4 text-sm leading-relaxed text-slate-600 shadow-sm">
                    Xin chào! Vui lòng chọn dịch vụ bạn muốn thực hiện ngay trong cửa sổ này.
                  </div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Dịch vụ hiện có</p>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <Car className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-slate-800">Đăng ký thẻ xe</span>
                      <span className="mt-1 block text-xs leading-relaxed text-slate-500">Chọn loại xe, tham khảo gói và gửi ảnh hồ sơ xét duyệt.</span>
                    </span>
                    <ChevronRight className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </button>
                </div>
              )}

              {step === 1 && (
                <div>
                  <button type="button" onClick={goBack} className="mb-4 flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Quay lại dịch vụ
                  </button>
                  <h3 className="text-lg font-bold text-slate-800">Chọn loại xe</h3>
                  <p className="mt-1 text-sm text-slate-500">Chúng tôi sẽ đề xuất các gói phù hợp với loại xe của bạn.</p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {VEHICLE_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => fetchFeePackages(type)}
                          className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 font-bold text-slate-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <Icon className="h-9 w-9 text-blue-600" aria-hidden="true" />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <button type="button" onClick={goBack} className="mb-4 flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Chọn lại loại xe
                  </button>
                  <h3 className="text-lg font-bold text-slate-800">Gói dành cho {vehicleType?.label}</h3>
                  <p className="mt-1 text-sm text-slate-500">Bạn có thể chọn trước một gói hoặc bỏ qua và mua sau khi hồ sơ được duyệt.</p>

                  {loadingPackages && (
                    <div role="status" className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500">
                      <LoaderCircle className="h-5 w-5 animate-spin text-blue-600" aria-hidden="true" /> Đang tải gói cước...
                    </div>
                  )}

                  {!loadingPackages && error && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{error}</span>
                      </div>
                      <button type="button" onClick={() => fetchFeePackages(vehicleType)} className="mt-3 font-bold underline">Thử tải lại</button>
                    </div>
                  )}

                  {!loadingPackages && !error && (
                    <div className="mt-4 space-y-3">
                      {feePackages.length === 0 && (
                        <p className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-500">Hiện chưa có gói cước phù hợp.</p>
                      )}
                      {feePackages.map((feePackage) => {
                        const isSelected = selectedPackage?.id === feePackage.id;
                        return (
                          <button
                            key={feePackage.id}
                            type="button"
                            onClick={() => setSelectedPackage(feePackage)}
                            aria-pressed={isSelected}
                            className={`flex w-full items-center gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-300'
                            }`}
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                              <CircleDollarSign className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-bold text-slate-800">{feePackage.name}</span>
                              <span className="mt-1 block text-xs text-slate-500">{feePackage.durationMonths} tháng</span>
                            </span>
                            <span className="text-sm font-bold text-blue-700">{formatPrice(feePackage.price ?? feePackage.currentPrice)}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {!loadingPackages && !error && (
                    <div className="mt-5 grid gap-2">
                      {selectedPackage && (
                        <button type="button" onClick={() => setStep(3)} className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                          Tiếp tục với gói {selectedPackage.name}
                        </button>
                      )}
                      <button type="button" onClick={() => { setSelectedPackage(null); setStep(3); }} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        Bỏ qua, chọn sau
                      </button>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div>
                  <button type="button" onClick={goBack} disabled={submitting} className="mb-4 flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 disabled:opacity-50">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Quay lại chọn gói
                  </button>
                  <h3 className="text-lg font-bold text-slate-800">Tải ảnh hồ sơ</h3>
                  <p className="mt-1 text-sm text-slate-500">Cần đủ 5 ảnh rõ nét. Mỗi ảnh tối đa 4 MB.</p>
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs leading-relaxed text-blue-800">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    Họ tên và biển số sẽ được hệ thống đọc từ ảnh sau khi gửi hồ sơ.
                  </div>

                  <div className="mt-4 space-y-3">
                    {DOCUMENTS.map(({ key, label }) => {
                      const file = files[key];
                      return (
                        <div key={key}>
                          <label htmlFor={`widget-${key}`} className="mb-1.5 block text-xs font-bold text-slate-600">{label} <span className="text-red-500">*</span></label>
                          <div
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={(event) => handleDrop(key, event)}
                            className={`relative flex min-h-16 items-center rounded-xl border border-dashed px-3 py-2 transition ${
                              file ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/40'
                            }`}
                          >
                            {file ? (
                              <div className="flex min-w-0 flex-1 items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                                <span className="min-w-0 flex-1 truncate text-xs font-semibold text-emerald-800">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile(key)}
                                  disabled={submitting}
                                  aria-label={`Xóa ảnh ${label}`}
                                  className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                                >
                                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <input
                                  id={`widget-${key}`}
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  onChange={(event) => handleFileChange(key, event)}
                                  disabled={submitting}
                                  className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                                />
                                <div className="flex w-full items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                                  <Upload className="h-4 w-4 text-blue-500" aria-hidden="true" /> Chọn hoặc thả ảnh vào đây
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {error && (
                    <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {error}
                    </div>
                  )}

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">
                      <span>Ảnh đã chọn</span><span>{completedFileCount}/5</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!allFilesSelected || submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <FileImage className="h-4 w-4" aria-hidden="true" />}
                      {submitting ? 'Đang gửi hồ sơ...' : 'Gửi yêu cầu xét duyệt'}
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="flex min-h-full flex-col items-center justify-center py-8 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-11 w-11" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-800">Gửi hồ sơ thành công</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
                    Đã gửi hồ sơ{registrationId ? ` #${registrationId}` : ''}, đang chờ nhân viên duyệt.
                  </p>
                  <div className="mt-6 grid w-full gap-2">
                    {selectedPackage && (
                      <button
                        type="button"
                        onClick={goToFeePlans}
                        className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Đi mua gói {selectedPackage.name}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={resetFlow}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <RotateCcw className="h-4 w-4" aria-hidden="true" /> Làm lại từ đầu
                    </button>
                  </div>
                </div>
              )}
            </main>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
