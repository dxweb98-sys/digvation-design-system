# Digvation Design System

Reusable React + TypeScript design system for Digvation projects. The package keeps reusable behavior from the previous Digvation UI, exposes a canonical `D*` component API, and ships with documentation/preview plus semantic design tokens.

## Repository layout

```text
digvation-design-system/
├─ .github/              # CI + pull request standards
├─ apps/
│  └─ docs/              # Vite documentation + live component preview/API lab
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
- npm 10+
- React 18.2+ in consuming applications

## Install and run locally

```bash
npm install
npm run validate
npm run dev
```

`npm run validate` runs typecheck, tests, UI build, and docs build. The docs app runs on `http://localhost:4173` unless that port is already used.

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

There is one canonical implementation per component. The package does not export a second unprefixed `Button`, `Input`, `Select`, etc.

Types and helpers keep normal names:

```tsx
import { DButton, type ButtonProps, type ButtonVariant } from '@digvation/ui';
```

## Build the UI package

```bash
npm run build:ui
```

Output:

```text
packages/ui/dist/
├─ index.js
├─ index.cjs
├─ index.d.ts
└─ styles.css
```

## Use the package locally in another project

For active local development, install the package directory once:

```bash
npm install /absolute/path/to/Digvation-Design-System/packages/ui
```

The consuming project still imports the production package name:

```tsx
import { DButton, DInput } from '@digvation/ui';
```

Rebuild the design system after source changes:

```bash
npm run build:ui
```

For a production-like package verification, use the packed tarball:

```bash
npm run pack:ui
```

Then install the generated file from `release/` in a representative consumer.

## Styles and project-owned theming

`@digvation/ui/styles.css` is intentionally built **without Tailwind Preflight**. The library must not reset `html`, `body`, `button`, `input`, `*`, or take ownership of the consuming application's page shell. The consumer keeps its own base/reset/layout CSS.

Import the library first and the application stylesheet after it:

```ts
import '@digvation/ui/styles.css';
import './app.css';
```

The recommended setup is to keep project variables as the source of truth and map them once:

```css
/* app.css */
:root {
  --pos-primary: #7c3aed;
  --pos-primary-hover: #6d28d9;
  --pos-secondary: #f3f0ff;
  --pos-secondary-foreground: #24143f;
  --pos-background: #faf8ff;
  --pos-surface: #ffffff;
  --pos-text: #17121f;
  --pos-muted: #746d7e;
  --pos-border: #e7dff0;
  --pos-success: #16803c;
  --pos-warning: #d97706;
  --pos-danger: #dc2626;
}
```

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

`DThemeProvider` defaults to `mode="inherit"` and `radius="inherit"`. It does not force the project into light/dark mode or change the project's radius policy unless explicitly requested. It only maps design-system semantic tokens; portal components inherit the same mapping from the document root.

For projects without an existing CSS-variable system, direct semantic values remain supported through `createProjectThemeTokens()` or the `tokens` prop.

See `docs/THEMING.md` for the full contract.

## Documentation and Component Lab

The docs app still shows component previews and examples. It also mounts **Component Lab**, which generates API metadata directly from the TypeScript source before docs dev/build/typecheck.

Component Lab provides:

- searchable exported `*Props` interfaces
- prop name, exact TypeScript type, required/optional state, and usage guidance
- exported helper/function signatures from the same component module
- live prop controls for behavior-heavy components such as `DButton`, `DInput`, `DSelect`, `DCombobox`, and `DRangeDatePicker`
- live callback/event logs so consumers can see when `onChange`, `onSearchChange`, `onCreateOption`, etc. actually fire
- generated usage code that changes together with the live controls

API metadata is generated by `apps/docs/scripts/generate-component-api.mjs`; do not maintain a second handwritten prop list that can drift from the source types.

## Form-control responsibilities

Keep selection controls explicit:

```text
DSelect         -> simple/static-first single selection
DCombobox       -> searchable/autocomplete/async selection
DInput          -> general scalar field + oldUi compatibility format modes
DCurrencyInput  -> dedicated canonical money value + localized display
```

`DSelect` retains existing searchable/async props for compatibility, but new API-driven autocomplete work should use `DCombobox`.

Async combobox options support debouncing, stale-response protection, external `refetchKey`, error callbacks, and selected-value resolution without forcing a data-fetching library onto consumers.

## Floating popup behavior

Anchored overlays share one positioning engine and can use:

```ts
scrollBehavior="reposition" // follow anchor while it remains meaningfully visible
scrollBehavior="close"      // close on ancestor/window scroll
scrollBehavior="lock"       // lock document scroll
```

Persistent overlays close automatically when their trigger is effectively gone from the viewport/clipping scroll parent. `DRangeDatePicker` prefers `close` because its panel is large. See `docs/FLOATING_OVERLAYS.md`.

## Git and release flow

```text
main                     production-ready/tagged releases
  └─ develop             integration for the next release
      ├─ feat/*
      ├─ fix/*
      ├─ refactor/*
      └─ release/vX.Y.Z

hotfix/* starts from main and is merged back to main + develop.
```

Before 1.0:

- PATCH — backward-compatible fixes
- MINOR — additive public features; breaking changes also require a MINOR bump + explicit migration notes

Prerelease progression:

```text
0.3.0-alpha.1 -> 0.3.0-beta.1 -> 0.3.0-rc.1 -> 0.3.0
```

Do not version-bump ordinary feature branches. Version changes happen during release stabilization. See `docs/RELEASE_PROCESS.md`.

## Design-system rules

1. One canonical implementation per public component.
2. No `BaseX + X + DX` duplicate component layers.
3. Shared behavior belongs in internal primitives only when multiple components genuinely use it.
4. Reusable UI does not import business hooks, application stores, routers, API modules, or project models.
5. Project identity changes through semantic tokens rather than component-by-component edits.
6. Reusable oldUi behavior remains the compatibility baseline unless it contains a real bug.
7. Public behavior changes require tests, docs, changelog entries, and `npm run validate`.
8. The distributed stylesheet must not ship application-level resets or Tailwind Preflight.
9. Consumer project colors remain the source of truth; design-system tokens map to them.

See `apps/docs` for live previews and `docs/COMPONENTS.md` for the current catalog.
