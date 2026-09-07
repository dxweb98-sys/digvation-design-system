# Changelog

## [Unreleased]

### Added

- Added `DTimePicker` with `hour` and `hour-minute` variants, configurable minute steps, shared field sizing, clear/error/hint behavior, and floating-overlay scroll policy.
- Added `DDatePicker` `date-hour` and `date-time` variants while preserving the existing `date` value/behavior contract. Date-time variants emit local ISO-like values in `YYYY-MM-DDTHH:mm` format.

## 1.0.0 - 2026-09-05

First stable production release of `@digvation/ui`. The `D*` public component API, semantic theming contract, package exports, floating-overlay behavior, and repository/release workflow are now treated as stable consumer contracts.

### Added

- Stable canonical `D*` React component API for Digvation projects.
- Configurable floating `scrollBehavior`: `reposition`, `close`, or `lock`.
- Async option refresh/error hooks for `DCombobox` and compatibility async `DSelect` via `refetchKey`, `onFetchError`, and `asyncErrorMessage`.
- Project-owned theming helpers: `createProjectThemeTokens()` and `createCssVariableTheme()`.
- Full Digvation fallback theme when consumers do not provide project tokens.
- Generated component API documentation with integrated `Preview`, `Code`, `Props`, and `Functions` playground tabs.
- Accordion visual variants: `default`, `separator`, `card`, and `separated`.
- Repository contribution, architecture, release/versioning, Git flow, CI, documentation-dogfooding, and pull-request standards.

### Changed

- `DCurrencyInput` keeps thousands grouping visible while editing while preserving a canonical raw decimal-text value.
- `DInput format="currency"` applies thousands grouping as the user types while preserving its raw-digit callback contract.
- `DCombobox` protects against stale async responses and exposes stronger combobox ARIA/keyboard semantics.
- `DSelect`, `DCombobox`, `DDatePicker`, `DRangeDatePicker`, `DNotificationPanel`, and `DSelectFilter` share the floating-position engine and configurable scroll policy.
- New autocomplete/API-driven selection flows should prefer `DCombobox`; `DSelect` retains searchable/async compatibility behavior.
- Distributed styles no longer include Tailwind Preflight or application-level global resets. Component normalization is scoped to Digvation component boundaries.
- Project semantic tokens may override primary, secondary, surfaces, text, borders, and status colors without changing component structure or behavior.
- Documentation controls dogfood public Digvation components where equivalents exist.
- `DDialog` header spacing and `DNotificationPanel` row spacing were compacted for a cleaner production baseline.

### Fixed

- `DInput type="password"` typing, deletion, controlled/uncontrolled state, visibility toggling, value preservation, and focus behavior.
- Currency formatting caret/focus stability while separators are inserted.
- Floating overlays no longer detach from hidden/scrolled-away anchors and close when the anchor is no longer meaningfully visible.
- `DSelect` selected and active-option highlighting no longer leave the previous/default option visually selected.
- Dropdown/search/option radii now follow a concentric panel geometry contract.
- Browser-native control chrome no longer leaks into `DSearchInput`, `DDataTable`, `DTabs`, `DAccordion`, `DPagination`, `DDialog`, and `DNotificationPanel`.
- Dialog scroll locking avoids page/sidebar horizontal layout shift.

### Testing

- Password controlled/uncontrolled typing, deletion, retyping, and visibility regressions.
- Live currency grouping/raw-value regressions.
- Async combobox stale-response, refetch, and error-state regressions.
- Floating `reposition`, `close`, `lock`, detached-anchor, nested-scroll, and overlay regressions.
- Component-boundary/style-isolation regressions.
- Dialog, notification, select, pagination, theme, toast, and composite-control regressions.

### Stable API policy

Starting with `1.0.0`:

- PATCH releases are backward-compatible fixes.
- MINOR releases add backward-compatible features/components.
- MAJOR releases contain breaking public API or behavior changes.
- Public `D*` names, exported types, semantic token contracts, and documented behavior are compatibility-sensitive.

## 0.2.0

Design-system API and overlay reliability release.

### Breaking API

- All public React components now use a canonical `D` prefix (`DButton`, `DInput`, `DSelect`, `DDialog`, `DDataTable`, etc.).
- Unprefixed component aliases are intentionally not exported; there is still only one implementation per component.

### Overlay and interaction fixes

- Reworked `DDropdown` around one shared internal floating-position hook.
- Floating content is measured in a layout effect and remains hidden until positioned, removing first-open jump/teleport.
- Floating panels update on scroll, resize, and element resize, support viewport collision handling, alignment, top/bottom flipping, and optional trigger-width matching.
- `DNotificationPanel` renders through a portal and accepts `anchorRef`, preventing parent overflow clipping.
- `DDialog` compensates scrollbar width while locking background scroll and keeps the lock during its exit animation, avoiding page/sidebar horizontal shift.
- `DAccordion` uses a consistent SVG chevron, `aria-expanded`/`aria-controls`, a persistent content region, and smooth grid-row/opacity disclosure animation.
- Removed text-character chevrons/arrows from DDataTable/DPagination control surfaces.

### Variants and theming

- `DButton`: added `soft`, `info`, `warning`, and `link`; retained `primary`, `secondary`, `outline`, `ghost`, `success`, `danger`.
- `DBadge`: added `secondary` and `info`.
- `DAlert`: added `neutral` and dedicated `--color-info` usage.
- `DInfoNote`: added `neutral` and `danger` while retaining `tip` compatibility.
- `DCard`: added `default`, `outlined`, `elevated`, and `interactive` variants.
- Added `--color-brand-hover`, `--color-brand-active`, `--color-info`, and semantic `--shadow-sm/md/lg` tokens.

### Regression coverage

- Added overlay regressions for first-open dropdown positioning, accordion disclosure semantics, notification portal anchoring, and dialog scrollbar compensation.
