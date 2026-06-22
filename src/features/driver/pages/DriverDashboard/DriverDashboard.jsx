import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../contexts/useAuth';
import { bookingService } from '../../../../services/bookingService';
import { ROUTES } from '../../../../constants/routes';
import Button from '../../components/Button';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const displayName = user?.fullName || user?.name || t('driverDashboard.driver');
  
  const [areas, setAreas] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [areasLoading, setAreasLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    const [, bookingsRes] = await Promise.all([
      bookingService.getDashboardSummary(),
      bookingService.getMyBookings(),
    ]);
    setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
    setLoading(false);
  }, []);

  const fetchAreas = useCallback(async () => {
    setAreasLoading(true);
    const { data } = await bookingService.getParkingAreas();
    setAreas(Array.isArray(data) ? data : []);
    setAreasLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboard();
    fetchAreas();
  }, [fetchDashboard, fetchAreas]);

  // Find active booking: CONFIRMED or PENDING
  const activeBooking = bookings.find(b => b.status === 'CONFIRMED' || b.status === 'PENDING') || null;

  // Recent history: exclude the active booking if it is shown, show next 2-3 bookings
  const historyBookings = bookings
    .filter(b => b.id !== activeBooking?.id)
    .slice(0, 3);

  // Suggested parking lots: top 2 open parking lots
  const suggestedAreas = areas
    .filter(a => a.status === 'OPEN')
    .slice(0, 2);

  const getStatusText = () => {
    if (!activeBooking) return t('driverDashboard.noBooking');
    if (activeBooking.status === 'PENDING') return t('driverDashboard.onePending');
    return t('driverDashboard.oneActive');
  };

  const handleExtend = () => {
    alert(t('driverDashboard.extendAlert'));
  };

  const handleEnd = async (id) => {
    if (window.confirm(t('driverDashboard.endConfirm'))) {
      await bookingService.cancelBooking(id);
      fetchDashboard();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Greeting and Quick Status Header */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t('driverDashboard.greeting', { name: displayName })}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-500">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${activeBooking ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <span>{getStatusText()}</span>
          </div>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left Side: Current Booking / Quick Book & Suggested Lots */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Current Booking Card / Call to Action */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <h3 className="mb-4 text-xs font-black uppercase tracking-wider text-slate-400">{t('driverDashboard.currentBooking')}</h3>
            
            {loading ? (
              <div className="h-44 animate-pulse rounded-2xl bg-slate-50" />
            ) : activeBooking ? (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-sky-950 p-6 text-white shadow-lg">
                <div className="absolute right-0 top-0 -mr-12 -mt-12 h-36 w-36 rounded-full bg-sky-500/10 blur-2xl" />
                <div className="relative z-10 flex flex-col justify-between h-full gap-4">
                  
                  {/* Booking details top row */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">{t('driverDashboard.bookingId')}: #{activeBooking.id}</span>
                      <h4 className="text-lg font-black text-white mt-1 leading-snug">{activeBooking.parkingAreaName}</h4>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                      activeBooking.status === 'PENDING' 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {activeBooking.status === 'PENDING' ? t('driverDashboard.pending') : t('driverDashboard.active')}
                    </span>
                  </div>

                  {/* Floor / Position Details */}
                  <div className="grid grid-cols-3 gap-4 border-y border-white/10 py-4 my-2 text-center">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{t('driverDashboard.floor')}</p>
                      <p className="text-base font-extrabold text-white">{t('driverDashboard.floorVal', { floor: activeBooking.floorNumber })}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{t('driverDashboard.vehicleType')}</p>
                      <p className="text-base font-extrabold text-white">{activeBooking.vehicleType === 'CAR' ? t('driverDashboard.carArea') : t('driverDashboard.motoArea')}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{t('driverDashboard.timeRemaining')}</p>
                      <p className="text-base font-extrabold text-sky-300">
                        {activeBooking.status === 'PENDING' ? '--:--' : '01h 45m'}
                      </p>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex justify-end gap-3 pt-2">
                    {activeBooking.status === 'CONFIRMED' && (
                      <button
                        onClick={handleExtend}
                        className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-xs font-bold text-white transition-all active:scale-[0.98]"
                      >
                        {t('driverDashboard.extend')}
                      </button>
                    )}
                    <button
                      onClick={() => handleEnd(activeBooking.id)}
                      className="rounded-xl bg-red-600 hover:bg-red-700 !text-white px-4 py-2 text-xs font-bold transition-all active:scale-[0.98]"
                    >
                      {activeBooking.status === 'PENDING' ? t('driverDashboard.cancelRequest') : t('driverDashboard.end')}
                    </button>
                  </div>

                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-[#0EA5E9] shadow-inner">
                  <span className="material-symbols-outlined text-[32px]">local_parking</span>
                </div>
                <h4 className="text-base font-bold text-slate-700">{t('driverDashboard.noBookingsFound')}</h4>
                <p className="mt-1.5 text-xs text-slate-400 max-w-sm">
                  {t('driverDashboard.bookNowDesc')}
                </p>
                <Button
                  variant="primary"
                  className="mt-5 w-full max-w-xs justify-center"
                  icon="add_circle"
                  onClick={() => navigate(ROUTES.DRIVER.BOOKING)}
                >
                  {t('driverDashboard.bookNow')}
                </Button>
              </div>
            )}
          </div>

          {/* Suggested Parking Lots */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">{t('driverDashboard.nearestLots')}</h3>
            </div>
            
            {areasLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-50" />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {suggestedAreas.map((area) => (
                  <div
                    key={area.id}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-100 p-4 transition-all duration-300 hover:border-sky-100 hover:shadow-lg hover:shadow-sky-100/10 cursor-pointer"
                    onClick={() => navigate(ROUTES.DRIVER.BOOKING)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[170px]">{area.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal line-clamp-1">{area.address}</p>
                      </div>
                      <span className="material-symbols-outlined text-[18px] text-sky-500">location_on</span>
                    </div>

                    <div className="mt-4 flex items-baseline justify-between border-t border-slate-50 pt-3">
                      <span className="text-[10px] font-bold text-slate-500">{t('driverDashboard.availableSlotsLabel')}</span>
                      <span className="text-sm font-black text-sky-600">
                        {area.availableSlots} / {area.totalSlots}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Recent History */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="mb-5 flex items-center justify-between border-b border-slate-50 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">{t('driverDashboard.recentHistory')}</h3>
              <button
                onClick={() => navigate(ROUTES.DRIVER.HISTORY)}
                className="text-xs font-black text-[#0EA5E9] hover:underline"
              >
                {t('driverDashboard.viewAll')}
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-50" />
                ))}
              </div>
            ) : historyBookings.length > 0 ? (
              <div className="space-y-3">
                {historyBookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[150px]">{b.parkingAreaName}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {formatVietnamDate(b.createdAt)}
                      </p>
                    </div>

                    <span className={`rounded-lg px-2 py-0.5 text-[9px] font-bold border ${
                      b.status === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : b.status === 'CANCELLED'
                          ? 'bg-slate-50 text-slate-500 border-slate-100'
                          : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {b.status === 'CONFIRMED' ? t('driverDashboard.completed') : b.status === 'CANCELLED' ? t('driverDashboard.cancelled') : t('driverDashboard.rejected')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs font-semibold text-slate-400">
                {t('driverDashboard.noHistory')}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
