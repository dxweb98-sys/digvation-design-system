# Validation and Localization

`@digvation/ui` keeps validation and localization reusable at the design-system boundary without forcing projects to adopt a specific form or i18n library.

## Form validation

Use `DForm` as the optional native `<form>` coordinator and `DFormField` (or `useDFormField`) to connect any value-bearing component to validation. The field component remains responsible for its normal controlled value API; the validation layer only coordinates rules, errors, and submit behavior.

```tsx
const [values, setValues] = useState({ email: '', role: null });

<DForm
  validateOn={['blur', 'submit']}
  onSubmit={(validValues) => save(validValues)}
>
  <DFormField
    name="email"
    label="Email"
    value={values.email}
    rules={[required(), email()]}
  >
    {({ error, onBlur }) => (
      <DInput
        label="Email"
        value={values.email}
        error={error}
        onBlur={onBlur}
        onChange={(email) => setValues((current) => ({ ...current, email }))}
      />
    )}
  </DFormField>

  <DButton type="submit">Submit</DButton>
</DForm>
```

Controls that already expose `error` (`DInput`, `DTextarea`, `DSelect`, `DCombobox`, `DDatePicker`, `DTimePicker`, `DRangeDatePicker`, and filter controls where applicable) can render the field error directly. Primitive controls such as `DCheckbox`, `DRadio`, `DToggle`, or custom project controls can render `DValidationMessage` next to the control.

### Built-in rules

The public package exports:

- `required()`
- `accepted()`
- `email()`
- `url()`
- `minLength()` / `maxLength()`
- `minValue()` / `maxValue()`
- `integer()`
- `pattern()`
- `sameAs()`
- `oneOf()`
- `date()`
- `time()`
- `customValidation()`
- `validateValue()` for standalone validation

Rules may be synchronous or asynchronous. `customValidation` is the escape hatch for project/domain checks such as checking username availability or validating a business rule against an API.

`DForm` supports `validateOn="submit"`, `"blur"`, `"change"`, or an array of modes. A field may override the form-level mode.

## Localization

`DLocalizationProvider` defaults to Indonesian (`id-ID`). Built-in English (`en`) messages are also included. Calendar month/weekday names and locale-sensitive table date/number presentation are formatted through `Intl`.

```tsx
<DLocalizationProvider locale="en-US">
  <App />
</DLocalizationProvider>
```

Changing `locale` causes components that use design-system static copy to render the new language at runtime.

### Project i18n adapter

The design system intentionally does not depend on i18next, next-intl, react-intl, or another application framework. Adapt the project translator through `translate`:

```tsx
<DLocalizationProvider
  locale={i18n.language}
  translate={(key, params, fallback) =>
    t(`designSystem.${key}`, {
      ...params,
      defaultValue: fallback,
    })
  }
>
  <App />
</DLocalizationProvider>
```

`messages` can override only selected design-system keys when a full translator adapter is unnecessary. Consumer-supplied component props such as `placeholder`, `title`, `emptyMessage`, `confirmLabel`, and `cancelLabel` continue to override built-in localized defaults.

For locales other than the built-in Indonesian/English dictionaries, provide `translate` or `messages`. `Intl` date/month formatting will still follow the supplied BCP-47 locale.
