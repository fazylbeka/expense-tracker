# AI evidence appendix

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

## Entry 3: Read-only risk review (Task 4)
TODO (tool/model, exact prompt, raw output, what I verified)