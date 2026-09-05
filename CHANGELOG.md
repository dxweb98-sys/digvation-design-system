# Changelog

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
