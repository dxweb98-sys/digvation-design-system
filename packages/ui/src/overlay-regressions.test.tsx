import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DAccordion, DAccordionItem } from './accordion';
import { DDialog } from './dialog';
import { DDropdown } from './dropdown';
import { DNotificationPanel } from './notification-panel';

afterEach(() => {
  cleanup();
  document.body.style.cssText = '';
  vi.restoreAllMocks();
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

  it('repositions an open dropdown when its anchor moves during scroll', async () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      return window.setTimeout(() => callback(0), 0) as unknown as number;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      window.clearTimeout(id);
    });

    let left = 80;
    const { container } = render(
      <DDropdown scrollBehavior="reposition" trigger={() => <button type="button">Tracked menu</button>}>
        <button type="button">Action</button>
      </DDropdown>,
    );
    const reference = container.firstElementChild as HTMLElement;
    vi.spyOn(reference, 'getBoundingClientRect').mockImplementation(() => ({
      x: left,
      y: 80,
      top: 80,
      left,
      right: left + 120,
      bottom: 120,
      width: 120,
      height: 40,
      toJSON: () => ({}),
    }) as DOMRect);

    fireEvent.click(screen.getByRole('button', { name: 'Tracked menu' }));
    const menu = screen.getByRole('menu');
    expect(menu.style.left).toBe('80px');

    left = 160;
    fireEvent.scroll(window);
    await waitFor(() => expect(menu.style.left).toBe('160px'));
  });

  it('closes a repositioning dropdown once most of its anchor is clipped away', async () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      return window.setTimeout(() => callback(0), 0) as unknown as number;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => window.clearTimeout(id));

    let top = 80;
    const { container } = render(
      <DDropdown scrollBehavior="reposition" trigger={() => <button type="button">Clipped menu</button>}>
        <button type="button">Action</button>
      </DDropdown>,
    );
    const reference = container.firstElementChild as HTMLElement;
    vi.spyOn(reference, 'getBoundingClientRect').mockImplementation(() => ({
      x: 80,
      y: top,
      top,
      left: 80,
      right: 200,
      bottom: top + 40,
      width: 120,
      height: 40,
      toJSON: () => ({}),
    }) as DOMRect);

    fireEvent.click(screen.getByRole('button', { name: 'Clipped menu' }));
    expect(screen.getByRole('menu')).toBeTruthy();

    top = -30;
    fireEvent.scroll(window);
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('keeps an oversized dropdown on one side of its trigger and constrains its height', async () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      return window.setTimeout(() => callback(0), 0) as unknown as number;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => window.clearTimeout(id));
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 768 });

    const { container } = render(
      <DDropdown trigger={() => <button type="button">Tall menu</button>}>
        <div>Tall content</div>
      </DDropdown>,
    );
    const reference = container.firstElementChild as HTMLElement;
    vi.spyOn(reference, 'getBoundingClientRect').mockReturnValue({
      x: 80, y: 350, top: 350, left: 80, right: 200, bottom: 390, width: 120, height: 40, toJSON: () => ({}),
    } as DOMRect);

    fireEvent.click(screen.getByRole('button', { name: 'Tall menu' }));
    const menu = screen.getByRole('menu');
    Object.defineProperty(menu, 'offsetHeight', { configurable: true, value: 500 });
    fireEvent(window, new Event('resize'));

    await waitFor(() => {
      expect(menu.style.top).toBe('396px');
      expect(menu.style.maxHeight).toBe('364px');
    });
  });

  it('closes an open dropdown on scroll when requested', async () => {
    render(
      <DDropdown scrollBehavior="close" trigger={() => <button type="button">Close-on-scroll menu</button>}>
        <button type="button">Action</button>
      </DDropdown>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close-on-scroll menu' }));
    expect(screen.getByRole('menu')).toBeTruthy();
    fireEvent.scroll(window);
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('locks and restores document scrolling when requested by a dropdown', () => {
    render(
      <DDropdown scrollBehavior="lock" trigger={() => <button type="button">Locked menu</button>}>
        <button type="button">Action</button>
      </DDropdown>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Locked menu' }));
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.click(screen.getByRole('button', { name: 'Locked menu' }));
    expect(document.body.style.overflow).toBe('');
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
    expect(document.body.style.overflow).toBe('hidden');
    await act(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 240));
    });
    expect(document.body.style.overflow).toBe('');
  });
});
