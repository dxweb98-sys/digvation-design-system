# Digvation Design System

Reusable React + TypeScript design system for Digvation projects. The package keeps reusable Digvation UI behavior, exposes a canonical `D*` component API, ships a complete fallback theme, and lets consumer projects override semantic identity tokens without letting the library take over the application shell.

## Stable release

Current stable production line:

```text
@digvation/ui@1.0.0
```

Starting with `1.0.0`, the public `D*` component API, exported types, semantic theme contract, package exports, and documented interaction behavior are compatibility-sensitive.

## Repository layout

```text
digvation-design-system/
├─ .github/              # CI + pull request standards
├─ apps/
│  └─ docs/              # Vite documentation + integrated component playgrounds
├─ docs/                 # architecture, usage, release and customization guides
├─ packages/
│  └─ ui/                # @digvation/ui reusable package
├─ release/              # npm pack output (.tgz)
├─ CHANGELOG.md
├─ CONTRIBUTING.md
└─ package.json
```

See:

- `CONTRIBUTING.md` — branch names, code naming, commits, PR rules, source conventions
- `docs/ARCHITECTURE.md` — repository/component boundaries
- `docs/RELEASE_PROCESS.md` — SemVer, prerelease, production/hotfix flow
- `docs/THEMING.md` — project-owned colors, CSS-variable mapping and style isolation
- `docs/FORM_CONTROLS.md` — input/select/combobox/currency contracts
- `docs/FLOATING_OVERLAYS.md` — anchored popup behavior and scrolling policy
- `docs/COMPONENT_AUDIT.md` — prioritized component roadmap

## Requirements

- Node.js 20+
- React 18.2+ in consuming applications

## Install in a project

After the package is available in the configured Digvation registry:

```bash
npm install @digvation/ui@^1.0.0
```

or:

```bash
pnpm add @digvation/ui@^1.0.0
```

Import the stylesheet once at the application entry/root stylesheet boundary:

```ts
import '@digvation/ui/styles.css';
import './app.css';
```

Then import only the components a feature needs:

```tsx
import {
  DButton,
  DInput,
  DSelect,
  DDialog,
} from '@digvation/ui';
```

A consumer does **not** need a theme provider just to make components look correct. The package always ships the Digvation fallback theme.

## Public component naming

All public React components use the Digvation prefix:

```tsx
import {
  DButton,
  DInput,
  DSelect,
  DCombobox,
  DDialog,
  DDataTable,
} from '@digvation/ui';
```

There is one canonical implementation per component. The package does not export duplicate unprefixed `Button`, `Input`, `Select`, etc.

Types and helpers keep normal names:

```tsx
import { DButton, type ButtonProps, type ButtonVariant } from '@digvation/ui';
```

## Project-owned theming

`@digvation/ui/styles.css` intentionally omits Tailwind Preflight and application-level global resets. The consuming project owns `html`, `body`, layout, sidebar, base typography, routing shell, and application reset CSS.

The design system owns component structure, spacing, states, accessibility, and behavior. Project identity is mapped through semantic tokens.

Example project variables:

```css
:root {
  --app-primary: #7c3aed;
  --app-primary-hover: #6d28d9;
  --app-secondary: #f3f0ff;
  --app-secondary-foreground: #24143f;
  --app-background: #faf8ff;
  --app-surface: #ffffff;
  --app-text: #17121f;
  --app-muted: #746d7e;
  --app-border: #e7dff0;
  --app-success: #16803c;
  --app-warning: #d97706;
  --app-danger: #dc2626;
}
```

Map them once:

```tsx
import {
  DThemeProvider,
  createCssVariableTheme,
} from '@digvation/ui';

const uiTheme = createCssVariableTheme({
  primary: '--app-primary',
  primaryHover: '--app-primary-hover',
  secondary: '--app-secondary',
  onSecondary: '--app-secondary-foreground',
  background: '--app-background',
  surface: '--app-surface',
  text: '--app-text',
  textMuted: '--app-muted',
  border: '--app-border',
  success: '--app-success',
  warning: '--app-warning',
  danger: '--app-danger',
});

<DThemeProvider tokens={uiTheme}>
  <App />
</DThemeProvider>
```

Any omitted token keeps the Digvation default. Portal-based components receive the same semantic mapping.

See `docs/THEMING.md` for the full contract.

## Documentation playground

Every documented component keeps its usage material together in the same section:

```text
Preview | Code | Props | Functions
```

Behavior-heavy components expose live prop controls. Code follows the current preview configuration, Props metadata is generated from TypeScript source, and Functions shows exported helpers plus callback/event observations. Documentation controls use public `D*` components wherever an equivalent exists.

## Form-control responsibilities

```text
DSelect         -> simple/static-first single selection
DCombobox       -> searchable/autocomplete/async selection
DInput          -> general scalar field + compatibility format modes
DCurrencyInput  -> dedicated canonical money value + localized display
```

`DSelect` retains searchable/async compatibility props, but new API-driven autocomplete work should prefer `DCombobox`.

## Floating popup behavior

Anchored overlays share one positioning engine and may use:

```ts
scrollBehavior="reposition" // follow anchor while meaningfully visible
scrollBehavior="close"      // close on ancestor/window scroll
scrollBehavior="lock"       // lock document scroll
```

Persistent overlays close automatically when their trigger is effectively gone from the viewport or clipping scroll parent. Large overlays such as `DRangeDatePicker` prefer `close`.

## Local package development

Install dependencies and validate the repository:

```bash
npm install
npm run validate
npm run dev
```

Build only the reusable package:

```bash
npm run build:ui
```

For direct local development from another project:

```bash
npm install /absolute/path/to/Digvation-Design-System/packages/ui
```

For production-like verification, build a tarball:

```bash
npm run pack:ui
```

Install the generated `.tgz` from `release/` into representative consumer projects before a production release when packaging, exports, CSS, peers, or public types change.

## Git and release flow

```text
main                     production-ready tagged releases
  └─ develop             integration for the next release
      ├─ feat/*
      ├─ fix/*
      ├─ refactor/*
      └─ release/vX.Y.Z

hotfix/* starts from main and is merged back to main + develop.
```

Stable SemVer policy from `1.0.0` onward:

```text
1.0.0 -> 1.0.1   PATCH: backward-compatible fixes
1.0.0 -> 1.1.0   MINOR: backward-compatible features/components
1.x   -> 2.0.0   MAJOR: breaking public API/behavior changes
```

Prereleases use `alpha.N`, `beta.N`, and `rc.N`, for example:

```text
1.1.0-alpha.1 -> 1.1.0-beta.1 -> 1.1.0-rc.1 -> 1.1.0
```

Do not version-bump ordinary feature branches. Version changes happen during release stabilization. See `docs/RELEASE_PROCESS.md`.

## Design-system rules

1. One canonical implementation per public component.
2. No `BaseX + X + DX` duplicate component layers.
3. Shared behavior belongs in internal primitives only when multiple components genuinely use it.
4. Reusable UI does not import business hooks, application stores, routers, API modules, or project models.
5. Project identity changes through semantic tokens rather than component-by-component edits.
6. Existing reusable behavior remains the compatibility baseline unless it contains a real bug.
7. Public behavior changes require tests, docs, changelog entries, and `npm run validate`.
8. The distributed stylesheet must not ship application-level resets or Tailwind Preflight.
9. Consumer project colors remain the source of truth when mapped; Digvation defaults remain available otherwise.
10. Documentation dogfoods public design-system controls instead of reimplementing equivalents.
