import type { HTMLAttributes } from 'react';
import { cn } from '../cn';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger' | 'outline';
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
  dotClassName?: string;
}
const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]',
  primary: 'bg-[var(--color-brand)]/10 text-[var(--color-brand)]',
  secondary: 'bg-[var(--color-text)]/7 text-[var(--color-text)]',
  info: 'bg-[var(--color-info)]/10 text-[var(--color-info)]',
  success: 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]',
  outline: 'border border-[var(--color-border)] bg-transparent text-[var(--color-text)]',
};
export function DBadge({ className, variant = 'default', dot = false, dotClassName, children, ...props }: BadgeProps) {
  return <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', variantClasses[variant], className)} {...props}>{dot ? <span className={cn('size-1.5 rounded-full bg-current', dotClassName)} aria-hidden="true" /> : null}{children}</span>;
}
