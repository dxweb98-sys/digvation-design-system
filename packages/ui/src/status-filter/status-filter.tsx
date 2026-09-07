import type { ReactNode } from 'react';
import { cn } from '../cn';
import { useDLocalization } from '../localization';

export interface StatusOption {
  label: ReactNode;
  value: string;
  count?: number;
}

export interface StatusFilterProps {
  label?: ReactNode;
  options: readonly StatusOption[];
  value: string;
  onChange: (value: string) => void;
  allLabel?: ReactNode;
}

export function DStatusFilter({ label, options, value, onChange, allLabel }: StatusFilterProps) {
  const { t } = useDLocalization();
  const resolvedAllLabel = allLabel ?? t('statusFilter.all');
  const button = (active: boolean) => cn(
    'rounded-[var(--radius-control)] px-3 py-1.5 text-xs font-medium transition-all duration-150',
    active
      ? 'bg-[var(--color-brand)] text-[var(--color-brand-foreground)] shadow-[var(--shadow-sm)]'
      : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]',
  );

  return (
    <div data-ds-component="status-filter" className="flex flex-wrap items-center gap-3">
      {label ? <span className="text-xs font-medium text-[var(--color-text-muted)]">{label}</span> : null}
      <div className="flex flex-wrap items-center gap-1.5">
        <button type="button" onClick={() => onChange('')} className={button(!value)}>{resolvedAllLabel}</button>
        {options.map((option) => (
          <button type="button" key={option.value} onClick={() => onChange(option.value)} className={button(value === option.value)}>
            {option.label}
            {option.count !== undefined ? <span className="ml-1 opacity-70">({option.count})</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
