import {
  forwardRef,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ForwardedRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { cn } from '../cn';
import { INPUT_SIZE_STYLES, type InputSize } from '../shared';

export type InputFormat = 'plain' | 'currency' | 'percentage';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

function ClearIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="m18 6-12 12M6 6l12 12" /></svg>;
}
function EyeIcon({ closed, className }: { closed?: boolean; className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>{closed ? <path d="m3 3 18 18" /> : null}<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5" /></svg>;
}
function InfoIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7h.01"/></svg>;
}

function assignRef<T>(ref: ForwardedRef<T>, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

function formatLegacyCurrency(value: string | number): string {
  const raw = String(value).replace(/\D/g, '');
  if (!raw || Number(raw) === 0) return '';
  return raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function eventWithValue(value: string): ChangeEvent<HTMLInputElement> {
  return { target: { value }, currentTarget: { value } } as ChangeEvent<HTMLInputElement>;
}

function countDigitsAfterCaret(value: string, caret: number | null) {
  if (caret === null) return 0;
  return value.slice(caret).replace(/\D/g, '').length;
}

function caretFromDigitsAfter(value: string, digitsAfter: number) {
  if (digitsAfter <= 0) return value.length;
  let remaining = digitsAfter;
  for (let index = value.length - 1; index >= 0; index -= 1) {
    if (/\d/.test(value[index] ?? '')) remaining -= 1;
    if (remaining === 0) return index;
  }
  return 0;
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size' | 'prefix'> {
  label?: ReactNode;
  labelInfo?: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
  type?: InputType;
  clearable?: boolean;
  size?: InputSize;
  onClear?: () => void;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  onNativeChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftAdornment?: ReactNode;
  rightAdornment?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  format?: InputFormat;
  loading?: boolean;
  containerClassName?: string;
}

export const DInput = forwardRef<HTMLInputElement, InputProps>(function DInput(
  {
    label,
    labelInfo,
    error,
    hint,
    type = 'text',
    clearable = true,
    size = 'md',
    onClear,
    onChange,
    onNativeChange,
    leftIcon,
    rightIcon,
    leftAdornment,
    rightAdornment,
    prefix,
    suffix,
    format = 'plain',
    loading = false,
    containerClassName,
    className,
    value,
    defaultValue,
    disabled,
    readOnly,
    id: externalId,
    ...props
  },
  forwardedRef,
) {
  const autoId = useId();
  const id = externalId ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCaretDigitsAfterRef = useRef<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const isControlled = value !== undefined && (Boolean(onChange || onNativeChange) || Boolean(readOnly));
  const [internalValue, setInternalValue] = useState(() => {
    if (value !== undefined && !isControlled) return String(value);
    return defaultValue == null ? '' : String(defaultValue);
  });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const s = INPUT_SIZE_STYLES[size];
  const currentValue = isControlled ? value : internalValue;

  // A value-only DInput is treated as an editable initial/synchronized value instead
  // of a permanently locked React controlled field. Consumers that need a truly
  // controlled input provide onChange/onNativeChange; display-only fields use readOnly.
  useEffect(() => {
    if (!isControlled && value !== undefined) setInternalValue(String(value));
  }, [isControlled, value]);

  const inputType = type === 'password' && showPassword ? 'text' : type === 'number' ? 'text' : type;
  const isZero = (type === 'number' || format === 'currency') && currentValue !== '' && currentValue != null && Number(currentValue) === 0;
  const hasValue = currentValue !== undefined && currentValue !== null && currentValue !== '' && !isZero;
  const showClear = clearable && hasValue && !disabled && !readOnly && !loading;
  const leadingIcon = leftAdornment ?? leftIcon;
  const trailingIcon = rightAdornment ?? rightIcon;
  const resolvedPrefix = prefix ?? (format === 'currency' ? 'Rp' : undefined);
  const resolvedSuffix = suffix ?? (format === 'percentage' ? '%' : undefined);
  const hasLeading = Boolean(leadingIcon || resolvedPrefix);
  const hasTrailing = Boolean(trailingIcon || resolvedSuffix || showClear || type === 'password' || loading);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!tooltipRef.current?.contains(event.target as Node)) setShowTooltip(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayValue = (() => {
    if (currentValue === undefined || currentValue === null) return '';
    if (type === 'number' && (currentValue === 0 || currentValue === '0')) return '';
    if (format === 'currency') return formatLegacyCurrency(currentValue as string | number);
    return String(currentValue);
  })();

  useLayoutEffect(() => {
    const pending = pendingCaretDigitsAfterRef.current;
    const input = inputRef.current;
    if (pending === null || !input || document.activeElement !== input) return;
    const nextCaret = caretFromDigitsAfter(input.value, pending);
    input.setSelectionRange(nextCaret, nextCaret);
    pendingCaretDigitsAfterRef.current = null;
  }, [displayValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let next = event.target.value;
    if (format === 'currency') {
      pendingCaretDigitsAfterRef.current = countDigitsAfterCaret(event.target.value, event.target.selectionStart);
      next = next.replace(/\D/g, '');
    } else if (format !== 'plain') {
      next = next.replace(/[^0-9.,-]/g, '');
    }

    if (!isControlled) setInternalValue(next);
    onChange?.(next, event);
    onNativeChange?.(event);
  };

  const handleClear = () => {
    const event = eventWithValue('');
    if (!isControlled) setInternalValue('');
    onClear?.();
    onChange?.('', event);
    onNativeChange?.(event);
    pendingCaretDigitsAfterRef.current = null;
    inputRef.current?.focus();
  };

  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', containerClassName)}>
      {label ? (
        <div className="flex w-fit items-center gap-1.5">
          <label htmlFor={id} className={cn(s.label, 'font-medium text-[var(--color-text)]')}>{label}</label>
          {labelInfo ? (
            <div ref={tooltipRef} className="group relative flex items-center">
              <button type="button" aria-label="Field information" aria-expanded={showTooltip} onClick={() => setShowTooltip((v) => !v)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                <InfoIcon className="size-3.5" />
              </button>
              <div role="tooltip" className={cn('invisible absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-[220px] -translate-x-1/2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100', showTooltip && 'visible opacity-100')}>
                <div className="relative rounded-lg bg-[var(--color-tooltip)] px-3 py-2 text-xs text-white shadow-lg">{labelInfo}<div className="absolute left-1/2 top-full size-0 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-[var(--color-tooltip)]" /></div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="relative flex min-w-0 items-center">
        {leadingIcon ? <span className={cn('pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 text-[var(--color-text-muted)]', size === 'sm' ? 'left-2.5 [&_svg]:size-3.5' : 'left-3 [&_svg]:size-4')}>{leadingIcon}</span> : null}
        {resolvedPrefix ? <span className={cn('pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 font-medium text-[var(--color-text-muted)]', size === 'sm' ? 'text-xs' : 'text-sm')}>{resolvedPrefix}</span> : null}
        <input
          {...props}
          ref={(node) => {
            inputRef.current = node;
            assignRef(forwardedRef, node);
          }}
          id={id}
          autoComplete={props.autoComplete ?? 'off'}
          type={inputType}
          inputMode={props.inputMode ?? (type === 'number' || format !== 'plain' ? 'numeric' : undefined)}
          value={displayValue}
          onChange={handleChange}
          disabled={disabled || loading}
          readOnly={readOnly}
          aria-invalid={Boolean(error) || undefined}
          aria-busy={loading || undefined}
          className={cn(
            'w-full min-w-0 rounded-lg border bg-[var(--color-surface)] text-[var(--color-text)] transition-colors duration-150 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 disabled:cursor-not-allowed disabled:bg-[var(--color-surface-muted)] disabled:opacity-50 read-only:bg-[var(--color-surface-muted)]',
            s.input,
            error ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20' : 'border-[var(--color-border)]',
            hasLeading && (size === 'sm' ? 'pl-8' : 'pl-10'),
            hasTrailing && (size === 'sm' ? 'pr-8' : 'pr-10'),
            className,
          )}
        />
        {resolvedSuffix ? <span className={cn('pointer-events-none absolute top-1/2 -translate-y-1/2 font-medium text-[var(--color-text-muted)]', size === 'sm' ? 'right-2.5 text-xs' : 'right-3 text-sm')}>{resolvedSuffix}</span> : null}
        {(showClear || type === 'password' || trailingIcon || loading) ? (
          <div className={cn('absolute top-1/2 flex -translate-y-1/2 items-center text-[var(--color-text-muted)]', size === 'sm' ? 'right-1.5 gap-0.5' : 'right-2 gap-1', resolvedSuffix && 'pointer-events-none opacity-0')}>
            {loading ? <span aria-label="Loading" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
            {!loading && showClear ? <button type="button" tabIndex={-1} aria-label="Clear input" onMouseDown={(event) => event.preventDefault()} onClick={handleClear} className={cn('rounded-md hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]', size === 'sm' ? 'p-0.5' : 'p-1')}><ClearIcon className={size === 'sm' ? 'size-3' : 'size-3.5'} /></button> : null}
            {!loading && type === 'password' ? <button type="button" tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'} onMouseDown={(event) => event.preventDefault()} onClick={() => setShowPassword((v) => !v)} className={cn('rounded-md hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]', size === 'sm' ? 'p-0.5' : 'p-1')}><EyeIcon closed={showPassword} className={size === 'sm' ? 'size-3' : 'size-3.5'} /></button> : null}
            {!loading && trailingIcon ? <span className="flex items-center">{trailingIcon}</span> : null}
          </div>
        ) : null}
      </div>
      {error ? <p className="text-xs text-[var(--color-danger)]">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-[var(--color-text-muted)]">{hint}</p> : null}
    </div>
  );
});

DInput.displayName = 'DInput';

export interface DecimalNormalizationOptions { scale?: number; integer?: boolean; }
export function normalizeDecimalInput(input: string, { scale = 4, integer = false }: DecimalNormalizationOptions = {}): string {
  const decimalIndex = Math.max(input.lastIndexOf('.'), input.lastIndexOf(','));
  const hasDecimal = !integer && decimalIndex >= 0;
  const rawWhole = (hasDecimal ? input.slice(0, decimalIndex) : input).replace(/\D/g, '');
  const rawFraction = hasDecimal ? input.slice(decimalIndex + 1).replace(/\D/g, '') : '';
  const whole = rawWhole.replace(/^0+(?=\d)/, '');
  if (!hasDecimal) return whole;
  return `${whole || '0'}.${rawFraction.slice(0, Math.max(0, scale))}`;
}

export interface DecimalInputProps extends Omit<InputProps, 'inputMode' | 'onChange' | 'onNativeChange' | 'type' | 'value' | 'defaultValue' | 'format'> {
  value: string;
  onValueChange: (value: string) => void;
  scale?: number;
  integer?: boolean;
}

export const DDecimalInput = forwardRef<HTMLInputElement, DecimalInputProps>(function DDecimalInput({ value, onValueChange, scale = 4, integer = false, ...props }, ref) {
  return <DInput ref={ref} {...props} value={value} type="text" inputMode={integer ? 'numeric' : 'decimal'} onNativeChange={(event) => onValueChange(normalizeDecimalInput(event.target.value, { scale, integer }))} />;
});

export interface CurrencyFormatOptions { groupSeparator?: string; decimalSeparator?: string; }
export function formatCurrencyInputValue(value: string, { groupSeparator = '.', decimalSeparator = ',' }: CurrencyFormatOptions = {}): string {
  if (!value) return '';
  const normalized = normalizeDecimalInput(value);
  const [whole = '', fraction] = normalized.split('.');
  const grouped = (whole || '0').replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
  return fraction === undefined ? grouped : `${grouped}${decimalSeparator}${fraction}`;
}

export function parseCurrencyInputValue(value: string, { groupSeparator = '.', decimalSeparator = ',' }: CurrencyFormatOptions = {}): string {
  const normalized = String(value).trim();
  if (!normalized) return '';
  const decimalIndex = normalized.lastIndexOf(decimalSeparator);
  const hasDecimal = decimalIndex >= 0;
  const wholeSource = hasDecimal ? normalized.slice(0, decimalIndex) : normalized;
  const fractionSource = hasDecimal ? normalized.slice(decimalIndex + decimalSeparator.length) : '';
  const whole = wholeSource.split(groupSeparator).join('').replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  const fraction = fractionSource.replace(/\D/g, '');
  if (!hasDecimal) return whole;
  return `${whole || '0'}.${fraction}`;
}

export interface CurrencyInputProps extends Omit<DecimalInputProps, 'integer' | 'onValueChange'> {
  onValueChange: (value: string) => void;
  currencySymbol?: ReactNode;
  groupSeparator?: string;
  decimalSeparator?: string;
}

export const DCurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(function DCurrencyInput(
  {
    value,
    onValueChange,
    currencySymbol = 'Rp',
    groupSeparator = '.',
    decimalSeparator = ',',
    ...props
  },
  forwardedRef,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCaretDigitsAfterRef = useRef<number | null>(null);
  const displayed = formatCurrencyInputValue(value, { groupSeparator, decimalSeparator });

  useLayoutEffect(() => {
    const pending = pendingCaretDigitsAfterRef.current;
    const input = inputRef.current;
    if (pending === null || !input || document.activeElement !== input) return;
    const nextCaret = caretFromDigitsAfter(input.value, pending);
    input.setSelectionRange(nextCaret, nextCaret);
    pendingCaretDigitsAfterRef.current = null;
  }, [displayed]);

  return (
    <DInput
      ref={(node) => {
        inputRef.current = node;
        assignRef(forwardedRef, node);
      }}
      {...props}
      value={displayed}
      type="text"
      inputMode="decimal"
      prefix={currencySymbol}
      onNativeChange={(event) => {
        pendingCaretDigitsAfterRef.current = countDigitsAfterCaret(event.target.value, event.target.selectionStart);
        onValueChange(parseCurrencyInputValue(event.target.value, { groupSeparator, decimalSeparator }));
      }}
    />
  );
});

export type { InputSize } from '../shared';