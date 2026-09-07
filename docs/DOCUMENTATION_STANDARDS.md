# Documentation standards

The documentation app is a consumer of `@digvation/ui` and should exercise the same public API that product applications use.

## Dogfooding rule

Use an existing `D*` component whenever the documentation UI needs the same interaction primitive.

Examples:

- buttons and actions -> `DButton`
- text/search/number fields -> `DInput` or `DSearchInput`
- select controls -> `DSelect`
- boolean controls -> `DCheckbox` or `DToggle`
- tabs -> `DTabs` when a full tab interaction is needed
- cards, alerts, badges and feedback -> their matching `D*` components

A raw native element is acceptable only when there is no equivalent public design-system primitive yet, or when the native element is the subject under test. The theme color picker currently uses native `input[type="color"]` because `DColorPicker` does not exist.

## Playground contract

Each component section keeps documentation in one place:

- Preview: live component plus meaningful editable props
- Code: code reflecting the current Preview configuration where available
- Props: generated public TypeScript API
- Functions: exported helpers plus callback/event observations

Do not reintroduce a separate global Component Lab window. Component experimentation belongs inside the component section playground.

## Styling rule

Docs CSS may arrange documentation layout, but it must not restyle the internal structure of `D*` controls. Prefer wrapper/layout classes over generic selectors such as `.theme-controls input`, `.theme-controls select`, or `.playground-controls button` that can accidentally override component styling.
