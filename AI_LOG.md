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

## Entry 3: GitHub Copilot Chat, read-only risk review (Task 4), 23 Nov 2026
- **Tool:** GitHub Copilot Chat in VS Code, **Ask** mode (no file edits allowed).
- **Model:** <WRITE THE MODEL NAME SHOWN IN THE COPILOT MODEL PICKER>
- **Context received:** new chat; AGENTS.md, `expenses.ts`, `ExpenseForm.tsx`, `package.json` attached by me. AGENTS.md was attached manually as context (I cannot verify whether this VS Code version loads it automatically).
  Copilot also opened on its own: `App.tsx`, `ExpenseTable.tsx`, `Summary.tsx`, `expenses.test.ts`, `vite.config.ts`, `vitest.config.ts`, `tsconfig.app.json`, `eslint.config.js`, `README.md`, `REPORT.md`, `AI_LOG.md`.
- **Prompt:** "You are doing a READ-ONLY risk review of a small React + TypeScript + Vite expense tracker. Do not modify, create or delete any files and do not propose running destructive commands. Follow the AGENTS.md rules in the attached file. Propose at least 8 candidate risks. For each give: category (correctness / maintainability / security / dependency / agent operations), cause -> event -> consequence, affected file or function, and a command or test I could run to verify it. Mark which ones you are unsure about."
- **Output:** 11 candidate risks (raw text in Appendix A). Copilot stated that no files were changed and no commands were executed. `git status` after the review: <PASTE OUTPUT, should show a clean tree>
- **Limitations of this review:**
  - Copilot read my own REPORT.md and AI_LOG.md, so risks 10 and 11 were taken from my documents and are not independent findings.
  - Nothing was executed by Copilot; all items are hypotheses until I verified them.
  - No security-category finding was proposed; I added an XSS check myself.
- **Problems found in Copilot's output (my assessment):**
  - Risk 11 ("AGENTS.md not loaded automatically") generalises a note about the claude.ai chat. Copilot itself opened AGENTS.md with a read tool, so for Copilot the claim is inaccurate. Classified as plausible/weak, not confirmed.
  - Risk 2 (`parseFloat("12abc")`): the form uses `<input type="number">`, so ordinary input cannot produce this. Candidate for unsupported.
  - Risk 7 (data lost on refresh) is the documented design ("React state only"), not a defect.
  - Risk 8 (no delete confirmation) is a UX preference, not a defect; category "maintainability" is a mismatch.
- **Useful suggestions:** risks 1 (silent rejection), 3 (`Infinity` passes validation), 4 (unknown customer type gets 0%) and 6 (untested functions) point at real code behaviour.
- **Verification (to be filled with real output):**
  - [ ] Browser: empty description -> result: <...>
  - [ ] Browser: `<script>alert(1)</script>` as description -> result: <...>
  - [ ] `validateExpense('x', Infinity)` -> result: <...>
  - [ ] `discountRate('vip')` -> result: <...>
  - [ ] rounding check -> result: <...>
  - [ ] `grep randomUUID src/App.tsx` -> result: <...>

### Appendix A: Copilot raw output

Paste here, unedited, the final answer of Copilot (from "No files or repository state were changed..." to the end of risk 11) inside a code block. The 15 intermediate "Read ... Completed with input" lines can be left out: they are listed under "Context received".