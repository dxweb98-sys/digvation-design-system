# Contributing to Digvation Design System

This repository is the reusable UI foundation for Digvation products. Consistency is part of the API: naming, behavior, accessibility, theming, tests, Git history, and release discipline are all treated as product requirements.

## Branch model

- `main` — production-ready code only. Every release on `main` must be tagged.
- `develop` — integration branch for the next release.
- `feat/<scope>-<summary>` — additive component/API work from `develop`.
- `fix/<scope>-<summary>` — non-breaking bug fixes from `develop`.
- `refactor/<scope>-<summary>` — internal changes with no intended public behavior change.
- `docs/<summary>` — documentation-only changes.
- `test/<summary>` — test-only changes.
- `chore/<summary>` — tooling/maintenance.
- `release/vX.Y.Z` — release stabilization branch cut from `develop`.
- `hotfix/<scope>-<summary>` — urgent production fix cut from `main`, merged back into both `main` and `develop`.

Do not commit feature work directly to `main`. Avoid vague branch names such as `changes`, `update`, `new`, or personal names. Branch names must communicate intent.

## Pull request flow

1. Sync `develop`.
2. Create the appropriate change branch from `develop`.
3. Keep the branch focused on one coherent change.
4. Add/update tests and docs with the implementation.
5. Run `npm run validate` before opening a PR.
6. Open the PR into `develop` using the repository template.
7. Use squash merge for normal feature/fix branches unless preserving commit history is materially useful.
8. Release branches are merged into `main` only after the release gate passes.

## Conventional commits

Use Conventional Commits:

```text
<type>(<scope>): <imperative summary>
```

Common types:

- `feat(ui): add multi-select control`
- `fix(input): preserve password input typing`
- `fix(floating): keep overlay anchored during scroll`
- `docs(repo): document release workflow`
- `test(combobox): cover stale async responses`
- `refactor(dropdown): share scroll handling`
- `chore(release): prepare v0.3.0-rc.1`

Use `!` and a `BREAKING CHANGE:` footer only when consumers must migrate.

## Source tree rules

```text
packages/ui/src/
├─ <component>/
│  ├─ <component>.tsx
│  ├─ <component>.test.tsx      # when interaction coverage is useful
│  └─ index.ts
├─ internal/                    # non-public reusable implementation details
│  ├─ floating/
│  ├─ focus/
│  ├─ scroll-lock/
│  └─ ...
├─ shared/                      # stable shared types/constants
├─ index.ts                     # public API only
└─ styles.css                   # semantic tokens and package-level styles
```

Rules:

- Folder/file names use `kebab-case`.
- Public React components use `D` + PascalCase (`DInput`, `DSelect`).
- Props/types use PascalCase without a forced `D` prefix (`InputProps`, `SelectOption`).
- Hooks start with `use` (`useFloatingPosition`).
- Boolean variables/props use `is`, `has`, `can`, `should`, or a clear adjective (`disabled`, `clearable`).
- Event handlers use `handleX` internally and `onX` in public props.
- Functions use descriptive verbs (`formatCurrencyInputValue`, `resolvePlacement`).
- Constants use `UPPER_SNAKE_CASE` only for true constants; normal immutable local values use camelCase.
- Avoid abbreviations unless they are domain-standard (`id`, `url`, `aria`).
- One canonical component implementation. Do not add `BaseInput + Input + DInput` layers.
- Internal primitives are not exported publicly unless they are intentionally part of the design-system API.

## Public API rules

- Public React components keep the `D*` prefix.
- Existing public behavior is compatibility-sensitive.
- Additive optional props are preferred over breaking changes.
- Do not depend on application routers, stores, business models, API clients, or feature hooks.
- Do not introduce a data-fetching library dependency just for a UI component. Async controls receive callbacks from consumers.
- Semantic design tokens are the styling contract. Avoid project-specific hard-coded colors.
- Global CSS must not take ownership of consumer layout (`body` overflow, app shell dimensions, sidebar behavior, etc.).

## Form control conventions

Where meaningful, field components use the same concepts and names:

- `label`
- `hint`
- `error`
- `disabled`
- `readOnly`
- `required`
- `size`
- `clearable`
- `loading`

`DSelect` is the simple selection control. `DCombobox` is the searchable/autocomplete control. Async search belongs primarily on `DCombobox`; compatibility props on `DSelect` should not grow into a second combobox implementation.

## Floating UI conventions

All anchored overlays must use the shared floating implementation. Do not implement ad-hoc `getBoundingClientRect()` logic inside individual components.

Supported scroll policies are:

- `reposition` — keep open and follow the anchor.
- `close` — close when the page/ancestor scrolls.
- `lock` — lock document scrolling while the overlay is open.

Each component chooses a sensible default and may expose the policy to consumers.

## Documentation conventions

The docs application is itself a consumer of `@digvation/ui`. Whenever a public `D*` component already exists for an interaction, use that component in documentation controls instead of recreating it with raw HTML. Raw native elements are allowed only when no equivalent design-system primitive exists yet or when the native element is the subject under test.

Component documentation stays inline in each component section using the shared `Preview / Code / Props / Functions` playground. Do not reintroduce a separate global Component Lab window.

See `docs/DOCUMENTATION_STANDARDS.md` for the detailed dogfooding and playground rules.

## Tests and release gate

Before a PR is mergeable:

```bash
npm run validate
```

The validation command must cover typecheck, unit/interaction tests, and build. A release additionally requires a docs build/manual interaction pass for overlays, form controls, and theming.

See `docs/RELEASE_PROCESS.md` for versioning and production flow.