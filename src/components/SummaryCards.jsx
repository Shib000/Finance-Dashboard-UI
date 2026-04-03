import { Wallet, TrendingDown, TrendingUp } from 'lucide-react'
import { formatCurrency } from '../lib/format'
import { computeSummary } from '../store/financeUtils'

export function SummaryCards({ transactions }) {
  const { balance, income, expenses } = computeSummary(transactions)

  const cards = [
    {
      label: 'Total balance',
      value: formatCurrency(balance),
      sub: 'Income minus expenses',
      icon: Wallet,
      accent: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      label: 'Income',
      value: formatCurrency(income),
      sub: 'All inflows',
      icon: TrendingUp,
      accent: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Expenses',
      value: formatCurrency(expenses),
      sub: 'All outflows',
      icon: TrendingDown,
      accent: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500/10',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map(({ label, value, sub, icon: Icon, accent, bg }) => (
        <div
          key={label}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {label}
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {value}
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {sub}
              </p>
            </div>
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg}`}
            >
              <Icon className={`h-5 w-5 ${accent}`} aria-hidden />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
