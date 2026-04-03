const CHART_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#f97316',
  '#eab308',
  '#22c55e',
]

export function computeSummary(transactions) {
  let income = 0
  let expenses = 0
  for (const t of transactions) {
    if (t.type === 'income') income += t.amount
    else expenses += t.amount
  }
  return {
    income,
    expenses,
    balance: income - expenses,
  }
}

export function computeCategorySpending(transactions) {
  const map = new Map()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
  }
  const entries = [...map.entries()].sort((a, b) => b[1] - a[1])
  return entries.map(([category, amount], i) => ({
    category,
    amount,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }))
}

export function computeBalanceTrend(transactions) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
  const byMonth = new Map()
  for (const t of sorted) {
    const key = t.date.slice(0, 7)
    const cur = byMonth.get(key) ?? { inc: 0, exp: 0 }
    if (t.type === 'income') cur.inc += t.amount
    else cur.exp += t.amount
    byMonth.set(key, cur)
  }
  const months = [...byMonth.keys()].sort()
  let running = 0
  return months.map((period) => {
    const { inc, exp } = byMonth.get(period)
    running += inc - exp
    return { period, balance: running }
  })
}
