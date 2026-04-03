import { createSlice } from '@reduxjs/toolkit'
import { seedTransactions } from '../data/mockTransactions'

export const CATEGORY_OPTIONS = [
  'Salary',
  'Freelance',
  'Groceries',
  'Transport',
  'Bills',
  'Entertainment',
  'Health',
  'Shopping',
  'Other',
]

const initialState = {
  transactions: seedTransactions,
  role: 'viewer',
  filterType: 'all',
  filterCategory: 'all',
  searchQuery: '',
  sortField: 'date',
  sortDir: 'desc',
  theme: 'system',
}

export const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.push({
        ...action.payload,
        id: crypto.randomUUID(),
      })
    },
    updateTransaction: (state, action) => {
      const { id, ...patch } = action.payload
      const i = state.transactions.findIndex((tx) => tx.id === id)
      if (i !== -1) {
        Object.assign(state.transactions[i], patch)
      }
    },
    removeTransaction: (state, action) => {
      state.transactions = state.transactions.filter(
        (tx) => tx.id !== action.payload,
      )
    },
    setRole: (state, action) => {
      state.role = action.payload
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload
    },
    setFilterCategory: (state, action) => {
      state.filterCategory = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setSort: (state, action) => {
      const { field, dir } = action.payload
      if (dir) {
        state.sortField = field
        state.sortDir = dir
      } else if (state.sortField === field) {
        state.sortDir = state.sortDir === 'desc' ? 'asc' : 'desc'
      } else {
        state.sortField = field
        state.sortDir = 'desc'
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    resetToSeed: (state) => {
      state.transactions = [...seedTransactions]
    },
  },
})

export const {
  addTransaction,
  updateTransaction,
  removeTransaction,
  setRole,
  setFilterType,
  setFilterCategory,
  setSearchQuery,
  setSort,
  setTheme,
  resetToSeed,
} = financeSlice.actions

export default financeSlice.reducer
