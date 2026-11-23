# Software Engineering - Assignment #05
**Student:** Fazylbek Assylzat
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
| 6 | Invalid input is rejected silently (`submit()` just returns, no message) | `ExpenseForm.tsx` | Fact at baseline; fixed by mitigation R1 (see Task 7) |
| 7 | Validation rule inside the React component and not unit-tested | `ExpenseForm.tsx`; no validation tests in `expenses.test.ts` | Fact |
| 8 | No rounding: `amount * (1 - rate)` gives long decimals | `applyDiscount()` | Confirmed later: the UI hides decimals with `toFixed(2)`, but displayed rows and total can differ by 0.01 (see Task 4 and Task 7) |
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
Disclosure: AGENTS.md is not loaded automatically by the chat assistant; its text was pasted or attached manually as context (see AI_LOG.md).

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

| (report and AI log) | `758c259` | first report and AI log |
| (AI log) | `553e86d` | Copilot review entry |
| (Mitigation 1, R5) | `2668623` | rounding fix + tests |
| (Mitigation 2, R1) | `5b94e13` | validation message + test |
| `final` | tag on the final report commit | no code changes after `5b94e13` |

## Task 4. Read-only risk review

**Tool:** GitHub Copilot Chat in VS Code, Ask mode, model: Copilot Fusion (Standard; the model picker does not name the underlying model). Prompt, context and raw output: AI_LOG.md, Entry 3. After the review `git status` showed no changes made by Copilot (only my own edit of AI_LOG.md).
**Limits:** Copilot executed no commands; it read my REPORT.md/AI_LOG.md itself, so its risks 10 and 11 are not independent.

| Copilot # | Candidate | Classification | Evidence |
|---|---|---|---|
| 1 | Silent rejection of invalid input | **Confirmed** | `ExpenseForm.tsx` `submit()` at baseline just `return`ed (`git show baseline:src/components/ExpenseForm.tsx`) |
| 3 | `Infinity`/huge amounts accepted | **Confirmed** (function level) | temporary test: `validateExpense('x', Infinity)` -> `null`; UI reachability not verified |
| 4 | Unknown customer type gets 0% | **Confirmed** (function level) | temporary test: `discountRate('vip')` -> `0`; not reachable through the `<select>` |
| 5 | Floating-point/rounding | **Confirmed** | `node` script: 3 rows of 0.02 (student) display 0.02 each (sum 0.06) but total shows 0.05; failing tests before fix (see Task 7) |
| 6 | Untested functions | **Confirmed** | `npm test` list has no test for `totalBeforeDiscount`, `totalByCategoryAfterDiscount` |
| 10 | Dev dependency vulnerabilities | **Confirmed** | `npm audit`: 6 (3 moderate, 1 high, 2 critical); `npm audit --omit=dev`: 0 |
| 9 | `crypto.randomUUID` unavailable | Plausible / unverified | `App.tsx:11`; localhost is a secure context, so not reproducible here |
| 11 | AGENTS.md not auto-loaded | Plausible / weak | Copilot opened AGENTS.md itself with a read tool; claim copied from my AI_LOG.md |
| 2 | `parseFloat("12abc")` | **Unsupported** | field is `<input type="number">`, browser blocks such text |
| 7 | Data lost on refresh | **Unsupported** as risk | documented design: "React state only" |
| 8 | No delete confirmation | **Unsupported** as defect | UX preference, no requirement |
| mine | XSS via description | **Unsupported** | `grep -rn "dangerouslySetInnerHTML\|innerHTML" src` -> no matches; browser test: description `<script>alert(1)</script>` was displayed as plain text in the table, no alert fired |
| mine | Build artifacts and `.bolt/` tracked in git | **Confirmed** | `git ls-files \| grep -E "bolt\|tsbuildinfo"` lists `.bolt/config.json`, `.bolt/memory.md`, `tsconfig.app.tsbuildinfo`, `tsconfig.node.tsbuildinfo` |
| mine | No CI | **Confirmed** | `ls -a`: no `.github/` |

Categories covered: correctness, maintainability, security, dependency, agent operations.

## Task 5. Risk register

Score = likelihood (1-3) x impact (1-3). "Initial" is before mitigation, "Residual" after.

| ID | Cat. | Cause -> Event -> Consequence | Component | Evidence | Initial L x I = S | Mitigation / owner / verification | Residual |
|---|---|---|---|---|---|---|---|
| R1 | correctness | `submit()` returns silently -> user enters invalid data -> nothing happens, no feedback | `ExpenseForm.tsx` | baseline code | 3 x 2 = **6** | **Done.** Error message shown in the form; owner: me; verified by unit test of messages + browser check | L1 x I2 = 2 (form message is not covered by an automated component test) |
| R5 | correctness | discount not rounded -> rows rounded individually, total from raw values -> displayed rows differ from total by 0.01 | `applyDiscount()` | `node` script, 2 failing tests | 2 x 2 = **4** | **Done.** `applyDiscount` rounds to cents; owner: me; verified by 2 tests | L1 x I1 = 1 (`Math.round` on binary floats can be off by half a cent in rare cases; cents-as-integers would be exact) |
| R4 | maintainability | 2 total functions untested -> later refactor -> summary silently wrong | `expenses.test.ts` | `npm test` list | 2 x 2 = 4 | Open. Add tests; owner: me; verify by `npm test` | 4 |
| R6 | dependency | vulnerable vitest/vite/esbuild/tinypool -> dev server/test run exploited -> developer machine exposed | `package.json` | `npm audit` | 2 x 2 = 4 | Open. Fix needs breaking upgrades (vitest 5, vite 8), forbidden by AGENTS.md without review; run dev server only locally; owner: me | 4 (production deps: 0 vulnerabilities) |
| R7 | agent ops | `.tsbuildinfo` and `.bolt/` tracked -> every build dirties the tree -> noisy diffs, harder review | `.gitignore` | `git ls-files` | 3 x 1 = 3 | Open. `git rm --cached` + `.gitignore`; owner: me | 3 |
| R2 | correctness | `validateExpense` accepts `Infinity` -> huge value entered -> total shows `Infinity` | `expenses.ts` | temp test: `null` | 1 x 2 = 2 | Open. Add `Number.isFinite` check + test | 2 |
| R3 | correctness | `discountRate` falls back to 0% for unknown type -> new type added without rate -> wrong total | `expenses.ts` | temp test: `0` | 1 x 2 = 2 | Open. Lookup table / exhaustive check | 2 |
| R8 | dependency | `^` ranges, no CI -> unchecked updates/regressions | `package.json` | no `.github/` | 2 x 1 = 2 | Open. Lockfile mitigates; add CI | 2 |
| R9 | compatibility | `crypto.randomUUID` unavailable (old browser/insecure origin) -> adding fails | `App.tsx:11` | grep | 1 x 2 = 2 | Open. Fallback id | 2 |

**Top two confirmed risks chosen for correction: R1 (score 6) and R5 (score 4).** R5 ties on score with R4 and R6. I chose it because it was reproduced with a command and failing tests and had a one-line fix. R6 needs breaking major upgrades that AGENTS.md forbids without review, and R4 only adds tests.

## Task 6. Agent-readiness audit

| Area | Observation | Evidence |
|---|---|---|
| Readable structure | Good: logic in `src/utils`, UI in `src/components` | repository map (Task 1) |
| README accuracy | README.md was checked against the scripts in package.json; no discrepancies found | README.md |
| Reproducible setup | Works after fix; `package-lock.json` present, but versions use `^`; original export failed to install | ETARGET on `bolt-original` |
| Tests | 16 unit tests, logic only; no component/UI tests; not all functions covered | `npm test` |
| Lint / type / build | `npm run lint` clean, `tsc -b` + `vite build` pass | outputs in Task 7 |
| Logging | None | code review |
| Security safeguards | No secrets, no network calls, React escapes text, 0 production vulnerabilities; dev tooling has 6 | `npm audit` |
| CI | None | no `.github/` |
| AGENTS.md | Has purpose, architecture, safe commands, conventions, forbidden actions and review gates; not verified to be auto-loaded; no CI enforces it | AGENTS.md |

**Readiness level: 2 (Documented).** Instructions, safe/forbidden commands and review gates exist and tests/lint/build run. Level 3 would need automated enforcement and wider tests.
**Missing evidence for level 3:** CI running test/lint/build, UI/component tests, pinned exact dependency versions, proof that the agent tool loads AGENTS.md automatically, cleaned repo (no tracked build cache).

## Task 7. Mitigation and verification

### Mitigation 1: R5 rounding (commit `2668623`)
- AI proposal (Claude): `Math.round(amount * (1 - rate) * 100) / 100` in `applyDiscount`. Reviewed the diff myself.
- Tests added first. **Before fix** (`npm test`): `Tests 2 failed | 13 passed (15)`:
  - `expected 0.018000000000000002 to be 0.02`
  - `expected '0.05' to be '0.06'`
- Problem during the change: my edit also removed `validateExpense` from `expenses.ts`; the next run showed `Tests 4 failed | 11 passed (15)` with `validateExpense is not a function`. `git diff src/utils/expenses.ts` showed the deletion; I restored the function. The tests caught the regression (lint did not).
- **After fix:** `Tests 15 passed (15)`, `npm run lint` clean, `npm run build` ok (`✓ built in 358ms`).

### Mitigation 2: R1 error message (commit `5b94e13`)
- AI proposal (Claude): `error` state in `ExpenseForm.tsx`, show the message already returned by `validateExpense`, plus a unit test for the message texts. Reviewed the diff myself.
- **Before:** `submit()` returned silently without any message (code at tag `baseline`: `git show baseline:src/components/ExpenseForm.tsx`).
- **After:** `Tests 16 passed (16)`, lint clean, `npm run build` ok (`✓ built in 386ms`). Browser (manual): empty description with amount 5 shows an error message; amount 0 with description "test" shows an error message; the message disappears after a valid expense is added.
- Not executed: automated test of the rendered form message (no component-testing library; AGENTS.md forbids adding dependencies without review).

### Baseline vs final
| Stage | Tests | Lint | Build |
|---|---|---|---|
| baseline `09faf82` | 9 passed | clean | ok |
| Task 3 `7539307` | 13 passed | clean | ok |
| after R5 `2668623` | 15 passed | clean | ok |
| final `5b94e13` | 16 passed | clean | ok |

### Updated risk scores
R1: 6 -> 2. R5: 4 -> 1. Others unchanged (see Task 5).
Limitations/trade-offs: rounding uses floats (half-cent edge cases); R1 message verified manually, not by an automated UI test.

## Task 8. Background agent safeguards (hypothetical)

**Task for the agent:** "Add unit tests for `totalBeforeDiscount` and `totalByCategoryAfterDiscount` (risk R4)." No paid background agent is used.

- **Isolation:** separate branch `agent/r4-tests` in its own git worktree (`git worktree add ../expense-tracker-agent -b agent/r4-tests final`); never works on `main`.
- **Allowed files:** only `src/utils/expenses.test.ts`.
- **Allowed commands:** `npm ci`, `npm test`, `npm run lint`, `npm run build`, `git status/diff/log/add/commit` on its own branch, read-only file viewing.
- **Prohibited:** editing `expenses.ts`, `package.json`, `package-lock.json` or config; adding/upgrading dependencies; `npm audit fix --force`; `git push`, force operations, `git reset --hard`; reading `.env` or secrets; network access other than the npm registry; deployment.
- **Limits:** 15 minutes wall-clock, at most 2 fix attempts after a failing check, stop and report instead of widening scope.
- **Artifacts to return:** change summary, full diff, `npm test`/`lint`/`build` logs with pass/fail totals, list of anything not run, risk notes.
- **Human gate:** I review the diff and logs and approve before any merge into `main`; no merge or deployment by the agent.
- **Failure / rollback:** if checks fail or scope is exceeded, the agent stops; I delete the worktree and branch (`git worktree remove`, `git branch -D agent/r4-tests`). If a bad merge slips through, `git revert <commit>`.

## Task 9. Release decision

**Decision: CONDITIONAL** (for the reviewed version `5b94e13`).

- **Evidence for:** 16/16 tests, lint clean, build passes; acceptance criteria 1-4 hold (discount rates, totals, empty list, checks pass); 0 vulnerabilities in production dependencies; two highest-scoring confirmed risks (R1, R5) mitigated and verified; no secrets in the repo.
- **Known limitations and controls:**
  - R4, R2, R3: untested functions and function-level gaps, owner: me, add tests/validation next.
  - R6: dev-tool vulnerabilities, control: use the dev server only on localhost, do not expose it; upgrade only with human review.
  - R7, R8: tracked build cache, no CI, owner: me.
  - R1 residual: form message verified manually only.
- **Why not GO:** no CI and no UI tests, so critical user flows are not automatically verified.
- **Why not NO-GO:** no unmitigated high-score risk remains and all critical checks pass.

## Task 10. AI reflection

I used three AI tools. bolt.new (23 Nov 2026) generated the starting project from a prompt describing an expense tracker with a deliberate if/else discount function. Claude (Sonnet 5.5, claude.ai chat) helped me plan the work, draft AGENTS.md and design the validateExpense refactoring; it saw my terminal outputs and the source of expenses.ts and ExpenseForm.tsx. For the read-only risk review I used GitHub Copilot Chat in Ask mode (model: Copilot Fusion, Standard) with AGENTS.md, expenses.ts, ExpenseForm.tsx and package.json attached; it also opened other repository files by itself.

A useful suggestion was Copilot's finding that validateExpense accepts Infinity and discountRate silently returns 0% for unknown types; I confirmed both with a temporary test. A rounding check I ran with node also found a real mismatch: three expenses of 0.02 showed 0.02 per row but a total of 0.05.

Weak or inaccurate suggestions: Claude first claimed the project had no input validation, but ExpenseForm.tsx already checked input, so I corrected the finding. Copilot's risks about parseFloat("12abc"), data loss on refresh and missing delete confirmation were weak: the number input blocks the first and the others are design choices. Its AGENTS.md risk was inaccurate because Copilot read the file itself, and it copied two risks from my own REPORT.md.

Personally, I ran every command, read the code, reproduced the rounding bug and added failing tests before the fix. Tests changed my decisions: they caught that my edit had deleted validateExpense, and the failing rounding tests proved R5 was real. Repository instructions helped keep the work inside safe commands, but I cannot prove Copilot followed them. Next I would add CI and component tests.