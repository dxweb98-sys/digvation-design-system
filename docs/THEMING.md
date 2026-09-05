# Project-owned theming and style isolation

`@digvation/ui` is a component library, not an application stylesheet. Consumer projects own page layout, body styles, routing shell, brand identity and application-level CSS.

At the same time, the design system must remain visually complete when a consumer does **not** provide a custom theme. The package therefore ships a full Digvation fallback palette, radii, shadows and typography tokens. Project theming is an override, not a requirement.

## The contract

```text
consumer project has no theme mapping
→ component uses Digvation default tokens

consumer project maps primary / secondary / surface / status colors
→ component keeps the same Digvation structure and behavior
→ only semantic identity follows the project
```

A consumer should never need to theme the library just to make `DButton`, `DSelect`, calendar cells or menu items look correct.

## Isolation guarantee

The distributed `@digvation/ui/styles.css` intentionally omits Tailwind Preflight. The package must not ship application-wide element resets such as `* { box-sizing }`, `body { ... }`, or `button, input { ... }` that could change a consumer application's layout or shell.

Instead, the package uses a **component-scoped normalization boundary** (`data-ds-component`). Inside that boundary only, Digvation controls normalize browser-native button appearance, box sizing and inherited form typography. Portal surfaces such as dropdowns carry the same boundary. This gives components a deterministic baseline without touching unrelated project elements.

## Default theme

Without `DThemeProvider`, components use the built-in fallback values from `styles.css`, including:

- primary / primary hover / active / foreground
- secondary / secondary hover / active / foreground
- background, surface and muted surface
- text, muted text and border
- info, success, warning and danger
- control, card and panel radii
- shadows
- Digvation fallback font stack

Panel item radius is derived from the panel radius so menus remain concentric:

```css
--radius-panel: 16px;
--radius-menu-item: max(6px, calc(var(--radius-panel) - 6px));
```

When a project overrides `--radius-panel`, dropdown item rounding follows automatically.

## Recommended integration: project variables are the source of truth

Assume the application already owns tokens:

```css
:root {
  --pos-primary: #6d28d9;
  --pos-primary-hover: #5b21b6;
  --pos-secondary: #f1f5f9;
  --pos-secondary-foreground: #0f172a;
  --pos-background: #f8fafc;
  --pos-surface: #ffffff;
  --pos-text: #0f172a;
  --pos-muted: #64748b;
  --pos-border: #e2e8f0;
  --pos-success: #16a34a;
  --pos-warning: #d97706;
  --pos-danger: #dc2626;
}
```

Map them once:

```tsx
import {
  DThemeProvider,
  createCssVariableTheme,
} from '@digvation/ui';

const uiTheme = createCssVariableTheme({
  primary: '--pos-primary',
  primaryHover: '--pos-primary-hover',
  secondary: '--pos-secondary',
  onSecondary: '--pos-secondary-foreground',
  background: '--pos-background',
  surface: '--pos-surface',
  text: '--pos-text',
  textMuted: '--pos-muted',
  border: '--pos-border',
  success: '--pos-success',
  warning: '--pos-warning',
  danger: '--pos-danger',
});

<DThemeProvider tokens={uiTheme}>
  <App />
</DThemeProvider>
```

The provider defaults to `mode="inherit"` and `radius="inherit"`, so it does not force light/dark mode or radius attributes onto the project. It only maps Digvation semantic tokens to the variables already owned by the project. Portal-based components still see the same mapped variables because the aliases are installed on `document.documentElement`.

## Direct semantic mapping

Projects without CSS variables can provide CSS values directly:

```tsx
import { DThemeProvider, createProjectThemeTokens } from '@digvation/ui';

const uiTheme = createProjectThemeTokens({
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  primaryActive: '#1e40af',
  onPrimary: '#ffffff',
  secondary: '#eef2ff',
  onSecondary: '#1e1b4b',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#0f172a',
  border: '#e2e8f0',
});
```

Any omitted value keeps the Digvation default.

## Import order

The recommended order is:

```ts
import '@digvation/ui/styles.css';
import './app.css';
```

The design-system fallback tokens live in a low-priority theme layer, so normal project token declarations can override them. Component utility styling remains explicit and component-scoped; project identity should be changed through semantic tokens rather than broad rules such as `button { ... }`.

## Token semantics

- `primary` maps to the main project action color.
- `secondary` maps to secondary buttons and quiet actions.
- `background` is used for focus ring offsets and component-aware background states; it does not style `body`.
- `surface` / `surfaceMuted` are component panels and muted controls.
- `text` / `textMuted` are component foreground colors.
- `border` is the neutral component border.
- `success`, `warning`, `danger`, `info` drive semantic states.
- radius and shadow values are optional; omit them to keep the package defaults.

Do not hard-code project identities inside component source files. Add or map a semantic token instead.
