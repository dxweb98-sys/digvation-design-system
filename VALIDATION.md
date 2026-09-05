# Validation report — v0.2.0

## Fixes included

This package directly addresses the runtime issues reported from the v0.1.x documentation preview:

- dropdowns appeared far from their trigger on first open,
- accordion icon/animation felt broken,
- dialog scroll locking shifted the whole page horizontally,
- notification panel was clipped/not visible,
- variants were incomplete,
- component naming was not distinctive enough for consuming projects.

## Static validation completed in the artifact environment

- 100 `.ts` / `.tsx` files parsed with TypeScript: **0 syntax diagnostics**.
- Relative import integrity check: **0 broken relative imports**.
- Public component implementation scan: canonical React component declarations use the `D*` prefix.
- No `BaseInput`/`BaseSelect`/parallel compatibility implementation layer was reintroduced.
- Core floating positioning is shared by `DDropdown`; `DNotificationPanel` uses the same internal floating hook.
- No npm package registry access is required to inspect/build the ZIP contents themselves.

## Regression tests included

The test suite includes existing coverage for input/select/combobox/dialog/toast/table/pagination plus v0.2.0 overlay regression cases:

- DDropdown first-open positioning is visible only after positioning.
- DAccordion maintains its content region and updates `aria-expanded`/`aria-hidden` correctly.
- DNotificationPanel renders in `document.body` and positions from an anchor ref.
- DDialog compensates the browser scrollbar and retains scroll lock through its exit transition.

## Runtime toolchain verification status

A full `npm install` cannot be completed inside this artifact environment because DNS resolution for `registry.npmjs.org` is unavailable (`Could not resolve host`). Therefore React/Vitest/Vite/tsup execution cannot be truthfully marked as executed here.

On a normal development machine with npm registry access, run the authoritative release gate:

```bash
npm install
npm run typecheck
npm test
npm run build
npm run dev
```

Do not publish the package if any of the first three commands fail. The docs dev server is configured for port `4173`.
