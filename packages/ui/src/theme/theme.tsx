import { useEffect, type ReactNode } from 'react';

export type ThemeRadius = 'compact' | 'default' | 'rounded';
export type ThemeMode = 'light' | 'dark';

export interface ThemeTokens {
  background?: string;
  surface?: string;
  surfaceMuted?: string;
  text?: string;
  textMuted?: string;
  border?: string;
  brand?: string;
  brandHover?: string;
  brandActive?: string;
  focus?: string;
  info?: string;
  success?: string;
  warning?: string;
  danger?: string;
  tooltip?: string;
  accentYellow?: string;
  accentMint?: string;
  accentSky?: string;
  accentLavender?: string;
  accentCoral?: string;
  radiusControl?: string;
  radiusCard?: string;
  radiusPanel?: string;
  shadowSm?: string;
  shadowMd?: string;
  shadowLg?: string;
  /** Legacy alias kept for existing themes. */
  shadowPanel?: string;
  fontSans?: string;
}

export interface ThemeProviderProps {
  children: ReactNode;
  tokens?: ThemeTokens;
  radius?: ThemeRadius;
  mode?: ThemeMode;
}

const variableMap: Record<keyof ThemeTokens, string> = {
  background: '--color-background',
  surface: '--color-surface',
  surfaceMuted: '--color-surface-muted',
  text: '--color-text',
  textMuted: '--color-text-muted',
  border: '--color-border',
  brand: '--color-brand',
  brandHover: '--color-brand-hover',
  brandActive: '--color-brand-active',
  focus: '--color-focus',
  info: '--color-info',
  success: '--color-success',
  warning: '--color-warning',
  danger: '--color-danger',
  tooltip: '--color-tooltip',
  accentYellow: '--color-accent-yellow',
  accentMint: '--color-accent-mint',
  accentSky: '--color-accent-sky',
  accentLavender: '--color-accent-lavender',
  accentCoral: '--color-accent-coral',
  radiusControl: '--radius-control',
  radiusCard: '--radius-card',
  radiusPanel: '--radius-panel',
  shadowSm: '--shadow-sm',
  shadowMd: '--shadow-md',
  shadowLg: '--shadow-lg',
  shadowPanel: '--shadow-panel',
  fontSans: '--font-sans',
};

export const defaultThemeTokens: Required<ThemeTokens> = {
  background: 'hsl(220 25% 98%)',
  surface: '#ffffff',
  surfaceMuted: 'hsl(220 15% 95%)',
  text: 'hsl(220 20% 12%)',
  textMuted: 'hsl(220 10% 50%)',
  border: 'hsl(220 18% 90%)',
  brand: 'hsl(217 91% 53%)',
  brandHover: 'hsl(217 91% 47%)',
  brandActive: 'hsl(217 91% 41%)',
  focus: 'hsl(217 91% 53%)',
  info: 'hsl(200 90% 45%)',
  success: 'hsl(145 65% 38%)',
  warning: 'hsl(38 92% 50%)',
  danger: 'hsl(0 72% 51%)',
  tooltip: '#1f2a44',
  accentYellow: '#f8e85d',
  accentMint: '#bfe4d2',
  accentSky: '#b9d8ef',
  accentLavender: '#cec4f5',
  accentCoral: '#f3a08b',
  radiusControl: '8px',
  radiusCard: '16px',
  radiusPanel: '16px',
  shadowSm: '0 1px 2px rgb(15 23 42 / 0.06)',
  shadowMd: '0 8px 24px rgb(15 23 42 / 0.10)',
  shadowLg: '0 18px 50px rgb(15 23 42 / 0.16)',
  shadowPanel: '0 8px 24px rgb(15 23 42 / 0.10)',
  fontSans: "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

export function themeTokensToCss(tokens: ThemeTokens): string {
  return Object.entries(tokens)
    .filter(([, value]) => value != null && value !== '')
    .map(([key, value]) => `${variableMap[key as keyof ThemeTokens]}: ${value};`)
    .join('\n');
}

/**
 * Applies semantic theme tokens globally so portal-based components inherit the same project theme.
 */
export function DThemeProvider({ children, tokens = {}, radius = 'default', mode = 'light' }: ThemeProviderProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const previousMode = root.getAttribute('data-ds-mode');
    const previousRadius = root.getAttribute('data-theme-radius');
    const previous = new Map<string, string>();

    Object.entries(tokens).forEach(([key, value]) => {
      if (value == null || value === '') return;
      const variable = variableMap[key as keyof ThemeTokens];
      previous.set(variable, root.style.getPropertyValue(variable));
      root.style.setProperty(variable, value);
    });
    root.setAttribute('data-ds-mode', mode);
    root.setAttribute('data-theme-radius', radius.toUpperCase());

    return () => {
      previous.forEach((value, variable) => {
        if (value) root.style.setProperty(variable, value);
        else root.style.removeProperty(variable);
      });
      if (previousMode == null) root.removeAttribute('data-ds-mode');
      else root.setAttribute('data-ds-mode', previousMode);
      if (previousRadius == null) root.removeAttribute('data-theme-radius');
      else root.setAttribute('data-theme-radius', previousRadius);
    };
  }, [mode, radius, tokens]);

  return <>{children}</>;
}
