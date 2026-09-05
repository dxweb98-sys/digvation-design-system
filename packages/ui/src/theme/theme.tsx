import { useEffect, type ReactNode } from 'react';

export type ThemeRadius = 'inherit' | 'compact' | 'default' | 'rounded';
export type ThemeMode = 'inherit' | 'light' | 'dark';

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
  brandForeground?: string;
  secondary?: string;
  secondaryHover?: string;
  secondaryActive?: string;
  secondaryForeground?: string;
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

/** Semantic project palette. The design system maps these names to its internal tokens. */
export interface ProjectThemeTokens {
  primary?: string;
  primaryHover?: string;
  primaryActive?: string;
  onPrimary?: string;
  secondary?: string;
  secondaryHover?: string;
  secondaryActive?: string;
  onSecondary?: string;
  background?: string;
  surface?: string;
  surfaceMuted?: string;
  text?: string;
  textMuted?: string;
  border?: string;
  focus?: string;
  info?: string;
  success?: string;
  warning?: string;
  danger?: string;
  tooltip?: string;
  radiusControl?: string;
  radiusCard?: string;
  radiusPanel?: string;
  shadowSm?: string;
  shadowMd?: string;
  shadowLg?: string;
  fontSans?: string;
}

export type CssVariableThemeMap = Partial<Record<keyof ProjectThemeTokens, string>>;

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
  brandForeground: '--color-brand-foreground',
  secondary: '--color-secondary',
  secondaryHover: '--color-secondary-hover',
  secondaryActive: '--color-secondary-active',
  secondaryForeground: '--color-secondary-foreground',
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
  brandForeground: '#ffffff',
  secondary: 'hsl(220 15% 95%)',
  secondaryHover: 'hsl(220 15% 92%)',
  secondaryActive: 'hsl(220 15% 88%)',
  secondaryForeground: 'hsl(220 20% 12%)',
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

/** Maps project-oriented primary/secondary naming to Digvation semantic tokens. */
export function createProjectThemeTokens(project: ProjectThemeTokens): ThemeTokens {
  return {
    background: project.background,
    surface: project.surface,
    surfaceMuted: project.surfaceMuted,
    text: project.text,
    textMuted: project.textMuted,
    border: project.border,
    brand: project.primary,
    brandHover: project.primaryHover ?? project.primary,
    brandActive: project.primaryActive ?? project.primaryHover ?? project.primary,
    brandForeground: project.onPrimary,
    secondary: project.secondary,
    secondaryHover: project.secondaryHover ?? project.secondary,
    secondaryActive: project.secondaryActive ?? project.secondaryHover ?? project.secondary,
    secondaryForeground: project.onSecondary,
    focus: project.focus ?? project.primary,
    info: project.info,
    success: project.success,
    warning: project.warning,
    danger: project.danger,
    tooltip: project.tooltip,
    radiusControl: project.radiusControl,
    radiusCard: project.radiusCard,
    radiusPanel: project.radiusPanel,
    shadowSm: project.shadowSm,
    shadowMd: project.shadowMd,
    shadowLg: project.shadowLg,
    shadowPanel: project.shadowMd,
    fontSans: project.fontSans,
  };
}

function asCssVariable(variableName: string) {
  const normalized = variableName.startsWith('--') ? variableName : `--${variableName}`;
  return `var(${normalized})`;
}

/**
 * Creates a theme that reads values from CSS variables owned by the consumer project.
 * Example: createCssVariableTheme({ primary: '--pos-primary', secondary: '--pos-secondary' }).
 */
export function createCssVariableTheme(map: CssVariableThemeMap): ThemeTokens {
  const project = Object.fromEntries(
    Object.entries(map).map(([key, variableName]) => [key, variableName ? asCssVariable(variableName) : undefined]),
  ) as ProjectThemeTokens;
  return createProjectThemeTokens(project);
}

/**
 * Applies only Digvation semantic variables. It does not reset body/html styles.
 * `mode="inherit"` and `radius="inherit"` leave the consumer project's root attributes untouched.
 * Portal-based components can still read the same variables because tokens are applied to documentElement.
 */
export function DThemeProvider({ children, tokens = {}, radius = 'inherit', mode = 'inherit' }: ThemeProviderProps) {
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

    if (mode !== 'inherit') root.setAttribute('data-ds-mode', mode);
    if (radius !== 'inherit') root.setAttribute('data-theme-radius', radius.toUpperCase());

    return () => {
      previous.forEach((value, variable) => {
        if (value) root.style.setProperty(variable, value);
        else root.style.removeProperty(variable);
      });
      if (mode !== 'inherit') {
        if (previousMode == null) root.removeAttribute('data-ds-mode');
        else root.setAttribute('data-ds-mode', previousMode);
      }
      if (radius !== 'inherit') {
        if (previousRadius == null) root.removeAttribute('data-theme-radius');
        else root.setAttribute('data-theme-radius', previousRadius);
      }
    };
  }, [mode, radius, tokens]);

  return <>{children}</>;
}
