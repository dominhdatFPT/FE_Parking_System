import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../contexts/useAuth';
import { apiClient } from '../../../../services/apiClient';
import { API_ENDPOINTS } from '../../../../services/endpoints';
import PageHeader from '../../components/PageHeader';

const VEHICLE_TYPE_IMAGE = {
  MOTORBIKE: '/vehicle-rear-motorbike.png',
  CAR: '/vehicle-rear-car.png',
};

function getVehicleTypeCode(vehicle) {
  const value = String(vehicle?.vehicleTypeCode || vehicle?.vehicleType || vehicle?.vehicleTypeName || '').toUpperCase();
  return value.includes('CAR') || value.includes('OTO') || value.includes('Ô') ? 'CAR' : 'MOTORBIKE';
}

function isVehicleVerified(vehicle) {
  const status = String(
    vehicle?.status
      || vehicle?.registrationStatus
      || vehicle?.approvalStatus
      || vehicle?.vehicleStatus
      || '',
  ).toUpperCase();

  return ['ACTIVE', 'APPROVED', 'CONFIRMED', 'VERIFIED', 'PAID'].some((keyword) => status.includes(keyword));
}

export default function DriverProfile() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const displayName = user?.fullName || user?.name || 'Driver';
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [vehicleError, setVehicleError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchVehicles() {
      setLoadingVehicles(true);
      setVehicleError('');
      try {
        const res = await apiClient.get(API_ENDPOINTS.FEE.MY_VEHICLES);
        if (!cancelled) setVehicles(res.data?.data ?? []);
      } catch (error) {
        if (!cancelled) {
          setVehicles([]);
          setVehicleError(error.response?.data?.message || 'Không thể tải danh sách xe.');
        }
      } finally {
        if (!cancelled) setLoadingVehicles(false);
      }
    }

    fetchVehicles();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title={t('sidebar.profile')} subtitle={user?.email || ''} />

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-slate-100/80 bg-white p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-3xl font-bold text-white shadow-lg shadow-sky-200/50">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-800">{displayName}</h2>
          <p className="mt-1 text-sm text-slate-500">{user?.email || 'Chưa có email'}</p>
          <div className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-left text-sm ring-1 ring-emerald-100">
            <p className="text-emerald-600">Verify</p>
            <p className="font-semibold text-emerald-800">
              {vehicles.some(isVehicleVerified) ? 'Đã xác thực phương tiện' : 'Chờ xác thực phương tiện'}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Xe của tôi</h3>
              <p className="mt-1 text-sm text-slate-400">{vehicles.length} phương tiện trong hồ sơ</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              Verify
            </span>
          </div>

          {vehicleError ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {vehicleError}
            </div>
          ) : null}

          {loadingVehicles ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[1, 2].map((item) => (
                <div key={item} className="h-36 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : vehicles.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {vehicles.map((vehicle) => {
                const typeCode = getVehicleTypeCode(vehicle);
                const verified = isVehicleVerified(vehicle);

                return (
                  <article key={vehicle.vehicleId || vehicle.id || vehicle.licensePlate} className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                    <div className="h-28 overflow-hidden bg-slate-100">
                      <img src={VEHICLE_TYPE_IMAGE[typeCode]} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="space-y-2 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-lg font-black text-slate-900">{vehicle.licensePlate || 'Chưa có biển số'}</h4>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          verified
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                            : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                        }`}>
                          {verified ? 'Đã verify' : 'Chờ verify'}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-600">
                        {vehicle.vehicleTypeName || (typeCode === 'CAR' ? 'Ô tô' : 'Xe máy')}
                      </p>
                      <p className="text-xs text-slate-400">
                        {[vehicle.brand, vehicle.color].filter(Boolean).join(' - ') || 'Chưa cập nhật hãng/màu xe'}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
              <h3 className="text-base font-bold text-slate-700">Chưa có xe trong hồ sơ</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Xe đã được duyệt sẽ hiển thị tại đây để bạn kiểm tra trạng thái verify.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
