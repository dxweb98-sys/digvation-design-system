# Form Controls

This guide documents the intended responsibilities of Digvation form controls and the compatibility rules for existing consumers.

## DInput

`DInput` is the general scalar text-like field. It supports both controlled and uncontrolled usage.

### Password

```tsx
const [password, setPassword] = useState('');

<DInput
  type="password"
  label="Password"
  value={password}
  onChange={(value) => setPassword(value)}
/>
```

The visibility button only changes the native `type` between `password` and `text`; it does not replace/remount the input or own the password value. Controlled password fields can be deleted, retyped, and toggled without losing their value or remounting the input. Uncontrolled password input is also supported.

A controlled field must update the value it passes back to `DInput`. A fixed `value` combined with a no-op `onChange` intentionally remains fixed, just like a normal React controlled input. For editable examples that do not need external state, use `defaultValue` instead:

```tsx
<DInput type="password" defaultValue="secret123" />
```

For a display-only field, use `readOnly` explicitly.

### Legacy currency format

`format="currency"` keeps the existing callback contract: `onChange` receives the raw digit string while the field displays Indonesian thousands grouping while typing.

```tsx
const [amount, setAmount] = useState('');

<DInput
  label="Amount"
  format="currency"
  value={amount}
  onChange={(rawValue) => setAmount(rawValue)}
/>
```

Typing `1000000` displays `1.000.000` while `amount === '1000000'`.

Use this mode when preserving the old `DInput`/oldUi contract is useful.

## DCurrencyInput

Use `DCurrencyInput` when the application wants a dedicated money field with a canonical decimal-text value and localized presentation.

```tsx
const [amount, setAmount] = useState('125000.5');

<DCurrencyInput
  label="Amount"
  value={amount}
  onValueChange={setAmount}
  currencySymbol="Rp"
/>
```

Default presentation:

```text
raw value: 125000.5
shown:     Rp 125.000,5
```

The field keeps grouping visible while editing. `formatCurrencyInputValue` and `parseCurrencyInputValue` are exported for project-specific form logic.

## DSelect vs DCombobox

Keep responsibilities explicit.

### DSelect

Use for a simple single selection, normally from a static list.

```tsx
<DSelect
  label="Status"
  value={status}
  onChange={setStatus}
  options={[
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ]}
/>
```

`searchable` and `fetchOptions` remain supported for compatibility, but new autocomplete/API-driven experiences should prefer `DCombobox`.

### DCombobox

Use for searchable/autocomplete selection.

```tsx
<DCombobox
  label="Customer"
  value={customerId}
  onChange={setCustomerId}
  options={customers}
/>
```

For remote options:

```tsx
<DCombobox
  label="Customer"
  value={customerId}
  onChange={setCustomerId}
  fetchOptions={(query) => fetchCustomers(query)}
/>
```

Async behavior includes:

- debounced requests (`debounceMs`)
- loading state
- stale-request protection (an older response cannot replace newer results)
- selected-value resolution
- consumer error callback (`onFetchError`)
- customizable error UI (`asyncErrorMessage`)

### Refetch after another field changes

Use `refetchKey` when remote options depend on external form state.

```tsx
<DCombobox
  label="City"
  value={cityId}
  onChange={setCityId}
  refetchKey={countryId}
  fetchOptions={(query) => fetchCities({ countryId, query })}
/>
```

When `countryId` changes while the combobox is open, fresh options are requested. The design system intentionally does not require TanStack Query or another data library; caching/retry policy remains an application concern.

## DDatePicker and DTimePicker

Use `DDatePicker` for a calendar value. Existing consumers keep the date-only behavior because `variant="date"` remains the default and continues to emit `YYYY-MM-DD`.

```tsx
<DDatePicker
  label="Deployment date"
  value={date}
  onChange={setDate}
/>
```

Use `date-hour` when the date only needs hour precision, or `date-time` for hour and minute selection. Both datetime variants use `YYYY-MM-DDTHH:mm`; `date-hour` always writes `:00` minutes.

```tsx
<DDatePicker
  label="Deployment schedule"
  variant="date-time"
  minuteStep={15}
  value={scheduledAt}
  onChange={setScheduledAt}
/>
```

Use `DTimePicker` when no calendar date is needed. Its value contract is always canonical `HH:mm` so consumers do not need different parsing logic between `hour` and `hour-minute` variants.

```tsx
<DTimePicker
  label="Start time"
  variant="hour-minute"
  minuteStep={15}
  value={startTime}
  onChange={setStartTime}
/>
```

`minuteStep` supports `1`, `5`, `10`, `15`, or `30`. The standalone `hour` variant normalizes any incoming minute value to `00` when displayed or emitted.

Both controls reuse the shared `DDropdown` floating engine, semantic field sizing, and existing theme tokens.

## Shared field naming

Where meaningful, form controls use:

```text
label
hint
error
disabled
readOnly
required
size
clearable
loading
```

Do not invent a second name for the same concept in a new form component without a concrete semantic reason.


## Shared validation

Use `DForm` with `DFormField` (or `useDFormField`) when a project wants design-system validation without coupling Digvation UI to React Hook Form, Formik, Zod, or another application library.

```tsx
<DForm validateOn={["blur", "submit"]} onSubmit={save}>
  <DFormField name="email" label="Email" value={emailValue} rules={[required(), email()]}>
    {({ error, onBlur }) => (
      <DInput
        label="Email"
        value={emailValue}
        error={error}
        onBlur={onBlur}
        onChange={setEmailValue}
      />
    )}
  </DFormField>
</DForm>
```

Built-in rules cover required/accepted values, email/URL, min/max length and number values, integers, patterns, same-as/cross-field checks, option membership, date, time, and custom sync/async rules. `validateOn` accepts `submit`, `blur`, `change`, or an array. A field may override the form-level mode.

Components with an `error` prop render validation directly. Primitive controls such as `DCheckbox`, `DRadio`, `DToggle`, and custom project controls can use `DValidationMessage`.

## Localization

`DLocalizationProvider` defaults to `id-ID`. Built-in English messages are provided and the provider accepts a project-owned `translate` adapter so existing i18next, next-intl, react-intl, or internal i18n setup can control Digvation component copy.

```tsx
<DLocalizationProvider
  locale={i18n.language}
  translate={(key, params, fallback) =>
    t(`designSystem.${key}`, { ...params, defaultValue: fallback })
  }
>
  <App />
</DLocalizationProvider>
```

When `locale` changes, localized Digvation component defaults rerender. Consumer-supplied props such as `label`, `placeholder`, `title`, `emptyMessage`, and action labels keep precedence. Calendar names and locale-sensitive table date/number formatting use `Intl`.
