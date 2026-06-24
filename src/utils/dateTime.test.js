import { describe, expect, it } from 'vitest';
import {
  apiDateTimeMillis,
  formatVietnamDateTime,
  normalizeApiDateTime,
  vietnamDayjs,
} from './dateTime';

describe('Vietnam date-time handling', () => {
  it('treats zone-less backend LocalDateTime values as UTC', () => {
    expect(normalizeApiDateTime('2026-06-22T16:43:00')).toBe('2026-06-22T16:43:00Z');
    expect(formatVietnamDateTime('2026-06-22T16:43:00')).toContain('23:43');
  });

  it('does not shift values that already contain an offset twice', () => {
    expect(normalizeApiDateTime('2026-06-22T23:43:00+07:00')).toBe('2026-06-22T23:43:00+07:00');
    expect(vietnamDayjs('2026-06-22T23:43:00+07:00').format('HH:mm DD/MM/YYYY'))
      .toBe('23:43 22/06/2026');
  });

  it('leaves date-only form values unchanged', () => {
    expect(normalizeApiDateTime('2026-06-22')).toBe('2026-06-22');
  });

  it('parses timestamps consistently for elapsed-time calculations', () => {
    expect(apiDateTimeMillis('2026-06-22T16:43:00'))
      .toBe(Date.parse('2026-06-22T16:43:00Z'));
  });
});
