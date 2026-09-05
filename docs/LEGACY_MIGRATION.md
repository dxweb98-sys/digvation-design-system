# Digvation NewUi — canonical migration

OldUi is no longer kept as a second `Base*` API. Its reusable behavior, logic, styling intent, and props are merged directly into the canonical NewUi components.

## Naming convention

- folder: kebab-case, e.g. `range-date-picker/`
- implementation: matching kebab-case file, e.g. `range-date-picker.tsx`
- component/type: PascalCase, e.g. `DRangeDatePicker`, `RangeDatePickerProps`
- named exports only
- one implementation per component

## OldUi -> canonical NewUi

- `BaseInput` -> `DInput`
- `BaseTextarea` -> `DTextarea`
- `BaseSearchInput` -> `DSearchInput`
- `BaseSelect` -> `DSelect`
- `BaseAutocomplete` -> `DCombobox`
- `BaseDropdown` -> `DDropdown`
- `BaseDatePicker` -> `DDatePicker`
- `BaseRangeDatePicker` -> `DRangeDatePicker`
- `BaseToggle` -> `DToggle`
- `BaseButton` -> `DButton`
- `BaseBadge` -> `DBadge`
- `BaseSkeleton` -> `DSkeleton`
- `BaseDialog` -> `DDialog`
- `DDataTable` -> `DDataTable`
- `BaseSelectFilter` -> `DSelectFilter`
- `DToastContainer` -> `DToastContainer`
- `DSplashScreen` -> `DSplashScreen`

The other generic old components are available directly as `DConfirmDialog`, `DConnectionError`, `DDateRangeFilter`, `DExportButton`, `DInfoNote`, `DNotificationPanel`, and `DStatusFilter`.

## Important callback compatibility

`DInput` intentionally keeps oldUi's value-first callback:

```tsx
<DInput onChange={(value, event) => setValue(value)} />
```

When a native React change event is specifically needed, use the additive `onNativeChange` prop:

```tsx
<DInput onNativeChange={(event) => setValue(event.target.value)} />
```

`DTextarea` follows the same rule. `DSelect` keeps the old `onChange(value)` contract and also exposes `onValueChange(value)` as an additive convenience.

## Shared foundation

There is no parallel Base component tree. Cross-component foundations are shared directly:

- `dropdown/` — one positioning/open-close/context engine used by DSelect, DCombobox, DDatePicker, DRangeDatePicker, DDataTable menus, DExportButton, and DSelectFilter.
- `shared/field-size.ts` — one input sizing definition used across field components.

## Intentionally not moved into reusable UI

`PaymentDialog`, `ReceiveItemDialog`, and the router-bound old `KpiCards` depend on Digvation application hooks/types/router state. They should live in the application feature layer and consume these canonical UI components rather than making the UI package depend on application code.
