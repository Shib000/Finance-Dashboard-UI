import { useDispatch, useSelector } from 'react-redux'
import {
  BarChart3,
  ListChecks,
  Lightbulb,
  LayoutDashboard,
  X,
  User,
  Settings2,
} from 'lucide-react'
import { setRole, setTheme } from '../store/financeSlice'

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
    theme === 'dark' ? Settings2 : theme === 'light' ? BarChart3 : User

  return (
    <button
      type="button"
      onClick={() => dispatch(setTheme(next))}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900"
      title={labels[theme]}
      aria-label={`${labels[theme]}. Click for ${labels[next]}.`}
    >
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4" aria-hidden />
        <span className="text-slate-600 dark:text-slate-300">
          Dark mode
        </span>
      </span>
      <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
        {theme}
      </span>
    </button>
  )
}

export function SidePanel({ activeView, onChange, onClose }) {
  const role = useSelector((s) => s.finance.role)
  const dispatch = useDispatch()

  const nav = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'transactions', label: 'Transactions', icon: ListChecks },
    { key: 'insights', label: 'Insights', icon: Lightbulb },
  ]

  return (
    <aside
      className={[
        'flex h-full flex-col rounded-2xl border border-slate-200/80 bg-gradient-to-b from-indigo-50/70 to-white p-4 shadow-sm dark:border-slate-800 dark:from-indigo-950/30 dark:to-slate-900/40',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <BarChart3 className="h-5 w-5" aria-hidden />
          </div>
          <div className="leading-tight">
            <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-slate-900 dark:text-white">
              Finance
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dashboard
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      <nav className="mt-4 space-y-1" aria-label="Primary navigation">
        {nav.map((item) => {
          const Icon = item.icon
          const active = activeView === item.key
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={[
                'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors',
                active
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-indigo-50/80 dark:text-slate-200 dark:hover:bg-indigo-950/30',
              ].join(' ')}
              aria-current={active ? 'page' : undefined}
            >
              <span
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-xl',
                  active
                    ? 'bg-white/10'
                    : 'bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="mt-4 border-t border-slate-200/80 pt-4 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          Role
        </div>
        <select
          value={role}
          onChange={(e) => dispatch(setRole(e.target.value))}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none ring-indigo-500/30 focus:ring-2 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-100"
          aria-label="Select role"
        >
          <option value="viewer">Viewer (read-only)</option>
          <option value="admin">Admin (edit)</option>
        </select>

        <div className="mt-3">
          <ThemeCycleButton />
        </div>
      </div>

      <p className="mt-auto pt-4 text-xs text-slate-500 dark:text-slate-400">
        Mock data only. No backend.
      </p>
    </aside>
  )
}

