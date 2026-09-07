# Release Process

Digvation Design System follows Semantic Versioning with an explicit pre-1.0 policy so consumers can predict migration risk.

## Version policy

Current package: `@digvation/ui`.

### Before 1.0

- PATCH (`0.2.0 -> 0.2.1`) — backward-compatible bug fixes, documentation fixes, test/tooling fixes that do not alter public behavior.
- MINOR (`0.2.x -> 0.3.0`) — additive public features/components. A breaking change before 1.0 also requires a MINOR bump, an explicit `BREAKING CHANGE` note, and migration documentation.
- MAJOR (`1.0.0`) — first stable API contract.

### After 1.0

Use standard SemVer:

- PATCH — backward-compatible fixes.
- MINOR — backward-compatible features.
- MAJOR — breaking public API/behavior changes.

The workspace root version and `packages/ui/package.json` version must stay aligned for release branches/tags.

## Prerelease identifiers

Use:

```text
X.Y.Z-alpha.N   early integration; API may still move
X.Y.Z-beta.N    feature-complete; compatibility testing
X.Y.Z-rc.N      release candidate; fixes only unless release is aborted
X.Y.Z           production release
```

Example flow:

```text
0.3.0-alpha.1
0.3.0-alpha.2
0.3.0-beta.1
0.3.0-rc.1
0.3.0
```

Do not reuse a published prerelease version. Increment the prerelease number.

## Branch flow

```text
main (production)
  |
  +---- hotfix/... -------------------------+
  |                                          |
  +---- develop (next release) <-------------+
          |
          +---- feat/...
          +---- fix/...
          +---- refactor/...
          |
          +---- release/v0.3.0
                    |
                    +-- alpha/beta/rc validation
                    +-- final version
                    +-- merge -> main + tag v0.3.0
                    +-- merge back -> develop
```

### Normal feature

1. Branch from `develop`.
2. Implement + test + document.
3. PR into `develop`.
4. Merge after `npm run validate` passes.

### Release

1. Cut `release/vX.Y.Z` from `develop`.
2. Set the prerelease version (`X.Y.Z-rc.1` when entering RC).
3. Update `CHANGELOG.md`.
4. Run the full release gate.
5. Only release fixes/documentation/version changes are allowed on the release branch.
6. Set the final version `X.Y.Z`.
7. Merge into `main`.
8. Create annotated tag `vX.Y.Z` on the final release commit.
9. Publish `@digvation/ui` from the tagged commit/package artifact.
10. Merge the release branch back into `develop`.

### Hotfix

1. Branch `hotfix/<summary>` from `main`.
2. Apply the smallest safe fix.
3. Increment PATCH.
4. Run the full release gate.
5. Merge into `main`, tag, and publish.
6. Merge/cherry-pick the fix back into `develop`.

## Release gate

Automated:

```bash
npm ci
npm run validate
npm run pack:ui
```

`npm run validate` must run:

- TypeScript typecheck
- tests
- UI package build
- documentation build

Manual smoke pass:

- DInput: text, password, clear, currency
- DSelect: open/select/clear/keyboard
- DCombobox: local search, async search, stale response protection, refetch
- floating overlays: first open, scroll down/up, nested scrolling, resize, collision/flip
- DDatePicker / DTimePicker / DRangeDatePicker
- DNotificationPanel
- DDialog focus/scroll locking
- light/dark/custom token themes

A release is blocked by TypeScript errors, failing tests, React act warnings, build failures, overlay jumps/clipping, or undocumented breaking changes.

## Changelog

Use Keep a Changelog-style sections:

```text
## [Unreleased]
### Added
### Changed
### Fixed
### Deprecated
### Removed
### Security
```

Move relevant entries from `Unreleased` into the released version at release time.

## Package artifacts

Local production-like verification:

```bash
npm run pack:ui
```

Install the generated `.tgz` into a representative consumer before the final tag for releases that alter packaging, exports, peer dependencies, CSS output, or public types.

Production publishing must come from a clean, validated release commit/tag, not from an arbitrary local working tree.
