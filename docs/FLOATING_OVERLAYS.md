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

`reposition` is anchor-aware: the panel follows only while at least half of the trigger is still visible inside the viewport and any clipping scroll ancestor. Once the trigger is mostly gone, the panel closes instead of floating detached from its component.

### close

Close the overlay on the first page/ancestor scroll.

```tsx
<DDropdown
  scrollBehavior="close"
  trigger={() => <DButton>Actions</DButton>}
>
  ...
</DDropdown>
```

This is useful for short-lived action menus and large anchored surfaces. `DRangeDatePicker` defaults to `close` because moving a large two-month calendar while the page scrolls is visually distracting. `DSelectFilter` also defaults to `close` because toolbar filters often live in moving data surfaces.

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
| `DRangeDatePicker` | `close` |
| `DNotificationPanel` | `reposition` |
| `DSelectFilter` | `close` |

Components that internally use `DDropdown` but do not expose a custom policy inherit `reposition`.

## Positioning guarantees

The shared engine:

- mounts content hidden before its first measurement
- makes content visible only after final first coordinates are available
- uses a portal so parent overflow does not clip panels
- keeps the panel semantically anchored even though it renders in `document.body`
- closes repositioning panels when the trigger is mostly clipped by the viewport or a scroll ancestor
- uses fixed positioning against the viewport
- supports top/bottom flipping based on available space
- keeps oversized panels on one side of the trigger instead of sliding them across/over it
- constrains oversized panel height to the available side and allows internal scrolling
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

Choose `reposition` for compact interactions where the user's input/search state should survive a small scroll. Choose `close` for transient menus or large overlays where preserving a detached-looking surface is worse than dismissing it. Use `lock` only when scrolling itself conflicts with the interaction.
