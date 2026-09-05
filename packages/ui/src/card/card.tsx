import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'interactive';
export interface CardProps extends HTMLAttributes<HTMLElement> { variant?: CardVariant; }

const variants: Record<CardVariant, string> = {
  default: 'border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]',
  outlined: 'border border-[var(--color-border)] bg-[var(--color-surface)]',
  elevated: 'border border-transparent bg-[var(--color-surface)] shadow-[var(--shadow-md)]',
  interactive: 'border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-[var(--color-brand)]/30 hover:shadow-[var(--shadow-md)]',
};

export function DCard({ className, variant = 'default', ...props }: CardProps) {
  return <section className={cn('rounded-[var(--radius-card)]', variants[variant], className)} {...props} />;
}
export function DCardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('border-b border-[var(--color-border)] px-4 py-3', className)} {...props} />; }
export function DCardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('p-4', className)} {...props} />; }
export function DCardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('border-t border-[var(--color-border)] px-4 py-3', className)} {...props} />; }
