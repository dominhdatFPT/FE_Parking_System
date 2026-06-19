import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { bookingService } from '../../../../services/bookingService';
import { ROUTES } from '../../../../constants/routes';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import VehicleTypeSelector from '../../components/VehicleTypeSelector';
import FloorSelector from '../../components/FloorSelector';

export default function DriverBooking() {
  const navigate = useNavigate();
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
  };

  if (success) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('booking.title')} subtitle={t('booking.subtitle')} icon="confirmation_number" />
        <div className="mx-auto max-w-lg">
          <div className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
              <span className="material-symbols-outlined text-[48px]">check_circle</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">{t('booking.createSuccess')}</h2>
            <p className="mt-2 text-sm text-slate-500">
              Booking <span className="font-bold text-sky-600">#{success.id}</span>
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-bold text-amber-600 ring-1 ring-amber-200">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              PENDING - {t('booking.pendingStatus')}
            </div>
            <div className="mt-6 flex gap-3 justify-center">
              <Button variant="secondary" size="md" icon="receipt_long" onClick={() => navigate(ROUTES.DRIVER.HISTORY)}>
                {t('booking.viewBooking')}
              </Button>
              <Button variant="primary" size="md" icon="add_circle" onClick={() => { setSuccess(null); setStep(1); setVehicleType(''); setSelectedArea(null); setSelectedFloor(null); setFloors([]); }}>
                {t('booking.newBooking')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const STEPS = [
    { num: 1, label: t('booking.step1'), icon: 'two_wheeler' },
    { num: 2, label: t('booking.step2'), icon: 'local_parking' },
    { num: 3, label: t('booking.step3'), icon: 'check_circle' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t('booking.title')} subtitle={t('booking.subtitle')} icon="confirmation_number" />

      <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="mb-6 flex items-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                  step > s.num ? 'bg-emerald-500 text-white' : step === s.num ? 'bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white shadow-md shadow-sky-300/40' : 'bg-slate-100 text-slate-400'
                }`}>
                  {step > s.num ? <span className="material-symbols-outlined text-[16px]">check</span> : <span className="material-symbols-outlined text-[18px]">{s.icon}</span>}
                </div>
                <span className={`hidden text-xs font-medium lg:block ${step >= s.num ? 'text-slate-700' : 'text-slate-400'}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`mx-3 h-0.5 flex-1 rounded-full transition-colors duration-300 ${step > s.num ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        <div className="min-h-[250px]">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="mb-4 text-sm font-medium text-slate-600">{t('booking.selectVehicleType')}</p>
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
                        <button key={area.id} type="button" disabled={isFull} onClick={() => handleSelectArea(area)}
                          className={`rounded-xl border-2 p-3 text-left transition-all ${isFull ? 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-50' : isSelected ? 'border-sky-500 bg-sky-50 shadow-md shadow-sky-100' : 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm'}`}>
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
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{t('booking.vehicleType')}</span>
                  <span className="font-bold text-slate-800">{vehicleType === 'MOTORBIKE' ? t('booking.motorcycle') : t('booking.car')}</span>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{t('booking.parkingLot')}</span>
                  <span className="font-bold text-slate-800">{selectedArea?.name}</span>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{t('booking.floor')}</span>
                  <span className="font-bold text-slate-800">{t('booking.floor')} {selectedFloor}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700 ring-1 ring-amber-100">
                <span className="material-symbols-outlined mt-0.5 text-[16px]">info</span>
                {t('booking.pendingNote')}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-2 border-t border-slate-100 pt-4">
          {step > 1 && (
            <Button variant="secondary" size="md" icon="arrow_back" onClick={handleBack}>
              {t('common.back')}
            </Button>
          )}
          {step < 3 ? (
            <Button variant="primary" size="md" iconRight="arrow_forward" disabled={!canNext} onClick={handleNext} className="flex-1 justify-center">
              {t('common.next')}
            </Button>
          ) : (
            <Button variant="primary" size="md" icon="check_circle" disabled={!canSubmit} loading={submitting} onClick={handleSubmit} className="flex-1 justify-center">
              {t('booking.createBooking')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
