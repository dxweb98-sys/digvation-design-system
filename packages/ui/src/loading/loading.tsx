import type { ReactNode } from 'react';
import { cn } from '../cn';
import { useDLocalization } from '../localization';

export function DLoadingIndicator({ label, className }: { label?: ReactNode; className?: string }) {
  const { t } = useDLocalization();
  return <div role="status" className={cn('inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)]', className)}><span className="size-4 animate-spin rounded-full border-2 border-[var(--color-brand)] border-t-transparent" />{label ?? t('loading.default')}</div>;
}
export function DLoadingOverlay({ label }: { label?: ReactNode }) { return <div className="fixed inset-0 z-[90] grid place-items-center bg-[var(--color-background)]/75 backdrop-blur-sm"><DLoadingIndicator label={label} /></div>; }
