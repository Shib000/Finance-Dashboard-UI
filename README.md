# Finance dashboard

A small, interactive finance dashboard built for a frontend assignment. It uses **mock data** (with optional **local persistence**), focuses on clarity and responsiveness, and includes a lightweight **role simulation** (viewer vs admin).

## Tech stack

- **React 19** (plain **JSX**) + **Vite**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Redux Toolkit** + **react-redux** for state, **redux-persist** for `localStorage` (transactions, role, theme)
- **Recharts** for the balance trend and category charts
- **Lucide** icons

## Getting started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

```bash
npm run build   # production build
npm run preview # serve dist/
```

## Features

### Overview

- **Summary cards**: total balance (income − expenses), total income, total expenses.
- **Balance trend**: area chart of running net balance by month.
- **Spending by category**: donut chart of expenses by category (with legend).

### Transactions

- Table with **date**, **description**, **category**, **type** (income/expense), and **amount**.
- **Search** on description and category.
- **Filters**: type (all/income/expense) and category.
- **Sort** by date or amount (toggle asc/desc).
- **Export CSV** of the currently filtered list.

### Role-based UI (front-end only)

- **Viewer**: read-only — no add/edit/delete controls.
- **Admin**: add transactions, edit, and delete.
- Switch roles from the **Role** dropdown in the header (demonstration only; no real auth).

### Insights

- **Highest spending category** (share of expenses).
- **Month-over-month** spending comparison when enough history exists.
- **Savings rate** / net position from recorded activity.

### State management

Redux store (`src/store/store.js`) combines a **`finance` slice** (`src/store/financeSlice.js`) with **redux-persist** so **transactions**, **role**, and **theme** survive reloads under the persist key `zorvyn-finance`. Filters, search, and sort live in the same slice but are **not** whitelisted for persistence, so they reset on refresh.

### UX details

- **Responsive** layout from mobile to desktop.
- **Empty states**: no data prompts with “Load sample data”; filtered-empty state explains how to adjust filters.
- **Dark mode**: cycles **System → Light → Dark** via the header control (system follows OS preference).

## Project layout

```
src/
  components/     # UI sections (summary, charts, transactions, dialogs)
  data/             # Seed / mock transactions
  hooks/            # Theme class sync with `document.documentElement`
  lib/              # Formatting and insight helpers
  store/            # Redux store, finance slice, selectors, chart helpers
```

## Assumptions

- Currency is **USD** for display and CSV export.
- Dates are stored as `YYYY-MM-DD` strings; charts aggregate by calendar month.

## License

Evaluation / assignment use only.
