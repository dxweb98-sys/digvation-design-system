import { DDatePicker } from '../date-picker';
import { useDLocalization } from '../localization';

export interface DateRangeFilterProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onClear?: () => void;
}

export function DDateRangeFilter({ from, to, onFromChange, onToChange, onClear }: DateRangeFilterProps) {
  const { t } = useDLocalization();
  return (
    <div data-ds-component="date-range-filter" className="flex flex-wrap items-center gap-3">
      <span className="hidden text-xs font-medium text-[var(--color-text-muted)] sm:inline">{t('dateRangeFilter.period')}</span>
      <DDatePicker value={from} onChange={onFromChange} containerClassName="w-[160px]" placeholder={t('dateRangeFilter.from')} />
      <span className="text-sm text-[var(--color-text-muted)]">—</span>
      <DDatePicker value={to} onChange={onToChange} minDate={from || undefined} containerClassName="w-[160px]" placeholder={t('dateRangeFilter.to')} />
      {onClear && (from || to) ? (
        <button
          type="button"
          onClick={onClear}
          className="h-9 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-danger)]/5 hover:text-[var(--color-danger)]"
        >
          {t('dateRangeFilter.reset')}
        </button>
      ) : null}
    </div>
  );
}
