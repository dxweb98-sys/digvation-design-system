# Digvation Design System

A reusable React design system extracted from the Digvation UI foundation. The project keeps the relevant oldUi behavior and visual language, removes duplicate component implementations, and adds a local documentation playground for future projects.

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

## Run the documentation locally

```bash
npm install
npm run dev
```

The command first builds `@digvation/ui`, then starts the docs app. Vite uses port `4173` by default and will print the local URL in the terminal.

## Build everything

```bash
npm run build
```

Outputs:

- `packages/ui/dist/` — reusable JavaScript, TypeScript declarations, and compiled component CSS
- `apps/docs/dist/` — static documentation site

## Verify before publishing

```bash
npm run typecheck
npm test
npm run build
```

The package includes regression tests for the canonical input, select, combobox, dialog, toast, DataTable behavior and the added pagination helper.

## Use the UI package in another project

### Recommended local workflow

From this repository:

```bash
npm run pack:ui
```

That creates a tarball inside `release/`, for example:

```text
release/digvation-ui-0.1.1.tgz
```

Then in another React project:

```bash
npm install ../digvation-design-system/release/digvation-ui-0.1.1.tgz
```

Import the styles once in your application entry file:

```tsx
import '@digvation/ui/styles.css';
```

Then use any component:

```tsx
import { Button, Input, Select } from '@digvation/ui';

export function ProjectForm() {
  return (
    <div>
      <Input label="Project name" value="Digvation" onChange={() => {}} />
      <Button>Save</Button>
    </div>
  );
}
```

### Publish later

The package is currently named `@digvation/ui`. Change that name if you want a different npm scope, then publish from `packages/ui` or with npm workspaces.

```bash
npm run build:ui
npm publish -w @digvation/ui --access public
```

For private company use, publish to your private npm registry instead.

## Customize a project theme

All components use semantic CSS variables. The easiest option is to override the variables after importing the package stylesheet:

```css
@import '@digvation/ui/styles.css';

:root {
  --color-brand: #7c3aed;
  --color-focus: #7c3aed;
  --color-background: #faf8ff;
  --color-surface: #ffffff;
  --color-surface-muted: #f4f0ff;
  --color-text: #17121f;
  --color-text-muted: #746d7e;
  --color-border: #e7dff0;

  --color-success: #16803c;
  --color-warning: #d97706;
  --color-danger: #dc2626;

  --radius-control: 10px;
  --radius-card: 18px;
  --radius-panel: 18px;
}
```

Or use `ThemeProvider`:

```tsx
import { ThemeProvider } from '@digvation/ui';

<ThemeProvider
  mode="light"
  radius="rounded"
  tokens={{
    brand: '#7c3aed',
    focus: '#7c3aed',
    background: '#faf8ff',
    surface: '#ffffff',
  }}
>
  <App />
</ThemeProvider>
```

`ThemeProvider` applies the variables at the document root so portal components such as `Dialog` and `Dropdown` receive the same theme.

## Semantic token list

Core tokens include:

- `--color-background`
- `--color-surface`
- `--color-surface-muted`
- `--color-text`
- `--color-text-muted`
- `--color-border`
- `--color-brand`
- `--color-focus`
- `--color-success`
- `--color-warning`
- `--color-danger`
- `--color-tooltip`
- `--radius-control`
- `--radius-card`
- `--radius-panel`
- `--shadow-panel`
- `--font-sans`

## Design-system rules

1. One canonical implementation per component.
2. No `BaseX` + `X` duplicate implementations.
3. Shared behavior is composed through actual primitives such as `Dropdown` and shared field sizing.
4. Reusable UI must not import application hooks, router state, API modules, or business models.
5. Project identity is changed through semantic tokens, not component-by-component class edits.
6. Keep oldUi behavior when it is reusable UI behavior; keep domain-specific logic outside this package.

## Added general-purpose components

In addition to the canonicalized Digvation components, the system adds common primitives that were missing for a reusable project foundation:

- `Avatar`
- `Tooltip`
- `Tabs`
- `Accordion`
- `Breadcrumb`
- `Pagination`
- `Separator`
- `Spinner`
- `ThemeProvider`

They use the same tokens and styling conventions as the rest of the library.

See the local documentation site for live examples and copyable usage snippets.
