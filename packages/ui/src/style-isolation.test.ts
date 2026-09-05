import { describe, expect, it } from 'vitest';
import css from './styles.css?raw';

describe('distributed stylesheet isolation', () => {
  it('does not import Tailwind Preflight or application-level element resets', () => {
    expect(css).not.toContain("@import 'tailwindcss';");
    expect(css).not.toContain('tailwindcss/preflight.css');
    expect(css).not.toMatch(/(^|\n)\s*body\s*\{/);
    expect(css).not.toMatch(/(^|\n)\s*html\s*\{/);
    expect(css).not.toMatch(/(^|\n)\s*\*\s*,/);
    expect(css).not.toMatch(/(^|\n)\s*button\s*,\s*\n?\s*input/);
  });

  it('ships a complete fallback theme while normalizing only Digvation component boundaries', () => {
    expect(css).toContain('--color-brand:');
    expect(css).toContain('--color-secondary:');
    expect(css).toContain('--color-surface:');
    expect(css).toContain('--radius-control:');
    expect(css).toContain('--radius-panel:');
    expect(css).toContain('--radius-menu-item:');
    expect(css).toContain('[data-ds-component]');
    expect(css).toContain("[data-ds-surface='floating'] [role='option']");
  });
});
