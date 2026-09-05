import { cn } from '../cn';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from '../internal/icons';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  siblingCount?: number;
  disabled?: boolean;
  className?: string;
}

export function getPaginationItems(page: number, total: number, sibling = 1): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: Math.max(total, 0) }, (_, i) => i + 1);
  const start = Math.max(2, page - sibling);
  const end = Math.min(total - 1, page + sibling);
  const items: (number | 'ellipsis')[] = [1];
  if (start > 2) items.push('ellipsis');
  for (let i = start; i <= end; i += 1) items.push(i);
  if (end < total - 1) items.push('ellipsis');
  items.push(total);
  return items;
}

const pageButtonBase = 'grid size-9 place-items-center rounded-[var(--radius-control)] text-sm font-medium outline-none transition-[background-color,color,border-color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/25 disabled:cursor-not-allowed disabled:opacity-40';

export function DPagination({
  page,
  totalPages,
  onChange,
  siblingCount = 1,
  disabled = false,
  className,
}: PaginationProps) {
  const go = (next: number) => {
    if (!disabled && next >= 1 && next <= totalPages && next !== page) onChange(next);
  };

  return (
    <nav data-ds-component="pagination" aria-label="Pagination" className={cn('flex items-center gap-1.5', className)}>
      <button
        type="button"
        aria-label="Previous page"
        disabled={disabled || page <= 1}
        onClick={() => go(page - 1)}
        className={cn(pageButtonBase, 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]')}
      >
        <ChevronLeftIcon size={16} />
      </button>

      {getPaginationItems(page, totalPages, siblingCount).map((item, index) => item === 'ellipsis'
        ? <span key={`e-${index}`} aria-hidden="true" className="grid size-9 place-items-center text-[var(--color-text-muted)]"><MoreHorizontalIcon size={16} /></span>
        : (
          <button
            type="button"
            key={item}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => go(item)}
            className={cn(
              pageButtonBase,
              item === page
                ? 'border border-[var(--color-brand)] bg-[var(--color-brand)] text-[var(--color-brand-foreground)] shadow-[var(--shadow-sm)]'
                : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]',
            )}
          >
            {item}
          </button>
        ))}

      <button
        type="button"
        aria-label="Next page"
        disabled={disabled || page >= totalPages}
        onClick={() => go(page + 1)}
        className={cn(pageButtonBase, 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]')}
      >
        <ChevronRightIcon size={16} />
      </button>
    </nav>
  );
}
