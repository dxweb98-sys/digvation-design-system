import { describe, expect, it } from 'vitest';

import {
  formatCurrencyInputValue,
  normalizeDecimalInput,
  parseCurrencyInputValue,
} from './input';

describe('shared decimal field helpers', () => {
  it('keeps a controlled decimal value as text and applies its scale', () => {
    expect(normalizeDecimalInput('00012,34567')).toBe('12.3456');
    expect(normalizeDecimalInput('12.3.4')).toBe('123.4');
    expect(normalizeDecimalInput('0008', { integer: true })).toBe('8');
  });

  it('formats only the presentation value of a money field', () => {
    expect(formatCurrencyInputValue('125000.5')).toBe('125.000,5');
    expect(formatCurrencyInputValue('1.234,50')).toBe('1.234,50');
    expect(formatCurrencyInputValue('')).toBe('');
  });

  it('parses a localized currency presentation back to canonical decimal text', () => {
    expect(parseCurrencyInputValue('1.234')).toBe('1234');
    expect(parseCurrencyInputValue('1.234.567')).toBe('1234567');
    expect(parseCurrencyInputValue('1.234,50')).toBe('1234.50');
    expect(parseCurrencyInputValue('Rp 12.345,6')).toBe('12345.6');
    expect(parseCurrencyInputValue('')).toBe('');
  });
});
