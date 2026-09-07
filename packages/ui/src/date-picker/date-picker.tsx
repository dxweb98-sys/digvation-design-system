import { useEffect, useId, useState, type ReactNode } from 'react';

import { cn } from '../cn';
import { DDropdown, useDropdownClose, type FloatingScrollBehavior } from '../dropdown';
import { TimePickerPanel } from '../internal/time/time-picker-panel';
import {
  getCurrentTimeValue,
  normalizeTimeValue,
  type TimeMinuteStep,
  type TimePrecision,
} from '../internal/time/time-utils';
import { INPUT_SIZE_STYLES, type InputSize } from '../shared';

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

function ChevronLeftIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4"><path d="m15 18-6-6 6-6" /></svg>; }
function ChevronRightIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4"><path d="m9 18 6-6-6-6" /></svg>; }
function CalendarIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>; }
function ClearIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5"><path d="m18 6-12 12M6 6l12 12" /></svg>; }

export type DatePickerVariant = 'date' | 'date-hour' | 'date-time';
export type DatePickerMinuteStep = TimeMinuteStep;

function datePart(value?: string) {
  return value?.split('T')[0] ?? '';
}

function timePart(value?: string) {
  const separator = value?.indexOf('T') ?? -1;
  return separator >= 0 ? value?.slice(separator + 1) ?? '' : '';
}

function parseDate(value?: string): Date | null {
  const raw = datePart(value);
  if (!raw) return null;
  const date = new Date(`${raw}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toValue(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function compareDateValue(value: string, boundary?: string) {
  if (!boundary) return 0;
  return value.localeCompare(datePart(boundary));
}

function timePrecision(variant: DatePickerVariant): TimePrecision {
  return variant === 'date-hour' ? 'hour' : 'hour-minute';
}

function formatDateDisplay(value?: string) {
  const date = parseDate(value);
  if (!date) return '';
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDisplayValue(value: string | undefined, variant: DatePickerVariant) {
  const dateDisplay = formatDateDisplay(value);
  if (!dateDisplay) return '';
  if (variant === 'date') return dateDisplay;
  const timeDisplay = normalizeTimeValue(timePart(value), timePrecision(variant));
  return timeDisplay ? `${dateDisplay} · ${timeDisplay}` : dateDisplay;
}

export interface DatePickerProps {
  label?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  error?: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
  clearable?: boolean;
  containerClassName?: string;
  minDate?: string;
  maxDate?: string;
  size?: InputSize;
  variant?: DatePickerVariant;
  minuteStep?: DatePickerMinuteStep;
  scrollBehavior?: FloatingScrollBehavior;
}

function DatePickerContent({
  value,
  onChange,
  minDate,
  maxDate,
  variant,
  minuteStep,
}: Pick<DatePickerProps, 'value' | 'onChange' | 'minDate' | 'maxDate'> & {
  variant: DatePickerVariant;
  minuteStep: DatePickerMinuteStep;
}) {
  const close = useDropdownClose();
  const today = new Date();
  const selectedDate = parseDate(value);
  const selectedDateValue = datePart(value);
  const precision = timePrecision(variant);
  const fallbackTime = () => getCurrentTimeValue(precision, minuteStep);
  const selectedTimeValue = normalizeTimeValue(timePart(value), precision) || fallbackTime();
  const [viewMonth, setViewMonth] = useState(selectedDate?.getMonth() ?? today.getMonth());
  const [viewYear, setViewYear] = useState(selectedDate?.getFullYear() ?? today.getFullYear());
  const [draftDate, setDraftDate] = useState(selectedDateValue);
  const [draftTime, setDraftTime] = useState(selectedTimeValue);

  useEffect(() => {
    const nextDate = parseDate(value);
    setDraftDate(datePart(value));
    setDraftTime(normalizeTimeValue(timePart(value), precision) || fallbackTime());
    if (!nextDate) return;
    setViewMonth(nextDate.getMonth());
    setViewYear(nextDate.getFullYear());
  }, [value, variant, minuteStep]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const move = (amount: number) => {
    const next = new Date(viewYear, viewMonth + amount, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const selectDate = (day: number) => {
    const next = toValue(viewYear, viewMonth, day);
    if ((minDate && compareDateValue(next, minDate) < 0) || (maxDate && compareDateValue(next, maxDate) > 0)) return;
    if (variant === 'date') {
      onChange?.(next);
      close?.();
      return;
    }
    setDraftDate(next);
  };

  const todayValue = toValue(today.getFullYear(), today.getMonth(), today.getDate());
  const todayDisabled = (minDate && compareDateValue(todayValue, minDate) < 0) || (maxDate && compareDateValue(todayValue, maxDate) > 0);

  const selectToday = () => {
    if (variant === 'date') {
      onChange?.(todayValue);
      close?.();
      return;
    }
    setDraftDate(todayValue);
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
  };

  const applyDateTime = () => {
    if (!draftDate) return;
    const normalizedTime = normalizeTimeValue(draftTime, precision) || fallbackTime();
    onChange?.(`${draftDate}T${normalizedTime}`);
    close?.();
  };

  return (
    <div className={cn('p-3', variant === 'date' ? 'w-[280px]' : 'w-[min(320px,calc(100vw-16px))]')}>
      <div className="mb-2 flex items-center justify-between">
        <button type="button" aria-label="Previous month" onClick={() => move(-1)} className="flex size-8 appearance-none items-center justify-center rounded-[var(--radius-menu-item)] border-0 bg-transparent text-[var(--color-text-muted)] shadow-none hover:bg-[var(--color-surface-muted)]"><ChevronLeftIcon /></button>
        <span className="text-sm font-medium text-[var(--color-text)]">{MONTHS[viewMonth]} {viewYear}</span>
        <button type="button" aria-label="Next month" onClick={() => move(1)} className="flex size-8 appearance-none items-center justify-center rounded-[var(--radius-menu-item)] border-0 bg-transparent text-[var(--color-text-muted)] shadow-none hover:bg-[var(--color-surface-muted)]"><ChevronRightIcon /></button>
      </div>
      <div className="mb-1 grid grid-cols-7 text-xs">{DAYS.map((day) => <div key={day} className="text-center text-[var(--color-text-muted)]">{day}</div>)}</div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, index) => <div key={`empty-${index}`} />)}
        {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => {
          const dateValue = toValue(viewYear, viewMonth, day);
          const selected = (variant === 'date' ? selectedDateValue : draftDate) === dateValue;
          const outside = (minDate && compareDateValue(dateValue, minDate) < 0) || (maxDate && compareDateValue(dateValue, maxDate) > 0);
          return (
            <button
              key={day}
              type="button"
              disabled={Boolean(outside)}
              onClick={() => selectDate(day)}
              className={cn(
                'aspect-square w-full appearance-none rounded-[var(--radius-control)] border-0 bg-transparent text-sm shadow-none transition-colors hover:bg-[var(--color-surface-muted)] disabled:cursor-not-allowed disabled:opacity-30',
                selected && 'bg-[var(--color-brand)] font-medium text-[var(--color-brand-foreground)] hover:bg-[var(--color-brand)]',
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {variant !== 'date' ? (
        <div className="mt-3 border-t border-[var(--color-border)] pt-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[var(--color-text)]">Waktu</p>
              <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">{variant === 'date-hour' ? 'Pilih jam' : 'Pilih jam dan menit'}</p>
            </div>
            <span className="rounded-[var(--radius-menu-item)] bg-[var(--color-surface-muted)] px-2 py-1 text-xs font-semibold tabular-nums text-[var(--color-text)]">{draftTime}</span>
          </div>
          <TimePickerPanel value={draftTime} variant={precision} minuteStep={minuteStep} onChange={setDraftTime} />
        </div>
      ) : null}

      {variant === 'date' ? (
        <div className="mt-2 border-t border-[var(--color-border)] pt-2">
          <button
            type="button"
            disabled={Boolean(todayDisabled)}
            onClick={selectToday}
            className="rounded-[var(--radius-menu-item)] px-2 py-1 text-xs font-medium text-[var(--color-brand)] hover:bg-[var(--color-brand)]/8 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Hari ini
          </button>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3">
          <button
            type="button"
            disabled={Boolean(todayDisabled)}
            onClick={selectToday}
            className="h-8 appearance-none rounded-[var(--radius-menu-item)] border-0 bg-transparent px-2 text-xs font-medium text-[var(--color-brand)] shadow-none hover:bg-[var(--color-surface-muted)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Hari ini
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => close?.()} className="h-8 appearance-none rounded-[var(--radius-menu-item)] border-0 bg-transparent px-3 text-xs font-medium text-[var(--color-text-muted)] shadow-none hover:bg-[var(--color-surface-muted)]">Batal</button>
            <button type="button" disabled={!draftDate} onClick={applyDateTime} className="h-8 appearance-none rounded-[var(--radius-menu-item)] border-0 bg-[var(--color-brand)] px-3 text-xs font-semibold text-[var(--color-brand-foreground)] shadow-none hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50">Terapkan</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function DDatePicker({
  label,
  value,
  onChange,
  onClear,
  placeholder = 'Pilih tanggal',
  error,
  hint,
  disabled = false,
  clearable = true,
  containerClassName,
  minDate,
  maxDate,
  size = 'md',
  variant = 'date',
  minuteStep = 1,
  scrollBehavior = 'reposition',
}: DatePickerProps) {
  const id = useId();
  const s = INPUT_SIZE_STYLES[size];
  const display = formatDisplayValue(value, variant);

  return (
    <div data-ds-component="date-picker" data-date-picker-variant={variant} className={cn('flex min-w-0 flex-col gap-1.5', containerClassName)}>
      {label ? <label htmlFor={id} className={cn(s.label, 'w-fit font-medium text-[var(--color-text)]')}>{label}</label> : null}
      <DDropdown contentRole="dialog" contentPadding={false} scrollBehavior={scrollBehavior} trigger={() => (
        <div className="relative">
          <button id={id} type="button" disabled={disabled} className={cn('flex w-full items-center gap-2 rounded-[var(--radius-control)] border bg-[var(--color-surface)] text-left text-[var(--color-text)] transition-colors focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 disabled:cursor-not-allowed disabled:bg-[var(--color-surface-muted)] disabled:opacity-50', s.input, error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]', !display && 'text-[var(--color-text-muted)]/60', clearable && display && 'pr-10')}>
            <span className="text-[var(--color-text-muted)]"><CalendarIcon /></span><span className="min-w-0 flex-1 truncate">{display || placeholder}</span>
          </button>
          {clearable && display && !disabled ? <button type="button" aria-label="Clear date" onMouseDown={(event) => event.preventDefault()} onClick={(event) => { event.preventDefault(); event.stopPropagation(); onChange?.(''); onClear?.(); }} className="absolute right-2 top-1/2 -translate-y-1/2 appearance-none rounded-md border-0 bg-transparent p-1 text-[var(--color-text-muted)] shadow-none hover:bg-[var(--color-surface-muted)]"><ClearIcon /></button> : null}
        </div>
      )}>
        <DatePickerContent value={value} onChange={onChange} minDate={minDate} maxDate={maxDate} variant={variant} minuteStep={minuteStep} />
      </DDropdown>
      {error ? <p className="text-xs text-[var(--color-danger)]">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-[var(--color-text-muted)]">{hint}</p> : null}
    </div>
  );
}
