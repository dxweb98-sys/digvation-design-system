import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../cn';
import { XIcon } from '../internal/icons';
import { lockDocumentScroll } from '../internal/scroll-lock';
import { useDLocalization } from '../localization';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

interface DialogRootProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  className?: string;
  overlayClassName?: string;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true',
  );
}

function DialogRoot({
  open,
  onClose,
  children,
  ariaLabel,
  ariaLabelledBy,
  className,
  overlayClassName,
  closeOnOverlay = false,
  closeOnEscape = false,
}: DialogRootProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const timer = window.setTimeout(() => setMounted(false), 220);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    return lockDocumentScroll();
  }, [mounted]);

  useLayoutEffect(() => {
    if (!open || !mounted) return;
    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== dialogRef.current) {
      previousActiveRef.current = active;
    }
    dialogRef.current?.focus({ preventScroll: true });
  }, [mounted, open]);

  useEffect(() => () => {
    previousActiveRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (open || !mounted) return;
    previousActiveRef.current?.focus({ preventScroll: true });
    previousActiveRef.current = null;
  }, [mounted, open]);

  useEffect(() => {
    if (!open || !mounted) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus({ preventScroll: true });
        return;
      }
      const index = focusable.indexOf(document.activeElement as HTMLElement);
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        focusable[focusable.length - 1]?.focus();
      } else if (!event.shiftKey && index === focusable.length - 1) {
        event.preventDefault();
        focusable[0]?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeOnEscape, mounted, onClose, open]);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-[1px] transition-opacity duration-200 motion-reduce:transition-none sm:items-center sm:p-4',
        open ? 'opacity-100' : 'pointer-events-none opacity-0',
        overlayClassName,
      )}
      onMouseDown={(event) => {
        if (closeOnOverlay && event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-ds-component="dialog"
        data-ds-surface="modal"
        tabIndex={-1}
        className={className}
      >
        {children}
      </section>
    </div>,
    document.body,
  );
}

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: DialogSize;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  showClose?: boolean;
  noPadding?: boolean;
  className?: string;
  overlayClassName?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

const sizeClasses: Record<DialogSize, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  full: 'sm:max-w-[95vw]',
};

export function DDialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  closeOnEscape = true,
  showClose = true,
  noPadding = false,
  className,
  overlayClassName,
  ariaLabel,
  ariaLabelledBy,
}: DialogProps) {
  const { t } = useDLocalization();
  return (
    <DialogRoot
      open={open}
      onClose={onClose}
      closeOnOverlay={closeOnOverlay}
      closeOnEscape={closeOnEscape}
      ariaLabelledBy={ariaLabelledBy}
      ariaLabel={ariaLabel ?? (typeof title === 'string' ? title : 'DDialog')}
      overlayClassName={overlayClassName}
      className={cn(
        'flex max-h-[90vh] w-full flex-col rounded-t-2xl bg-[var(--color-surface)] shadow-[var(--shadow-lg)] transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none sm:max-h-[85vh] sm:rounded-[var(--radius-panel)]',
        open ? 'translate-y-0 opacity-100 sm:scale-100' : 'translate-y-6 opacity-0 sm:translate-y-0 sm:scale-[0.98]',
        sizeClasses[size],
        className,
      )}
    >
      <div className="flex justify-center pb-1 pt-3 sm:hidden"><div className="h-1 w-10 rounded-full bg-[var(--color-border)]" /></div>
      {(title || description || showClose) ? (
        <div className="flex min-h-16 items-start justify-between gap-4 border-b border-[var(--color-border)] px-5 py-3 sm:px-5 sm:py-3">
          <div className="min-w-0 flex-1 self-center">
            {title ? <h3 className="m-0 text-base font-semibold leading-6 text-[var(--color-text)]">{title}</h3> : null}
            {description ? <p className="mb-0 mt-1 text-xs leading-5 text-[var(--color-text-muted)]">{description}</p> : null}
          </div>
          {showClose ? (
            <button
              type="button"
              aria-label={t('dialog.close')}
              onClick={onClose}
              className="grid size-8 shrink-0 appearance-none place-items-center rounded-lg border-0 bg-transparent p-0 text-[var(--color-text-muted)] outline-none shadow-none transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/25"
            >
              <XIcon size={16} />
            </button>
          ) : null}
        </div>
      ) : null}
      <div className={cn('flex-1 overflow-y-auto', !noPadding && 'px-5 py-4 sm:px-5')}>{children}</div>
      {footer ? <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]/30 px-5 py-3 sm:rounded-b-[var(--radius-panel)]">{footer}</div> : null}
    </DialogRoot>
  );
}
