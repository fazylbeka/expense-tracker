# AGENTS.md

## Purpose
Expense Tracker: a small React + TypeScript + Vite + Tailwind 3 web app. Users add expenses; the app applies a discount by customer type and shows totals per category. Data lives in React state only.

## Architecture
- `src/main.tsx` → `src/App.tsx` (entry, state)
- `src/components/` UI only: ExpenseForm, ExpenseTable, Summary
- `src/utils/expenses.ts` business logic as pure functions (discounts, totals)
- `src/utils/expenses.test.ts` Vitest unit tests

## Setup and safe commands
- `npm install`
- `npm run dev` (http://localhost:5173)
- `npm test`
- `npm run lint`
- `npm run build`
- Read-only: `git status`, `git diff`, `git log`, `npm audit`

## Coding conventions
- Business logic stays in `src/utils/`, not in components.
- TypeScript strict; no `any`.
- Keep functions pure and small.
- Run `npm test`, `npm run lint` and `npm run build` before finishing a task.

## Test expectations
- Every change to `src/utils/expenses.ts` needs a unit test.
- Acceptance criteria that must stay true: regular 0% / student 10% / premium 20% discount; totals sum correctly; empty list gives 0; test, lint and build pass.

## Forbidden actions
- Never read, create or commit secrets (`.env`, API keys, tokens).
- No production deployments or publishing.
- No destructive commands (`rm -rf` outside `node_modules`/`dist`, `git reset --hard`, `git push --force`).
- No `npm audit fix --force`.
- No adding, removing or upgrading dependencies without human review.
- Do not edit `package-lock.json` by hand.

## Review gates
- Show the diff and test output before any commit.
- A human approves every merge.