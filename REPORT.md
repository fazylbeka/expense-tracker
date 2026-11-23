# Software Engineering - Assignment #05
**Student:** <Fazylbek Assylzat>
**Project:** Expense Tracker (React + TypeScript + Vite 5 + Tailwind 3), generated with bolt.new
**Date:** 23 November 2026

## 0. Baseline

| Tag | Commit | Description |
|---|---|---|
| `bolt-original` | `26dae7a` | Original bolt.new export. `npm install` fails (ETARGET). |
| `baseline` | `09faf82` | Working starting point: invalid `@tailwindcss/vite` removed from package.json, package-lock.json regenerated. |
| (AGENTS.md) | `ee347a0` | Task 2 |
| (Task 3) | `7539307` | Task 3 refactoring |

Change between `bolt-original` and `baseline`: removed `"@tailwindcss/vite": "^3.4.0"` (package.json line 18). The project uses Tailwind 3 (`tailwind.config.js`, `postcss.config.js`, `@tailwind base;` in `src/index.css`), so this plugin (Tailwind 4 only) was not needed.

Run/test/build commands: `npm install`, `npm run dev`, `npm test`, `npm run lint`, `npm run build`.

## Task 1. Baseline and context

### Repository map

| Path | Role |
|---|---|
| `src/main.tsx` -> `src/App.tsx` | Entry point, app state |
| `src/components/ExpenseForm.tsx` | Form + input check |
| `src/components/ExpenseTable.tsx`, `Summary.tsx` | Table and totals UI |
| `src/utils/expenses.ts` | Business logic (pure functions: discounts, totals) |
| `src/utils/expenses.test.ts` | Vitest unit tests |
| `vite.config.ts`, `vitest.config.ts`, `tsconfig*.json`, `eslint.config.js` | Build, test, type and lint config |
| `tailwind.config.js`, `postcss.config.js`, `src/index.css` | Styling |
| `.bolt/` | bolt.new metadata |

### Commands and actual results (baseline `09faf82`)

**`npm install` on `bolt-original`:**
```
npm error code ETARGET
npm error notarget No matching version found for @tailwindcss/vite@^3.4.0.
npm error notarget In most cases you or one of your dependencies are requesting
npm error notarget a package version that doesn't exist.
```
After the fix:
```
added 339 packages, and audited 340 packages in 33s
6 vulnerabilities (3 moderate, 1 high, 2 critical)
```

**`npm run dev`:** `VITE v5.4.21 ready in 226 ms`, Local: http://localhost:5173/

**`npm test`:**
```
 ✓ src/utils/expenses.test.ts (9)
 Test Files  1 passed (1)
      Tests  9 passed (9)
```

**`npm run lint`:** no output (no errors or warnings).

**`npm run build`:**
```
✓ 35 modules transformed.
dist/assets/index-CqQcd1rQ.js   148.88 kB │ gzip: 47.41 kB
✓ built in 412ms
```

**`npm audit`** (summary): moderate in `@vitest/mocker`, `esbuild` (dev server can be queried by any website, GHSA-67mh-4wv8-2f99); critical in `tinypool` (prototype pollution, GHSA-5gmw-xhrv-c9v3). Fix needs `npm audit fix --force` (vitest 5, vite 8: breaking), not run.
**`npm audit --omit=dev`:** `found 0 vulnerabilities`.

### Findings

| # | Finding | Evidence | Status |
|---|---|---|---|
| 1 | `npm install` failed on the original export: `@tailwindcss/vite@^3.4.0` does not exist | ETARGET error; package.json line 18 (tag `bolt-original`) | Fact |
| 2 | `npm audit`: 6 vulnerabilities (3 moderate, 1 high, 2 critical) in vitest, vite, esbuild, tinypool | `npm audit` output | Fact |
| 3 | These vulnerable packages are dev-only, not in the production dependencies | `npm audit --omit=dev` -> 0 vulnerabilities | Fact |
| 4 | `discountRate` is an if/else chain; an unknown customer type silently gets 0% | `src/utils/expenses.ts`, `discountRate()` | Fact |
| 5 | Validation existed only in the UI; logic functions accept negative/NaN amounts | `ExpenseForm.tsx` `submit()`; no checks in `expenses.ts` | Fact |
| 6 | Invalid input is rejected silently (`submit()` just returns, no message) | `ExpenseForm.tsx` | Fact by code reading; not tried in browser |
| 7 | Validation rule inside the React component and not unit-tested | `ExpenseForm.tsx`; no validation tests in `expenses.test.ts` | Fact |
| 8 | No rounding: `amount * (1 - rate)` may give long decimals | `applyDiscount()` | Plausible, not yet run |
| 9 | `totalBeforeDiscount` and `totalByCategoryAfterDiscount` have no tests | `npm test` lists only 4 tested functions | Fact |
| 10 | `totalByCategory` and `totalByCategoryAfterDiscount` are near-duplicates | `src/utils/expenses.ts` | Fact |
| 11 | Build cache `tsconfig.*.tsbuildinfo` and `.bolt/` are committed to git | `git commit` output of `bolt-original` | Fact |
| 12 | Outdated eslint 9.39.5 (deprecated warning) | `npm install` output | Fact |

### Acceptance criteria
1. `discountRate`: regular 0%, student 10%, premium 20%.
2. `totalAfterDiscount` sums discounted amounts; empty list gives 0.
3. `totalByCategory` groups raw amounts by category.
4. `npm test`, `npm run lint`, `npm run build` pass.

## Task 2. Agent instructions
`AGENTS.md` is in the repository root (commit `ee347a0`). It covers purpose, architecture, setup, safe commands, conventions, test expectations, forbidden actions (secrets, deployments, destructive commands, `npm audit fix --force`, unreviewed dependency changes) and review gates.
Disclosure: AGENTS.md is not loaded automatically by the chat assistant; its text was pasted manually into the prompt (see AI_LOG.md).

## Task 3. Focused pattern decision
- **Problem:** the validation rule (empty description, NaN, amount <= 0) was inside `ExpenseForm.tsx`: mixed UI and business logic, untested.
- **Strategy for discounts:** evaluated and rejected. There are only 3 fixed rates; a lookup table would be enough, a Strategy would add classes without benefit.
- **Change (one refactoring):** extracted `validateExpense(description, amount)` into `src/utils/expenses.ts`; `ExpenseForm.tsx` now calls it; 4 unit tests added. Commit `7539307`.
- **Before:** 9 tests, rule in the component. **After:** 13 tests, rule is a pure tested function.
- `git diff baseline --stat`: `ExpenseForm.tsx` 4 lines changed, `expenses.test.ts` +16, `expenses.ts` +7.

**After the change (actual output):**
```
 ✓ src/utils/expenses.test.ts (13)
   ✓ validateExpense (4)
 Test Files  1 passed (1)
      Tests  13 passed (13)
```
`npm run lint`: no output. `npm run build`: `✓ 35 modules transformed ... ✓ built in 352ms`.
Acceptance criteria 1-4 still hold (tests, lint and build pass).

## Task 4. Read-only risk review
TODO

## Task 5. Risk register
TODO

## Task 6. Agent-readiness audit
TODO

## Task 7. Mitigation and verification
TODO

## Task 8. Background agent safeguards
TODO

## Task 9. Release decision
TODO

## Task 10. AI reflection (200-300 words)
TODO