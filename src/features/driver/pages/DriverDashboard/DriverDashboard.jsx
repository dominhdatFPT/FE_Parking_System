import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../contexts/useAuth';
import { bookingService } from '../../../../services/bookingService';
import { ROUTES } from '../../../../constants/routes';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import Button from '../../components/Button';
import BookingFlowWidget from '../../components/BookingFlowWidget';
import ParkingLotCard from '../../components/ParkingLotCard';
import CurrentBookingPanel from '../../components/CurrentBookingPanel';
import NotificationPanel from '../../components/NotificationPanel';
import ParkingAvailabilityMap from '../../components/ParkingAvailabilityMap';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const displayName = user?.fullName || user?.name || 'Driver';
  const [summary, setSummary] = useState(null);
  const [areas, setAreas] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [areasLoading, setAreasLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedFloors, setSelectedFloors] = useState([]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    const [summaryRes, bookingsRes] = await Promise.all([
      bookingService.getDashboardSummary(),
      bookingService.getMyBookings(),
    ]);
    setSummary(summaryRes.data);
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

  const latestBooking = bookings[0] || null;

  const handleSelectArea = useCallback(async (area) => {
    setSelectedArea(area);
    const { data } = await bookingService.getFloorsByArea(area.id);
    setSelectedFloors(Array.isArray(data) ? data : []);
  }, []);

  const handleBookingCreated = useCallback(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('dashboard.title')}
        subtitle={`${t('header.greeting')} ${displayName}!`}
        icon="dashboard"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0EA5E9] via-[#0891B2] to-[#06B6D4] p-6 shadow-xl shadow-sky-300/40 sm:p-8">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {t('dashboard.heroTitle')}
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-white/80 sm:text-base">
            {t('dashboard.heroSubtitle')}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="ghost"
              size="lg"
              icon="add_circle"
              className="!bg-white !text-sky-600 !font-bold !shadow-lg !shadow-sky-700/20 hover:!shadow-xl"
              onClick={() => document.getElementById('booking-widget')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('dashboard.bookNow')}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              icon="receipt_long"
              className="!bg-white/10 !text-white !border-2 !border-white/30 !backdrop-blur-sm hover:!bg-white/20"
              onClick={() => navigate(ROUTES.DRIVER.HISTORY)}
            >
              {t('dashboard.viewBookings')}
            </Button>
          </div>
        </div>
        <div className="absolute -bottom-8 -right-8 opacity-10 sm:opacity-15">
          <span className="material-symbols-outlined text-[180px]">directions_car</span>
        </div>
        <div className="absolute right-20 top-4 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-6 bottom-0 h-24 w-24 rounded-full bg-cyan-200/15 blur-2xl" />
      </section>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white shadow-sm" />
          ))}
        </div>
      ) : summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon="local_parking" value={summary.openParkingLots} label={t('dashboard.openLots')} accent="sky" trend="+1" trendUp />
          <StatCard icon="slot_available" value={summary.availableSlots} label={t('dashboard.availableSlots')} accent="emerald" trend="+12" trendUp />
          <StatCard icon="pending" value={summary.pendingBookings} label={t('dashboard.pendingBookings')} accent="amber" />
          <StatCard icon="check_circle" value={summary.confirmedBookings} label={t('dashboard.confirmedBookings')} accent="violet" />
        </div>
      )}

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div id="booking-widget">
            <BookingFlowWidget onBookingCreated={handleBookingCreated} />
          </div>

          {/* Parking Lots */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] text-white shadow-sm">
                <span className="material-symbols-outlined text-[16px]">apartment</span>
              </span>
              {t('dashboard.nearbyParkingLots')}
            </h3>
            {areasLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-56 animate-pulse rounded-2xl bg-white shadow-sm" />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {areas.map((area) => (
                  <ParkingLotCard key={area.id} area={area} onSelect={handleSelectArea} />
                ))}
              </div>
            )}
          </div>

          <ParkingAvailabilityMap selectedArea={selectedArea} floors={selectedFloors} />
        </div>

        <div className="space-y-6">
          <CurrentBookingPanel booking={latestBooking} loading={loading} />
          <NotificationPanel />
        </div>
      </div>
    </div>
  );
}
