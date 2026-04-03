import { Lightbulb } from 'lucide-react'
import { buildInsights } from '../lib/insights'

const toneRing = {
  positive:
    'border-emerald-200/80 bg-emerald-50/80 dark:border-emerald-900/50 dark:bg-emerald-950/40',
  attention:
    'border-amber-200/80 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/40',
  neutral:
    'border-slate-200/80 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800/40',
}

export function InsightsPanel({ transactions }) {
  const items = buildInsights(transactions)

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-2">
        <Lightbulb
          className="h-5 w-5 text-amber-500 dark:text-amber-400"
          aria-hidden
        />
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-900 dark:text-white">
          Insights
        </h2>
      </div>
      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
        Quick takeaways from your data
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.title}
            className={`rounded-xl border p-4 ${toneRing[item.tone ?? 'neutral']}`}
          >
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {item.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {item.detail}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
