# Digvation Design System

Reusable React + TypeScript design system for Digvation projects. The package keeps reusable behavior from the previous Digvation UI, exposes a canonical `D*` component API, and ships with documentation/preview plus semantic design tokens.

## Repository layout

```text
digvation-design-system/
├─ .github/              # CI + pull request standards
├─ apps/
│  └─ docs/              # Vite documentation + live component preview
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

## Styles and theming

If a consumer wants the design-system CSS, import it once at the consumer's chosen style boundary, then override semantic variables in the consumer stylesheet:

```css
@import '@digvation/ui/styles.css';

:root {
  --color-brand: #7c3aed;
  --color-brand-hover: #6d28d9;
  --color-brand-active: #5b21b6;
  --color-focus: #7c3aed;

  --color-background: #faf8ff;
  --color-surface: #ffffff;
  --color-surface-muted: #f4f0ff;
  --color-text: #17121f;
  --color-text-muted: #746d7e;
  --color-border: #e7dff0;

  --color-info: #0284c7;
  --color-success: #16803c;
  --color-warning: #d97706;
  --color-danger: #dc2626;

  --radius-control: 10px;
  --radius-card: 18px;
  --radius-panel: 18px;
}
```

The UI package must not take ownership of a consuming application's page shell, sidebar, routing, or global layout. Consumer-specific layout styles stay in the consumer.

Or use `DThemeProvider`:

```tsx
import { DThemeProvider } from '@digvation/ui';

<DThemeProvider
  mode="light"
  radius="rounded"
  tokens={{
    brand: '#7c3aed',
    brandHover: '#6d28d9',
    brandActive: '#5b21b6',
    focus: '#7c3aed',
    background: '#faf8ff',
    surface: '#ffffff',
  }}
>
  <App />
</DThemeProvider>
```

Portal components inherit document-root theme tokens.

## Form-control responsibilities

Keep selection controls explicit:

```text
DSelect     -> simple/static-first single selection
DCombobox   -> searchable/autocomplete/async selection
DInput      -> general scalar field + oldUi compatibility format modes
DCurrencyInput -> dedicated canonical money value + localized display
```

`DSelect` retains existing searchable/async props for compatibility, but new API-driven autocomplete work should use `DCombobox`.

Async combobox options support debouncing, stale-response protection, external `refetchKey`, error callbacks, and selected-value resolution without forcing a data-fetching library onto consumers.

## Floating popup behavior

Anchored overlays share one positioning engine and can use:

```ts
scrollBehavior="reposition" // keep open and follow anchor
scrollBehavior="close"      // close on ancestor/window scroll
scrollBehavior="lock"       // lock document scroll
```

Form dropdowns default to `reposition`; short-lived toolbar/action surfaces can prefer `close`. See `docs/FLOATING_OVERLAYS.md`.

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

See `apps/docs` for live previews and `docs/COMPONENTS.md` for the current catalog.
