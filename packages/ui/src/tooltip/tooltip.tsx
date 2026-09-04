import { cloneElement, useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { cn } from '../cn';

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  delayMs?: number;
}

const placementClass = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'left-1/2 top-full mt-2 -translate-x-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
} as const;

type TooltipTriggerProps = { 'aria-describedby'?: string };

export function Tooltip({ content, children, placement = 'top', className, delayMs = 120 }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const child = children as ReactElement<TooltipTriggerProps>;

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const show = () => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setOpen(true);
    }, delayMs);
  };

  const hide = () => {
    clearTimer();
    setOpen(false);
  };

  useEffect(() => clearTimer, []);

  const trigger = cloneElement(child, {
    'aria-describedby': open ? id : child.props['aria-describedby'],
  });

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={() => { clearTimer(); setOpen(true); }}
      onBlur={hide}
    >
      {trigger}
      <span
        id={id}
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-[100] w-max max-w-64 rounded-lg bg-[var(--color-tooltip)] px-2.5 py-1.5 text-xs leading-relaxed text-white shadow-lg transition-all duration-150',
          placementClass[placement],
          open ? 'visible opacity-100' : 'invisible opacity-0',
          className,
        )}
      >
        {content}
      </span>
    </span>
  );
}
