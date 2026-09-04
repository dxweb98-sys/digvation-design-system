# Changelog

## 0.1.1

Validation hotfix based on the first real local install/run pass.

- Fixed `AccordionItemProps` collision with the native HTML `title` attribute.
- Fixed React 19 typing for Tooltip trigger props and made the hover-delay timer persistent/cleaned up.
- Made Dialog initial focus deterministic instead of deferring it with `requestAnimationFrame`.
- Updated DataTable regression test to query the desktop table cell semantically while retaining responsive mobile + desktop rendering.
- Wrapped stateful focus interactions in `act(...)` in interaction tests.
- Removed redundant deferred refocus after Combobox selection.

The component API, oldUi behavior contract, theme tokens, and canonical component naming are unchanged.
