import { createContext, useContext, useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

type TabsContextValue = { value: string; setValue: (value: string) => void; baseId: string };
const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('DTabs components must be inside <DTabs>.');
  return ctx;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

export function DTabs({ value, defaultValue, onValueChange, children, className, ...props }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const baseId = useId();
  const setValue = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <TabsContext.Provider value={{ value: current, setValue, baseId }}>
      <div data-ds-component="tabs" className={className} {...props}>{children}</div>
    </TabsContext.Provider>
  );
}

export function DTabsList({ className, onKeyDown, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1 rounded-[var(--radius-control)] bg-[var(--color-surface-muted)] p-1',
        className,
      )}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        const tabs = Array.from(event.currentTarget.querySelectorAll('[role=tab]:not(:disabled)')) as HTMLButtonElement[];
        if (!tabs.length) return;
        const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
        const next = event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? tabs.length - 1
            : event.key === 'ArrowRight'
              ? (index + 1 + tabs.length) % tabs.length
              : (index - 1 + tabs.length) % tabs.length;
        event.preventDefault();
        tabs[next]?.focus();
        tabs[next]?.click();
      }}
      {...props}
    />
  );
}

export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
}

export function DTabsTrigger({ value, disabled, className, children, ...props }: TabsTriggerProps) {
  const ctx = useTabs();
  const active = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${value}`}
      aria-selected={active}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      disabled={disabled}
      onClick={() => ctx.setValue(value)}
      className={cn(
        'min-h-8 rounded-[max(6px,calc(var(--radius-control)-2px))] px-3 py-1.5 text-sm font-medium transition-[background-color,color,box-shadow] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/25 disabled:cursor-not-allowed disabled:opacity-40',
        active
          ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-[var(--shadow-sm)]'
          : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]/60 hover:text-[var(--color-text)]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function DTabsContent({ value, className, ...props }: TabsContentProps) {
  const ctx = useTabs();
  if (ctx.value !== value) return null;
  return <div role="tabpanel" id={`${ctx.baseId}-panel-${value}`} aria-labelledby={`${ctx.baseId}-tab-${value}`} className={className} {...props} />;
}
