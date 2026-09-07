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

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

function selectedClass(selected: boolean) {
  return selected
    ? 'bg-[var(--color-brand)] font-semibold text-[var(--color-brand-foreground)]'
    : 'text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]';
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
    <div className={cn('grid gap-3', variant === 'hour-minute' ? 'grid-cols-2' : 'grid-cols-1', className)}>
      <div className="min-w-0">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[var(--color-text)]">Jam</span>
          <span className="text-[11px] tabular-nums text-[var(--color-text-muted)]">{String(parsed.hour).padStart(2, '0')}</span>
        </div>
        <div role="group" aria-label="Jam" className={cn('grid max-h-40 gap-1 overflow-y-auto pr-1', variant === 'hour-minute' ? 'grid-cols-3' : 'grid-cols-6')}>
          {HOURS.map((hour) => {
            const selected = parsed.hour === hour;
            return (
              <button
                key={hour}
                type="button"
                aria-label={`Jam ${String(hour).padStart(2, '0')}`}
                aria-pressed={selected}
                onClick={() => selectHour(hour)}
                className={cn(
                  'h-8 appearance-none rounded-[var(--radius-menu-item)] border-0 bg-transparent px-1 text-xs tabular-nums shadow-none transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20',
                  selectedClass(selected),
                )}
              >
                {String(hour).padStart(2, '0')}
              </button>
            );
          })}
        </div>
      </div>

      {variant === 'hour-minute' ? (
        <div className="min-w-0">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[var(--color-text)]">Menit</span>
            <span className="text-[11px] tabular-nums text-[var(--color-text-muted)]">{String(parsed.minute).padStart(2, '0')}</span>
          </div>
          <div role="group" aria-label="Menit" className="grid max-h-40 grid-cols-3 gap-1 overflow-y-auto pr-1">
            {minuteOptions.map((minute) => {
              const selected = parsed.minute === minute;
              return (
                <button
                  key={minute}
                  type="button"
                  aria-label={`Menit ${String(minute).padStart(2, '0')}`}
                  aria-pressed={selected}
                  onClick={() => selectMinute(minute)}
                  className={cn(
                    'h-8 appearance-none rounded-[var(--radius-menu-item)] border-0 bg-transparent px-1 text-xs tabular-nums shadow-none transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20',
                    selectedClass(selected),
                  )}
                >
                  {String(minute).padStart(2, '0')}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
