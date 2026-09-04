# Validation report

This report reflects the `0.1.1` correction pass after the first real local installation/run report.

## Reported local failures that were corrected

The first local run exposed issues that the original source-only validation did not catch:

- `AccordionItemProps` conflicted with `HTMLAttributes<HTMLDivElement>['title']`.
- Tooltip accessed `children.props` through React 19's default `unknown` props type.
- Dialog focus was deferred with `requestAnimationFrame`, while the interaction test expected focus after React effects had flushed.
- DataTable renders both responsive representations in the DOM, so a plain `getByText('Alya')` was ambiguous in JSDOM.
- Stateful `.focus()` calls in tests produced React `act(...)` warnings.

All five areas are corrected in `0.1.1`.

## Source checks passed in the artifact environment

- 0 `BaseX` implementation references in reusable package source.
- 0 application `@/` imports inside the reusable UI package.
- 0 `react-router` imports inside the reusable UI package.
- 0 broken relative imports.
- Canonical folder/file naming remains intact.
- TypeScript parser check passed across 96 `.ts` / `.tsx` files with 0 syntax diagnostics.
- Tooltip now uses an explicitly typed `ReactElement<TooltipTriggerProps>` before accessing `props`.
- Accordion removes native `title` from the inherited HTML attribute set with `Omit<..., 'title'>`.
- Dialog focuses its dialog surface directly once mounted instead of relying on a deferred animation frame.
- DataTable test now queries the semantic table cell, avoiding the intentional duplicate responsive text node.
- Input/CurrencyInput/Combobox focus tests now wrap stateful native focus in Testing Library `act(...)`.

## Regression tests included

The repository includes Vitest / Testing Library coverage for:

- Input continuous controlled typing
- Decimal and currency input normalization
- Select controlled selection and keyboard navigation
- Combobox controlled selection
- Dialog focus containment / dismissal
- Toast provider show / dismiss behavior
- DataTable generic pagination behavior
- Pagination helper behavior

Run locally with:

```bash
npm run typecheck
npm test
npm run build
npm run dev
```

## Artifact-environment limitation

Dependency installation from npm registry still times out in this artifact environment, so the real React/Vitest/Vite toolchain cannot be executed here. The fixes above were made directly from the exact errors and stack traces produced by the user's real local installation, followed by source parsing and import-integrity checks here.

The authoritative final verification is therefore the same four commands above on a machine with registry access.
