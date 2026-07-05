import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../../../../contexts/useAuth';
import { ROUTES } from '../../../../constants/routes';
import NotificationPanel from '../../components/NotificationPanel';

const quickActions = [
  {
    key: 'registerVehicle',
    path: ROUTES.DRIVER.VEHICLE_REGISTRATION,
    labelVi: 'Đăng ký thẻ xe',
    labelEn: 'Vehicle card',
    descVi: 'Gửi hồ sơ thẻ tháng',
    descEn: 'Submit monthly pass',
    icon: 'assignment_ind',
    color: 'text-[#0EA5E9] bg-[#E0F2FE]',
  },
  {
    key: 'feePlans',
    path: ROUTES.DRIVER.FEE_PLANS,
    labelVi: 'Biểu phí',
    labelEn: 'Fee plans',
    descVi: 'Chọn gói phù hợp',
    descEn: 'Choose your package',
    icon: 'sell',
    color: 'text-[#2563EB] bg-[#EFF6FF]',
  },
  {
    key: 'payment',
    path: ROUTES.DRIVER.PAYMENT,
    labelVi: 'Thanh toán',
    labelEn: 'Payments',
    descVi: 'Hóa đơn & giao dịch',
    descEn: 'Invoices & payments',
    icon: 'payments',
    color: 'text-[#059669] bg-[#ECFDF5]',
  },
  {
    key: 'support',
    path: ROUTES.DRIVER.SUPPORT,
    labelVi: 'Hỗ trợ',
    labelEn: 'Support',
    descVi: 'Trợ lý và yêu cầu',
    descEn: 'Help and tickets',
    icon: 'smart_toy',
    color: 'text-[#7C3AED] bg-[#F3E8FF]',
  },
];

const suggestedLots = [
  {
    id: 'zone-a',
    nameKey: 'dashboard.centralParking',
    addressKey: 'dashboard.mainGateGroundFloor',
    availableSlots: 42,
    totalSlots: 100,
  },
  {
    id: 'zone-b',
    nameKey: 'dashboard.monthlyPassArea',
    addressKey: 'dashboard.zoneBEntrance',
    availableSlots: 18,
    totalSlots: 64,
  },
];

const steps = [
  { icon: 'badge', titleKey: 'dashboard.profileStep', textKey: 'dashboard.profileStepDesc' },
  { icon: 'approval_delegation', titleKey: 'dashboard.reviewStep', textKey: 'dashboard.reviewStepDesc' },
  { icon: 'credit_card', titleKey: 'dashboard.paymentStep', textKey: 'dashboard.paymentStepDesc' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 18 },
  },
};

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const displayName = user?.fullName || user?.name || t('driverDashboard.driver');
  const isVietnamese = i18n.language === 'vi';

  return (
    <motion.div
      className="mx-auto flex max-w-[1400px] flex-col px-1"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.section
        variants={itemVariants}
        className="relative mb-8 overflow-hidden rounded-[24px] border border-[#4BB8FA] bg-[#4BB8FA] p-5 shadow-[0_18px_46px_rgba(14,165,233,0.16)] md:mb-10 md:p-6"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-20 w-80 rounded-full bg-[#0EA5E9]/20 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">{t('dashboard.workspace')}</p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">
              {t('dashboard.welcome', { name: displayName })}
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-white/90">
              {t('dashboard.overviewSubtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(ROUTES.DRIVER.VEHICLE_REGISTRATION)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white px-4 py-2.5 text-sm font-bold text-[#0369A1] shadow-[0_14px_30px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:bg-[#F8FAFC] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            {t('dashboard.registerVehicleCard')}
          </button>
        </div>
      </motion.section>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <motion.section variants={itemVariants} className="rounded-[24px] border border-[#E5E7EB] bg-white p-1.5 shadow-[0_18px_46px_rgba(15,23,42,0.06)]">
            <div className="rounded-[18px] border border-[#E5E7EB] bg-gradient-to-br from-white via-[#F8FAFC] to-[#E0F2FE] p-5">
              <div className="space-y-4">
                <span className="inline-flex rounded-full bg-[#E0F2FE] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0369A1]">
                  {t('dashboard.vehicleCardOverview')}
                </span>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-[#0F172A]">{t('dashboard.startWithApplication')}</h2>
                  <p className="mt-2 max-w-[52ch] text-sm font-medium leading-relaxed text-[#64748B]">
                    {t('dashboard.applicationGuide')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.DRIVER.VEHICLE_REGISTRATION)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0EA5E9] px-4 py-2 text-xs font-bold text-white shadow-[0_12px_24px_rgba(14,165,233,0.22)] transition hover:bg-[#0284C7] active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-[16px]">assignment_ind</span>
                    {t('dashboard.submitApplication')}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.DRIVER.FEE_PLANS)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-white px-4 py-2 text-xs font-bold text-[#0369A1] transition hover:bg-[#F0F9FF] active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-[16px]">sell</span>
                    {t('dashboard.viewFeePlans')}
                  </button>
                </div>
              </div>

            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="space-y-3">
            <h3 className="px-1 text-xs font-black uppercase tracking-[0.18em] text-[#64748B]">{t('dashboard.quickActions')}</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {quickActions.map((action) => (
                <button
                  key={action.key}
                  type="button"
                  onClick={() => navigate(action.path)}
                  className="group flex min-h-[132px] flex-col justify-between rounded-[22px] border border-[#E5E7EB] bg-white p-4 text-left shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-[#BAE6FD] hover:shadow-[0_18px_42px_rgba(14,165,233,0.1)] active:scale-[0.98]"
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-105 ${action.color}`}>
                    <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
                  </span>
                  <span>
                    <span className="block text-sm font-black tracking-tight text-[#0F172A] group-hover:text-[#0EA5E9]">
                      {isVietnamese ? action.labelVi : action.labelEn}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-[#64748B]">
                      {isVietnamese ? action.descVi : action.descEn}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.titleKey} className="rounded-[22px] border border-[#E5E7EB] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5F9] text-[#0EA5E9]">
                  <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
                </span>
                <h4 className="mt-4 text-sm font-black text-[#0F172A]">{t(step.titleKey)}</h4>
                <p className="mt-1 text-xs font-medium leading-relaxed text-[#64748B]">{t(step.textKey)}</p>
              </div>
            ))}
          </motion.section>
        </div>

        <div className="space-y-6">
          <motion.section variants={itemVariants} className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_46px_rgba(15,23,42,0.06)]">
            <h3 className="border-b border-[#E5E7EB] pb-3 text-xs font-black uppercase tracking-[0.18em] text-[#64748B]">
              {t('dashboard.suggestedParkingAreas')}
            </h3>
            <div className="mt-4 space-y-4">
              {suggestedLots.map((area) => {
                const fillRate = Math.round(((area.totalSlots - area.availableSlots) / area.totalSlots) * 100);
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => navigate(ROUTES.DRIVER.FEE_PLANS)}
                    className="group w-full rounded-2xl border border-[#E5E7EB] p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[#BAE6FD] hover:bg-[#F8FAFC] hover:shadow-[0_14px_30px_rgba(14,165,233,0.08)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-black tracking-tight text-[#0F172A] group-hover:text-[#0EA5E9]">{t(area.nameKey)}</h4>
                        <p className="mt-1 text-xs font-medium text-[#64748B]">{t(area.addressKey)}</p>
                      </div>
                      <span className="material-symbols-outlined text-[18px] text-[#0EA5E9]">location_on</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.12em] text-[#64748B]">
                        <span>{t('dashboard.available')}</span>
                        <span className="font-mono text-[#334155]">{area.availableSlots} / {area.totalSlots}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
                        <div
                          className={`h-full rounded-full ${fillRate >= 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${fillRate}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.section>

          <motion.div variants={itemVariants}>
            <NotificationPanel />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
