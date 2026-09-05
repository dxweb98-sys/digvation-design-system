import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../cn';
import {
  useFloatingPosition,
  type FloatingPlacement,
  type FloatingScrollBehavior,
} from '../internal/floating/use-floating-position';
import { DropdownContext } from './dropdown-context';

export interface DropdownProps {
  trigger: (context: { open: boolean }) => ReactNode;
  children: ReactNode;
  placement?: FloatingPlacement;
  matchWidth?: boolean;
  onClose?: () => void;
  closeOnItemClick?: boolean;
  closeOnEsc?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentRole?: 'listbox' | 'menu' | 'dialog';
  className?: string;
  contentClassName?: string;
  /** Disable the generic vertical panel padding when a component owns its inner spacing. */
  contentPadding?: boolean;
  offset?: number;
  minWidth?: number;
  viewportPadding?: number;
  /** Behavior when the page or a scroll ancestor moves while the panel is open. */
  scrollBehavior?: FloatingScrollBehavior;
}

export function DDropdown({
  trigger,
  children,
  placement = 'bottom-start',
  matchWidth = false,
  onClose,
  closeOnItemClick = false,
  closeOnEsc = true,
  open: controlledOpen,
  onOpenChange,
  contentRole = 'menu',
  className,
  contentClassName,
  contentPadding = true,
  offset = 6,
  minWidth = 140,
  viewportPadding = 8,
  scrollBehavior = 'reposition',
}: DropdownProps) {
  const referenceRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean | ((current: boolean) => boolean)) => {
      const resolved = typeof next === 'function' ? next(open) : next;
      if (controlledOpen === undefined) setUncontrolledOpen(resolved);
      onOpenChange?.(resolved);
    },
    [controlledOpen, onOpenChange, open],
  );

  const close = useCallback(() => {
    if (!open) return;
    setOpen(false);
    onClose?.();
  }, [onClose, open, setOpen]);

  const { style, positioned } = useFloatingPosition({
    open,
    referenceRef,
    floatingRef,
    placement,
    matchWidth,
    offset,
    minWidth,
    viewportPadding,
    scrollBehavior,
    onRequestClose: close,
  });

  useEffect(() => {
    if (!open) return;
    const outside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!referenceRef.current?.contains(target) && !floatingRef.current?.contains(target)) close();
    };
    const escape = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape') close();
    };
    document.addEventListener('mousedown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [close, closeOnEsc, open]);

  const context = useMemo(() => ({ close, open }), [close, open]);

  return (
    <DropdownContext.Provider value={context}>
      <div
        ref={referenceRef}
        className={cn('inline-block', matchWidth && 'w-full', className)}
        onClick={(event) => {
          if (event.defaultPrevented) return;
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        onKeyDown={(event) => {
          if (event.defaultPrevented) return;
          if (event.key === 'Enter' || event.key === ' ') {
            const target = event.target as HTMLElement;
            if (target.tagName === 'BUTTON' || target.tagName === 'INPUT') return;
            event.preventDefault();
            event.stopPropagation();
            setOpen((value) => !value);
          }
        }}
      >
        {trigger({ open })}
      </div>
      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={floatingRef}
              role={contentRole}
              tabIndex={-1}
              style={style}
              data-positioned={positioned ? 'true' : 'false'}
              data-scroll-behavior={scrollBehavior}
              onClick={(event) => {
                if (!closeOnItemClick) return;
                const target = event.target as HTMLElement;
                if (target.closest("button, [role='option'], [role='menuitem'], a")) close();
              }}
              className={cn(
                'z-[9999] min-w-[140px] overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]',
                contentPadding && 'py-1',
                positioned && 'animate-[dropdown-in_150ms_ease-out]',
                contentClassName,
              )}
            >
              {children}
            </div>,
            document.body,
          )
        : null}
    </DropdownContext.Provider>
  );
}

export type { FloatingPlacement, FloatingScrollBehavior } from '../internal/floating/use-floating-position';
