# Form Controls

This guide documents the intended responsibilities of Digvation form controls and the compatibility rules for existing consumers.

## DInput

`DInput` is the general scalar text-like field. It supports controlled, uncontrolled, and value-only preview/default usage.

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

The visibility button only changes the native `type` between `password` and `text`; it does not replace/remount the input or own the password value. Uncontrolled password input is also supported.

A `value` without `onChange`/`onNativeChange` is intentionally treated as an editable initial/synchronized value instead of a permanently locked React controlled field. This keeps documentation previews and simple defaults editable:

```tsx
<DInput type="password" value="secret123" />
```

For a truly controlled field, provide `value` plus a change handler. For a display-only field, use `readOnly` explicitly.

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
