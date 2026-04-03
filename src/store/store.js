import { configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist'
import financeReducer from './financeSlice'
import storage from './persistStorage'

const persistConfig = {
  key: 'zorvyn-finance',
  storage,
  whitelist: ['transactions', 'role', 'theme'],
}

const persistedFinanceReducer = persistReducer(persistConfig, financeReducer)

export const store = configureStore({
  reducer: {
    finance: persistedFinanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
