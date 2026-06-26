import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../../../../contexts/useAuth';
import { bookingService } from '../../../../services/bookingService';
import { ROUTES } from '../../../../constants/routes';
import { formatVietnamDate } from '../../../../utils/dateTime';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
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
  const realHistory = bookings
    .filter(b => b.id !== activeBooking?.id)
    .slice(0, 3);

  const mockHistory = [
    {
      id: 'mock-hist-1',
      parkingAreaName: 'Tòa nhà đỗ xe A (Parking Building A)',
      createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      status: 'CONFIRMED'
    },
    {
      id: 'mock-hist-2',
      parkingAreaName: 'Khu vực đỗ xe Bến Thành',
      createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
      status: 'CONFIRMED'
    },
    {
      id: 'mock-hist-3',
      parkingAreaName: 'Bãi đỗ xe ngoài trời Lê Lợi',
      createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      status: 'CANCELLED'
    }
  ];

  const displayHistory = realHistory.length > 0 ? realHistory : mockHistory;

  // Suggested parking lots: top 2 open parking lots
  const realAreas = areas
    .filter(a => a.status === 'OPEN')
    .slice(0, 2);

  const mockAreas = [
    {
      id: 'mock-area-1',
      name: 'Tòa nhà đỗ xe A (Parking Building A)',
      address: 'Khu vực Trung tâm Quận 1',
      availableSlots: 42,
      totalSlots: 100,
      status: 'OPEN'
    },
    {
      id: 'mock-area-2',
      name: 'Khu vực đỗ xe Bến Thành',
      address: 'Phường Bến Thành, Quận 1',
      availableSlots: 15,
      totalSlots: 80,
      status: 'OPEN'
    }
  ];

  const displayAreas = realAreas.length > 0 ? realAreas : mockAreas;

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

  // Animations variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 18,
      },
    },
  };

  const quickActions = [
    { 
      key: 'booking', 
      path: ROUTES.DRIVER.BOOKING, 
      labelVi: 'Đặt chỗ ngay', 
      labelEn: 'Book Spot',
      descVi: 'Tìm slot đỗ nhanh',
      descEn: 'Find parking fast',
      icon: 'add_circle', 
      color: 'text-[#0EA5E9] bg-[#E0F2FE]' 
    },
    { 
      key: 'payments', 
      path: ROUTES.DRIVER.PAYMENT, 
      labelVi: 'Thanh toán', 
      labelEn: 'Payments',
      descVi: 'Hóa đơn & lịch sử',
      descEn: 'Invoices & history',
      icon: 'payments', 
      color: 'text-[#2563EB] bg-[#EFF6FF]' 
    },
    { 
      key: 'registerVehicle', 
      path: ROUTES.DRIVER.VEHICLE_REGISTRATION, 
      labelVi: 'Đăng ký thẻ xe', 
      labelEn: 'Vehicle Card',
      descVi: 'Đăng ký thẻ tháng',
      descEn: 'Monthly pass',
      icon: 'assignment_ind', 
      color: 'text-[#2563EB] bg-[#EFF6FF]' 
    },
    { 
      key: 'support', 
      path: ROUTES.DRIVER.SUPPORT, 
      labelVi: 'AI hỗ trợ', 
      labelEn: 'AI Support',
      descVi: 'Trợ lý ảo 24/7',
      descEn: 'Virtual assistant',
      icon: 'smart_toy', 
      color: 'text-[#0EA5E9] bg-[#E0F2FE]' 
    },
  ];

  return (
    <motion.div 
      className="max-w-[1400px] mx-auto px-1 flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>

      {/* 1. Welcome Section */}
      <motion.div 
        variants={itemVariants}
        className="relative mb-8 overflow-hidden rounded-[24px] border border-[#4BB8FA] bg-[#4BB8FA] p-4 shadow-[0_18px_46px_rgba(15,23,42,0.06)] md:mb-10 md:p-5"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[#0EA5E9]/10 blur-3xl" />
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between relative z-10">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
              Xin chào, {displayName} 👋
            </h1>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-white/90">
              Chào mừng bạn quay trở lại với hệ thống quản lý đỗ xe thông minh.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-1.5 shadow-sm md:self-auto">
            <span className={`inline-block h-2 w-2 rounded-full ${activeBooking ? 'animate-pulse bg-emerald-500' : 'bg-[#CBD5E1]'}`} />
            <span className="text-[11px] font-semibold text-[#334155]">
              {getStatusText()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Left Columns (Col Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* 2. Current Booking Card / Call to Action */}
          <motion.div variants={itemVariants}>
            {loading ? (
              <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-1.5 shadow-[0_18px_46px_rgba(15,23,42,0.05)]">
                <div className="h-64 animate-pulse rounded-[18px] bg-[#F5F7FB]" />
              </div>
            ) : activeBooking ? (
              // Double-Bezel Architecture
              <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-1.5 shadow-[0_18px_46px_rgba(15,23,42,0.06)]">
                <div className="relative overflow-hidden rounded-[18px] border border-[#E5E7EB] bg-gradient-to-br from-white via-[#F8FAFC] to-[#E0F2FE] p-5 text-[#0F172A] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <div className="pointer-events-none absolute right-0 top-0 -mr-12 -mt-12 h-44 w-44 rounded-full bg-[#0EA5E9]/16 blur-3xl" />
                  <div className="pointer-events-none absolute bottom-0 left-1/3 -mb-12 -ml-12 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row justify-between gap-5">
                    
                    {/* Left: Info */}
                    <div className="flex-1 flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#0EA5E9]">
                            {t('driverDashboard.bookingId')}:
                          </span>
                          <span className="font-mono text-[9px] font-medium text-[#2563EB]">
                            #{activeBooking.id}
                          </span>
                        </div>
                        <h2 className="mt-1 text-lg font-bold leading-snug tracking-tight text-[#0F172A] md:text-xl">
                          {activeBooking.parkingAreaName}
                        </h2>
                      </div>

                      {/* Details Grid */}
                      <div className="my-0.5 grid grid-cols-3 gap-2 border-y border-[#E5E7EB] py-3.5">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#64748B]">{t('driverDashboard.floor')}</p>
                          <p className="mt-0.5 text-xs font-bold text-[#0F172A]">
                            {t('driverDashboard.floorVal', { floor: activeBooking.floorNumber })}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#64748B]">{t('driverDashboard.vehicleType')}</p>
                          <p className="mt-0.5 text-xs font-bold text-[#0F172A]">
                            {activeBooking.vehicleType === 'CAR' ? t('driverDashboard.carArea') : t('driverDashboard.motoArea')}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#64748B]">{t('driverDashboard.timeRemaining')}</p>
                          <p className="mt-0.5 font-mono text-xs font-bold text-[#0EA5E9]">
                            {activeBooking.status === 'PENDING' ? '--:--' : '01h 45m'}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          activeBooking.status === 'PENDING' 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {activeBooking.status === 'PENDING' ? t('driverDashboard.pending') : t('driverDashboard.active')}
                        </span>
                        
                        <div className="flex gap-2">
                          {activeBooking.status === 'CONFIRMED' && (
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={handleExtend}
                              className="cursor-pointer rounded-full border border-[#BAE6FD] bg-white px-3 py-1.5 text-xs font-bold !text-[#0369A1] shadow-sm transition-all hover:bg-[#F0F9FF]"
                            >
                              {t('driverDashboard.extend')}
                            </motion.button>
                          )}
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleEnd(activeBooking.id)}
                            className="cursor-pointer rounded-full bg-[#DC2626] px-3 py-1.5 text-xs font-bold !text-white shadow-[0_10px_20px_rgba(220,38,38,0.18)] transition-all hover:bg-[#B91C1C]"
                          >
                            {activeBooking.status === 'PENDING' ? t('driverDashboard.cancelRequest') : t('driverDashboard.end')}
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Right: Mock QR Ticket */}
                    <div className="group relative flex h-28 w-28 flex-col items-center justify-center self-center overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-[0_14px_28px_rgba(15,23,42,0.06)] md:self-auto">
                      <div className="absolute left-0 h-[1.5px] w-full animate-scan bg-[#0EA5E9] shadow-[0_0_8px_#0ea5e9]" style={{ animation: 'scan 3s linear infinite' }} />
                      <span className="material-symbols-outlined text-[44px] text-[#0EA5E9] transition-transform duration-500 group-hover:scale-105" style={{ fontVariationSettings: "'wght' 200" }}>
                        qr_code_2
                      </span>
                      <span className="mt-1.5 text-[8px] font-bold uppercase tracking-widest text-[#64748B]">VÉ ĐIỆN TỬ</span>
                    </div>

                  </div>
                </div>
              </div>
            ) : (
              // Empty State - Bento-style Split Grid
              <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-1.5 shadow-[0_18px_46px_rgba(15,23,42,0.06)]">
                <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-6 p-5">
                  
                  {/* Left: Text & Action */}
                  <div className="md:col-span-3 space-y-4 text-left">
                    <span className="inline-block rounded-full bg-[#E0F2FE] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0369A1]">
                      {t('driverDashboard.currentBooking')}
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-[#0F172A]">
                      {t('driverDashboard.noBookingsFound')}
                    </h3>
                    <p className="max-w-[45ch] text-xs leading-relaxed text-[#64748B]">
                      {t('driverDashboard.bookNowDesc')}
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(ROUTES.DRIVER.BOOKING)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#0EA5E9] px-4 py-2 text-xs font-bold !text-white shadow-[0_12px_24px_rgba(14,165,233,0.22)] transition-all hover:bg-[#0284C7]"
                    >
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'wght' 400" }}>add_circle</span>
                      <span>{t('driverDashboard.bookNow')}</span>
                    </motion.button>
                  </div>

                  {/* Right: Premium Vector Illustration */}
                  <div className="md:col-span-2 flex justify-center">
                    <div className="group relative aspect-square w-full max-w-[150px] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#F5F7FB] p-1 shadow-inner">
                      <img 
                        src="/empty_parking.png" 
                        alt="No active booking"
                        className="w-full h-full object-cover rounded-[10px] group-hover:scale-105 transition-transform duration-700 ease-out" 
                      />
                    </div>
                  </div>

                </div>
              </div>
            )}
          </motion.div>

          {/* 3. Quick Actions */}
          <motion.div 
            variants={itemVariants}
            className="space-y-3"
          >
            <h3 className="px-1 text-xs font-bold uppercase tracking-widest text-[#64748B]">
              Thao tác nhanh
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const label = i18n.language === 'vi' ? action.labelVi : action.labelEn;
                const desc = i18n.language === 'vi' ? action.descVi : action.descEn;
                
                return (
                  <motion.div
                    key={action.key}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(action.path)}
                    className="group relative flex cursor-pointer flex-col justify-between rounded-[22px] border border-[#E5E7EB] bg-white p-4 text-left shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#BAE6FD] hover:shadow-[0_18px_42px_rgba(14,165,233,0.10)]"
                  >
                    <div className={`mb-3.5 flex h-9.5 w-9.5 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105 ${action.color}`}>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'wght' 300" }}>
                        {action.icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold tracking-tight text-[#0F172A] transition-colors group-hover:text-[#0EA5E9]">
                        {label}
                      </h4>
                      <p className="mt-0.5 text-[10px] font-medium text-[#64748B]">
                        {desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

        </div>

        {/* Right Side Column */}
        <div className="space-y-6">
          
          {/* 4. Nearest Lots */}
          <motion.div 
            variants={itemVariants}
            className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_46px_rgba(15,23,42,0.06)]"
          >
            <h3 className="border-b border-[#E5E7EB] pb-3 text-xs font-bold uppercase tracking-widest text-[#64748B]">
              {t('driverDashboard.nearestLots')}
            </h3>
            
            {areasLoading ? (
              <div className="mt-4 space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-28 animate-pulse rounded-xl bg-[#F5F7FB]" />
                ))}
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {displayAreas.map((area) => {
                  const fillRate = area.totalSlots > 0 
                    ? Math.round(((area.totalSlots - area.availableSlots) / area.totalSlots) * 100) 
                    : 0;

                  return (
                    <div
                      key={area.id}
                      onClick={() => navigate(ROUTES.DRIVER.BOOKING)}
                      className="group flex cursor-pointer flex-col gap-2.5 rounded-2xl border border-[#E5E7EB] p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[#BAE6FD] hover:bg-[#F8FAFC] hover:shadow-[0_14px_30px_rgba(14,165,233,0.08)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-xs font-bold tracking-tight text-[#0F172A] transition-colors group-hover:text-[#0EA5E9]">
                            {area.name}
                          </h4>
                          <p className="mt-0.5 line-clamp-1 text-[10px] font-medium leading-normal text-[#64748B]">
                            {area.address || 'Khu vực Trung tâm Quận 1'}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-[16px] text-[#0EA5E9] transition-transform duration-300 group-hover:scale-110" style={{ fontVariationSettings: "'wght' 300" }}>
                          location_on
                        </span>
                      </div>

                      {/* Fill Rate Progress Bar */}
                      <div className="space-y-1.5 mt-1">
                        <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-[#64748B]">
                          <span>{t('driverDashboard.availableSlotsLabel')}</span>
                          <span className="font-mono text-[#334155]">
                            {area.availableSlots} / {area.totalSlots}
                          </span>
                        </div>
                        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
                          <div 
                            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                              fillRate >= 85 ? 'bg-rose-500' : fillRate >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${fillRate}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-bold">
                          <span className="uppercase tracking-wider text-[#64748B]">Tỉ lệ lấp đầy:</span>
                          <span className={fillRate >= 85 ? 'text-rose-500/90' : fillRate >= 60 ? 'text-amber-500/90' : 'text-emerald-500/90'}>
                            {fillRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* 5. Recent History */}
          <motion.div 
            variants={itemVariants}
            className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_46px_rgba(15,23,42,0.06)]"
          >
            <div className="mb-4 flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#64748B]">
                {t('driverDashboard.recentHistory')}
              </h3>
              <button
                onClick={() => navigate(ROUTES.DRIVER.HISTORY)}
                className="cursor-pointer text-xs font-bold text-[#0EA5E9] transition-colors hover:text-[#0284C7] hover:underline"
              >
                {t('driverDashboard.viewAll')}
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-xl bg-[#F5F7FB]" />
                ))}
              </div>
            ) : displayHistory.length > 0 ? (
              <div className="space-y-3">
                {displayHistory.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] p-3 text-left transition-all duration-200 hover:bg-[#F8FAFC]"
                  >
                    <div className="space-y-1 min-w-0 pr-2">
                      <p className="max-w-[150px] truncate text-xs font-bold leading-none text-[#0F172A]">
                        {b.parkingAreaName}
                      </p>
                      <p className="font-mono text-[9px] font-medium text-[#64748B]">
                        {formatVietnamDate(b.createdAt)}
                      </p>
                    </div>

                    <span className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border shrink-0 ${
                      b.status === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : b.status === 'CANCELLED'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {b.status === 'CONFIRMED' 
                        ? t('driverDashboard.completed') 
                        : b.status === 'CANCELLED' 
                          ? t('driverDashboard.cancelled') 
                          : t('driverDashboard.rejected')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs font-bold text-[#64748B]">
                {t('driverDashboard.noHistory')}
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
