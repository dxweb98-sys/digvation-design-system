import { createContext, useContext, useId, useState, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../cn';
import { ChevronDownIcon } from '../internal/icons';

type AccordionContextValue = {
  open: string[];
  toggle: (value: string) => void;
  baseId: string;
  variant: AccordionVariant;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('DAccordionItem must be inside <DAccordion>.');
  return context;
}

/**
 * default   = borderless disclosure list
 * separator = borderless list with horizontal separators between items
 * card      = one bordered surface with separators inside
 * separated = each item is its own bordered surface
 */
export type AccordionVariant = 'default' | 'separator' | 'card' | 'separated';

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  variant?: AccordionVariant;
}

export function DAccordion({
  type = 'single',
  value,
  defaultValue = [],
  onValueChange,
  variant = 'default',
  className,
  ...props
}: AccordionProps) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const baseId = useId();

  const toggle = (itemValue: string) => {
    const next = current.includes(itemValue)
      ? current.filter((item) => item !== itemValue)
      : type === 'multiple'
        ? [...current, itemValue]
        : [itemValue];
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <AccordionContext.Provider value={{ open: current, toggle, baseId, variant }}>
      <div
        data-ds-component="accordion"
        data-accordion-variant={variant}
        className={cn(
          variant === 'card' && 'overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)]',
          variant === 'separated' && 'space-y-2',
          className,
        )}
        {...props}
      />
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  value: string;
  title: ReactNode;
  disabled?: boolean;
}

export function DAccordionItem({ value, title, disabled, className, children, ...props }: AccordionItemProps) {
  const context = useAccordion();
  const open = context.open.includes(value);
  const id = `${context.baseId}-${value.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
  const triggerId = `${id}-trigger`;
  const contentId = `${id}-content`;

  return (
    <div
      className={cn(
        context.variant === 'separator' && 'border-b border-[var(--color-border)] last:border-b-0',
        context.variant === 'card' && 'border-b border-[var(--color-border)] px-4 last:border-b-0',
        context.variant === 'separated' && 'overflow-hidden rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4',
        (context.variant === 'default' || context.variant === 'separator') && 'px-0',
        className,
      )}
      {...props}
    >
      <button
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => context.toggle(value)}
        className="group flex w-full appearance-none items-center justify-between gap-4 border-0 bg-transparent py-3 text-left text-sm font-medium text-[var(--color-text)] outline-none transition-colors duration-150 hover:text-[var(--color-brand)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/25 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span>{title}</span>
        <ChevronDownIcon
          size={17}
          className={cn('shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 ease-out group-hover:text-current', open && 'rotate-180')}
        />
      </button>
      <div
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!open}
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-4 text-sm leading-relaxed text-[var(--color-text-muted)]">{children}</div>
        </div>
      </div>
    </div>
  );
}
