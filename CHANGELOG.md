# Changelog

## [Unreleased]

### Added

- Configurable floating `scrollBehavior`: `reposition`, `close`, or `lock`.
- Async option refresh/error hooks for `DCombobox` and compatibility async `DSelect` via `refetchKey`, `onFetchError`, and `asyncErrorMessage`.
- `parseCurrencyInputValue` helper for localized currency presentation.
- Repository contribution, architecture, release/versioning, Git flow, CI, and pull-request standards.
- Form-control, floating-overlay, and component-roadmap documentation.

### Changed

- `DCurrencyInput` keeps thousands grouping visible while editing while preserving a canonical raw decimal-text value.
- `DInput format="currency"` now applies thousands grouping as the user types while preserving its raw-digit callback contract.
- `DCombobox` protects against stale async responses and exposes stronger combobox ARIA/keyboard semantics.
- `DSelect`, `DCombobox`, `DDatePicker`, `DRangeDatePicker`, `DNotificationPanel`, and `DSelectFilter` share configurable floating-scroll behavior.
- New autocomplete/API-driven selection flows should prefer `DCombobox`; `DSelect` keeps searchable/async capabilities for compatibility.

### Fixed

- Uncontrolled `DInput`, including `type="password"`, no longer renders as a permanently controlled empty value and can be typed normally.
- Password visibility toggling preserves input value/focus instead of remounting the field.
- Currency formatting keeps caret/focus stable when presentation separators are inserted.
- Floating reposition work is animation-frame throttled and nested scrolls no longer leave panels detached from their anchors.

### Testing

- Added password controlled/uncontrolled typing and visibility regressions.
- Added live currency grouping/raw-value regressions.
- Added async combobox stale-response, refetch, and error-state regressions.
- Added floating `reposition`, `close`, and `lock` regressions.

## 0.2.0

Design-system API and overlay reliability release.

### Breaking API

- All public React components now use a canonical `D` prefix (`DButton`, `DInput`, `DSelect`, `DDialog`, `DDataTable`, etc.).
- Unprefixed component aliases are intentionally not exported; there is still only one implementation per component.

### Overlay and interaction fixes

- Reworked `DDropdown` around one shared internal floating-position hook.
- Floating content is measured in a layout effect and remains hidden until positioned, removing first-open jump/teleport.
- Floating panels update on scroll, resize, and element resize, support viewport collision handling, alignment, top/bottom flipping, and optional trigger-width matching.
- `DNotificationPanel` now renders through a portal and accepts `anchorRef`, preventing parent overflow clipping.
- `DDialog` now compensates scrollbar width while locking background scroll and keeps the lock during its exit animation, avoiding page/sidebar horizontal shift.
- `DAccordion` now uses a consistent SVG chevron, `aria-expanded`/`aria-controls`, a persistent content region, and smooth grid-row/opacity disclosure animation.
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
