import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft' | 'info' | 'success' | 'warning' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-brand)] text-[var(--color-brand-foreground)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-brand-hover)] active:bg-[var(--color-brand-active)]',
  secondary: 'bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:bg-[var(--color-secondary-hover)] active:bg-[var(--color-secondary-active)]',
  outline: 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]',
  ghost: 'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]',
  soft: 'bg-[var(--color-brand)]/10 text-[var(--color-brand)] hover:bg-[var(--color-brand)]/15 active:bg-[var(--color-brand)]/20',
  info: 'bg-[var(--color-info)] text-white shadow-[var(--shadow-sm)] hover:brightness-95 active:brightness-90',
  success: 'bg-[var(--color-success)] text-white shadow-[var(--shadow-sm)] hover:brightness-95 active:brightness-90',
  warning: 'bg-[var(--color-warning)] text-white shadow-[var(--shadow-sm)] hover:brightness-95 active:brightness-90',
  danger: 'bg-[var(--color-danger)] text-white shadow-[var(--shadow-sm)] hover:brightness-95 active:brightness-90',
  link: 'h-auto bg-transparent px-0 text-[var(--color-brand)] underline-offset-4 hover:underline active:opacity-80',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-xs',
  md: 'h-10 gap-2 px-4 text-sm',
  lg: 'h-12 gap-2 px-6 text-base',
  icon: 'size-10 p-0',
};

export const DButton = forwardRef<HTMLButtonElement, ButtonProps>(function DButton(
  { className, variant = 'primary', size = 'md', loading = false, leftIcon, rightIcon, fullWidth = false, disabled, type = 'button', children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center rounded-[var(--radius-control)] font-medium transition-[background-color,color,border-color,box-shadow,transform,opacity] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] active:scale-[0.98] motion-reduce:transform-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        variant !== 'link' && sizeClasses[size],
        variant === 'link' && size === 'sm' && 'text-xs',
        variant === 'link' && size === 'md' && 'text-sm',
        variant === 'link' && size === 'lg' && 'text-base',
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" /> : leftIcon}
      {children ? <span>{children}</span> : null}
      {!loading ? rightIcon : null}
    </button>
  );
});
