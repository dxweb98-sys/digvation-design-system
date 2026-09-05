import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DAccordion, DAccordionItem } from './accordion';
import { DDialog } from './dialog';
import { DDropdown } from './dropdown';
import { DNotificationPanel } from './notification-panel';

afterEach(() => {
  cleanup();
  document.body.style.cssText = '';
});

describe('overlay regressions', () => {
  it('positions DDropdown before it becomes visible on first open', () => {
    const rect = { x: 100, y: 80, top: 80, left: 100, right: 220, bottom: 120, width: 120, height: 40, toJSON: () => ({}) };
    const { container } = render(
      <DDropdown trigger={() => <button type="button">Open menu</button>}>
        <button type="button">Action</button>
      </DDropdown>,
    );
    const reference = container.firstElementChild as HTMLElement;
    vi.spyOn(reference, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const menu = screen.getByRole('menu');
    expect(menu.dataset.positioned).toBe('true');
    expect(menu.style.visibility).toBe('visible');
    expect(menu.style.left).toBe('100px');
    expect(menu.style.top).toBe('126px');
  });

  it('keeps DAccordion content mounted and updates accessible disclosure state', () => {
    render(<DAccordion><DAccordionItem value="usage" title="Usage">Accordion content</DAccordionItem></DAccordion>);
    const trigger = screen.getByRole('button', { name: 'Usage' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByRole('region', { hidden: true }).getAttribute('aria-hidden')).toBe('true');
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('region').getAttribute('aria-hidden')).toBe('false');
  });

  it('renders DNotificationPanel through a portal and anchors it to its trigger', () => {
    const anchorRef = createRef<HTMLButtonElement>();
    const onClose = vi.fn();
    render(
      <>
        <button ref={anchorRef} type="button">Notifications</button>
        <DNotificationPanel
          anchorRef={anchorRef}
          open
          onClose={onClose}
          notifications={[]}
          onMarkRead={() => {}}
          onMarkAllRead={() => {}}
          onDismiss={() => {}}
        />
      </>,
    );
    vi.spyOn(anchorRef.current!, 'getBoundingClientRect').mockReturnValue({ x: 200, y: 40, top: 40, left: 200, right: 320, bottom: 80, width: 120, height: 40, toJSON: () => ({}) } as DOMRect);
    // Re-render by toggling a harmless event so the layout hook recalculates from the mocked anchor.
    fireEvent(window, new Event('resize'));
    const panel = screen.getByRole('dialog', { name: 'Notifikasi' });
    expect(panel.parentElement).toBe(document.body);
    expect(panel.dataset.positioned).toBe('true');
    expect(screen.getByText('Tidak ada notifikasi')).toBeTruthy();
  });

  it('compensates the scrollbar while DDialog is mounted and restores styles after exit', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 });
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 1184 });
    const { rerender } = render(<DDialog open onClose={() => {}} title="Stable layout">Content</DDialog>);
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.paddingRight).toContain('16px');

    rerender(<DDialog open={false} onClose={() => {}} title="Stable layout">Content</DDialog>);
    // Exit animation keeps scroll lock active so the page does not shift mid-transition.
    expect(document.body.style.overflow).toBe('hidden');
    await new Promise((resolve) => window.setTimeout(resolve, 240));
    expect(document.body.style.overflow).toBe('');
  });
});
