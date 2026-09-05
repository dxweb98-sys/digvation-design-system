# Digvation Design System

Reusable React + TypeScript design system for Digvation projects. The package keeps the reusable behavior from the previous Digvation UI, removes duplicate implementations, exposes a `D*` component API, and ships with a local documentation/preview application plus semantic design tokens.

## Repository layout

```text
digvation-design-system/
├─ apps/
│  └─ docs/             # Vite documentation + live component preview
├─ packages/
│  └─ ui/               # @digvation/ui reusable package
├─ docs/                 # written guides
├─ release/              # npm pack output (.tgz)
└─ package.json          # npm workspaces
```

## Requirements

- Node.js 20+
- npm 10+
- React 18.2+ in consuming applications

## Install and run locally

```bash
npm install
npm run typecheck
npm test
npm run build
npm run dev
```

The docs app runs on `http://localhost:4173` unless that port is already used.

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

There is only one canonical implementation per component. The package does not export a second unprefixed `Button`, `Input`, `Select`, etc.

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

## Use the local package in another project

The recommended production-like local workflow is `npm pack`.

From the design-system repository:

```bash
npm run pack:ui
```

This produces:

```text
release/digvation-ui-0.2.0.tgz
```

Then from your active project:

```bash
npm install ../Digvation-Design-System/release/digvation-ui-0.2.0.tgz
```

Import the stylesheet once, before your project overrides:

```tsx
import '@digvation/ui/styles.css';
import './index.css';
```

Use components normally:

```tsx
import { DButton, DInput, DSelect } from '@digvation/ui';

export function ProjectForm() {
  return (
    <div>
      <DInput label="Project name" clearable />
      <DSelect
        label="Status"
        options={[
          { label: 'Active', value: 'active' },
          { label: 'Draft', value: 'draft' },
        ]}
      />
      <DButton>Save</DButton>
    </div>
  );
}
```

## Theme a consuming project

Components use semantic CSS variables. Override them after importing the package stylesheet:

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

  --shadow-sm: 0 1px 2px rgb(15 23 42 / 0.06);
  --shadow-md: 0 8px 24px rgb(15 23 42 / 0.10);
  --shadow-lg: 0 18px 50px rgb(15 23 42 / 0.16);
}
```

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

Portal components such as `DDropdown`, `DNotificationPanel`, and `DDialog` inherit the same document-root theme.

## Important v0.2.0 fixes

- `DDropdown` now uses one shared floating-position engine and is hidden until its first position is measured, preventing first-open teleport/jump.
- `DNotificationPanel` renders through a portal and can anchor to `anchorRef`, preventing clipping inside documentation cards or application containers.
- `DAccordion` uses an SVG chevron and smooth disclosure animation while keeping content mounted for the transition.
- `DDialog` compensates for the removed browser scrollbar and keeps scroll lock active through the exit animation, preventing horizontal layout shift.
- Text-symbol arrows/chevrons in the core table/pagination surfaces were replaced with consistent SVG icons.
- Semantic variants were expanded for buttons, badges, alerts, notes, and cards.
- All canonical public React components now use the `D` prefix.

## Main semantic variants

`DButton`:

```text
primary · secondary · outline · ghost · soft · info · success · warning · danger · link
```

`DBadge`:

```text
default · primary · secondary · info · success · warning · danger · outline
```

`DAlert`:

```text
neutral · info · success · warning · danger
```

`DInfoNote`:

```text
neutral · info · success · warning · danger · tip
```

`DCard`:

```text
default · outlined · elevated · interactive
```

## Design-system rules

1. One canonical implementation per public component.
2. No `BaseX + X + DX` duplicate component layers.
3. Shared behavior belongs in internal primitives only when multiple components genuinely use it.
4. Reusable UI does not import business hooks, application stores, routers, API modules, or project models.
5. Project identity changes through semantic tokens rather than component-by-component edits.
6. Reusable oldUi behavior remains the compatibility baseline unless it contained a real bug.

See `apps/docs` for live previews and the files under `docs/` for migration/customization guidance.
