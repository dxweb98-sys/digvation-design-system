import { type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react'; import { cn } from '../cn';
export function Breadcrumb({className,...props}:HTMLAttributes<HTMLElement>){return <nav aria-label="Breadcrumb" className={className} {...props}/>;}
export function BreadcrumbList({className,...props}:HTMLAttributes<HTMLOListElement>){return <ol className={cn('flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-muted)]',className)} {...props}/>;}
export function BreadcrumbItem({className,...props}:HTMLAttributes<HTMLLIElement>){return <li className={cn('inline-flex items-center gap-2',className)} {...props}/>;}
export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement>{ active?:boolean; }
export function BreadcrumbLink({active=false,className,...props}:BreadcrumbLinkProps){return <a aria-current={active?'page':undefined} className={cn(active?'font-medium text-[var(--color-text)]':'transition-colors hover:text-[var(--color-text)]',className)} {...props}/>;}
export function BreadcrumbSeparator({children='/',className,...props}:HTMLAttributes<HTMLSpanElement>&{children?:ReactNode}){return <span aria-hidden="true" className={cn('text-[var(--color-border)]',className)} {...props}>{children}</span>;}
