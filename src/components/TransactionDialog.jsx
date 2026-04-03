import { useDispatch } from 'react-redux'
import { useState } from 'react'
import {
  CATEGORY_OPTIONS,
  addTransaction,
  updateTransaction,
} from '../store/financeSlice'

function defaults(editing) {
  return {
    date: editing?.date ?? new Date().toISOString().slice(0, 10),
    amount: editing ? String(editing.amount) : '',
    category: editing?.category ?? 'Groceries',
    type: editing?.type ?? 'expense',
    description: editing?.description ?? '',
  }
}

export function TransactionDialog({ editing, onClose }) {
  const dispatch = useDispatch()

  const d = defaults(editing)
  const [date, setDate] = useState(d.date)
  const [amount, setAmount] = useState(d.amount)
  const [category, setCategory] = useState(d.category)
  const [type, setType] = useState(d.type)
  const [description, setDescription] = useState(d.description)

  function handleSubmit(e) {
    e.preventDefault()
    const num = Number.parseFloat(amount)
    if (!Number.isFinite(num) || num <= 0) return

    const payload = {
      date,
      amount: num,
      category,
      type,
      description: description.trim() || '—',
    }

    if (editing) {
      dispatch(updateTransaction({ id: editing.id, ...payload }))
    } else {
      dispatch(addTransaction(payload))
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity dark:bg-black/50"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md rounded-t-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tx-dialog-title"
      >
        <h2
          id="tx-dialog-title"
          className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-900 dark:text-white"
        >
          {editing ? 'Edit transaction' : 'New transaction'}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="text-slate-600 dark:text-slate-400">Type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-indigo-500/30 focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-slate-600 dark:text-slate-400">Date</span>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-indigo-500/30 focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="text-slate-600 dark:text-slate-400">Amount (USD)</span>
            <input
              type="number"
              required
              min={0.01}
              step={0.01}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-indigo-500/30 focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-600 dark:text-slate-400">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-indigo-500/30 focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-slate-600 dark:text-slate-400">Description</span>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this for?"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-indigo-500/30 focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              {editing ? 'Save changes' : 'Add transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
