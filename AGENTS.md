# Repository Guidelines

## Project Structure & Module Organization
Inda Home runs on the Next.js pages router with source under `src`. Page-level routes live in `src/pages` (auth flows, orders, profile), while `src/views` assembles screen sections and `src/components` holds shared UI. Utilities sit in `src/helpers`, static config in `src/data`, and shared contracts in `src/types`. Store media in `src/assets`, global styles and Tailwind entry points in `src/styles`, and static files in `public`. Workflow automation resides in `.github/workflows`.

## Build, Test, and Development Commands
Install dependencies once with `npm install`. Use `npm run dev` to launch Turbopack on http://localhost:9007 for local work. `npm run build` generates the production bundle, followed by `npm run start` to serve it. Run `npm run lint` before committing to enforce Next.js ESLint rules.

## Coding Style & Naming Conventions
TypeScript is required; add explicit interfaces or types in `src/types` when sharing structures. Components and pages use PascalCase filenames (`OrdersTable.tsx`), hooks and helpers use camelCase. Stick to two-space indentation and prefer named exports except for page-level defaults. Tailwind v4 classes drive styling?lean on utility-first patterns and centralize tokens in `tailwind.config.js` instead of ad-hoc CSS.

## Testing Guidelines
Automated tests are not yet wired. When adding coverage, colocate React Testing Library or Cypress specs alongside the component (`Component.test.tsx`) or within a new `tests/` directory. Perform manual smoke checks for auth and order workflows, and document results or screenshots in the PR description.

## Commit & Pull Request Guidelines
Use conventional commits (`feat:`, `fix:`, `chore:`) as seen in history, keeping messages imperative and referencing tickets when available (`feat: add receipt modal (INDA-123)`). Each PR should outline the change set, list verification steps (`npm run lint`, manual QA), and attach visual diffs for UI updates. Request reviews from the relevant owner and confirm CI passes before merging
