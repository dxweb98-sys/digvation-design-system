import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { DThemeProvider, createCssVariableTheme, createProjectThemeTokens } from './theme';

afterEach(() => {
  cleanup();
  const root = document.documentElement;
  root.removeAttribute('data-ds-mode');
  root.removeAttribute('data-theme-radius');
  root.style.removeProperty('--color-brand');
  root.style.removeProperty('--color-secondary');
});

describe('project-owned theming', () => {
  it('maps project primary and secondary semantics to Digvation tokens', () => {
    const tokens = createProjectThemeTokens({
      primary: '#111111',
      primaryHover: '#222222',
      secondary: '#eeeeee',
      onSecondary: '#101010',
    });

    expect(tokens.brand).toBe('#111111');
    expect(tokens.brandHover).toBe('#222222');
    expect(tokens.brandActive).toBe('#222222');
    expect(tokens.secondary).toBe('#eeeeee');
    expect(tokens.secondaryForeground).toBe('#101010');
  });

  it('creates CSS-variable aliases owned by the consumer project', () => {
    const tokens = createCssVariableTheme({
      primary: '--pos-primary',
      secondary: 'pos-secondary',
      border: '--pos-border',
    });

    expect(tokens.brand).toBe('var(--pos-primary)');
    expect(tokens.secondary).toBe('var(--pos-secondary)');
    expect(tokens.border).toBe('var(--pos-border)');
  });

  it('inherits project mode/radius attributes by default and restores mapped variables', () => {
    const root = document.documentElement;
    root.setAttribute('data-ds-mode', 'dark');
    root.setAttribute('data-theme-radius', 'PROJECT');
    root.style.setProperty('--color-brand', '#old');

    const { unmount } = render(
      <DThemeProvider tokens={{ brand: 'var(--pos-primary)', secondary: 'var(--pos-secondary)' }}>
        <div>App</div>
      </DThemeProvider>,
    );

    expect(root.getAttribute('data-ds-mode')).toBe('dark');
    expect(root.getAttribute('data-theme-radius')).toBe('PROJECT');
    expect(root.style.getPropertyValue('--color-brand')).toBe('var(--pos-primary)');
    expect(root.style.getPropertyValue('--color-secondary')).toBe('var(--pos-secondary)');

    unmount();
    expect(root.getAttribute('data-ds-mode')).toBe('dark');
    expect(root.getAttribute('data-theme-radius')).toBe('PROJECT');
    expect(root.style.getPropertyValue('--color-brand')).toBe('#old');
    expect(root.style.getPropertyValue('--color-secondary')).toBe('');
  });
});
