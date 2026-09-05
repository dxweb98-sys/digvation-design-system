import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export type AlertVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant;
  title?: ReactNode;
  icon?: ReactNode;
}
const alertClasses: Record<AlertVariant, string> = {
  neutral: 'border-[var(--color-border)] bg-[var(--color-surface-muted)]/60 text-[var(--color-text)]',
  info: 'border-[var(--color-info)]/25 bg-[var(--color-info)]/10 text-[var(--color-text)]',
  success: 'border-[var(--color-success)]/25 bg-[var(--color-success)]/10 text-[var(--color-text)]',
  warning: 'border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 text-[var(--color-text)]',
  danger: 'border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 text-[var(--color-text)]',
};
export function DAlert({ variant = 'info', title, icon, className, children, ...props }: AlertProps) {
  return <div role="alert" className={cn('flex gap-3 rounded-[var(--radius-control)] border p-3 text-sm', alertClasses[variant], className)} {...props}>{icon ? <span className="mt-0.5 shrink-0">{icon}</span> : null}<div className="min-w-0">{title ? <p className="font-semibold">{title}</p> : null}{children ? <div className={title ? 'mt-1 text-xs leading-5' : 'text-xs leading-5'}>{children}</div> : null}</div></div>;
}
