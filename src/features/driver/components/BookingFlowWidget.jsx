import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import VehicleTypeSelector from './VehicleTypeSelector';
import FloorSelector from './FloorSelector';
import { bookingService } from '../../../services/bookingService';

const STEPS = [
  { num: 1, key: 'step1' },
  { num: 2, key: 'step2' },
  { num: 3, key: 'step3' },
];

export default function BookingFlowWidget({ onBookingCreated }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [vehicleType, setVehicleType] = useState('');
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [floors, setFloors] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await bookingService.getParkingAreas();
      if (!cancelled) {
        setAreas(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSelectArea = useCallback(async (area) => {
    setSelectedArea(area);
    setSelectedFloor(null);
    const { data } = await bookingService.getFloorsByArea(area.id);
    setFloors(Array.isArray(data) ? data : []);
  }, []);

  const canNext = step === 1 ? !!vehicleType : step === 2 ? !!selectedArea && !!selectedFloor : false;
  const canSubmit = !!vehicleType && !!selectedArea && !!selectedFloor && !submitting;

  const handleNext = () => { if (canNext) setStep((s) => s + 1); };
  const handleBack = () => {
    if (step === 2) { setSelectedArea(null); setSelectedFloor(null); setFloors([]); }
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    const { data, error: err } = await bookingService.createBooking({
      vehicleType,
      parkingAreaId: selectedArea.id,
      floorNumber: selectedFloor,
    });
    setSubmitting(false);
    if (err) { setError('Không thể tạo booking. Vui lòng thử lại.'); return; }
    setSuccess(data);
    onBookingCreated?.(data);
    setTimeout(() => {
      setStep(1);
      setVehicleType('');
      setSelectedArea(null);
      setSelectedFloor(null);
      setFloors([]);
      setSuccess(null);
    }, 3000);
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center py-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>
          <h3 className="text-lg font-bold text-slate-800">{t('booking.createSuccess')}</h3>
          <p className="mt-2 text-sm text-slate-500">
            Booking <span className="font-semibold text-sky-600">#{success.id}</span>
          </p>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-600 ring-1 ring-amber-100">
            PENDING
          </div>
          <p className="mt-2 text-xs text-slate-400">{t('booking.pendingStatus')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-800">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] text-white shadow-sm">
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
        </span>
        {t('dashboard.quickBooking')}
      </h3>

      <div className="mb-6 flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                step > s.num ? 'bg-emerald-500 text-white' : step === s.num ? 'bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white shadow-md shadow-sky-300/40' : 'bg-slate-100 text-slate-400'
              }`}>
                {step > s.num ? <span className="material-symbols-outlined text-[16px]">check</span> : s.num}
              </div>
              <span className={`hidden text-xs font-medium sm:block ${step >= s.num ? 'text-slate-700' : 'text-slate-400'}`}>{t(`booking.${s.key}`)}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`mx-2 h-0.5 flex-1 rounded-full transition-colors duration-300 ${step > s.num ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}

      <div className="min-h-[200px]">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="mb-3 text-sm font-medium text-slate-600">{t('booking.selectVehicleType')}</p>
            <VehicleTypeSelector selected={vehicleType} onChange={setVehicleType} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-sm font-medium text-slate-600">{t('booking.selectParkingAndFloor')}</p>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
              </div>
            ) : (
              <>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {areas.map((area) => {
                    const isFull = area.status === 'FULL' || area.availableSlots === 0;
                    const isSelected = selectedArea?.id === area.id;
                    return (
                      <button
                        key={area.id}
                        type="button"
                        disabled={isFull}
                        onClick={() => handleSelectArea(area)}
                        className={`rounded-xl border-2 p-3 text-left transition-all duration-200 ${
                          isFull
                            ? 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-50'
                            : isSelected
                              ? 'border-sky-500 bg-sky-50 shadow-md shadow-sky-100'
                              : 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-bold ${isSelected ? 'text-sky-700' : 'text-slate-700'}`}>{area.name}</p>
                          {isSelected && <span className="material-symbols-outlined text-[16px] text-sky-500">check_circle</span>}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">{isFull ? t('booking.full') : `${area.availableSlots} ${t('booking.slotsAvailable')}`}</p>
                      </button>
                    );
                  })}
                </div>
                <FloorSelector floors={floors} selectedFloor={selectedFloor} onSelect={setSelectedFloor} />
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-sm font-medium text-slate-600">{t('booking.confirmInfo')}</p>
            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-sky-50/30 p-5 space-y-3 ring-1 ring-slate-100">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
                  {t('booking.vehicleType')}
                </span>
                <span className="text-sm font-bold text-slate-800">{vehicleType === 'MOTORBIKE' ? t('booking.motorcycle') : t('booking.car')}</span>
              </div>
              <div className="h-px bg-slate-200" />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="material-symbols-outlined text-[18px]">local_parking</span>
                  {t('booking.parkingLot')}
                </span>
                <span className="text-sm font-bold text-slate-800">{selectedArea?.name}</span>
              </div>
              <div className="h-px bg-slate-200" />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="material-symbols-outlined text-[18px]">layers</span>
                  {t('booking.floor')}
                </span>
                <span className="text-sm font-bold text-slate-800">{t('booking.floor')} {selectedFloor}</span>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700 ring-1 ring-amber-100">
              <span className="material-symbols-outlined mt-0.5 text-[16px]">info</span>
              {t('booking.pendingNote')}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
        {step > 1 && (
          <Button variant="secondary" size="md" icon="arrow_back" onClick={handleBack}>
            {t('common.back')}
          </Button>
        )}
        {step < 3 ? (
          <Button
            variant="primary"
            size="md"
            iconRight="arrow_forward"
            disabled={!canNext}
            onClick={handleNext}
            className="flex-1 justify-center"
          >
            {t('common.next')}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            icon="check_circle"
            disabled={!canSubmit}
            loading={submitting}
            onClick={handleSubmit}
            className="flex-1 justify-center"
          >
            {t('booking.createBooking')}
          </Button>
        )}
      </div>
    </div>
  );
}
