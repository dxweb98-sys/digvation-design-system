import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';

import { lockDocumentScroll } from '../scroll-lock';

export type FloatingPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
export type FloatingScrollBehavior = 'reposition' | 'close' | 'lock';

interface FloatingPositionOptions {
  open: boolean;
  referenceRef: RefObject<HTMLElement | null>;
  floatingRef: RefObject<HTMLElement | null>;
  placement?: FloatingPlacement;
  matchWidth?: boolean;
  offset?: number;
  minWidth?: number;
  viewportPadding?: number;
  scrollBehavior?: FloatingScrollBehavior;
  onRequestClose?: () => void;
}

interface FloatingPositionResult {
  style: CSSProperties;
  positioned: boolean;
  updatePosition: () => void;
}

const HIDDEN_STYLE: CSSProperties = {
  position: 'fixed',
  visibility: 'hidden',
  pointerEvents: 'none',
  zIndex: 9999,
};

const CLIPPING_OVERFLOW = /(auto|scroll|hidden|clip)/;

function rectIntersects(
  rect: Pick<DOMRect, 'top' | 'right' | 'bottom' | 'left'>,
  bounds: { top: number; right: number; bottom: number; left: number },
) {
  return rect.bottom > bounds.top && rect.top < bounds.bottom && rect.right > bounds.left && rect.left < bounds.right;
}

function isReferenceVisible(reference: HTMLElement, viewportPadding: number) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return true;

  const rect = reference.getBoundingClientRect();
  // JSDOM and a not-yet-laid-out element may report a zero rect. In that case
  // there is not enough geometry to prove the reference is hidden, so keep it open.
  if (rect.width === 0 && rect.height === 0) return true;

  let bounds = {
    top: viewportPadding,
    left: viewportPadding,
    right: window.innerWidth - viewportPadding,
    bottom: window.innerHeight - viewportPadding,
  };

  if (!rectIntersects(rect, bounds)) return false;

  let ancestor = reference.parentElement;
  while (ancestor && ancestor !== document.body && ancestor !== document.documentElement) {
    const styles = window.getComputedStyle(ancestor);
    const overflow = `${styles.overflow} ${styles.overflowX} ${styles.overflowY}`;
    if (CLIPPING_OVERFLOW.test(overflow)) {
      const ancestorRect = ancestor.getBoundingClientRect();
      bounds = {
        top: Math.max(bounds.top, ancestorRect.top),
        left: Math.max(bounds.left, ancestorRect.left),
        right: Math.min(bounds.right, ancestorRect.right),
        bottom: Math.min(bounds.bottom, ancestorRect.bottom),
      };
      if (bounds.right <= bounds.left || bounds.bottom <= bounds.top || !rectIntersects(rect, bounds)) return false;
    }
    ancestor = ancestor.parentElement;
  }

  return true;
}

export function useFloatingPosition({
  open,
  referenceRef,
  floatingRef,
  placement = 'bottom-start',
  matchWidth = false,
  offset = 6,
  minWidth = 140,
  viewportPadding = 8,
  scrollBehavior = 'reposition',
  onRequestClose,
}: FloatingPositionOptions): FloatingPositionResult {
  const [style, setStyle] = useState<CSSProperties>(HIDDEN_STYLE);
  const [positioned, setPositioned] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  const updatePosition = useCallback(() => {
    if (typeof window === 'undefined') return;
    const reference = referenceRef.current;
    const floating = floatingRef.current;
    if (!reference || !floating) return;

    if (!isReferenceVisible(reference, viewportPadding)) {
      onRequestClose?.();
      return;
    }

    const rect = reference.getBoundingClientRect();
    const measuredWidth = matchWidth ? rect.width : Math.max(floating.offsetWidth, minWidth);
    const measuredHeight = floating.offsetHeight;
    const roomBelow = window.innerHeight - rect.bottom - viewportPadding;
    const roomAbove = rect.top - viewportPadding;
    const wantsTop = placement.startsWith('top');
    const alignEnd = placement.endsWith('end');
    const placeTop = wantsTop
      ? roomAbove >= measuredHeight || roomAbove > roomBelow
      : roomBelow < measuredHeight && roomAbove > roomBelow;

    let left = alignEnd ? rect.right - measuredWidth : rect.left;
    left = Math.max(viewportPadding, Math.min(left, window.innerWidth - measuredWidth - viewportPadding));

    const next: CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
      minWidth,
      visibility: 'visible',
      pointerEvents: 'auto',
      left,
      maxWidth: `calc(100vw - ${viewportPadding * 2}px)`,
      ...(matchWidth ? { width: rect.width } : {}),
    };

    if (placeTop) {
      next.bottom = Math.max(viewportPadding, window.innerHeight - rect.top + offset);
      next.top = 'auto';
    } else {
      next.top = Math.max(
        viewportPadding,
        Math.min(rect.bottom + offset, window.innerHeight - measuredHeight - viewportPadding),
      );
      next.bottom = 'auto';
    }

    setStyle(next);
    setPositioned(true);
  }, [floatingRef, matchWidth, minWidth, offset, onRequestClose, placement, referenceRef, viewportPadding]);

  const schedulePositionUpdate = useCallback(() => {
    if (typeof window === 'undefined' || animationFrameRef.current !== null) return;
    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = null;
      updatePosition();
    });
  }, [updatePosition]);

  useLayoutEffect(() => {
    if (!open) {
      setPositioned(false);
      setStyle(HIDDEN_STYLE);
      return;
    }

    // The panel is mounted hidden, measured in this layout effect, and only then
    // made visible at its final coordinates. This prevents a first-open teleport.
    setPositioned(false);
    setStyle(HIDDEN_STYLE);
    updatePosition();

    const handleResize = () => schedulePositionUpdate();
    const handleScroll = (event: Event) => {
      const target = event.target;
      if (typeof Node !== 'undefined' && target instanceof Node && floatingRef.current?.contains(target)) return;

      if (scrollBehavior === 'close') {
        onRequestClose?.();
        return;
      }

      // Persistent overlays keep following their anchor while it is still visible.
      // updatePosition() closes them once the anchor leaves the viewport or a
      // clipping scroll ancestor, preventing a detached panel from following the view.
      schedulePositionUpdate();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(schedulePositionUpdate)
      : null;

    if (observer) {
      if (referenceRef.current) observer.observe(referenceRef.current);
      if (floatingRef.current) observer.observe(floatingRef.current);
    }

    const unlock = scrollBehavior === 'lock' ? lockDocumentScroll() : () => {};

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
      observer?.disconnect();
      unlock();
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [floatingRef, onRequestClose, open, referenceRef, schedulePositionUpdate, scrollBehavior, updatePosition]);

  return { style, positioned, updatePosition };
}
