export type ValidationValue = unknown;
export type ValidationParams = Record<string, string | number | boolean | null | undefined>;

export interface ValidationIssue {
  key?: string;
  message?: string;
  params?: ValidationParams;
}

export interface ValidationContext<TValues extends Record<string, unknown> = Record<string, unknown>> {
  name: string;
  label: string;
  values: TValues;
}

export type ValidationResult = ValidationIssue | string | null | undefined | false;
export type ValidationRule<TValue = ValidationValue, TValues extends Record<string, unknown> = Record<string, unknown>> = (
  value: TValue,
  context: ValidationContext<TValues>,
) => ValidationResult | Promise<ValidationResult>;

export type ValidationSchema<TValues extends Record<string, unknown> = Record<string, unknown>> = Partial<{
  [K in keyof TValues]: readonly ValidationRule<TValues[K], TValues>[];
}> & Record<string, readonly ValidationRule[]>;

function issue(key: string, params?: ValidationParams, message?: string): ValidationIssue {
  return { key, params, message };
}

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null || value === '' || value === false) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') {
    const entries = Object.values(value as Record<string, unknown>);
    return entries.length === 0 || entries.every(isEmpty);
  }
  return false;
}

function optionalEmpty(value: unknown) {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

export function required(message?: string): ValidationRule {
  return (value) => isEmpty(value) ? issue('validation.required', undefined, message) : null;
}

export function accepted(message?: string): ValidationRule {
  return (value) => value === true || value === 'true' || value === 1 ? null : issue('validation.accepted', undefined, message);
}

export function email(message?: string): ValidationRule {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (value) => optionalEmpty(value) || pattern.test(String(value)) ? null : issue('validation.email', undefined, message);
}

export function url(message?: string): ValidationRule {
  return (value) => {
    if (optionalEmpty(value)) return null;
    try {
      const parsed = new URL(String(value));
      return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? null : issue('validation.url', undefined, message);
    } catch {
      return issue('validation.url', undefined, message);
    }
  };
}

export function minLength(min: number, message?: string): ValidationRule {
  return (value) => optionalEmpty(value) || String(value).length >= min ? null : issue('validation.minLength', { min }, message);
}

export function maxLength(max: number, message?: string): ValidationRule {
  return (value) => optionalEmpty(value) || String(value).length <= max ? null : issue('validation.maxLength', { max }, message);
}

export function minValue(min: number, message?: string): ValidationRule {
  return (value) => optionalEmpty(value) || (Number.isFinite(Number(value)) && Number(value) >= min) ? null : issue('validation.minValue', { min }, message);
}

export function maxValue(max: number, message?: string): ValidationRule {
  return (value) => optionalEmpty(value) || (Number.isFinite(Number(value)) && Number(value) <= max) ? null : issue('validation.maxValue', { max }, message);
}

export function integer(message?: string): ValidationRule {
  return (value) => optionalEmpty(value) || Number.isInteger(Number(value)) ? null : issue('validation.integer', undefined, message);
}

export function pattern(regex: RegExp, message?: string): ValidationRule {
  return (value) => {
    if (optionalEmpty(value)) return null;
    regex.lastIndex = 0;
    return regex.test(String(value)) ? null : issue('validation.pattern', undefined, message);
  };
}


export function sameAs(otherField: string, otherLabel = otherField, message?: string): ValidationRule {
  return (value, context) => Object.is(value, context.values[otherField]) ? null : issue('validation.sameAs', { otherLabel }, message);
}

export function oneOf(values: readonly unknown[], message?: string): ValidationRule {
  return (value) => optionalEmpty(value) || values.some((candidate) => Object.is(candidate, value)) ? null : issue('validation.oneOf', undefined, message);
}

export function date(message?: string): ValidationRule {
  return (value) => {
    if (optionalEmpty(value)) return null;
    const raw = String(value).split('T')[0] ?? '';
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
    if (!match) return issue('validation.date', undefined, message);
    const year = Number(match[1]); const month = Number(match[2]); const day = Number(match[3]);
    const parsed = new Date(year, month - 1, day);
    return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day ? null : issue('validation.date', undefined, message);
  };
}

export function time(message?: string): ValidationRule {
  return (value) => optionalEmpty(value) || /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(String(value).split('T').pop() ?? '') ? null : issue('validation.time', undefined, message);
}

export function customValidation<TValue = ValidationValue>(rule: ValidationRule<TValue>): ValidationRule<TValue> {
  return rule;
}

export async function validateValue<TValue = ValidationValue>(
  value: TValue,
  rules: readonly ValidationRule<TValue>[] = [],
  context: ValidationContext = { name: '', label: 'Field', values: {} },
): Promise<ValidationIssue | null> {
  for (const rule of rules) {
    const result = await rule(value, context);
    if (!result) continue;
    if (typeof result === 'string') return { message: result };
    return result;
  }
  return null;
}
