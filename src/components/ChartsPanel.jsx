import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  computeBalanceTrend,
  computeCategorySpending,
} from '../store/financeUtils'
import { formatCurrency } from '../lib/format'

export function ChartsPanel({ transactions }) {
  const trend = computeBalanceTrend(transactions)
  const categories = computeCategorySpending(transactions)

  const empty = transactions.length === 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 lg:col-span-3">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-900 dark:text-white">
          Balance trend
        </h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Running net balance by month
        </p>
        <div className="mt-4 h-72 w-full">
          {empty || trend.length === 0 ? (
            <ChartEmpty message="Add transactions with dates to see your balance trend." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ left: 4, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="balFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-700"
                  vertical={false}
                />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-slate-500"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) =>
                    new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      maximumFractionDigits: 0,
                    }).format(v)
                  }
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-slate-500"
                  axisLine={false}
                  tickLine={false}
                  width={48}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid rgb(226 232 240)',
                    fontSize: 13,
                  }}
                  formatter={(value) => [
                    formatCurrency(Number(value ?? 0)),
                    'Balance',
                  ]}
                  labelFormatter={(l) => `Month ${l}`}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#balFill)"
                  dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 lg:col-span-2">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-900 dark:text-white">
          Spending by category
        </h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Expense breakdown
        </p>
        <div className="mt-4 flex h-72 flex-col items-center justify-center">
          {empty || categories.length === 0 ? (
            <ChartEmpty message="No expense categories yet — try adding a few expenses." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={88}
                  paddingAngle={2}
                >
                  {categories.map((entry, i) => (
                    <Cell key={entry.category + i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value ?? 0))}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid rgb(226 232 240)',
                    fontSize: 13,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        {!empty && categories.length > 0 && (
          <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            {categories.slice(0, 6).map((c) => (
              <li key={c.category} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: c.fill }}
                />
                {c.category}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function ChartEmpty({ message }) {
  return (
    <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/30 dark:text-slate-400">
      {message}
    </div>
  )
}
