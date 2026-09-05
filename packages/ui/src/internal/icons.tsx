import type { SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function baseProps(size: number, className?: string): SVGProps<SVGSVGElement> {
  return {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    width: size,
    height: size,
    className,
    'aria-hidden': true,
  };
}

export function ChevronDownIcon({ size = 16, className, ...props }: IconProps) {
  return <svg {...baseProps(size, className)} {...props}><path d="m6 9 6 6 6-6" /></svg>;
}
export function ChevronUpIcon({ size = 16, className, ...props }: IconProps) {
  return <svg {...baseProps(size, className)} {...props}><path d="m18 15-6-6-6 6" /></svg>;
}
export function ChevronLeftIcon({ size = 16, className, ...props }: IconProps) {
  return <svg {...baseProps(size, className)} {...props}><path d="m15 18-6-6 6-6" /></svg>;
}
export function ChevronRightIcon({ size = 16, className, ...props }: IconProps) {
  return <svg {...baseProps(size, className)} {...props}><path d="m9 18 6-6-6-6" /></svg>;
}
export function ChevronsUpDownIcon({ size = 16, className, ...props }: IconProps) {
  return <svg {...baseProps(size, className)} {...props}><path d="m7 15 5 5 5-5M7 9l5-5 5 5" /></svg>;
}
export function ArrowUpIcon({ size = 14, className, ...props }: IconProps) {
  return <svg {...baseProps(size, className)} {...props}><path d="m18 15-6-6-6 6" /><path d="M12 21V9" /></svg>;
}
export function ArrowDownIcon({ size = 14, className, ...props }: IconProps) {
  return <svg {...baseProps(size, className)} {...props}><path d="m6 9 6 6 6-6" /><path d="M12 3v12" /></svg>;
}
export function MoreHorizontalIcon({ size = 18, className, ...props }: IconProps) {
  return <svg {...baseProps(size, className)} {...props}><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></svg>;
}
export function XIcon({ size = 18, className, ...props }: IconProps) {
  return <svg {...baseProps(size, className)} {...props}><path d="M18 6 6 18M6 6l12 12" /></svg>;
}
export function CheckIcon({ size = 16, className, ...props }: IconProps) {
  return <svg {...baseProps(size, className)} {...props}><path d="m5 12 4 4L19 6" /></svg>;
}
