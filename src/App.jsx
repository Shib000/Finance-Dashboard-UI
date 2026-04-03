import { useSelector } from 'react-redux'
import { BarChart3, Menu } from 'lucide-react'
import { ChartsPanel } from './components/ChartsPanel'
import { InsightsPanel } from './components/InsightsPanel'
import { SummaryCards } from './components/SummaryCards'
import { TransactionsPanel } from './components/TransactionsPanel'
import { SidePanel } from './components/SidePanel'
import { useThemeClass } from './hooks/useThemeClass'
import { useState } from 'react'

export default function App() {
  const transactions = useSelector((s) => s.finance.transactions)
  const theme = useSelector((s) => s.finance.theme)
  const [activeView, setActiveView] = useState('overview')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useThemeClass(theme)

  return (
    <div className="min-h-svh font-sans">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-slate-50/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 lg:hidden dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" aria-hidden />
            </button>
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

          <div className="hidden sm:block text-sm text-slate-600 dark:text-slate-300">
            {activeView === 'overview'
              ? 'Overview'
              : activeView === 'transactions'
                ? 'Transactions'
                : 'Insights'}
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
        <div className="hidden w-80 lg:block">
          <SidePanel activeView={activeView} onChange={setActiveView} />
        </div>

        <main className="min-w-0 flex-1 space-y-8">
          {activeView === 'overview' && (
            <>
              <SummaryCards transactions={transactions} />
              <ChartsPanel transactions={transactions} />
              <InsightsPanel transactions={transactions} />
            </>
          )}

          {activeView === 'transactions' && <TransactionsPanel />}

          {activeView === 'insights' && (
            <>
              <InsightsPanel transactions={transactions} />
            </>
          )}
        </main>
      </div>

      <footer className="border-t border-slate-200/80 py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
        Mock data for evaluation — no backend.
      </footer>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation overlay"
          />
          <div className="absolute left-3 right-3 top-3 bottom-3">
            <SidePanel
              activeView={activeView}
              onChange={(v) => {
                setActiveView(v)
                setMobileNavOpen(false)
              }}
              onClose={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
