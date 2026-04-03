/**
 * redux-persist storage for the browser. Avoids CJS default-export issues when
 * Vite bundles `redux-persist/lib/storage` (storage.getItem / setItem missing).
 */
function webStorage() {
  return {
    getItem: (key) =>
      Promise.resolve(
        typeof window !== 'undefined' ? window.localStorage.getItem(key) : null,
      ),
    setItem: (key, value) => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value)
      }
      return Promise.resolve()
    },
    removeItem: (key) => {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
      return Promise.resolve()
    },
  }
}

export default webStorage()
