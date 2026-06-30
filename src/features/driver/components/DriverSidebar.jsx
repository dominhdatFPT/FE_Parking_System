import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../constants/routes';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { useAuth } from '../../../contexts/useAuth';
import Logo from '../../../components/Logo';

const navItems = [
  { key: 'dashboard', path: ROUTES.DRIVER.DASHBOARD, icon: 'dashboard' },
  { key: 'registerVehicle', path: ROUTES.DRIVER.VEHICLE_REGISTRATION, icon: 'assignment_ind' },
  { key: 'vehiclePricing', path: ROUTES.DRIVER.FEE_PLANS, icon: 'sell' },
  { key: 'payments', path: ROUTES.DRIVER.PAYMENT, icon: 'payments' },
  { key: 'notifications', path: ROUTES.DRIVER.NOTIFICATIONS, icon: 'notifications' },
  { key: 'support', path: ROUTES.DRIVER.SUPPORT, icon: 'help' },
];

export default function DriverSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { setUser } = useAuth();

  const handleNav = (target) => {
    const path = typeof target === 'string' ? target : target?.path;
    if (path) {
      navigate(path);
    }
    onClose?.();
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem('smart-parking-user');
    localStorage.removeItem('rememberMe');
    setUser(null);
    navigate(ROUTES.LOGIN, { replace: true });
    onClose?.();
  };

  const isProfileActive = location.pathname === ROUTES.DRIVER.PROFILE;

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
          background: '#DBEAFE',
        }}
      >
        <div 
          onClick={() => { window.location.href = ROUTES.DRIVER.DASHBOARD; }}
          className="flex flex-col px-5 py-3 gap-1 border-b border-slate-200/60 cursor-pointer select-none"
          title="Về trang tổng quan"
        >
          <Logo variant="horizontal" theme="brand" size="sm" />
          <p className="ml-[44px] text-[9px] font-bold uppercase tracking-[0.2em] text-slate-700">Driver Workspace</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
          <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#64748B]">{t('sidebar.menu')}</p>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNav(item)}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-all duration-300 ${
                  active
                    ? 'border border-[#BAE6FD] bg-[#E0F2FE] text-[#0369A1] shadow-[0_10px_24px_rgba(14,165,233,0.12)]'
                    : 'text-[#64748B] hover:-translate-y-[0.5px] hover:bg-white/70 hover:text-[#0F172A] hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)]'
                }`}
              >
                {active && (
                  <div className="absolute inset-0 rounded-xl bg-[#E0F2FE]" />
                )}
                <span className={`relative z-10 material-symbols-outlined text-[19px] transition-colors duration-300 ${
                  active ? 'text-[#0EA5E9]' : 'text-[#64748B] group-hover:text-[#0EA5E9]'
                }`}>
                  {item.icon}
                </span>
                <span className="relative z-10">{t(`sidebar.${item.key}`)}</span>
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-5 border-t border-[#E5E7EB]" />

        {/* Bottom */}
        <div className="p-3 space-y-1">
          <button
            type="button"
            onClick={() => handleNav(ROUTES.DRIVER.PROFILE)}
            className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-all duration-300 ${
              isProfileActive
                ? 'border border-[#BAE6FD] bg-[#E0F2FE] text-[#0369A1] shadow-[0_10px_24px_rgba(14,165,233,0.12)]'
                : 'text-[#64748B] hover:bg-white/70 hover:text-[#0F172A] hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)]'
            }`}
          >
            {isProfileActive && (
              <div className="absolute inset-0 rounded-xl bg-[#E0F2FE]" />
            )}
            <span className={`relative z-10 material-symbols-outlined text-[19px] transition-colors duration-300 ${
              isProfileActive ? 'text-[#0EA5E9]' : 'text-[#64748B] group-hover:text-[#0EA5E9]'
            }`}>
              person
            </span>
            <span className="relative z-10">{t('sidebar.profile')}</span>
          </button>
          
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-[#64748B] transition-all duration-300 hover:bg-[#FEF2F2] hover:text-[#DC2626] hover:shadow-sm"
          >
            <span className="material-symbols-outlined text-[19px] text-[#64748B] group-hover:text-[#DC2626]">logout</span>
            {t('sidebar.logout')}
          </button>
        </div>
      </aside>
    </>
  );
}
