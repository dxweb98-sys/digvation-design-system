import { type HTMLAttributes } from 'react'; import { cn } from '../cn';
export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> { orientation?: 'horizontal' | 'vertical'; decorative?: boolean; }
export function Separator({ orientation='horizontal', decorative=true, className, ...props }: SeparatorProps) { return <div role={decorative ? 'none' : 'separator'} aria-orientation={decorative ? undefined : orientation} className={cn('shrink-0 bg-[var(--color-border)]', orientation === 'horizontal' ? 'h-px w-full' : 'h-full min-h-4 w-px', className)} {...props}/>; }
