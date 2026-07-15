const STORAGE_KEY = 'parking_vehicle_type_by_plate';

export function normalizePlateKey(value = '') {
  return String(value).trim().toUpperCase().replace(/[\s.-]/g, '');
}

export function normalizeVehicleTypeCode(value) {
  const normalized = String(value || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim();

  if (normalized === '1') return 'MOTORBIKE';
  if (normalized === '2') return 'CAR';
  if (
    normalized === 'MOTORBIKE'
    || normalized.includes('MOTOR')
    || normalized.includes('MOTO')
    || normalized.includes('BIKE')
    || normalized.includes('XE MAY')
  ) {
    return 'MOTORBIKE';
  }
  if (
    normalized === 'CAR'
    || normalized.includes('AUTO')
    || normalized.includes('O TO')
    || normalized.includes('OTO')
  ) {
    return 'CAR';
  }

  return '';
}

function readVehicleTypeMap() {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function rememberVehicleType(licensePlate, vehicleType) {
  if (typeof window === 'undefined') return;

  const plateKey = normalizePlateKey(licensePlate);
  const typeCode = normalizeVehicleTypeCode(vehicleType);
  if (!plateKey || !typeCode) return;

  const nextMap = {
    ...readVehicleTypeMap(),
    [plateKey]: typeCode,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMap));
}

export function getRememberedVehicleType(licensePlate) {
  const plateKey = normalizePlateKey(licensePlate);
  if (!plateKey) return '';

  return normalizeVehicleTypeCode(readVehicleTypeMap()[plateKey]);
}
