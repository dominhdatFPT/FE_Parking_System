import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { bookingService } from '../../../../services/bookingService';
import { ROUTES } from '../../../../constants/routes';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { vietnamDayjs } from '../../../../utils/dateTime';

const ITEMS_PER_PAGE = 5;

export default function DriverHistory() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await bookingService.getMyBookings();
      if (!cancelled) {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = bookings.filter((b) => {
    const matchSearch = !search || b.id.toLowerCase().includes(search.toLowerCase()) || b.parkingAreaName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || b.status === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const filters = [
    { key: 'ALL', label: t('history.all'), count: bookings.length },
    { key: 'PENDING', label: t('history.pending'), count: bookings.filter((b) => b.status === 'PENDING').length },
    { key: 'CONFIRMED', label: t('history.confirmed'), count: bookings.filter((b) => b.status === 'CONFIRMED').length },
    { key: 'REJECTED', label: t('history.rejected'), count: bookings.filter((b) => b.status === 'REJECTED').length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('history.title')}
        subtitle={t('history.subtitle')}
        icon="receipt_long"
        actions={
          <Button variant="primary" size="md" icon="add_circle" onClick={() => navigate(ROUTES.DRIVER.BOOKING)}>
            {t('history.newBooking')}
          </Button>
        }
      />

      <div className="rounded-2xl border border-slate-100/80 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <span className="material-symbols-outlined text-[18px]">search</span>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={t('history.searchPlaceholder')}
              className="w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => { setFilter(f.key); setPage(1); }}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                filter === f.key
                  ? 'bg-sky-50 text-sky-600 ring-1 ring-sky-200'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {f.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${filter === f.key ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-500'}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white shadow-sm" />
          ))}
        </div>
      ) : paged.length === 0 ? (
        <EmptyState
          icon="receipt_long"
          title={t('history.noResults')}
          description={search || filter !== 'ALL' ? t('history.noResultsDesc') : t('history.emptyDesc')}
          actionLabel={filter === 'ALL' && !search ? t('history.bookNow') : undefined}
          onAction={filter === 'ALL' && !search ? () => navigate(ROUTES.DRIVER.BOOKING) : undefined}
        />
      ) : (
        <>
          <div className="space-y-3">
            {paged.map((b) => (
              <div key={b.id} className="group rounded-2xl border border-slate-100/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-500 ring-1 ring-sky-100 transition-transform duration-300 group-hover:scale-110">
                      <span className="material-symbols-outlined text-[22px]">
                        {b.vehicleType === 'MOTORBIKE' ? 'two_wheeler' : 'directions_car'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800">#{b.id}</p>
                        <StatusBadge status={b.status} />
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{b.parkingAreaName}</p>
                      <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">layers</span>
                          {t('history.floor')} {b.floorNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {vietnamDayjs(b.createdAt).format('HH:mm DD/MM/YYYY')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="secondary" size="icon-sm" icon="chevron_left" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} />
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i + 1)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                    page === i + 1 ? 'bg-sky-50 text-sky-600 ring-1 ring-sky-200' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <Button variant="secondary" size="icon-sm" icon="chevron_right" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
