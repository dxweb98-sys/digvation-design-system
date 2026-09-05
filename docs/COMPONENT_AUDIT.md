# Component Audit and Roadmap

This audit compares the current public `@digvation/ui` surface with common needs in reusable business/web applications. It is intentionally conservative: missing components are not automatically added to the package. A component should be promoted into the design system only after its API can be generic, themed, accessible, documented, and tested without application/domain dependencies.

## Current coverage

The current package already covers the most common foundations:

- actions: button/export
- forms: input, decimal/currency input, textarea, select, combobox, search, checkbox, radio, toggle, date/date-range controls and filters
- feedback: alert, note, badge, toast, progress, loading/skeleton, connection/empty states
- data/display: card, avatar, data table, separator
- navigation/disclosure: tabs, accordion, breadcrumb, pagination
- overlays: dropdown, tooltip, dialog/confirm dialog, notification panel
- theming: semantic tokens and `DThemeProvider`

## High-priority additions

These are likely to be useful in multiple Digvation products and deserve dedicated change branches rather than being bundled into unrelated fixes.

### 1. DMultiSelect

Why: filters, permissions, tags, product/category assignment, and multi-entity forms frequently need multiple selection.

Expected foundation:
- reuse the existing field sizing and floating engine
- local + searchable options
- optional async options after DCombobox patterns are proven
- removable selected chips
- keyboard navigation
- max visible chips / overflow summary
- no duplicate combobox implementation

Suggested branch: `feat/multi-select`

### 2. DPopover

Why: a generic anchored content surface is useful for compact settings, help, date/time adjuncts, and application-specific controls that are not menus.

Expected foundation:
- compose the shared floating engine
- controlled/uncontrolled open state
- placement + `scrollBehavior`
- focus/outside/Escape behavior
- no action-menu assumptions

Suggested branch: `feat/popover`

### 3. DFileUpload / DDropzone

Why: attachments, receipts, product assets, avatars, imports, and evidence documents recur in business products.

Expected foundation:
- native file input first
- drag/drop as progressive enhancement
- accept/max size/multiple constraints
- validation callbacks
- file-list rendering hooks
- no storage/upload API dependency

Suggested branch: `feat/file-upload`

### 4. DRadioGroup / DCheckboxGroup

Why: consistent label/error/hint/group keyboard semantics are preferable to rebuilding groups in every form.

Expected foundation:
- compose existing DRadio/DCheckbox visual language
- field-level error/hint/required state
- accessible group semantics

Suggested branch: `feat/choice-groups`

## Medium-priority additions

Add when at least two consuming products need them:

- `DDrawer` / `DSheet` — non-modal/mobile navigation or contextual editing surface
- `DStepper` — multi-step forms/processes
- `DTimeline` — audit/history/transaction activity
- `DStat` — KPI/value display primitive
- `DTag` / `DChip` — only if selection/removal semantics differ enough from `DBadge`
- `DCommand` — only after a real command-palette/search use case exists

## Do not add yet without a concrete consumer

- generic `DContextMenu`
- separate `DModal` that merely duplicates `DDialog`
- `DInfiniteScroll` component instead of a small behavior hook when needed
- app-specific tables/cards/status components

The package should grow because reusable behavior exists, not because a component appears on a generic UI-library checklist.

## Acceptance criteria for every addition

A new public component must include:

1. canonical `D*` export with one implementation
2. semantic-token styling consistent with existing controls
3. keyboard and ARIA behavior appropriate to the pattern
4. light/dark/custom-token compatibility
5. live docs preview + written usage/API notes
6. interaction/regression tests
7. no application/domain/API client dependency
8. `npm run validate` passing
9. changelog entry under `Unreleased`
10. a focused feature branch and PR into `develop`
