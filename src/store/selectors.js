import { createSelector } from '@reduxjs/toolkit'

const selectFinance = (state) => state.finance

export const selectFilteredTransactions = createSelector([selectFinance], (state) => {
  let list = [...state.transactions]

  if (state.filterType !== 'all') {
    list = list.filter((t) => t.type === state.filterType)
  }
  if (state.filterCategory !== 'all') {
    list = list.filter((t) => t.category === state.filterCategory)
  }
  const q = state.searchQuery.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    )
  }

  const mul = state.sortDir === 'asc' ? 1 : -1
  list.sort((a, b) => {
    if (state.sortField === 'amount') {
      return (a.amount - b.amount) * mul
    }
    return (new Date(a.date).getTime() - new Date(b.date).getTime()) * mul
  })

  return list
})
