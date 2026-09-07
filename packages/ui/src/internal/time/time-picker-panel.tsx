import { useEffect, useRef } from 'react';

import { cn } from '../../cn';
import {
  formatTimeValue,
  getMinuteOptions,
  parseTimeValue,
  type TimeMinuteStep,
  type TimePrecision,
} from './time-utils';

interface TimePickerPanelProps {
  value: string;
  variant: TimePrecision;
  minuteStep: TimeMinuteStep;
  onChange: (value: string) => void;
  className?: string;
}

interface WheelColumnProps {
  label: string;
  valueLabel: (value: number) => string;
  options: readonly number[];
  selected: number;
  onSelect: (value: number) => void;
}

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const WHEEL_PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

function WheelColumn({ label, valueLabel, options, selected, onSelect }: WheelColumnProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const settleTimerRef = useRef<number | null>(null);
  const selectedIndex = Math.max(0, options.indexOf(selected));

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const top = selectedIndex * ITEM_HEIGHT;
    if (typeof node.scrollTo === 'function') node.scrollTo({ top, behavior: 'auto' });
    else node.scrollTop = top;
  }, [selectedIndex]);

  useEffect(() => () => {
    if (settleTimerRef.current !== null) window.clearTimeout(settleTimerRef.current);
  }, []);

  const settleSelection = () => {
    const node = scrollRef.current;
    if (!node) return;
    const index = Math.max(0, Math.min(options.length - 1, Math.round(node.scrollTop / ITEM_HEIGHT)));
    const next = options[index];
    if (next !== undefined && next !== selected) onSelect(next);
  };

  return (
    <div className="relative z-10 min-w-0 flex-1">
      <span className="sr-only">{label}</span>
      <div
        ref={scrollRef}
        role="group"
        aria-label={label}
        onScroll={() => {
          if (settleTimerRef.current !== null) window.clearTimeout(settleTimerRef.current);
          settleTimerRef.current = window.setTimeout(settleSelection, 90);
        }}
        className="h-[220px] snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingBlock: WHEEL_PADDING }}
      >
        {options.map((option, index) => {
          const active = option === selected;
          const distance = Math.abs(index - selectedIndex);
          return (
            <button
              key={option}
              type="button"
              aria-label={`${label} ${valueLabel(option)}`}
              aria-pressed={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onSelect(option)}
              className={cn(
                'flex h-11 w-full snap-center appearance-none items-center justify-center border-0 bg-transparent px-2 tabular-nums shadow-none outline-none transition-[color,opacity,font-size] duration-150 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus)]/25',
                active
                  ? 'text-xl font-semibold text-[var(--color-text)] opacity-100'
                  : distance === 1
                    ? 'text-lg font-medium text-[var(--color-text-muted)] opacity-65'
                    : distance === 2
                      ? 'text-base text-[var(--color-text-muted)] opacity-35'
                      : 'text-sm text-[var(--color-text-muted)] opacity-20',
              )}
            >
              {valueLabel(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TimePickerPanel({ value, variant, minuteStep, onChange, className }: TimePickerPanelProps) {
  const parsed = parseTimeValue(value) ?? { hour: 0, minute: 0 };
  const minuteOptions = getMinuteOptions(minuteStep, parsed.minute);

  const selectHour = (hour: number) => {
    onChange(formatTimeValue(hour, variant === 'hour' ? 0 : parsed.minute));
  };

  const selectMinute = (minute: number) => {
    onChange(formatTimeValue(parsed.hour, minute));
  };

  return (
    <div
      data-time-picker-wheel="true"
      className={cn(
        'relative mx-auto overflow-hidden rounded-[var(--radius-panel)] bg-[var(--color-surface)]',
        variant === 'hour-minute' ? 'w-full max-w-[244px]' : 'w-full max-w-[112px]',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-11 -translate-y-1/2 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface-muted)]/55" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-[var(--color-surface)] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-[var(--color-surface)] to-transparent" />

      <div className="relative z-10 flex items-center gap-2">
        <WheelColumn
          label="Jam"
          valueLabel={(hour) => String(hour).padStart(2, '0')}
          options={HOURS}
          selected={parsed.hour}
          onSelect={selectHour}
        />

        {variant === 'hour-minute' ? (
          <>
            <span aria-hidden="true" className="relative z-10 -mx-1 text-xl font-semibold text-[var(--color-text-muted)]">:</span>
            <WheelColumn
              label="Menit"
              valueLabel={(minute) => String(minute).padStart(2, '0')}
              options={minuteOptions}
              selected={parsed.minute}
              onSelect={selectMinute}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
