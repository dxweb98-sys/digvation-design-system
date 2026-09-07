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
import { useDLocalization } from '../localization';
import { INPUT_SIZE_STYLES, type InputSize } from '../shared';

function ClockIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
}
function ClearIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5"><path d="m18 6-12 12M6 6l12 12" /></svg>;
}

export type TimePickerVariant = TimePrecision;
export type TimePickerMinuteStep = TimeMinuteStep;

export interface TimePickerProps {
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
  size?: InputSize;
  variant?: TimePickerVariant;
  minuteStep?: TimePickerMinuteStep;
  scrollBehavior?: FloatingScrollBehavior;
}

function TimePickerContent({
  value,
  onChange,
  variant,
  minuteStep,
}: Pick<TimePickerProps, 'value' | 'onChange'> & {
  variant: TimePickerVariant;
  minuteStep: TimePickerMinuteStep;
}) {
  const close = useDropdownClose();
  const { t } = useDLocalization();
  const fallback = () => getCurrentTimeValue(variant, minuteStep);
  const [draft, setDraft] = useState(() => normalizeTimeValue(value, variant) || fallback());

  useEffect(() => {
    setDraft(normalizeTimeValue(value, variant) || fallback());
  }, [value, variant, minuteStep]);

  const apply = () => {
    onChange?.(normalizeTimeValue(draft, variant));
    close?.();
  };

  return (
    <div className={cn('p-3', variant === 'hour' ? 'w-[min(232px,calc(100vw-16px))]' : 'w-[min(320px,calc(100vw-16px))]')}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[var(--color-text)]">{t('timePicker.title')}</p>
          <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">{variant === 'hour' ? t('timePicker.hourPrecision') : t('timePicker.hourMinutePrecision')}</p>
        </div>
        <span className="rounded-[var(--radius-menu-item)] bg-[var(--color-surface-muted)] px-2 py-1 text-xs font-semibold tabular-nums text-[var(--color-text)]">{draft}</span>
      </div>

      <TimePickerPanel value={draft} variant={variant} minuteStep={minuteStep} onChange={setDraft} />

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3">
        <button
          type="button"
          onClick={() => setDraft(fallback())}
          className="h-8 appearance-none rounded-[var(--radius-menu-item)] border-0 bg-transparent px-2 text-xs font-medium text-[var(--color-brand)] shadow-none hover:bg-[var(--color-surface-muted)]"
        >
          {t('timePicker.now')}
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => close?.()}
            className="h-8 appearance-none rounded-[var(--radius-menu-item)] border-0 bg-transparent px-3 text-xs font-medium text-[var(--color-text-muted)] shadow-none hover:bg-[var(--color-surface-muted)]"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={apply}
            className="h-8 appearance-none rounded-[var(--radius-menu-item)] border-0 bg-[var(--color-brand)] px-3 text-xs font-semibold text-[var(--color-brand-foreground)] shadow-none hover:brightness-95"
          >
            {t('common.apply')}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DTimePicker({
  label,
  value,
  onChange,
  onClear,
  placeholder,
  error,
  hint,
  disabled = false,
  clearable = true,
  containerClassName,
  size = 'md',
  variant = 'hour-minute',
  minuteStep = 1,
  scrollBehavior = 'reposition',
}: TimePickerProps) {
  const id = useId();
  const { t } = useDLocalization();
  const s = INPUT_SIZE_STYLES[size];
  const display = normalizeTimeValue(value, variant);
  const resolvedPlaceholder = placeholder ?? t('timePicker.placeholder');

  return (
    <div data-ds-component="time-picker" className={cn('flex min-w-0 flex-col gap-1.5', containerClassName)}>
      {label ? <label htmlFor={id} className={cn(s.label, 'w-fit font-medium text-[var(--color-text)]')}>{label}</label> : null}
      <DDropdown contentRole="dialog" contentPadding={false} scrollBehavior={scrollBehavior} trigger={() => (
        <div className="relative">
          <button
            id={id}
            type="button"
            disabled={disabled}
            aria-invalid={Boolean(error) || undefined}
            className={cn(
              'flex w-full items-center gap-2 rounded-[var(--radius-control)] border bg-[var(--color-surface)] text-left text-[var(--color-text)] transition-colors focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 disabled:cursor-not-allowed disabled:bg-[var(--color-surface-muted)] disabled:opacity-50',
              s.input,
              error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]',
              !display && 'text-[var(--color-text-muted)]/60',
              clearable && display && 'pr-10',
            )}
          >
            <span className="text-[var(--color-text-muted)]"><ClockIcon /></span>
            <span className="min-w-0 flex-1 truncate tabular-nums">{display || resolvedPlaceholder}</span>
          </button>
          {clearable && display && !disabled ? (
            <button
              type="button"
              aria-label={t('timePicker.clear')}
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onChange?.('');
                onClear?.();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 appearance-none rounded-md border-0 bg-transparent p-1 text-[var(--color-text-muted)] shadow-none hover:bg-[var(--color-surface-muted)]"
            >
              <ClearIcon />
            </button>
          ) : null}
        </div>
      )}>
        <TimePickerContent value={value} onChange={onChange} variant={variant} minuteStep={minuteStep} />
      </DDropdown>
      {error ? <p className="text-xs text-[var(--color-danger)]">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-[var(--color-text-muted)]">{hint}</p> : null}
    </div>
  );
}
