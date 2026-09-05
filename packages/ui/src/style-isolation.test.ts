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
});
