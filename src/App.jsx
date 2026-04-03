import { useDispatch, useSelector } from 'react-redux'
import { BarChart3, Moon, Sun, Monitor } from 'lucide-react'
import { ChartsPanel } from './components/ChartsPanel'
import { InsightsPanel } from './components/InsightsPanel'
import { SummaryCards } from './components/SummaryCards'
import { TransactionsPanel } from './components/TransactionsPanel'
import { useThemeClass } from './hooks/useThemeClass'
import { setRole, setTheme } from './store/financeSlice'

function ThemeCycleButton() {
  const theme = useSelector((s) => s.finance.theme)
  const dispatch = useDispatch()

  const order = ['system', 'light', 'dark']
  const next = order[(order.indexOf(theme) + 1) % order.length]
  const labels = {
    system: 'Theme: system',
    light: 'Theme: light',
    dark: 'Theme: dark',
  }
  const Icon =
    theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <button
      type="button"
      onClick={() => dispatch(setTheme(next))}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      title={labels[theme]}
      aria-label={`${labels[theme]}. Click for ${labels[next]}.`}
    >
      <Icon className="h-4 w-4" aria-hidden />
      <span className="hidden sm:inline capitalize">{theme}</span>
    </button>
  )
}

export default function App() {
  const transactions = useSelector((s) => s.finance.transactions)
  const role = useSelector((s) => s.finance.role)
  const theme = useSelector((s) => s.finance.theme)
  const dispatch = useDispatch()

  useThemeClass(theme)

  return (
    <div className="min-h-svh font-sans">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-slate-50/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <BarChart3 className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold leading-tight text-slate-900 dark:text-white">
                Finance dashboard
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Summary, trends, and transactions
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <label className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 dark:text-slate-400">Role</span>
              <select
                value={role}
                onChange={(e) => dispatch(setRole(e.target.value))}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none ring-indigo-500/30 focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="viewer">Viewer (read-only)</option>
                <option value="admin">Admin (edit)</option>
              </select>
            </label>
            <ThemeCycleButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <SummaryCards transactions={transactions} />
        <ChartsPanel transactions={transactions} />
        <InsightsPanel transactions={transactions} />
        <TransactionsPanel />
      </main>

      <footer className="border-t border-slate-200/80 py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
        Mock data for evaluation — no backend.
      </footer>
    </div>
  )
}
