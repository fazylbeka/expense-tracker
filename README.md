# Expense Tracker

A small React + TypeScript + Vite app for tracking expenses with customer-type discounts. No backend, no database, no authentication. Data lives in React state only.

## Features

- Add an expense with description, amount, category (Food, Transport, Study, Other), and customer type (regular, student, premium).
- Discounts applied by customer type: regular 0%, student 10%, premium 20%.
- List expenses in a table with the final amount after discount.
- Per-category totals and overall total.
- Delete any expense.

## Setup

```bash
npm install
```

## Commands

```bash
npm run dev      # start dev server
npm run build    # type-check + production build
npm run test     # run unit tests (Vitest)
npm run lint     # lint with ESLint
```

## Structure

- `src/utils/expenses.ts` — pure functions for discount and totals logic
- `src/components/` — UI components (ExpenseForm, ExpenseTable, Summary)
- `src/App.tsx` — app shell with in-memory state
