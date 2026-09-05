import { useEffect, useRef, type RefObject } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../cn';
import { CheckIcon, XIcon } from '../internal/icons';
import {
  useFloatingPosition,
  type FloatingScrollBehavior,
} from '../internal/floating/use-floating-position';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface NotificationPanelProps {
  notifications: readonly NotificationItem[];
  open: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDismiss: (id: string) => void;
  /** Element that the panel is positioned against. Strongly recommended. */
  anchorRef?: RefObject<HTMLElement | null>;
  title?: string;
  emptyMessage?: string;
  className?: string;
  offset?: number;
  scrollBehavior?: FloatingScrollBehavior;
}

const dotClass: Record<NotificationItem['type'], string> = {
  info: 'bg-[var(--color-info)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  error: 'bg-[var(--color-danger)]',
};

const iconButtonClass = 'grid size-8 appearance-none place-items-center rounded-lg border-0 bg-transparent p-0 text-[var(--color-text-muted)] outline-none transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/25';

export function DNotificationPanel({
  notifications,
  open,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onDismiss,
  anchorRef,
  title = 'Notifikasi',
  emptyMessage = 'Tidak ada notifikasi',
  className,
  offset = 8,
  scrollBehavior = 'reposition',
}: NotificationPanelProps) {
  const floatingRef = useRef<HTMLDivElement>(null);
  const emptyReference = useRef<HTMLElement | null>(null);
  const referenceRef = anchorRef ?? emptyReference;
  const hasAnchor = Boolean(anchorRef);
  const { style, positioned } = useFloatingPosition({
    open: open && hasAnchor,
    referenceRef,
    floatingRef,
    placement: 'bottom-end',
    matchWidth: false,
    minWidth: 320,
    offset,
    scrollBehavior,
    onRequestClose: onClose,
  });

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (floatingRef.current?.contains(target) || anchorRef?.current?.contains(target)) return;
      onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [anchorRef, onClose, open]);

  if (!open || typeof document === 'undefined') return null;
  const unread = notifications.filter((item) => !item.read).length;
  const fallbackStyle = { position: 'fixed' as const, top: 72, right: 24, zIndex: 9999, visibility: 'visible' as const };

  return createPortal(
    <div
      ref={floatingRef}
      role="dialog"
      aria-label={title}
      data-ds-component="notification-panel"
      data-ds-surface="floating"
      data-positioned={hasAnchor ? (positioned ? 'true' : 'false') : 'fallback'}
      data-scroll-behavior={scrollBehavior}
      style={hasAnchor ? style : fallbackStyle}
      className={cn(
        'w-[min(24rem,calc(100vw-16px))] overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]',
        hasAnchor && positioned && 'animate-[dropdown-in_150ms_ease-out]',
        className,
      )}
    >
      <div className="flex min-h-12 items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-semibold text-[var(--color-text)]">{title}</span>
          {unread > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-brand)] px-1.5 text-[10px] font-bold text-[var(--color-brand-foreground)]">
              {unread}
            </span>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {unread > 0 ? (
            <button type="button" aria-label="Mark all read" onClick={onMarkAllRead} className={iconButtonClass}>
              <CheckIcon size={15} />
            </button>
          ) : null}
          <button type="button" aria-label="Close notifications" onClick={onClose} className={iconButtonClass}>
            <XIcon size={15} />
          </button>
        </div>
      </div>

      <div className="max-h-[min(24rem,60vh)] overflow-y-auto p-1.5">
        {notifications.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-[var(--color-text-muted)]">{emptyMessage}</div>
        ) : notifications.map((item) => (
          <div
            key={item.id}
            className={cn(
              'group flex items-start gap-1 rounded-[var(--radius-menu-item)] px-1.5 py-1 transition-colors hover:bg-[var(--color-surface-muted)]/65',
              !item.read && 'bg-[var(--color-brand)]/5',
            )}
          >
            <button
              type="button"
              onClick={() => onMarkRead(item.id)}
              className="flex min-w-0 flex-1 appearance-none items-start gap-3 rounded-[var(--radius-menu-item)] border-0 bg-transparent px-2 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/25"
            >
              <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', !item.read ? dotClass[item.type] : 'bg-transparent')} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-[var(--color-text)]">{item.title}</span>
                <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-[var(--color-text-muted)]">{item.message}</span>
                <span className="mt-1 block text-[10px] text-[var(--color-text-muted)]/70">{item.createdAt}</span>
              </span>
            </button>
            <button
              type="button"
              aria-label={`Dismiss ${item.title}`}
              onClick={() => onDismiss(item.id)}
              className="mt-1 grid size-7 shrink-0 appearance-none place-items-center rounded-md border-0 bg-transparent p-0 text-[var(--color-text-muted)]/55 opacity-70 outline-none transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/25 group-hover:opacity-100"
            >
              <XIcon size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
}
