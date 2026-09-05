# Theme customization

Do not change component source files to rebrand a project. Override semantic tokens instead.

## Brand-only change

```css
:root {
  --color-brand: #0f766e;
  --color-focus: #0f766e;
}
```

## Full project palette

```css
:root {
  --color-background: #f8fafc;
  --color-surface: #ffffff;
  --color-surface-muted: #f1f5f9;
  --color-text: #0f172a;
  --color-text-muted: #64748b;
  --color-border: #e2e8f0;
  --color-brand: #2563eb;
  --color-focus: #2563eb;
  --color-success: #15803d;
  --color-warning: #d97706;
  --color-danger: #dc2626;
}
```

## Radius presets

`DThemeProvider` supports `compact`, `default`, and `rounded`. The same values can be set through the root attribute `data-theme-radius` with `COMPACT`, `DEFAULT`, or `ROUNDED`.

## Dark mode

```tsx
<DThemeProvider mode="dark">
  <App />
</DThemeProvider>
```

You can still override individual dark tokens after the package stylesheet if a project needs a different palette.
