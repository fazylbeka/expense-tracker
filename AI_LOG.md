# AI evidence appendix

AI tools used: bolt.new, Claude (Anthropic), GitHub Copilot Chat (VS Code).

## Entry 1: bolt.new, 23 Nov 2026
- **Tool:** bolt.new
- **Prompt summary:** build a small Expense Tracker (React + TypeScript + Vite + Tailwind), logic in `src/utils/expenses.ts` as pure functions, discount by customer type with an if/else chain, Vitest tests, ESLint, README, .gitignore.
- **Output used:** the whole generated project (baseline).
- **Problem found:** `npm install` failed with ETARGET: `@tailwindcss/vite@^3.4.0` does not exist (that plugin exists only for Tailwind 4, the project uses Tailwind 3).
- **Change made:** removed the package from package.json, regenerated package-lock.json (tag `baseline`).
- **Verification:** `npm install`, `npm test` (9 passed), `npm run lint`, `npm run build`, `npm run dev`.

## Entry 2: Claude (Anthropic), 23 Nov 2026
- **Tool:** Claude in the claude.ai chat (Claude Sonnet 5.5).
- **Prompt summary:** help planning the assignment, diagnosing the install error, drafting AGENTS.md, report text and the Task 3 refactoring. Context given: terminal outputs, `expenses.ts`, `ExpenseForm.tsx`, `npm audit` output.
- **Output used:** AGENTS.md template (adapted), findings table, `validateExpense()` code and 4 tests.
- **Problems found:**
  - Claude first stated that the logic had no input validation (finding 5). After I showed `ExpenseForm.tsx` this was wrong: validation exists in the UI. The finding was corrected to "validation only in the UI, not in logic functions".
  - Claude's first assumption that audit issues are dev-only was unverified until I ran `npm audit --omit=dev` (0 vulnerabilities).
- **Changes made:** AGENTS.md (commit `ee347a0`), `validateExpense` refactoring (commit `7539307`).
- **Verification:** `npm test` (13 passed), `npm run lint`, `npm run build`, `git diff baseline --stat`.
- **Note:** AGENTS.md is not loaded automatically by the chat; its text is pasted manually where used.

## Entry 3: GitHub Copilot Chat, read-only risk review (Task 4), 23 Nov 2026
- **Tool:** GitHub Copilot Chat in VS Code, **Ask** mode (no file edits allowed).
- **Model:** Copilot Fusion (Standard). The model picker shows "Copilot Fusion" ("picks or combines the best models for your task") and does not name the underlying model.
- **Context received:** new chat; AGENTS.md, `expenses.ts`, `ExpenseForm.tsx`, `package.json` attached by me. AGENTS.md was attached manually as context (I cannot verify whether this VS Code version loads it automatically).
  Copilot also opened on its own: `App.tsx`, `ExpenseTable.tsx`, `Summary.tsx`, `expenses.test.ts`, `vite.config.ts`, `vitest.config.ts`, `tsconfig.app.json`, `eslint.config.js`, `README.md`, `REPORT.md`, `AI_LOG.md`.
- **Prompt:** "You are doing a READ-ONLY risk review of a small React + TypeScript + Vite expense tracker. Do not modify, create or delete any files and do not propose running destructive commands. Follow the AGENTS.md rules in the attached file. Propose at least 8 candidate risks. For each give: category (correctness / maintainability / security / dependency / agent operations), cause -> event -> consequence, affected file or function, and a command or test I could run to verify it. Mark which ones you are unsure about."
- **Output:** 11 candidate risks (raw text in Appendix A). Copilot stated that no files were changed and no commands were executed. `git status` after the review: On branch main, "Changes not staged for commit: modified: AI_LOG.md" (my own edit); no other changes.
- **Limitations of this review:**
  - Copilot read my own REPORT.md and AI_LOG.md, so risks 10 and 11 were taken from my documents and are not independent findings.
  - Nothing was executed by Copilot; all items are hypotheses until I verified them.
  - No security-category finding was proposed; I added an XSS check myself.
- **Problems found in Copilot's output (my assessment):**
  - Risk 11 ("AGENTS.md not loaded automatically") generalises a note about the claude.ai chat. Copilot itself opened AGENTS.md with a read tool, so for Copilot the claim is inaccurate. Classified as plausible/weak, not confirmed.
  - Risk 2 (`parseFloat("12abc")`): the form uses `<input type="number">`, so ordinary input cannot produce this. Classified as unsupported.
  - Risk 7 (data lost on refresh) is the documented design ("React state only"), not a defect.
  - Risk 8 (no delete confirmation) is a UX preference, not a defect; category "maintainability" is a mismatch.
- **Useful suggestions:** risks 1 (silent rejection), 3 (`Infinity` passes validation), 4 (unknown customer type gets 0%) and 6 (untested functions) point at real code behaviour.
- **Verification (my own runs):**
  - [x] Browser: empty description (amount 5) -> an error message appeared (after mitigation R1)
  - [x] Browser: `<script>alert(1)</script>` as description -> displayed as plain text, no alert
  - [x] Temporary test: `validateExpense('x', Infinity)` -> `null` (Infinity accepted)
  - [x] Temporary test: `discountRate('vip')` -> `0`
  - [x] `node` rounding check: 3 rows of 0.02 (student) show a row sum of 0.06, but the displayed total is 0.05
  - [x] `grep -n "randomUUID" src/App.tsx` -> `src/App.tsx:11` (no fallback)

## Entry 4: Claude (Anthropic), Claude Sonnet 5.5, 23 Nov 2026 (Tasks 4-10)
- **Prompt summary:** classify the Copilot findings, choose the two risks to mitigate, write the tests and fixes for R5 (rounding) and R1 (error message), draft risk register, readiness audit, background-agent plan, release decision and AI reflection. Context given: terminal outputs, source files, Copilot's answer.
- **Output used:** `Math.round(...)` fix in `applyDiscount`, tests for R5 and R1 message texts, `error` state in `ExpenseForm.tsx`, report text for Tasks 4-9.
- **Problems found:** while applying the R5 edit I accidentally deleted `validateExpense` from `expenses.ts`; `npm test` showed 4 failures (`validateExpense is not a function`), `git diff` located the deletion, I restored it. Lint did not catch this; tests did.
- **Verification:** `npm test` 16/16, `npm run lint`, `npm run build`, `git diff`, manual browser checks, commits `2668623` (R5) and `5b94e13` (R1).

### Appendix A: Copilot raw output (final answer, unedited)

The 15 intermediate "Read ... Completed with input" tool-call lines are omitted; the files are listed under "Context received" in Entry 3.

```
No files or repository state were changed; commands were not executed.

### Candidate risks

1. **Correctness — Silent rejection of invalid amounts**
   - **Cause → Event → Consequence:** `ExpenseForm.submit()` calls `parseFloat()` and silently returns when `validateExpense()` fails. **→** A user receives no explanation for why an expense was not added. **→** The UI appears unresponsive and users may submit repeatedly.
   - **Affected:** `ExpenseForm.tsx`, `submit()` and `validateExpense()`.
   - **Verification:** Add a component test that submits blank, zero, negative, and NaN-like amounts and assert that visible validation feedback appears.
   - **Unsure:** No — source confirms the silent return.

2. **Correctness — `parseFloat()` accepts partially numeric input**
   - **Cause → Event → Consequence:** `parseFloat("12abc")` returns `12`, and the HTML number input normally prevents this but programmatic or browser-specific input may bypass validation. **→** A malformed value could be interpreted as a valid amount. **→** Incorrect expense records may be created.
   - **Affected:** `ExpenseForm.tsx`, `submit()`.
   - **Verification:** Unit test `parseFloat("12abc")`/replace parsing with `Number()` semantics, or a browser test dispatching that value into the amount field.
   - **Unsure:** Yes — the browser normally constrains `<input type="number">`, so this may be difficult to trigger through ordinary UI interaction.

3. **Correctness — Infinite or excessively large amounts are not rejected**
   - **Cause → Event → Consequence:** `validateExpense()` checks only `NaN` and `amount <= 0`. **→** `Infinity` or a very large finite number can pass. **→** UI displays `"Infinity"` or inaccurate totals and loses monetary precision.
   - **Affected:** `expenses.ts`, `validateExpense()` and discount/total functions.
   - **Verification:** Add tests for `Infinity`, `Number.MAX_VALUE`, and very large decimal values; run `npm test`.
   - **Unsure:** No for the missing validation; yes for whether normal UI input can realistically submit these values.

4. **Correctness — Discounts permit no runtime validation**
   - **Cause → Event → Consequence:** `discountRate()` silently assigns 0% to every unknown customer type. **→** A manipulated DOM value or future caller bypassing the TypeScript union adds an unknown type. **→** Incorrect discounted totals are displayed.
   - **Affected:** `expenses.ts`, `discountRate()`.
   - **Verification:** Test `discountRate('unknown' as CustomerType)` and assert it throws or is rejected; test a manipulated select value in the browser.
   - **Unsure:** No for current behavior; yes for whether an unknown value can occur through normal UI use.

5. **Correctness — Floating-point monetary calculations may accumulate rounding errors**
   - **Cause → Event → Consequence:** Discounts use raw binary floating-point multiplication and totals sum the results. **→** Long decimals or cent-level totals can display inconsistently. **→** Customers see incorrect cents or totals differing after aggregation.
   - **Affected:** `expenses.ts`, `applyDiscount()`, `totalAfterDiscount()`, and category functions.
   - **Verification:** Add tests with cent values, such as `10.05` at 10% or repeated 0.01 expenses, and compare a defined rounding policy.
   - **Unsure:** Yes — whether the discrepancy exceeds display/acceptance thresholds depends on the intended rounding policy.

6. **Maintainability — Several totals and discount calculations lack direct tests**
   - **Cause → Event → Consequence:** Existing tests cover `discountRate`, `applyDiscount`, `totalAfterDiscount`, `totalByCategory`, and `validateExpense`, but not `totalBeforeDiscount`, `totalByCategoryAfterDiscount`, or category discount edge cases. **→** Future changes can alter summary or table totals unnoticed. **→** Dashboard values can diverge without test failure.
   - **Affected:** `expenses.test.ts` and `expenses.ts`.
   - **Verification:** Run `npm test`; add assertions for before totals, empty-category totals, and discounted category totals.
   - **Unsure:** No — the test file confirms these gaps.

7. **Correctness — Data is lost on page refresh or navigation**
   - **Cause → Event → Consequence:** `App.tsx` stores expenses only in `useState`, with no persistence. **→** Refreshing or closing the page removes all records. **→** The expense tracker silently loses user-entered data.
   - **Affected:** `App.tsx`, `App`.
   - **Verification:** Add an expense, refresh the browser, and verify whether data disappears.
   - **Unsure:** Yes — this is likely intentional under the documented “React state only” requirement, so it is a risk only if persistence is expected.

8. **Maintainability — Accidental deletion has no confirmation or undo**
   - **Cause → Event → Consequence:** `ExpenseTable.tsx` exposes a direct Delete button and `App.tsx` immediately filters it out. **→** One accidental click permanently removes the expense. **→** Users lose record data with no recovery.
   - **Affected:** `ExpenseTable` and `deleteExpense()`.
   - **Verification:** Click Delete and then refresh or attempt to recover the record; there is no undo or confirmation.
   - **Unsure:** Yes — deletion UX requirements were not stated.

9. **Compatibility — ID generation may fail outside supported secure-browser contexts**
   - **Cause → Event → Consequence:** `App.tsx` calls `crypto.randomUUID()` directly. **→** Older browsers or non-secure contexts without that API throw an exception. **→** Adding an expense fails and React state may not update.
   - **Affected:** `App.tsx`, `addExpense()`.
   - **Verification:** Test in a browser environment where `crypto.randomUUID` is unavailable or run a jsdom/component test with it mocked as undefined.
   - **Unsure:** Yes — deployment/browser support is not documented.

10. **Dependency — Current lockfile may contain known vulnerable development tooling**
    - **Cause → Event → Consequence:** `REPORT.md` records six audit findings, primarily in Vitest/Vite/esbuild tooling. **→** Local dev-server or test dependencies may expose known issues. **→** Developer environments or exposed dev servers may be vulnerable even though production dependencies reportedly have zero findings.
    - **Affected:** `package.json`, `package-lock.json`.
    - **Verification:** Run `npm audit` and `npm audit --omit=dev`.
    - **Unsure:** Yes — the report is historical; the audit result should be rechecked before relying on it.

11. **Agent operations — Repository instructions may not be loaded automatically**
    - **Cause → Event → Consequence:** `AI_LOG.md` states that `AGENTS.md` was manually pasted rather than loaded automatically. **→** A future agent may miss prohibited actions or review gates. **→** It could modify dependencies, run destructive commands, or omit the required diff/test review.
    - **Affected:** `AGENTS.md`, agent session setup.
    - **Verification:** Inspect the agent/runtime startup context for an explicit `AGENTS.md` inclusion; search session logs for its content.
    - **Unsure:** No — the evidence states it was not loaded automatically.
```