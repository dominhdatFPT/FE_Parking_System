import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import {
  KeyRound,
  Eye,
  EyeOff,
  Check,
  X,
  Lock,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Ban,
  Phone,
  Save
} from 'lucide-react';
import { useAuth } from '../../../../contexts/useAuth';
import { apiClient } from '../../../../services/apiClient';
import { API_ENDPOINTS } from '../../../../services/endpoints';
import { vietnamDayjs } from '../../../../utils/dateTime';
import PageHeader from '../../components/PageHeader';

const tProfile = {
  vi: {
    resetPasswordBtn: 'Đặt lại mật khẩu',
    modalTitle: 'Đặt lại mật khẩu',
    step: 'Bước',
    of: 'trên',
    currentPassword: 'Mật khẩu hiện tại',
    currentPasswordPlaceholder: 'Nhập mật khẩu hiện tại của bạn',
    currentPasswordDesc: 'Vui lòng nhập mật khẩu hiện tại để xác minh bạn là chủ sở hữu tài khoản.',
    newPassword: 'Mật khẩu mới',
    newPasswordPlaceholder: 'Nhập mật khẩu mới',
    newPasswordDesc: 'Tạo mật khẩu mới có độ bảo mật cao.',
    confirmPassword: 'Xác nhận mật khẩu mới',
    confirmPasswordPlaceholder: 'Nhập lại mật khẩu mới',
    confirmPasswordDesc: 'Nhập lại mật khẩu mới để đảm bảo tính chính xác.',
    passwordStrength: 'Độ mạnh mật khẩu',
    strengthWeak: 'Yêu',
    strengthMedium: 'Trung bình',
    strengthStrong: 'Mạnh',
    criterionLength: 'Tối thiểu 8 ký tự',
    criterionCase: 'Chữ hoa và chữ thường',
    criterionSpecial: 'Số hoặc ký tự đặc biệt',
    matchSuccess: 'Mật khẩu khớp',
    matchError: 'Mật khẩu không khớp',
    btnContinue: 'Tiếp tục',
    btnCancel: 'Hủy',
    btnSubmit: 'Cập nhật mật khẩu',
    btnDone: 'Hoàn tất',
    successTitle: 'Đặt lại mật khẩu thành công!',
    successDesc: 'Mật khẩu của bạn đã được cập nhật thành công. Vui lòng sử dụng mật khẩu mới cho các lần đăng nhập tiếp theo.',
    errorRequired: 'Trường này không được để trống.',
    errorVerifyFailed: 'Mật khẩu hiện tại không chính xác.',
    errorGeneric: 'Có lỗi xảy ra khi cập nhật mật khẩu.',
    verifying: 'Đang xác thực...',
    updating: 'Đang cập nhật...',
    hide: 'Ẩn',
    show: 'Hiện',
    usageTitle: 'Tổng quan sử dụng',
    usageSubtitle: 'Hoạt động đặt chỗ và thanh toán gần đây của bạn',
    totalBookings: 'Tổng lượt đặt chỗ',
    confirmedBookings: 'Đã xác nhận',
    paidBookings: 'Đã thanh toán',
    latestActivity: 'Hoạt động gần nhất',
    noActivity: 'Bạn chưa có hoạt động đặt chỗ nào.',
    usageLoadError: 'Chưa thể tải hoạt động sử dụng. Vui lòng thử lại sau.',
    noEmail: 'Chưa có email',
    role: 'Vai trò',
    vehicleManagement: 'Quản lý phương tiện',
    vehicleManagementDesc: 'Các xe đã đăng ký với tài khoản này',
    loadingUsage: 'Đang tải tổng quan sử dụng',
    loadingVehicles: 'Đang tải danh sách xe',
    vehicleLoadError: 'Không thể tải danh sách xe đã đăng ký. Vui lòng thử lại sau.',
    noVehicles: 'Tài khoản này chưa có xe nào được đăng ký.',
    licensePlateLabel: 'Biển số',
    planLabel: 'Gói đăng ký',
    cancelSubscriptionBtn: 'Hủy đăng ký thẻ',
    cancelSelectTitle: 'Chọn xe cần hủy',
    cancelSelectDesc: 'Chọn xe đang có gói đăng ký hoạt động mà bạn muốn hủy.',
    cancelSelectLoading: 'Đang tải danh sách gói đăng ký...',
    cancelSelectLoadError: 'Không thể tải danh sách gói đăng ký. Vui lòng thử lại sau.',
    cancelSelectEmpty: 'Bạn không có xe nào đang có gói đăng ký hoạt động.',
    cancelPlanLabel: 'Gói cước',
    cancelPlateLabel: 'Biển số',
    cancelExpiryLabel: 'Hết hạn',
    cancelPriceLabel: 'Giá gói',
    cancelModalTitle: 'Xác nhận hủy đăng ký thẻ',
    cancelModalDesc: 'Bạn có chắc chắn muốn hủy gói đăng ký thẻ dưới đây không?',
    cancelModalWarning: 'Sau khi hủy, gói đăng ký sẽ ngừng hiệu lực ngay lập tức và không thể hoàn tác.',
    cancelModalConfirmBtn: 'Xác nhận hủy',
    cancelling: 'Đang hủy...',
    btnBack: 'Quay lại',
    cancelSuccessTitle: 'Đã hủy đăng ký thẻ!',
    cancelSuccessDesc: 'Gói đăng ký của xe đã được hủy thành công.',
    cancelErrorGeneric: 'Không thể hủy đăng ký thẻ. Vui lòng thử lại sau.',
  },
  en: {
    resetPasswordBtn: 'Reset Password',
    modalTitle: 'Reset Password',
    step: 'Step',
    of: 'of',
    currentPassword: 'Current Password',
    currentPasswordPlaceholder: 'Enter your current password',
    currentPasswordDesc: 'Please enter your current password to verify you are the account owner.',
    newPassword: 'New Password',
    newPasswordPlaceholder: 'Enter new password',
    newPasswordDesc: 'Create a secure new password.',
    confirmPassword: 'Confirm New Password',
    confirmPasswordPlaceholder: 'Re-enter new password',
    confirmPasswordDesc: 'Re-enter the new password to ensure accuracy.',
    passwordStrength: 'Password Strength',
    strengthWeak: 'Weak',
    strengthMedium: 'Medium',
    strengthStrong: 'Strong',
    criterionLength: 'At least 8 characters',
    criterionCase: 'Uppercase & lowercase letters',
    criterionSpecial: 'Number or special character',
    matchSuccess: 'Passwords match',
    matchError: 'Passwords do not match',
    btnContinue: 'Continue',
    btnCancel: 'Cancel',
    btnSubmit: 'Update Password',
    btnDone: 'Done',
    successTitle: 'Password reset successful!',
    successDesc: 'Your password has been updated successfully. Please use your new password for future logins.',
    errorRequired: 'This field is required.',
    errorVerifyFailed: 'Current password is incorrect.',
    errorGeneric: 'Something went wrong while updating your password.',
    verifying: 'Verifying...',
    updating: 'Updating...',
    hide: 'Hide',
    show: 'Show',
    usageTitle: 'Usage overview',
    usageSubtitle: 'Your recent booking and payment activity',
    totalBookings: 'Total bookings',
    confirmedBookings: 'Confirmed',
    paidBookings: 'Paid',
    latestActivity: 'Latest activity',
    noActivity: 'You have no booking activity yet.',
    usageLoadError: 'Usage activity is unavailable right now. Please try again later.',
    noEmail: 'No email available',
    role: 'Role',
    vehicleManagement: 'Vehicle Management',
    vehicleManagementDesc: 'Vehicles registered with this account',
    loadingUsage: 'Loading usage overview',
    loadingVehicles: 'Loading registered vehicles',
    vehicleLoadError: 'Could not load registered vehicles. Please try again later.',
    noVehicles: 'This account has no registered vehicles yet.',
    licensePlateLabel: 'License plate',
    planLabel: 'Subscription plan',
    cancelSubscriptionBtn: 'Cancel Subscription',
    cancelSelectTitle: 'Select a vehicle to cancel',
    cancelSelectDesc: 'Choose the vehicle with an active subscription you want to cancel.',
    cancelSelectLoading: 'Loading your subscriptions...',
    cancelSelectLoadError: 'Could not load your subscriptions. Please try again later.',
    cancelSelectEmpty: 'You have no vehicles with an active subscription.',
    cancelPlanLabel: 'Plan',
    cancelPlateLabel: 'License plate',
    cancelExpiryLabel: 'Expires',
    cancelPriceLabel: 'Plan price',
    cancelModalTitle: 'Confirm cancellation',
    cancelModalDesc: 'Are you sure you want to cancel the subscription below?',
    cancelModalWarning: 'Once cancelled, the subscription will stop immediately and this cannot be undone.',
    cancelModalConfirmBtn: 'Confirm cancellation',
    cancelling: 'Cancelling...',
    btnBack: 'Back',
    cancelSuccessTitle: 'Subscription cancelled!',
    cancelSuccessDesc: "The vehicle's subscription has been cancelled successfully.",
    cancelErrorGeneric: 'Could not cancel the subscription. Please try again later.',
  }
};

const unwrapVehicleList = (payload) => {
  const data = payload?.data ?? payload;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.records)) return data.records;
  if (Array.isArray(data?.vehicles)) return data.vehicles;
  if (Array.isArray(data?.data)) return data.data;
  return Array.isArray(data) ? data : [];
};

const normalizeVehicleTypeName = (vehicle) => {
  const raw = vehicle.vehicleTypeName || vehicle.vehicleType || vehicle.vehicleTypeCode || vehicle.type || '';
  const normalized = String(raw).toUpperCase();
  if (normalized.includes('CAR') || normalized.includes('OTO') || normalized.includes('Ô TÔ')) return 'Ô tô';
  if (normalized.includes('MOTOR') || normalized.includes('BIKE') || normalized.includes('MOTO') || normalized.includes('XE MÁY')) return 'Xe máy';
  return raw || 'Chưa có dữ liệu';
};

const normalizeRegisteredVehicle = (vehicle) => ({
  id: vehicle.vehicleId || vehicle.id || vehicle.registrationId || vehicle.licensePlate,
  licensePlate: vehicle.licensePlate || vehicle.plateNumber || vehicle.vehiclePlate || 'Chưa có biển số',
  vehicleType: normalizeVehicleTypeName(vehicle),
  status: vehicle.subscriptionStatus || vehicle.registrationStatus || vehicle.status || '',
  planName: vehicle.planName || vehicle.packageName || vehicle.subscriptionPlanName || '',
  endDate: vehicle.endDate || vehicle.expiredAt || vehicle.expireAt || vehicle.validUntil || null,
});

export default function DriverProfile() {
  const { user, setUser } = useAuth();
  const { t, i18n } = useTranslation();
  const displayName = user?.fullName || user?.name || 'Driver';

  const currentLanguage = i18n.language.startsWith('en') ? 'en' : 'vi';
  const localT = tProfile[currentLanguage];
  const phoneTexts = currentLanguage === 'vi'
    ? {
        label: 'Số điện thoại',
        placeholder: 'Nhập số điện thoại',
        help: 'Dùng để nhận hỗ trợ khi có sự cố bảo vệ hoặc thanh toán.',
        save: 'Lưu',
        saved: 'Đã cập nhật số điện thoại.',
        invalid: 'Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số.',
        error: 'Không thể cập nhật số điện thoại.',
      }
    : {
        label: 'Phone number',
        placeholder: 'Enter phone number',
        help: 'Used for support when security or payment incidents need follow-up.',
        save: 'Save',
        saved: 'Phone number updated.',
        invalid: 'Phone number must start with 0 and contain 10-11 digits.',
        error: 'Could not update phone number.',
      };
  const [registeredVehicles, setRegisteredVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [vehiclesError, setVehiclesError] = useState(false);
  const [phoneDraft, setPhoneDraft] = useState(user?.phone || '');
  const [phoneStatus, setPhoneStatus] = useState('idle');
  const [phoneMessage, setPhoneMessage] = useState('');

  // Reset password states
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Verify, 2: New Pwd, 3: Confirm Pwd, 4: Success
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Cancel subscription states
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelStep, setCancelStep] = useState('select'); // select | confirm | success
  const [cancelStatus, setCancelStatus] = useState('idle'); // idle | loading | success | error
  const [cancelErrorMsg, setCancelErrorMsg] = useState('');
  const [cancelableSubscriptions, setCancelableSubscriptions] = useState([]);
  const [cancelListLoading, setCancelListLoading] = useState(false);
  const [cancelListError, setCancelListError] = useState(false);
  const [selectedCancelSub, setSelectedCancelSub] = useState(null);

  useEffect(() => {
    setPhoneDraft(user?.phone || '');
    setPhoneStatus('idle');
    setPhoneMessage('');
  }, [user?.phone]);

  useEffect(() => {
    let cancelled = false;

    async function loadRegisteredVehicles() {
      setVehiclesLoading(true);
      setVehiclesError(false);

      try {
        const response = await apiClient.get(API_ENDPOINTS.FEE.MY_VEHICLES);
        if (cancelled) return;
        setRegisteredVehicles(unwrapVehicleList(response.data).map(normalizeRegisteredVehicle));
      } catch {
        if (cancelled) return;
        setRegisteredVehicles([]);
        setVehiclesError(true);
      } finally {
        if (!cancelled) setVehiclesLoading(false);
      }
    }

    loadRegisteredVehicles();

    return () => {
      cancelled = true;
    };
  }, []);

  // Password criteria check
  const criteria = useMemo(() => {
    return {
      hasLength: newPassword.length >= 8,
      hasCase: /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword),
      hasSpecial: /\d/.test(newPassword) || /[^A-Za-z0-9]/.test(newPassword),
    };
  }, [newPassword]);

  // Password strength score
  const strengthScore = useMemo(() => {
    let score = 0;
    if (criteria.hasLength) score += 1;
    if (criteria.hasCase) score += 1;
    if (criteria.hasSpecial) score += 1;
    return score;
  }, [criteria]);

  const strengthLabel = useMemo(() => {
    if (!newPassword) return '';
    if (strengthScore <= 1) return localT.strengthWeak;
    if (strengthScore === 2) return localT.strengthMedium;
    return localT.strengthStrong;
  }, [newPassword, strengthScore, localT]);

  const strengthColor = useMemo(() => {
    if (strengthScore <= 1) return 'bg-rose-500';
    if (strengthScore === 2) return 'bg-amber-500';
    return 'bg-emerald-500';
  }, [strengthScore]);

  const normalizedPhone = useMemo(() => phoneDraft.trim().replace(/\s+/g, ''), [phoneDraft]);
  const storedPhone = String(user?.phone || '');
  const isPhoneChanged = normalizedPhone !== storedPhone;
  const isPhoneValid = normalizedPhone === '' || /^0\d{9,10}$/.test(normalizedPhone);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();

    if (!isPhoneValid) {
      setPhoneStatus('error');
      setPhoneMessage(phoneTexts.invalid);
      return;
    }

    setPhoneStatus('saving');
    setPhoneMessage('');

    try {
      const response = await apiClient.patch(API_ENDPOINTS.PROFILE.UPDATE, { phone: normalizedPhone });
      const updatedProfile = response.data?.data ?? response.data ?? {};
      setUser((currentUser) => ({
        ...currentUser,
        id: updatedProfile.userId ?? updatedProfile.id ?? currentUser?.id,
        fullName: updatedProfile.fullName ?? currentUser?.fullName,
        name: updatedProfile.fullName ?? currentUser?.name,
        email: updatedProfile.email ?? currentUser?.email,
        phone: updatedProfile.phone ?? normalizedPhone,
        avatarUrl: updatedProfile.avatarUrl ?? currentUser?.avatarUrl,
        role: updatedProfile.role ?? currentUser?.role,
      }));
      setPhoneDraft(updatedProfile.phone ?? normalizedPhone);
      setPhoneStatus('success');
      setPhoneMessage(phoneTexts.saved);
    } catch (error) {
      setPhoneStatus('error');
      setPhoneMessage(error.response?.data?.message || phoneTexts.error);
    }
  };

  // Reset form states
  const handleCloseModal = () => {
    setIsResetModalOpen(false);
    // Delay resetting states so transitions complete first
    setTimeout(() => {
      setCurrentStep(1);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setErrorMsg('');
      setIsLoading(false);
    }, 300);
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setErrorMsg(localT.errorRequired);
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    try {
      await apiClient.post(API_ENDPOINTS.PROFILE.VERIFY_PASSWORD, { password: currentPassword });
      setCurrentStep(2);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || localT.errorVerifyFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    if (strengthScore < 2) {
      setErrorMsg(currentLanguage === 'vi' ? 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.' : 'Password is too weak. Please choose a stronger password.');
      return;
    }
    setErrorMsg('');
    setCurrentStep(3);
  };

  const handleStep3Submit = async (e) => {
    e.preventDefault();
    if (!confirmPassword) {
      setErrorMsg(localT.errorRequired);
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg(localT.matchError);
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    try {
      await apiClient.post(API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });
      setCurrentStep(4);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || localT.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCancelModal = async () => {
    setIsCancelModalOpen(true);
    setCancelStep('select');
    setCancelListLoading(true);
    setCancelListError(false);

    try {
      const res = await apiClient.get(API_ENDPOINTS.FEE.MY_SUBSCRIPTIONS);
      const all = res.data?.data ?? [];
      setCancelableSubscriptions(all.filter((sub) => sub.status === 'ACTIVE'));
    } catch {
      setCancelListError(true);
      setCancelableSubscriptions([]);
    } finally {
      setCancelListLoading(false);
    }
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
    setTimeout(() => {
      setCancelStep('select');
      setCancelStatus('idle');
      setCancelErrorMsg('');
      setSelectedCancelSub(null);
      setCancelableSubscriptions([]);
    }, 300);
  };

  const handleSelectCancelSub = (sub) => {
    setSelectedCancelSub(sub);
    setCancelStep('confirm');
  };

  const handleConfirmCancelSubscription = async () => {
    if (!selectedCancelSub) return;
    setCancelStatus('loading');
    setCancelErrorMsg('');

    try {
      await apiClient.patch(API_ENDPOINTS.FEE.CANCEL_SUBSCRIPTION(selectedCancelSub.id));
      setCancelStatus('success');
      setCancelStep('success');
    } catch (error) {
      setCancelStatus('error');
      setCancelErrorMsg(error.response?.data?.message || localT.cancelErrorGeneric);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t('sidebar.profile')} subtitle={user?.email || ''} icon="person" />

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-slate-100/80 bg-white p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-3xl font-bold text-white shadow-lg shadow-sky-200/50">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-800">{displayName}</h2>
          <p className="mt-1 text-sm text-slate-500">{user?.email || localT.noEmail}</p>
          
          <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-left text-sm ring-1 ring-slate-100">
            <p className="text-slate-400">{localT.role}</p>
            <p className="font-semibold text-slate-700">{user?.role || 'driver'}</p>
          </div>

          <form onSubmit={handlePhoneSubmit} className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-left ring-1 ring-slate-100">
            <label className="text-xs font-semibold uppercase text-slate-400" htmlFor="driver-phone">
              {phoneTexts.label}
            </label>
            <div className="mt-2 flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="driver-phone"
                  type="tel"
                  inputMode="tel"
                  value={phoneDraft}
                  onChange={(e) => {
                    setPhoneDraft(e.target.value.replace(/[^\d\s]/g, ''));
                    if (phoneStatus !== 'idle') {
                      setPhoneStatus('idle');
                      setPhoneMessage('');
                    }
                  }}
                  placeholder={phoneTexts.placeholder}
                  disabled={phoneStatus === 'saving'}
                  className={`h-11 w-full rounded-xl border bg-white py-2 pl-9 pr-3 text-sm font-semibold text-slate-800 outline-none transition focus:ring-4 ${
                    phoneStatus === 'error'
                      ? 'border-rose-200 focus:border-rose-400 focus:ring-rose-100'
                      : 'border-slate-200 focus:border-sky-500 focus:ring-sky-100'
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={phoneStatus === 'saving' || !isPhoneChanged || !isPhoneValid}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-500 text-white shadow-sm shadow-sky-200 transition hover:bg-sky-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
                aria-label={phoneTexts.save}
                title={phoneTexts.save}
              >
                {phoneStatus === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">{phoneTexts.help}</p>
            {phoneMessage && (
              <p className={`mt-2 text-xs font-semibold ${phoneStatus === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {phoneMessage}
              </p>
            )}
          </form>

          <button
            onClick={() => setIsResetModalOpen(true)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] cursor-pointer"
          >
            <KeyRound className="h-4 w-4 text-slate-500" />
            {localT.resetPasswordBtn}
          </button>

          <button
            onClick={handleOpenCancelModal}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/60 px-4 py-2.5 text-sm font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50 hover:border-rose-300 active:scale-[0.98] cursor-pointer"
          >
            <Ban className="h-4 w-4 text-rose-500" />
            {localT.cancelSubscriptionBtn}
          </button>
        </div>

        <div className="space-y-6">
          <section className="overflow-hidden rounded-[24px] bg-white shadow-[0_18px_50px_rgba(30,64,175,0.08)] ring-1 ring-slate-900/[0.05]">
            <header className="flex items-start justify-between gap-4 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_48%),linear-gradient(135deg,#f8fbff_0%,#ffffff_70%)] px-5 pb-5 pt-5 sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-600">
                  Smart Parking
                </p>
                <h3 className="mt-1 text-lg font-bold tracking-[-0.02em] text-slate-900">
                  {localT.vehicleManagement}
                </h3>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {localT.vehicleManagementDesc}
                </p>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                <span className="material-symbols-outlined text-[22px]">directions_car</span>
              </span>
            </header>

            <div className="px-5 pb-5 sm:px-6 sm:pb-6">
              {vehiclesLoading ? (
                <div className="grid gap-3" aria-label={localT.loadingVehicles}>
                  {[1, 2].map((item) => (
                    <div key={item} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                  ))}
                </div>
              ) : vehiclesError ? (
                <div className="flex items-start gap-3 rounded-2xl bg-rose-50 px-4 py-4 text-sm text-rose-700 ring-1 ring-rose-100">
                  <span className="material-symbols-outlined mt-0.5 text-[19px]">error</span>
                  <p className="leading-5">{localT.vehicleLoadError}</p>
                </div>
              ) : registeredVehicles.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 ring-1 ring-slate-100">
                    <span className="material-symbols-outlined text-[28px]">directions_car_off</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-500">{localT.noVehicles}</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {registeredVehicles.map((vehicle) => (
                    <article
                      key={vehicle.id || vehicle.licensePlate}
                      className="rounded-2xl bg-slate-50/90 p-4 ring-1 ring-slate-900/[0.045]"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-sky-600 shadow-sm ring-1 ring-sky-100">
                            <span className="material-symbols-outlined text-[23px]">
                              {vehicle.vehicleType === 'Ô tô' ? 'directions_car' : 'two_wheeler'}
                            </span>
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-base font-bold text-slate-900">{vehicle.licensePlate}</p>
                            <p className="mt-0.5 text-sm font-medium text-slate-500">{vehicle.vehicleType}</p>
                          </div>
                        </div>

                        {vehicle.status && (
                          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {vehicle.status}
                          </span>
                        )}
                      </div>

                      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-100">
                          <dt className="text-[10px] font-bold uppercase text-slate-400">{localT.licensePlateLabel}</dt>
                          <dd className="mt-1 truncate text-sm font-semibold text-slate-800">{vehicle.licensePlate}</dd>
                        </div>
                        <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-100">
                          <dt className="text-[10px] font-bold uppercase text-slate-400">{localT.planLabel}</dt>
                          <dd className="mt-1 truncate text-sm font-semibold text-slate-800">{vehicle.planName || '-'}</dd>
                        </div>
                        <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-100">
                          <dt className="text-[10px] font-bold uppercase text-slate-400">{localT.cancelExpiryLabel}</dt>
                          <dd className="mt-1 truncate text-sm font-semibold text-slate-800">
                            {vehicle.endDate ? vietnamDayjs(vehicle.endDate).format('DD/MM/YYYY') : '-'}
                          </dd>
                        </div>
                      </dl>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>

      {/* Password Reset Modal */}
      <AnimatePresence>
        {isResetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            {/* Modal Content Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-slate-100 bg-white p-6 shadow-2xl z-10"
            >
              {/* Close Button */}
              {currentStep !== 4 && (
                <button
                  onClick={handleCloseModal}
                  className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Header */}
              <div className="text-center mb-6">
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-600">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{localT.modalTitle}</h3>
                {currentStep !== 4 && (
                  <p className="text-xs font-semibold text-sky-600 mt-1 uppercase tracking-wider">
                    {localT.step} {currentStep} {localT.of} 3
                  </p>
                )}
              </div>

              {/* Stepper Progress Bar */}
              {currentStep !== 4 && (
                <div className="flex items-center justify-between gap-2 mb-6 px-4">
                  <div className={`h-1.5 flex-1 rounded-full ${currentStep >= 1 ? 'bg-sky-500' : 'bg-slate-100'}`} />
                  <div className={`h-1.5 flex-1 rounded-full ${currentStep >= 2 ? 'bg-sky-500' : 'bg-slate-100'}`} />
                  <div className={`h-1.5 flex-1 rounded-full ${currentStep >= 3 ? 'bg-sky-500' : 'bg-slate-100'}`} />
                </div>
              )}

              {/* Step 1: Verify current password */}
              {currentStep === 1 && (
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <p className="text-sm text-slate-500 leading-relaxed text-center">
                    {localT.currentPasswordDesc}
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 block">
                      {localT.currentPassword}
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        placeholder={localT.currentPasswordPlaceholder}
                        disabled={isLoading}
                        className="w-full h-11 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="flex items-center gap-2 p-3 text-xs text-rose-600 bg-rose-50 rounded-xl border border-rose-100">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={isLoading}
                      className="flex-1 h-11 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 active:scale-95 transition"
                    >
                      {localT.btnCancel}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !currentPassword}
                      className="flex-1 h-11 bg-[#0EA5E9] !text-white rounded-xl text-sm font-semibold hover:bg-[#0284c7] active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {localT.verifying}
                        </>
                      ) : (
                        localT.btnContinue
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Enter new password */}
              {currentStep === 2 && (
                <form onSubmit={handleStep2Submit} className="space-y-4">
                  <p className="text-sm text-slate-500 leading-relaxed text-center">
                    {localT.newPasswordDesc}
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 block">
                      {localT.newPassword}
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        placeholder={localT.newPasswordPlaceholder}
                        className="w-full h-11 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Real-time Strength Meter */}
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                      <span>{localT.passwordStrength}</span>
                      <span className="font-bold text-slate-800">{strengthLabel || '-'}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((stepVal) => (
                        <div
                          key={stepVal}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            newPassword && stepVal <= strengthScore ? strengthColor : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Criteria Checklist */}
                    <div className="pt-1 space-y-2 border-t border-slate-200/60 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        {criteria.hasLength ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full bg-slate-200 shrink-0" />
                        )}
                        <span className={criteria.hasLength ? 'text-emerald-600 font-medium' : ''}>
                          {localT.criterionLength}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {criteria.hasCase ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full bg-slate-200 shrink-0" />
                        )}
                        <span className={criteria.hasCase ? 'text-emerald-600 font-medium' : ''}>
                          {localT.criterionCase}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {criteria.hasSpecial ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full bg-slate-200 shrink-0" />
                        )}
                        <span className={criteria.hasSpecial ? 'text-emerald-600 font-medium' : ''}>
                          {localT.criterionSpecial}
                        </span>
                      </div>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="flex items-center gap-2 p-3 text-xs text-rose-600 bg-rose-50 rounded-xl border border-rose-100">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 h-11 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 active:scale-95 transition"
                    >
                      {localT.btnCancel}
                    </button>
                    <button
                      type="submit"
                      disabled={strengthScore < 2}
                      className="flex-1 h-11 bg-[#0EA5E9] !text-white rounded-xl text-sm font-semibold hover:bg-[#0284c7] active:scale-95 transition disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {localT.btnContinue}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Confirm new password */}
              {currentStep === 3 && (
                <form onSubmit={handleStep3Submit} className="space-y-4">
                  <p className="text-sm text-slate-500 leading-relaxed text-center">
                    {localT.confirmPasswordDesc}
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 block">
                      {localT.confirmPassword}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        placeholder={localT.confirmPasswordPlaceholder}
                        disabled={isLoading}
                        className="w-full h-11 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Real-time Match Indicator */}
                  {confirmPassword && (
                    <div className="pt-1">
                      {newPassword === confirmPassword ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span>{localT.matchSuccess}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold">
                          <AlertCircle className="h-4 w-4 text-rose-500" />
                          <span>{localT.matchError}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {errorMsg && (
                    <div className="flex items-center gap-2 p-3 text-xs text-rose-600 bg-rose-50 rounded-xl border border-rose-100">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      disabled={isLoading}
                      className="flex-1 h-11 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 active:scale-95 transition"
                    >
                      {localT.btnCancel}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !confirmPassword || newPassword !== confirmPassword}
                      className="flex-1 h-11 bg-[#0EA5E9] !text-white rounded-xl text-sm font-semibold hover:bg-[#0284c7] active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {localT.updating}
                        </>
                      ) : (
                        localT.btnSubmit
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 4: Success Screen */}
              {currentStep === 4 && (
                <div className="text-center space-y-5 py-2">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-inner">
                    <ShieldCheck className="h-8 w-8" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-slate-800">
                      {localT.successTitle}
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                      {localT.successDesc}
                    </p>
                  </div>

                  <button
                    onClick={handleCloseModal}
                    className="w-full h-11 bg-[#0EA5E9] !text-white rounded-xl text-sm font-semibold hover:bg-[#0284c7] active:scale-95 transition shadow-md shadow-sky-600/10"
                  >
                    {localT.btnDone}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancel Subscription Modal */}
      <AnimatePresence>
        {isCancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelStatus === 'loading' ? undefined : handleCloseCancelModal}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-slate-100 bg-white p-6 shadow-2xl z-10"
            >
              {cancelStatus !== 'loading' && (
                <button
                  onClick={handleCloseCancelModal}
                  className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {cancelStep === 'success' ? (
                <div className="text-center space-y-5 py-2">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-inner">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-slate-800">{localT.cancelSuccessTitle}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                      {localT.cancelSuccessDesc}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseCancelModal}
                    className="w-full h-11 bg-[#0EA5E9] !text-white rounded-xl text-sm font-semibold hover:bg-[#0284c7] active:scale-95 transition shadow-md shadow-sky-600/10"
                  >
                    {localT.btnDone}
                  </button>
                </div>
              ) : cancelStep === 'select' ? (
                <>
                  <div className="text-center mb-6">
                    <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
                      <Ban className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{localT.cancelSelectTitle}</h3>
                    <p className="mt-1 text-sm text-slate-500 leading-relaxed">{localT.cancelSelectDesc}</p>
                  </div>

                  {cancelListLoading ? (
                    <div className="space-y-2" aria-label={localT.cancelSelectLoading}>
                      {[1, 2].map((item) => (
                        <div key={item} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
                      ))}
                    </div>
                  ) : cancelListError ? (
                    <div className="flex items-center gap-2 p-3 text-xs text-rose-600 bg-rose-50 rounded-xl border border-rose-100">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{localT.cancelSelectLoadError}</span>
                    </div>
                  ) : cancelableSubscriptions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center text-sm text-slate-500">
                      {localT.cancelSelectEmpty}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {cancelableSubscriptions.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleSelectCancelSub(sub)}
                          className="flex w-full flex-col gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-rose-300 hover:bg-rose-50/50 active:scale-[0.99]"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-bold text-slate-800">{sub.licensePlate}</p>
                            <p className="shrink-0 text-sm font-bold text-rose-600">
                              {Number(sub.amountToPay || 0).toLocaleString('vi-VN')} đ
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-xs text-slate-500">{sub.planName}</p>
                            <p className="shrink-0 text-xs font-semibold text-slate-400">
                              {localT.cancelExpiryLabel}: {sub.endDate ? vietnamDayjs(sub.endDate).format('DD/MM/YYYY') : '-'}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseCancelModal}
                      className="flex-1 h-11 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 active:scale-95 transition"
                    >
                      {localT.btnCancel}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
                      <Ban className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{localT.cancelModalTitle}</h3>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-slate-500 leading-relaxed text-center">
                      {localT.cancelModalDesc}
                    </p>

                    <div className="space-y-2 rounded-2xl bg-slate-50 p-4 text-sm ring-1 ring-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">{localT.cancelPlateLabel}</span>
                        <span className="font-semibold text-slate-800">{selectedCancelSub?.licensePlate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">{localT.cancelPlanLabel}</span>
                        <span className="font-semibold text-slate-800">{selectedCancelSub?.planName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">{localT.cancelPriceLabel}</span>
                        <span className="font-semibold text-slate-800">
                          {Number(selectedCancelSub?.amountToPay || 0).toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">{localT.cancelExpiryLabel}</span>
                        <span className="font-semibold text-slate-800">
                          {selectedCancelSub?.endDate ? vietnamDayjs(selectedCancelSub.endDate).format('DD/MM/YYYY') : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{localT.cancelModalWarning}</span>
                    </div>

                    {cancelStatus === 'error' && (
                      <div className="flex items-center gap-2 p-3 text-xs text-rose-600 bg-rose-50 rounded-xl border border-rose-100">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{cancelErrorMsg}</span>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setCancelStep('select')}
                        disabled={cancelStatus === 'loading'}
                        className="flex-1 h-11 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 active:scale-95 transition disabled:opacity-50"
                      >
                        {localT.btnBack}
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmCancelSubscription}
                        disabled={cancelStatus === 'loading'}
                        className="flex-1 h-11 bg-rose-600 !text-white rounded-xl text-sm font-semibold hover:bg-rose-700 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {cancelStatus === 'loading' ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {localT.cancelling}
                          </>
                        ) : (
                          localT.cancelModalConfirmBtn
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

