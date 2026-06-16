import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../constants/routes';

const navItems = [
  { key: 'dashboard', path: ROUTES.DRIVER.DASHBOARD, icon: 'dashboard' },
  { key: 'registerVehicle', path: ROUTES.DRIVER.VEHICLE_REGISTRATION, icon: 'assignment_ind' },
  { key: 'vehiclePricing', path: '#pricing', icon: 'sell' },
  { key: 'payments', path: ROUTES.DRIVER.PAYMENT, icon: 'payments' },
  { key: 'notifications', path: ROUTES.DRIVER.NOTIFICATIONS, icon: 'notifications' },
  { key: 'support', path: ROUTES.DRIVER.SUPPORT, icon: 'help' },
];

export default function DriverSidebar({ isOpen, onClose, onShowPricing }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleNav = (item) => {
    if (item.key === 'vehiclePricing') {
      onShowPricing?.();
      onClose?.();
      return;
    }
    navigate(item.path);
    onClose?.();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col transition-transform duration-300 ease-out lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 100%)',
        }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] shadow-md shadow-sky-400/30">
            <span className="material-symbols-outlined text-[22px] text-white">directions_car</span>
          </div>
          <div>
            <span className="text-[17px] font-extrabold tracking-tight">
              <span className="text-sky-800">Smart</span>
              <span className="text-white drop-shadow-sm">Parking</span>
            </span>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-600/70">IoT Platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
          <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-sky-700/50">{t('sidebar.menu')}</p>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNav(item)}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white shadow-lg shadow-sky-400/40'
                    : 'text-slate-700 hover:bg-white/70 hover:text-slate-900 hover:shadow-md hover:shadow-sky-300/20 hover:-translate-y-[0.5px]'
                }`}
              >
                {active && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] shadow-lg shadow-sky-400/40" />
                )}
                <span className={`relative z-10 material-symbols-outlined text-[19px] transition-colors duration-300 ${
                  active ? 'text-white' : 'text-sky-600/80 group-hover:text-slate-700'
                }`}>
                  {item.icon}
                </span>
                <span className="relative z-10">{t(`sidebar.${item.key}`)}</span>
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-5 border-t border-sky-300/30" />

        {/* Bottom */}
        <div className="p-3">
          <button
            type="button"
            onClick={() => handleNav(ROUTES.DRIVER.PROFILE)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-slate-700 transition-all duration-300 hover:bg-white/70 hover:text-slate-900 hover:shadow-md hover:shadow-sky-300/20"
          >
            <span className="material-symbols-outlined text-[19px] text-sky-600/80">person</span>
            {t('sidebar.profile')}
          </button>
          <button
            type="button"
            onClick={() => handleNav(ROUTES.LOGIN)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-slate-700 transition-all duration-300 hover:bg-red-50/80 hover:text-red-500 hover:shadow-sm"
          >
            <span className="material-symbols-outlined text-[19px] text-sky-600/80">logout</span>
            {t('sidebar.logout')}
          </button>
        </div>
      </aside>
    </>
  );
}
