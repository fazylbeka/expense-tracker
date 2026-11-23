# Project memory

## Product intent & audience

- Expense Tracker: small client-side app to add, list, summarize, and delete expenses.
- Audience: users wanting a simple in-memory tracker; project is intentionally minimal (~200-300 lines).
- No backend, database, authentication, API keys, or localStorage; data lives only in React state.

## Brand personality & voice

- Clean, minimal, utility-focused developer/learner-oriented app.
- Tone: straightforward, no marketing copy.

## Visual design & UX direction

- Styling via Tailwind CSS; clean minimal aesthetic.
- Layout: add-expense form, expenses table, and summary section.
- Categories: Food, Transport, Study, Other.
- Customer types: regular, student, premium.
- Show original amount and final amount after discount in the table.
- Summary shows per-category totals and overall total.

## Decisions, constraints & rationale

- Stack: React + TypeScript + Vite (base starter already present).
- Added: Tailwind CSS, Vitest (+ testing library), ESLint; no extra libraries beyond need.
- Business logic isolated as pure functions in `src/utils/expenses.ts`:
  - `calculateDiscount`: if/else chain on customer type (regular 0%, student 10%, premium 20%).
  - Totals and per-category totals computed as pure functions, not inside components.
- UI components split into `src/components/` (add form, expense table, summary).
- npm scripts: `dev`, `build`, `test`, `lint`.
- Vitest version chosen for compatibility with installed Vite version.
- `App.css` removed; Tailwind directives used in CSS.
- README.md includes setup and run commands; `.gitignore` present.

## Open questions & assumptions

- Persistence intentionally omitted; future requests may add localStorage/backend — confirm before adding.
- No currency/locale formatting specified; current implementation is generic.
- No filtering/sorting/editing requested; avoid adding unless asked.