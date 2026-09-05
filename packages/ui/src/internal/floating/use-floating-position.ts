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
const MIN_REFERENCE_VISIBLE_RATIO = 0.5;

function intersectionArea(
  rect: Pick<DOMRect, 'top' | 'right' | 'bottom' | 'left'>,
  bounds: { top: number; right: number; bottom: number; left: number },
) {
  const width = Math.max(0, Math.min(rect.right, bounds.right) - Math.max(rect.left, bounds.left));
  const height = Math.max(0, Math.min(rect.bottom, bounds.bottom) - Math.max(rect.top, bounds.top));
  return width * height;
}

function isReferenceVisible(reference: HTMLElement, viewportPadding: number) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return true;
  if (!reference.isConnected) return false;

  const referenceStyle = window.getComputedStyle(reference);
  if (referenceStyle.display === 'none' || referenceStyle.visibility === 'hidden') return false;

  const rect = reference.getBoundingClientRect();
  // JSDOM and a not-yet-laid-out element may report a zero rect. There is not
  // enough geometry to prove it is hidden, so do not close solely for that case.
  if (rect.width === 0 && rect.height === 0) return true;

  let bounds = {
    top: viewportPadding,
    left: viewportPadding,
    right: window.innerWidth - viewportPadding,
    bottom: window.innerHeight - viewportPadding,
  };

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
      if (bounds.right <= bounds.left || bounds.bottom <= bounds.top) return false;
    }
    ancestor = ancestor.parentElement;
  }

  const referenceArea = Math.max(1, rect.width * rect.height);
  return intersectionArea(rect, bounds) / referenceArea >= MIN_REFERENCE_VISIBLE_RATIO;
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
    const roomBelow = Math.max(0, window.innerHeight - rect.bottom - offset - viewportPadding);
    const roomAbove = Math.max(0, rect.top - offset - viewportPadding);
    const wantsTop = placement.startsWith('top');
    const alignEnd = placement.endsWith('end');
    const placeTop = wantsTop
      ? roomAbove >= measuredHeight || roomAbove > roomBelow
      : roomBelow < measuredHeight && roomAbove > roomBelow;
    const availableHeight = placeTop ? roomAbove : roomBelow;

    let left = alignEnd ? rect.right - measuredWidth : rect.left;
    left = Math.max(viewportPadding, Math.min(left, window.innerWidth - Math.min(measuredWidth, window.innerWidth - viewportPadding * 2) - viewportPadding));

    const next: CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
      minWidth,
      visibility: 'visible',
      pointerEvents: 'auto',
      left,
      maxWidth: `calc(100vw - ${viewportPadding * 2}px)`,
      maxHeight: Math.max(0, availableHeight),
      overflowY: 'auto',
      overscrollBehavior: 'contain',
      ...(matchWidth ? { width: rect.width } : {}),
    };

    // Keep the panel attached to one side of the reference. If the panel is
    // taller than the available room, constrain its height instead of sliding
    // it across/over the trigger.
    if (placeTop) {
      next.bottom = window.innerHeight - rect.top + offset;
      next.top = 'auto';
    } else {
      next.top = rect.bottom + offset;
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

      // Persistent overlays follow the anchor only while at least half of the
      // trigger remains visible inside the viewport and clipping ancestors.
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
