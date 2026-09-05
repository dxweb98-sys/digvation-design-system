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
  }, [floatingRef, matchWidth, minWidth, offset, placement, referenceRef, viewportPadding]);

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
      const isNodeTarget = typeof Node !== 'undefined' && target instanceof Node;
      if (isNodeTarget && floatingRef.current?.contains(target)) return;

      if (scrollBehavior === 'close') {
        onRequestClose?.();
        return;
      }

      // `lock` prevents document scrolling, but nested scroll containers can still
      // move an anchor; keep positioning current in both persistent modes.
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
