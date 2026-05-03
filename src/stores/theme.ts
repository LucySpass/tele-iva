import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'

export type Theme = 'light' | 'dark'

// Keep in sync with the inline FOUC-prevention script in index.html.
const STORAGE_KEY = 'tele-iva-theme'

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* localStorage may be unavailable (private mode, embedded) */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(readInitialTheme())

  watchEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme.value)
    }
  })

  function set(next: Theme) {
    theme.value = next
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }

  function toggle() {
    set(theme.value === 'dark' ? 'light' : 'dark')
  }

  return { theme, set, toggle }
})
