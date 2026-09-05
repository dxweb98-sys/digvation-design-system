import { useCallback, useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';

export type FloatingPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

interface FloatingPositionOptions {
  open: boolean;
  referenceRef: RefObject<HTMLElement | null>;
  floatingRef: RefObject<HTMLElement | null>;
  placement?: FloatingPlacement;
  matchWidth?: boolean;
  offset?: number;
  minWidth?: number;
  viewportPadding?: number;
}

interface FloatingPositionResult {
  style: CSSProperties;
  positioned: boolean;
  updatePosition: () => void;
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
}: FloatingPositionOptions): FloatingPositionResult {
  const [style, setStyle] = useState<CSSProperties>({ position: 'fixed', visibility: 'hidden', zIndex: 9999 });
  const [positioned, setPositioned] = useState(false);

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
      left,
      maxWidth: `calc(100vw - ${viewportPadding * 2}px)`,
      ...(matchWidth ? { width: rect.width } : {}),
    };

    if (placeTop) {
      next.bottom = Math.max(viewportPadding, window.innerHeight - rect.top + offset);
      next.top = 'auto';
    } else {
      next.top = Math.max(viewportPadding, Math.min(rect.bottom + offset, window.innerHeight - measuredHeight - viewportPadding));
      next.bottom = 'auto';
    }

    setStyle(next);
    setPositioned(true);
  }, [floatingRef, matchWidth, minWidth, offset, placement, referenceRef, viewportPadding]);

  useLayoutEffect(() => {
    if (!open) {
      setPositioned(false);
      setStyle({ position: 'fixed', visibility: 'hidden', zIndex: 9999 });
      return;
    }

    updatePosition();

    const onViewportChange = () => updatePosition();
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('scroll', onViewportChange, true);

    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(onViewportChange)
      : null;
    if (observer) {
      if (referenceRef.current) observer.observe(referenceRef.current);
      if (floatingRef.current) observer.observe(floatingRef.current);
    }

    return () => {
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('scroll', onViewportChange, true);
      observer?.disconnect();
    };
  }, [floatingRef, open, referenceRef, updatePosition]);

  return { style, positioned, updatePosition };
}
