# Component catalog

The local docs app contains interactive previews and copyable usage snippets. This file is a quick inventory of the reusable package surface.

## Actions

| Component | Purpose | Important API |
|---|---|---|
| `Button` | Primary/secondary/destructive actions | `variant`, `size`, `loading`, `leftIcon`, `rightIcon`, `fullWidth` |
| `ExportButton` | Shared export dropdown | `onExport`, `filename`, `onSuccess`, `onError`, `onProcessing` |

## Forms

| Component | Purpose | Important API |
|---|---|---|
| `Input` | Canonical text/password/number input preserving oldUi behavior | `label`, `format`, `clearable`, `size`, `onChange(value,event)`, `onNativeChange`, `prefix`, `suffix` |
| `DecimalInput` | Controlled normalized numeric text | `value`, `onValueChange`, `scale`, `integer` |
| `CurrencyInput` | Controlled money text + formatted presentation | `value`, `onValueChange`, `currencySymbol`, separators |
| `Textarea` | Canonical multiline field | `label`, `value`, `onChange(value,event)`, `clearable`, `error`, `hint` |
| `Select` | Custom select panel | `options`, `value`, `onChange`, `searchable`, `fetchOptions`, `clearable` |
| `Combobox` | Search/autocomplete/create option | `fetchOptions`, `allowCreate`, `onCreateOption`, `renderOption`, `debounceMs` |
| `SearchInput` | Debounced search field | `value`, `onChange`, `debounceMs`, `placeholder` |
| `Checkbox` | Boolean checkbox | Native checkbox props |
| `Radio` | Radio selection | Native radio props |
| `Toggle` | Switch/toggle with oldUi label layout | `checked`, `onChange`, `labelPosition`, `size`, `fullWidth` |
| `DatePicker` | Single date calendar | `value`, `onChange`, `minDate`, `maxDate`, `clearable`, `size` |
| `RangeDatePicker` | Date range calendar | `value`, `onChange`, `clearable`, `size` |
| `DateRangeFilter` | Toolbar date filter | `from`, `to`, change callbacks, `onClear` |
| `SelectFilter` | OldUi-style inline-label select filter | `label`, `options`, `value`, `onChange` |
| `StatusFilter` | Quick status chips | `options`, `value`, `onChange`, counts |

## Feedback

| Component | Purpose |
|---|---|
| `Alert` | Semantic inline alert |
| `InfoNote` | Informational/tip/warning note |
| `Badge` | Status/category badge |
| `ToastProvider` / `useToast` / `ToastContainer` | App-scoped transient feedback |
| `Progress` | Determinate or indeterminate progress |
| `LoadingIndicator` | Inline loading state |
| `LoadingOverlay` | Full-screen loading state |
| `Skeleton` | Base loading skeleton |
| `TableSkeleton` | Table loading composition |
| `CardSkeleton` | Card loading composition |
| `FormSkeleton` | Form loading composition |
| `ConnectionError` | Full-screen connection failure |
| `SplashScreen` | Full-screen application splash |

## Display and data

| Component | Purpose |
|---|---|
| `Card`, `CardHeader`, `CardContent`, `CardFooter` | Content grouping primitives |
| `Avatar` | Image/initial avatar with presence |
| `EmptyState` | Empty/no-result state |
| `DataTable` | Searchable, sortable, responsive table preserving oldUi behavior |
| `Separator` | Horizontal/vertical separator |
| `Spinner` | Small standalone spinner |

## Navigation and disclosure

| Component | Purpose |
|---|---|
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | Keyboard-friendly tabs |
| `Accordion`, `AccordionItem` | Single/multiple disclosure |
| `Breadcrumb` family | Application hierarchy |
| `Pagination` | Standalone page navigation |

## Overlay infrastructure

| Component | Purpose |
|---|---|
| `Dropdown` | Shared portal positioning engine used by Select, Combobox, DatePicker, DataTable and ExportButton |
| `Tooltip` | Contextual hover/focus information |
| `Dialog` | Mobile bottom-sheet + desktop modal preserving oldUi behavior |
| `ConfirmDialog` | Destructive/non-destructive confirmation |
| `NotificationPanel` | Notification dropdown panel |

## Theme

| Export | Purpose |
|---|---|
| `ThemeProvider` | Apply theme mode/radius/tokens globally, including portal components |
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
