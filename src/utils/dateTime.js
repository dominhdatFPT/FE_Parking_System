import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const VIETNAM_TIME_ZONE = 'Asia/Ho_Chi_Minh';

const ZONELESS_ISO_DATE_TIME = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?)$/;

/**
 * The backend and PostgreSQL run in UTC, while LocalDateTime responses do not
 * contain an offset. Attach UTC only to complete date-time values. Date-only
 * form values are intentionally left untouched.
 */
export function normalizeApiDateTime(value) {
  if (typeof value !== 'string') return value;
  const match = value.match(ZONELESS_ISO_DATE_TIME);
  return match ? `${match[1]}T${match[2]}Z` : value;
}

export function parseApiDateTime(value) {
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  if (!value) return null;

  const date = new Date(normalizeApiDateTime(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function apiDateTimeMillis(value) {
  return parseApiDateTime(value)?.getTime() ?? Number.NaN;
}

export function formatVietnamDateTime(value, options = {}) {
  const date = parseApiDateTime(value);
  if (!date) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: VIETNAM_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }).format(date);
}

export function formatVietnamDate(value, options = {}) {
  const date = parseApiDateTime(value);
  if (!date) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: VIETNAM_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  }).format(date);
}

export function formatVietnamTime(value, options = {}) {
  const date = parseApiDateTime(value);
  if (!date) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: VIETNAM_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }).format(date);
}

export function vietnamDayjs(value) {
  const date = parseApiDateTime(value);
  return dayjs(date ?? Number.NaN).tz(VIETNAM_TIME_ZONE);
}

export function normalizeApiDateTimes(value) {
  if (Array.isArray(value)) return value.map(normalizeApiDateTimes);
  if (value && typeof value === 'object') {
    Object.keys(value).forEach((key) => {
      value[key] = normalizeApiDateTimes(value[key]);
    });
    return value;
  }
  return normalizeApiDateTime(value);
}
