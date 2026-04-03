import { computeCategorySpending, computeSummary } from '../store/financeUtils'
import { formatCurrency } from './format'

export function buildInsights(transactions) {
  if (transactions.length === 0) {
    return [
      {
        title: 'No activity yet',
        detail:
          'Add transactions or load sample data to see personalized insights.',
        tone: 'neutral',
      },
    ]
  }

  const { balance, income, expenses } = computeSummary(transactions)
  const byCat = computeCategorySpending(transactions)
  const top = byCat[0]

  const byMonth = new Map()
  for (const t of transactions) {
    const m = t.date.slice(0, 7)
    const cur = byMonth.get(m) ?? { inc: 0, exp: 0 }
    if (t.type === 'income') cur.inc += t.amount
    else cur.exp += t.amount
    byMonth.set(m, cur)
  }
  const months = [...byMonth.keys()].sort()
  const last = months[months.length - 1]
  const prev = months[months.length - 2]
  let monthComparison = null
  if (last && prev) {
    const eLast = byMonth.get(last).exp
    const ePrev = byMonth.get(prev).exp
    const delta = ePrev > 0 ? ((eLast - ePrev) / ePrev) * 100 : null
    if (delta !== null) {
      monthComparison =
        delta >= 0
          ? `Spending in ${last} was ${delta.toFixed(0)}% higher than ${prev}.`
          : `Spending in ${last} was ${Math.abs(delta).toFixed(0)}% lower than ${prev}.`
    }
  }

  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0

  const items = []

  if (top) {
    items.push({
      title: 'Top spending category',
      detail: `${top.category} accounts for ${formatPct(top.amount, expenses)} of total expenses.`,
      tone: 'neutral',
    })
  }

  if (monthComparison) {
    items.push({
      title: 'Month over month',
      detail: monthComparison,
      tone: monthComparison.includes('higher') ? 'attention' : 'positive',
    })
  }

  items.push({
    title: 'Savings rate',
    detail:
      income > 0
        ? `You retained about ${savingsRate.toFixed(1)}% of income after expenses (net ${formatCurrency(balance)}).`
        : `Net position is ${formatCurrency(balance)} with recorded activity.`,
    tone: balance >= 0 ? 'positive' : 'attention',
  })

  return items
}

function formatPct(part, whole) {
  if (whole <= 0) return '—'
  return `${Math.round((part / whole) * 100)}%`
}
