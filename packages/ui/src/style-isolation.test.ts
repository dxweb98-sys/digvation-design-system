import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('distributed stylesheet isolation', () => {
  it('does not import Tailwind Preflight or application-level element resets', () => {
    const css = fs.readFileSync(path.resolve(process.cwd(), 'src/styles.css'), 'utf8');

    expect(css).not.toContain("@import 'tailwindcss';");
    expect(css).not.toContain('tailwindcss/preflight.css');
    expect(css).not.toMatch(/(^|\n)\s*body\s*\{/);
    expect(css).not.toMatch(/(^|\n)\s*html\s*\{/);
    expect(css).not.toMatch(/(^|\n)\s*\*\s*,/);
    expect(css).not.toMatch(/(^|\n)\s*button\s*,\s*\n?\s*input/);
  });
});
