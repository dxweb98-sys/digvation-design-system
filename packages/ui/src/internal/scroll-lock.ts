let lockCount = 0;
let restore: (() => void) | null = null;

/** Keeps the page width stable while preventing background scrolling. */
export function lockDocumentScroll(): () => void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return () => {};

  lockCount += 1;
  if (lockCount === 1) {
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const previousCompensation = body.style.getPropertyValue('--ds-scrollbar-compensation');
    const computedPaddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);

    body.style.overflow = 'hidden';
    body.style.setProperty('--ds-scrollbar-compensation', `${scrollbarWidth}px`);
    if (scrollbarWidth > 0) body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;

    restore = () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
      if (previousCompensation) body.style.setProperty('--ds-scrollbar-compensation', previousCompensation);
      else body.style.removeProperty('--ds-scrollbar-compensation');
    };
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      restore?.();
      restore = null;
    }
  };
}
