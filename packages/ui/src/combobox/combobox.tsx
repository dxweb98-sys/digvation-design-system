import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { cn } from '../cn';
import { DDropdown, type FloatingScrollBehavior } from '../dropdown';
import { INPUT_SIZE_STYLES, type InputSize } from '../shared';
import type { SelectOption } from '../select';

function SearchIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>;
}
function ClearIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5"><path d="m18 6-12 12M6 6l12 12" /></svg>;
}
function sameValue(left: string | number | null | undefined, right: string | number | null | undefined) {
  return String(left ?? '') === String(right ?? '');
}

export type ComboboxOption = SelectOption;

export interface ComboboxProps {
  label?: ReactNode;
  placeholder?: string;
  options?: readonly SelectOption[];
  value?: string | number | null;
  size?: InputSize;
  onChange?: (value: string | number | null) => void;
  fetchOptions?: (search: string) => Promise<readonly SelectOption[]>;
  /** Change this key (for example when countryId changes) to request fresh async options. */
  refetchKey?: string | number | boolean | null;
  onFetchError?: (error: unknown) => void;
  asyncErrorMessage?: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
  clearable?: boolean;
  containerClassName?: string;
  renderEmpty?: (inputValue: string) => ReactNode;
  allowCreate?: boolean;
  onCreateOption?: (value: string) => void;
  renderCreateOption?: (inputValue: string, onClick: () => void) => ReactNode;
  renderOption?: (option: SelectOption, isSelected: boolean) => ReactNode;
  onSearchChange?: (query: string) => void;
  loading?: boolean;
  idleMessage?: ReactNode;
  ariaLabel?: string;
  debounceMs?: number;
  scrollBehavior?: FloatingScrollBehavior;
}

export function DCombobox({
  label,
  placeholder = 'Ketik untuk mencari...',
  options = [],
  value,
  size = 'md',
  onChange,
  fetchOptions,
  refetchKey,
  onFetchError,
  asyncErrorMessage = 'Gagal memuat pilihan',
  error,
  hint,
  disabled = false,
  clearable = true,
  containerClassName,
  allowCreate = false,
  onCreateOption,
  renderEmpty,
  renderCreateOption,
  renderOption,
  onSearchChange,
  loading = false,
  idleMessage,
  ariaLabel,
  debounceMs = 300,
  scrollBehavior = 'reposition',
}: ComboboxProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRequestIdRef = useRef(0);
  const resolveRequestIdRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [asyncOptions, setAsyncOptions] = useState<readonly SelectOption[]>([]);
  const [isFetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<unknown>(null);
  const [resolvedSelection, setResolvedSelection] = useState<SelectOption | null>(null);
  const s = INPUT_SIZE_STYLES[size];
  const isAsync = Boolean(fetchOptions);

  useEffect(() => {
    if (!fetchOptions || !open) return;
    const requestId = ++searchRequestIdRef.current;
    const timeout = window.setTimeout(() => {
      setFetching(true);
      setFetchError(null);
      void fetchOptions(inputValue)
        .then((result) => {
          if (requestId === searchRequestIdRef.current) setAsyncOptions(result);
        })
        .catch((nextError: unknown) => {
          if (requestId !== searchRequestIdRef.current) return;
          setFetchError(nextError);
          onFetchError?.(nextError);
        })
        .finally(() => {
          if (requestId === searchRequestIdRef.current) setFetching(false);
        });
    }, debounceMs);
    return () => window.clearTimeout(timeout);
  }, [debounceMs, fetchOptions, inputValue, onFetchError, open, refetchKey]);

  useEffect(() => {
    if (!fetchOptions || value == null || value === '' || sameValue(resolvedSelection?.value, value)) return;
    const requestId = ++resolveRequestIdRef.current;
    void fetchOptions('')
      .then((result) => {
        if (requestId !== resolveRequestIdRef.current) return;
        const found = result.find((option) => sameValue(option.value, value));
        setResolvedSelection(found ?? null);
      })
      .catch((nextError: unknown) => onFetchError?.(nextError));
  }, [fetchOptions, onFetchError, refetchKey, resolvedSelection?.value, value]);

  const selectedOption = options.find((option) => sameValue(option.value, value)) ?? (sameValue(resolvedSelection?.value, value) ? resolvedSelection : null);
  const source = isAsync ? asyncOptions : options;
  const filtered = useMemo(
    () => isAsync ? source : source.filter((option) => String(option.label).toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())),
    [inputValue, isAsync, source],
  );

  const choose = (option: SelectOption) => {
    if (option.disabled) return;
    setResolvedSelection(option);
    onChange?.(option.value);
    setOpen(false);
    setInputValue('');
  };

  const clear = () => {
    onChange?.(null);
    setResolvedSelection(null);
    setInputValue('');
    setOpen(false);
  };

  const create = () => {
    const next = inputValue.trim();
    if (!next) return;
    onCreateOption?.(next);
    onChange?.(next);
    setResolvedSelection({ label: next, value: next });
    setOpen(false);
    setInputValue('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
      setInputValue('');
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => {
        const count = filtered.length || 1;
        return event.key === 'ArrowDown' ? (current + 1) % count : (current - 1 + count) % count;
      });
      return;
    }
    if (event.key === 'Home' && open) {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (event.key === 'End' && open) {
      event.preventDefault();
      setActiveIndex(Math.max(0, filtered.length - 1));
      return;
    }
    if (event.key === 'Enter' && open) {
      const active = filtered[activeIndex];
      if (active && !active.disabled) {
        event.preventDefault();
        choose(active);
      } else if (allowCreate && inputValue.trim()) {
        event.preventDefault();
        create();
      }
    }
  };

  const showIdle = Boolean(idleMessage && !inputValue && !isAsync);

  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', containerClassName)}>
      {label ? <label htmlFor={id} className={cn(s.label, 'w-fit font-medium text-[var(--color-text)]')}>{label}</label> : null}
      <DDropdown
        matchWidth
        open={open}
        onOpenChange={setOpen}
        contentRole="listbox"
        contentClassName="max-h-60 overflow-y-auto p-1"
        scrollBehavior={scrollBehavior}
        onClose={() => { setOpen(false); setInputValue(''); }}
        trigger={() => (
          <div className="relative">
            <SearchIcon className={cn('pointer-events-none absolute top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]', s.iconLeft)} />
            <input
              ref={inputRef}
              id={id}
              aria-label={ariaLabel}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls={`${id}-listbox`}
              aria-activedescendant={open && filtered[activeIndex] ? `${id}-option-${activeIndex}` : undefined}
              autoComplete="off"
              type="text"
              disabled={disabled}
              value={open ? inputValue : String(selectedOption?.label ?? '')}
              placeholder={selectedOption ? String(selectedOption.label) : placeholder}
              onClick={(event) => event.stopPropagation()}
              onFocus={() => { setOpen(true); setActiveIndex(0); }}
              onChange={(event) => {
                const next = event.target.value;
                setInputValue(next);
                onSearchChange?.(next);
                setOpen(true);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              className={cn(
                'w-full rounded-lg border bg-[var(--color-surface)] text-[var(--color-text)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 disabled:cursor-not-allowed disabled:bg-[var(--color-surface-muted)] disabled:opacity-50',
                s.input,
                'pl-10 pr-10',
                error ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20' : 'border-[var(--color-border)]',
              )}
            />
            {clearable && selectedOption && !disabled ? <button type="button" tabIndex={-1} aria-label="Clear selection" onMouseDown={(event) => event.preventDefault()} onClick={(event) => { event.preventDefault(); event.stopPropagation(); clear(); }} className={cn('absolute top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]', s.clear)}><ClearIcon /></button> : null}
          </div>
        )}
      >
        <div id={`${id}-listbox`}>
          {loading || isFetching ? <div className="px-3 py-6 text-center text-sm text-[var(--color-text-muted)]">Mencari...</div> : fetchError ? <div className="px-3 py-6 text-center text-sm text-[var(--color-danger)]">{asyncErrorMessage}</div> : showIdle ? <div className="px-3 py-6 text-center text-sm text-[var(--color-text-muted)]">{idleMessage}</div> : filtered.length === 0 ? (
            renderEmpty ? renderEmpty(inputValue) : allowCreate && inputValue.trim() ? (
              renderCreateOption ? renderCreateOption(inputValue, create) : <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={(event) => { event.stopPropagation(); create(); }} className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-[var(--color-brand)] hover:bg-[var(--color-surface-muted)]">Gunakan “{inputValue.trim()}”</button>
            ) : <div className="px-3 py-6 text-center text-sm text-[var(--color-text-muted)]">Tidak ditemukan</div>
          ) : filtered.map((option, index) => {
            const isSelected = sameValue(option.value, value);
            return <button id={`${id}-option-${index}`} key={String(option.value)} type="button" role="option" aria-selected={isSelected} disabled={option.disabled} onMouseDown={(event) => event.preventDefault()} onClick={(event) => { event.stopPropagation(); choose(option); }} className={cn('w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--color-surface-muted)] disabled:cursor-not-allowed disabled:opacity-50', isSelected && 'bg-[var(--color-brand)]/10 font-medium text-[var(--color-brand)]', index === activeIndex && !isSelected && 'bg-[var(--color-surface-muted)]')}>{renderOption ? renderOption(option, isSelected) : option.label}</button>;
          })}
        </div>
      </DDropdown>
      {error ? <p className="text-xs text-[var(--color-danger)]">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-[var(--color-text-muted)]">{hint}</p> : null}
    </div>
  );
}
