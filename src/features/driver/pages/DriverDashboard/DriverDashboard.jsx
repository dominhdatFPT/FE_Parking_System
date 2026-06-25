import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../contexts/useAuth';
import { ROUTES } from '../../../../constants/routes';
import NotificationPanel from '../../components/NotificationPanel';

const quickActions = [
  {
    route: ROUTES.DRIVER.VEHICLE_REGISTRATION,
    icon: 'assignment_ind',
    title: 'Đăng ký thẻ xe',
    description: 'Gửi hồ sơ đăng ký phương tiện và theo dõi kết quả xét duyệt.',
    tone: 'from-sky-500 to-cyan-500',
  },
  {
    route: ROUTES.DRIVER.FEE_PLANS,
    icon: 'sell',
    title: 'Biểu phí thẻ xe',
    description: 'Chọn phương tiện và mua gói gửi xe phù hợp.',
    tone: 'from-blue-600 to-indigo-600',
  },
  {
    route: ROUTES.DRIVER.PAYMENT,
    icon: 'payments',
    title: 'Thanh toán',
    description: 'Thanh toán gói và kiểm tra lịch sử hóa đơn.',
    tone: 'from-emerald-500 to-teal-500',
  },
  {
    route: ROUTES.DRIVER.SUPPORT,
    icon: 'help',
    title: 'Hỗ trợ',
    description: 'Gửi yêu cầu và nhận phản hồi từ nhân viên hỗ trợ.',
    tone: 'from-violet-500 to-purple-600',
  },
];

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const displayName = user?.fullName || user?.name || t('driverDashboard.driver');

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-7 text-white shadow-xl shadow-sky-950/10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">Smart Parking</p>
        <h1 className="mt-3 text-3xl font-black">Xin chào, {displayName}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
          Quản lý đăng ký thẻ xe, mua biểu phí, thanh toán và yêu cầu hỗ trợ tại một nơi.
          Nút trợ lý ở góc màn hình sẽ hướng dẫn đăng ký xe từng bước.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-black uppercase tracking-wider text-slate-400">Chức năng chính</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickActions.map((action) => (
            <button
              key={action.route}
              type="button"
              onClick={() => navigate(action.route)}
              className="group rounded-3xl border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${action.tone} text-white shadow-md`}>
                <span className="material-symbols-outlined">{action.icon}</span>
              </span>
              <h3 className="mt-4 text-base font-black text-slate-800">{action.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">{action.description}</p>
            </button>
          ))}
        </div>
      </section>

      <NotificationPanel />
    </div>
  );
}
