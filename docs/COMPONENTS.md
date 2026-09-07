# Component catalog

The local docs app contains interactive previews and copyable usage snippets. This file is a quick inventory of the reusable package surface. Detailed form and overlay behavior is documented in `FORM_CONTROLS.md` and `FLOATING_OVERLAYS.md`.

## Actions

| Component | Purpose | Important API |
|---|---|---|
| `DButton` | Primary/secondary/destructive actions | `variant`, `size`, `loading`, `leftIcon`, `rightIcon`, `fullWidth` |
| `DExportButton` | Shared export dropdown | `onExport`, `filename`, `onSuccess`, `onError`, `onProcessing` |

## Forms

| Component | Purpose | Important API |
|---|---|---|
| `DInput` | Canonical text/password/number input preserving oldUi behavior | `label`, `format`, `clearable`, `size`, `onChange(value,event)`, `onNativeChange`, `prefix`, `suffix` |
| `DDecimalInput` | Controlled normalized numeric text | `value`, `onValueChange`, `scale`, `integer` |
| `DCurrencyInput` | Controlled money field with live localized presentation | `value`, `onValueChange`, `currencySymbol`, `groupSeparator`, `decimalSeparator` |
| `DTextarea` | Canonical multiline field | `label`, `value`, `onChange(value,event)`, `clearable`, `error`, `hint` |
| `DSelect` | Simple single-selection control; searchable/async props retained for compatibility | `options`, `value`, `onChange`, `clearable`, `scrollBehavior` |
| `DCombobox` | Search/autocomplete/create/async option control | `fetchOptions`, `refetchKey`, `onFetchError`, `allowCreate`, `onCreateOption`, `renderOption`, `debounceMs`, `scrollBehavior` |
| `DSearchInput` | Debounced search field | `value`, `onChange`, `debounceMs`, `placeholder` |
| `DCheckbox` | Boolean checkbox | Native checkbox props |
| `DRadio` | Radio selection | Native radio props |
| `DToggle` | Switch/toggle with oldUi label layout | `checked`, `onChange`, `labelPosition`, `size`, `fullWidth` |
| `DDatePicker` | Single date calendar with optional time selection | `value`, `onChange`, `variant`, `minuteStep`, `minDate`, `maxDate`, `clearable`, `size`, `scrollBehavior` |
| `DTimePicker` | Standalone hour or hour-minute picker | `value`, `onChange`, `variant`, `minuteStep`, `clearable`, `size`, `scrollBehavior` |
| `DRangeDatePicker` | Date range calendar | `value`, `onChange`, `clearable`, `size`, `scrollBehavior` |
| `DDateRangeFilter` | Toolbar date filter | `from`, `to`, change callbacks, `onClear` |
| `DSelectFilter` | OldUi-style inline-label select filter | `label`, `options`, `value`, `onChange`, `scrollBehavior` |
| `DStatusFilter` | Quick status chips | `options`, `value`, `onChange`, counts |

`DDatePicker` keeps `variant="date"` as the default and preserves its existing `YYYY-MM-DD` value contract. `variant="date-hour"` and `variant="date-time"` emit local ISO-like values in `YYYY-MM-DDTHH:mm` form. `DTimePicker` uses canonical `HH:mm`; its `hour` variant always normalizes minutes to `00`.

For new work, keep `DSelect` simple/static-first and use `DCombobox` when the user types to filter/search or options are fetched from an API.

## Feedback

| Component | Purpose |
|---|---|
| `DAlert` | Semantic inline alert |
| `DInfoNote` | Informational/tip/warning note |
| `DBadge` | Status/category badge |
| `DToastProvider` / `useToast` / `DToastContainer` | App-scoped transient feedback |
| `DProgress` | Determinate or indeterminate progress |
| `DLoadingIndicator` | Inline loading state |
| `DLoadingOverlay` | Full-screen loading state |
| `DSkeleton` | Base loading skeleton |
| `DTableSkeleton` | Table loading composition |
| `DCardSkeleton` | Card loading composition |
| `DFormSkeleton` | Form loading composition |
| `DConnectionError` | Full-screen connection failure |
| `DSplashScreen` | Full-screen application splash |

## Display and data

| Component | Purpose |
|---|---|
| `DCard`, `DCardHeader`, `DCardContent`, `DCardFooter` | Content grouping primitives |
| `DAvatar` | Image/initial avatar with presence |
| `DEmptyState` | Empty/no-result state |
| `DDataTable` | Searchable, sortable, responsive table preserving oldUi behavior |
| `DSeparator` | Horizontal/vertical separator |
| `DSpinner` | Small standalone spinner |

## Navigation and disclosure

| Component | Purpose |
|---|---|
| `DTabs`, `DTabsList`, `DTabsTrigger`, `DTabsContent` | Keyboard-friendly tabs |
| `DAccordion`, `DAccordionItem` | Single/multiple disclosure |
| `DBreadcrumb` family | Application hierarchy |
| `DPagination` | Standalone page navigation |

## Overlay infrastructure

| Component | Purpose |
|---|---|
| `DDropdown` | Shared portal/floating engine | `placement`, `matchWidth`, `scrollBehavior`, `viewportPadding` |
| `DTooltip` | Contextual hover/focus information | content/delay/placement behavior |
| `DDialog` | Mobile bottom-sheet + desktop modal preserving oldUi behavior | modal focus/scroll lifecycle |
| `DConfirmDialog` | Destructive/non-destructive confirmation | confirm/cancel actions |
| `DNotificationPanel` | Notification dropdown panel | `anchorRef`, `scrollBehavior`, read/dismiss callbacks |

`FloatingScrollBehavior` is exported as `reposition | close | lock`.

## Theme

| Export | Purpose |
|---|---|
| `DThemeProvider` | Apply theme mode/radius/tokens globally, including portal components |
| `defaultThemeTokens` | Default token reference |
| `themeTokensToCss` | Convert a token object to CSS variable declarations |

## Shared helpers

The package exports reusable helpers for project-specific form logic:

- `normalizeDecimalInput`
- `formatCurrencyInputValue`
- `parseCurrencyInputValue`
- `selectOptionsFromChildren`
- `getPaginationPages`
- `getPaginationItems`
- `cn`

## Roadmap

See `COMPONENT_AUDIT.md`. High-priority gaps are currently `DMultiSelect`, `DPopover`, `DFileUpload/DDropzone`, and grouped radio/checkbox controls. They should be implemented on focused feature branches instead of being added opportunistically to unrelated changes.
