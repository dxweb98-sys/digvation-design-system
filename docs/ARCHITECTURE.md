# Repository Architecture

## Top-level tree

```text
digvation-design-system/
├─ .github/
│  ├─ pull_request_template.md
│  └─ workflows/
│     └─ ci.yml
├─ apps/
│  └─ docs/                   # local docs + live preview
├─ docs/
│  ├─ ARCHITECTURE.md
│  ├─ RELEASE_PROCESS.md
│  └─ ...
├─ packages/
│  └─ ui/
│     ├─ src/
│     │  ├─ <component>/
│     │  ├─ internal/
│     │  ├─ shared/
│     │  ├─ index.ts
│     │  └─ styles.css
│     └─ package.json
├─ CHANGELOG.md
├─ CONTRIBUTING.md
├─ README.md
└─ package.json
```

## Ownership boundaries

### `packages/ui`

Reusable UI only. It owns:

- component rendering and interaction
- accessibility behavior
- semantic tokens
- generic async callback orchestration
- generic overlay/focus/scroll primitives
- reusable formatting helpers

It must not own:

- project routes
- application stores
- business/domain types
- API clients
- authentication/session state
- purchasing/sales/ERP logic
- page layout of consuming applications

### `apps/docs`

Consumer of `@digvation/ui`, not a second UI implementation. Examples must render real package components. Documentation-specific layout/styles stay here.

### `internal`

Code in `packages/ui/src/internal` exists to prevent duplicated implementation logic. It is private unless deliberately exported from `src/index.ts`.

Good internal candidates:

- anchored floating positioning
- document scroll locking
- focus utilities
- shared icons
- field mechanics used by multiple controls

Do not create an internal abstraction for one component unless it clearly reduces complexity or is expected to be shared immediately.

## Component shape

Preferred:

```text
packages/ui/src/select/
├─ select.tsx
├─ select.test.tsx
└─ index.ts
```

Public export:

```ts
export { DSelect, type SelectProps, type SelectOption } from './select';
```

Root export:

```ts
export { DSelect, type SelectProps, type SelectOption } from './select';
```

Do not create compatibility layers such as `BaseSelect -> Select -> DSelect`. `DSelect` is the canonical implementation.

## Form family

Use explicit component responsibilities:

- `DInput` — text-like scalar fields, including legacy `format="currency"` compatibility.
- `DCurrencyInput` — dedicated canonical currency value editing when a raw decimal value API is preferred.
- `DDecimalInput` — decimal/integer normalized text input.
- `DSelect` — simple single selection; static-first.
- `DCombobox` — searchable/autocomplete selection; async-friendly.
- `DSearchInput` — debounced search field behavior.
- `DDatePicker` / `DRangeDatePicker` — anchored date selection.

Do not turn `DSelect` and `DCombobox` into two copies of the same large component. Compatibility props may remain, but new autocomplete/async UX should prefer `DCombobox`.

## Overlay architecture

Anchored overlays use the shared floating engine:

```text
internal/floating/use-floating-position
                ↑
                |
             DDropdown
          /      |       \
     DSelect DCombobox DDatePicker ...
```

A component may use the floating hook directly only when its API/structure does not naturally fit `DDropdown` (for example an externally controlled notification panel). It must still share the same positioning and scroll policy implementation.

## Styling contract

Component appearance is defined through semantic tokens such as:

```text
--color-brand
--color-surface
--color-text
--color-border
--color-success
--color-warning
--color-danger
--radius-control
--radius-panel
--shadow-lg
```

Consumers can override tokens. Package CSS must avoid destructive global layout rules. A design-system component may lock scrolling only while a component that explicitly requires it is active (for example `DDialog`), with proper cleanup and scrollbar compensation.
