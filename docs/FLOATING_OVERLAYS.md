# Floating Overlays

Digvation anchored overlays share one positioning implementation. Individual components must not duplicate `getBoundingClientRect()`/scroll listener logic.

## Scroll behavior

Anchored components expose `scrollBehavior` when consumers need to override the default.

```ts
type FloatingScrollBehavior = 'reposition' | 'close' | 'lock';
```

### reposition

Keep the overlay open and follow its anchor while window or nested scroll containers move.

```tsx
<DSelect scrollBehavior="reposition" ... />
<DCombobox scrollBehavior="reposition" ... />
```

This is the default for form controls because dismissing a selection/search panel during normal page scrolling is usually disruptive.

### close

Close the overlay when the page/ancestor scrolls.

```tsx
<DDropdown
  scrollBehavior="close"
  trigger={() => <DButton>Actions</DButton>}
>
  ...
</DDropdown>
```

This is useful for short-lived action menus. `DSelectFilter` defaults to `close` because toolbar filters often live in horizontally/vertically moving data surfaces.

### lock

Prevent document scrolling for the lifetime of the anchored overlay while preserving page width with scrollbar compensation.

```tsx
<DDropdown scrollBehavior="lock" ... />
```

Use this sparingly. Normal selects/date pickers should not normally lock the page. `DDialog` has its own modal scroll/focus lifecycle and does not use `DDropdown`.

## Defaults

| Component | Default |
|---|---|
| `DDropdown` | `reposition` |
| `DSelect` | `reposition` |
| `DCombobox` | `reposition` |
| `DDatePicker` | `reposition` |
| `DRangeDatePicker` | `reposition` |
| `DNotificationPanel` | `reposition` |
| `DSelectFilter` | `close` |

Components that internally use `DDropdown` but do not expose a custom policy inherit `reposition`.

## Positioning guarantees

The shared engine:

- mounts content hidden before its first measurement
- makes content visible only after final first coordinates are available
- uses a portal so parent overflow does not clip panels
- uses fixed positioning against the viewport
- supports top/bottom flipping based on available space
- supports start/end alignment
- clamps horizontal placement inside viewport padding
- supports optional trigger-width matching
- updates after window resize
- observes trigger/panel size changes with `ResizeObserver` when available
- listens to scroll in capture mode so nested scroll containers are handled
- throttles repeated reposition work with `requestAnimationFrame`
- ignores scrolling generated inside the floating panel itself
- cleans listeners/observers/animation frames on close/unmount

## Component guidance

Choose `reposition` for interactions where the user's input/search state should survive a scroll. Choose `close` for transient action menus where maintaining context is less valuable than avoiding detached menus. Use `lock` only when scrolling itself conflicts with the interaction.
