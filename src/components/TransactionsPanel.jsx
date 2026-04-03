import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ArrowDownAZ,
  ArrowUpDown,
  Download,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { formatCurrency, formatDate } from '../lib/format'
import {
  CATEGORY_OPTIONS,
  removeTransaction,
  resetToSeed,
  setFilterCategory,
  setFilterType,
  setSearchQuery,
  setSort,
} from '../store/financeSlice'
import { selectFilteredTransactions } from '../store/selectors'
import { TransactionDialog } from './TransactionDialog'

function exportCsv(rows) {
  const header = ['date', 'amount', 'category', 'type', 'description']
  const lines = [
    header.join(','),
    ...rows.map((r) =>
      [
        r.date,
        r.amount,
        `"${r.category.replace(/"/g, '""')}"`,
        r.type,
        `"${r.description.replace(/"/g, '""')}"`,
      ].join(','),
    ),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

export function TransactionsPanel() {
  const dispatch = useDispatch()
  const transactions = useSelector((s) => s.finance.transactions)
  const filtered = useSelector(selectFilteredTransactions)
  const role = useSelector((s) => s.finance.role)
  const filterType = useSelector((s) => s.finance.filterType)
  const filterCategory = useSelector((s) => s.finance.filterCategory)
  const searchQuery = useSelector((s) => s.finance.searchQuery)
  const sortField = useSelector((s) => s.finance.sortField)
  const sortDir = useSelector((s) => s.finance.sortDir)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const isAdmin = role === 'admin'

  const categoryOptions = useMemo(() => {
    const fromData = new Set(transactions.map((t) => t.category))
    CATEGORY_OPTIONS.forEach((c) => fromData.add(c))
    return ['all', ...[...fromData].sort()]
  }, [transactions])

  const emptyAll = transactions.length === 0
  const emptyFilter = !emptyAll && filtered.length === 0

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-900 dark:text-white">
            Transactions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isAdmin
              ? 'Filter, sort, and manage entries.'
              : 'View-only — switch role to admin to edit.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => exportCsv(filtered)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Download className="h-4 w-4" aria-hidden />
            Export CSV
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setEditing(null)
                setDialogOpen(true)
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 dark:border-slate-800 lg:flex-row lg:flex-wrap lg:items-end">
        <label className="block min-w-[140px] flex-1 text-sm">
          <span className="text-slate-500 dark:text-slate-400">Search</span>
          <span className="relative mt-1 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Description or category"
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-slate-900 outline-none ring-indigo-500/30 focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </span>
        </label>
        <label className="block w-full text-sm sm:w-40">
          <span className="text-slate-500 dark:text-slate-400">Type</span>
          <select
            value={filterType}
            onChange={(e) => dispatch(setFilterType(e.target.value))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label className="block w-full text-sm sm:w-44">
          <span className="text-slate-500 dark:text-slate-400">Category</span>
          <select
            value={filterCategory}
            onChange={(e) => dispatch(setFilterCategory(e.target.value))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All categories' : c}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => dispatch(setSort({ field: 'date' }))}
            className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm font-medium ${
              sortField === 'date'
                ? 'border-indigo-300 bg-indigo-50 text-indigo-800 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-200'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowDownAZ className="h-4 w-4" aria-hidden />
            Date {sortField === 'date' && (sortDir === 'desc' ? '↓' : '↑')}
          </button>
          <button
            type="button"
            onClick={() => dispatch(setSort({ field: 'amount' }))}
            className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm font-medium ${
              sortField === 'amount'
                ? 'border-indigo-300 bg-indigo-50 text-indigo-800 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-200'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowUpDown className="h-4 w-4" aria-hidden />
            Amount {sortField === 'amount' && (sortDir === 'desc' ? '↓' : '↑')}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {emptyAll ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <p className="max-w-sm text-slate-600 dark:text-slate-300">
              You don&apos;t have any transactions yet. Load sample data to explore
              the dashboard, or switch to <strong>Admin</strong> and add your
              own.
            </p>
            <button
              type="button"
              onClick={() => dispatch(resetToSeed())}
              className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Load sample data
            </button>
          </div>
        ) : emptyFilter ? (
          <div className="px-6 py-16 text-center text-slate-600 dark:text-slate-300">
            No transactions match your filters. Try clearing search or changing
            type/category.
          </div>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3 text-right">Amount</th>
                {isAdmin && (
                  <th className="px-5 py-3 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="bg-white transition-colors hover:bg-slate-50/80 dark:bg-slate-900/40 dark:hover:bg-slate-800/60"
                >
                  <td className="whitespace-nowrap px-5 py-3 text-slate-600 dark:text-slate-300">
                    {formatDate(t.date)}
                  </td>
                  <td className="max-w-[200px] truncate px-5 py-3 text-slate-800 dark:text-slate-100">
                    {t.description}
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        t.type === 'income'
                          ? 'font-medium text-emerald-600 dark:text-emerald-400'
                          : 'font-medium text-rose-600 dark:text-rose-400'
                      }
                    >
                      {t.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td
                    className={`px-5 py-3 text-right font-semibold tabular-nums ${
                      t.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '−'}
                    {formatCurrency(t.amount)}
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(t)
                            setDialogOpen(true)
                          }}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                          aria-label={`Edit ${t.description}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => dispatch(removeTransaction(t.id))}
                          className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
                          aria-label={`Delete ${t.description}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {dialogOpen && (
        <TransactionDialog
          key={editing?.id ?? 'new-transaction'}
          editing={editing}
          onClose={() => {
            setDialogOpen(false)
            setEditing(null)
          }}
        />
      )}
    </section>
  )
}
