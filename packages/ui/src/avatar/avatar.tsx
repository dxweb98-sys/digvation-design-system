import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  fallback?: ReactNode;
  size?: AvatarSize;
  status?: 'online' | 'offline' | 'busy' | 'away';
}
const sizeClass: Record<AvatarSize, string> = { xs: 'size-6 text-[9px]', sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-12 text-base', xl: 'size-16 text-lg' };
const dotSize: Record<AvatarSize, string> = { xs: 'size-1.5', sm: 'size-2', md: 'size-2.5', lg: 'size-3', xl: 'size-3.5' };
const statusClass = { online: 'bg-[var(--color-success)]', offline: 'bg-[var(--color-text-muted)]', busy: 'bg-[var(--color-danger)]', away: 'bg-[var(--color-warning)]' } as const;
function initials(name?: string) { return name?.trim().split(/\s+/).slice(0,2).map((part) => part[0]?.toUpperCase()).join('') || '?'; }
export function Avatar({ src, alt, name, fallback, size = 'md', status, className, ...props }: AvatarProps) {
  return <div className={cn('relative inline-flex shrink-0', className)} {...props}><div className={cn('grid place-items-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] font-semibold text-[var(--color-text-muted)]', sizeClass[size])}>{src ? <img src={src} alt={alt ?? name ?? ''} className="size-full object-cover" /> : fallback ?? initials(name)}</div>{status ? <span aria-label={status} className={cn('absolute bottom-0 right-0 rounded-full ring-2 ring-[var(--color-surface)]', dotSize[size], statusClass[status])} /> : null}</div>;
}
