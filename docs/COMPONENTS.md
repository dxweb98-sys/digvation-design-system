# Component catalog

The local docs app contains interactive previews and copyable usage snippets. This file is a quick inventory of the reusable package surface.

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
| `DCurrencyInput` | Controlled money text + formatted presentation | `value`, `onValueChange`, `currencySymbol`, separators |
| `DTextarea` | Canonical multiline field | `label`, `value`, `onChange(value,event)`, `clearable`, `error`, `hint` |
| `DSelect` | Custom select panel | `options`, `value`, `onChange`, `searchable`, `fetchOptions`, `clearable` |
| `DCombobox` | Search/autocomplete/create option | `fetchOptions`, `allowCreate`, `onCreateOption`, `renderOption`, `debounceMs` |
| `DSearchInput` | Debounced search field | `value`, `onChange`, `debounceMs`, `placeholder` |
| `DCheckbox` | Boolean checkbox | Native checkbox props |
| `DRadio` | DRadio selection | Native radio props |
| `DToggle` | Switch/toggle with oldUi label layout | `checked`, `onChange`, `labelPosition`, `size`, `fullWidth` |
| `DDatePicker` | Single date calendar | `value`, `onChange`, `minDate`, `maxDate`, `clearable`, `size` |
| `DRangeDatePicker` | Date range calendar | `value`, `onChange`, `clearable`, `size` |
| `DDateRangeFilter` | Toolbar date filter | `from`, `to`, change callbacks, `onClear` |
| `DSelectFilter` | OldUi-style inline-label select filter | `label`, `options`, `value`, `onChange` |
| `DStatusFilter` | Quick status chips | `options`, `value`, `onChange`, counts |

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
| `DCardSkeleton` | DCard loading composition |
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
| `DDropdown` | Shared portal positioning engine used by DSelect, DCombobox, DDatePicker, DDataTable and DExportButton |
| `DTooltip` | Contextual hover/focus information |
| `DDialog` | Mobile bottom-sheet + desktop modal preserving oldUi behavior |
| `DConfirmDialog` | Destructive/non-destructive confirmation |
| `DNotificationPanel` | Notification dropdown panel |

## Theme

| Export | Purpose |
|---|---|
| `DThemeProvider` | Apply theme mode/radius/tokens globally, including portal components |
| `defaultThemeTokens` | Default token reference |
| `themeTokensToCss` | Convert a token object to CSS variable declarations |

## Shared helpers

The package also exports format/normalization helpers that are useful when building project-specific form logic:

- `normalizeDecimalInput`
- `formatCurrencyInputValue`
- `selectOptionsFromChildren`
- `getPaginationPages`
- `getPaginationItems`
- `cn`
