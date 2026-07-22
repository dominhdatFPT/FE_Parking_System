export const PLATE_REGEX = /^(?=.*[A-Z])(?=.*\d)(?!-)(?!.*--)[A-Z0-9]+(?:-[A-Z0-9]+)*$/;
export const PLATE_MIN_LENGTH = 5;
export const PLATE_MAX_LENGTH = 12;

export const sanitizeLicensePlateInput = (value = '') =>
  value.toUpperCase().replace(/[^A-Z0-9-]/g, '');

export const normalizeLicensePlate = (value = '') =>
  sanitizeLicensePlateInput(value).slice(0, PLATE_MAX_LENGTH);

export const isValidLicensePlate = (value = '') => {
  const normalized = normalizeLicensePlate(value);
  return (
    normalized.length >= PLATE_MIN_LENGTH &&
    normalized.length <= PLATE_MAX_LENGTH &&
    PLATE_REGEX.test(normalized)
  );
};
