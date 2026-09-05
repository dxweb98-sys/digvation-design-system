# Adding a component

Use this checklist when extending the system:

1. Create exactly one canonical component folder under `packages/ui/src/<component-name>/`.
2. Use kebab-case for folders/files and PascalCase for exported React components.
3. Export public APIs from the component `index.ts` and from `packages/ui/src/index.ts`.
4. Use existing semantic CSS variables before introducing new tokens.
5. Reuse shared primitives such as `DDropdown`, `DButton`, `DInput`, and `DSeparator` instead of duplicating their logic.
6. Keep app/domain hooks and business models outside the UI package.
7. Add an interactive documentation example under `apps/docs/src/App.tsx`.
8. Run `npm run typecheck` and `npm run build`.
9. Run `npm run pack:ui` and install the generated tarball into a real project before publishing.
