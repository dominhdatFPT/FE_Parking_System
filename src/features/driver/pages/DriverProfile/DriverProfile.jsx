import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../contexts/useAuth';
import PageHeader from '../../components/PageHeader';

export default function DriverProfile() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const displayName = user?.fullName || user?.name || 'Driver';

  return (
    <div className="space-y-6">
      <PageHeader title={t('sidebar.profile')} subtitle={user?.email || ''} icon="person" />

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-slate-100/80 bg-white p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-3xl font-bold text-white shadow-lg shadow-sky-200/50">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-800">{displayName}</h2>
          <p className="mt-1 text-sm text-slate-500">{user?.email || 'Chưa có email'}</p>
          <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-left text-sm ring-1 ring-slate-100">
            <p className="text-slate-400">Role</p>
            <p className="font-semibold text-slate-700">{user?.role || 'driver'}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <span className="material-symbols-outlined text-[32px]">directions_car</span>
            </div>
            <h3 className="text-base font-bold text-slate-700">Vehicle Management</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
              Vehicle management will be available when the API is connected.
            </p>
          </div>
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <span className="material-symbols-outlined text-[32px]">account_balance_wallet</span>
            </div>
            <h3 className="text-base font-bold text-slate-700">Wallet & Stats</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
              Wallet balance and monthly stats will be available when the API is connected.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
