import { type HTMLAttributes } from 'react'; import { cn } from '../cn';
export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> { size?: 'sm' | 'md' | 'lg'; label?: string; }
const sizes={ sm:'size-3.5 border-2', md:'size-5 border-2', lg:'size-8 border-[3px]' } as const;
export function Spinner({ size='md', label='Loading', className, ...props }: SpinnerProps) { return <span role="status" aria-label={label} className={cn('inline-block animate-spin rounded-full border-current border-t-transparent text-[var(--color-brand)]', sizes[size], className)} {...props}/>; }
