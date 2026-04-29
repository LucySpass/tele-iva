import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { useThemeStore } from '../../stores/theme'

const STORAGE_KEY = 'tele-iva-theme'

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe('useThemeStore', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    mockMatchMedia(false)
    setActivePinia(createPinia())
  })

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme')
  })

  describe('initial theme', () => {
    it('uses the stored value when present', () => {
      localStorage.setItem(STORAGE_KEY, 'dark')
      const store = useThemeStore()
      expect(store.theme).toBe('dark')
    })

    it('falls back to prefers-color-scheme: dark when nothing is stored', () => {
      mockMatchMedia(true)
      const store = useThemeStore()
      expect(store.theme).toBe('dark')
    })

    it('defaults to light when no storage and the system prefers light', () => {
      const store = useThemeStore()
      expect(store.theme).toBe('light')
    })

    it('ignores invalid stored values', () => {
      localStorage.setItem(STORAGE_KEY, 'neon')
      const store = useThemeStore()
      expect(store.theme).toBe('light')
    })

    it('applies data-theme to <html> on creation', () => {
      localStorage.setItem(STORAGE_KEY, 'dark')
      useThemeStore()
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    })
  })

  describe('toggle', () => {
    it('flips light to dark, persists, and updates the attribute', async () => {
      const store = useThemeStore()
      store.toggle()

      expect(store.theme).toBe('dark')
      expect(localStorage.getItem(STORAGE_KEY)).toBe('dark')
      await nextTick()
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    })

    it('flips dark to light', () => {
      localStorage.setItem(STORAGE_KEY, 'dark')
      const store = useThemeStore()
      store.toggle()

      expect(store.theme).toBe('light')
      expect(localStorage.getItem(STORAGE_KEY)).toBe('light')
    })
  })

  describe('set', () => {
    it('updates state and persists', async () => {
      const store = useThemeStore()
      store.set('dark')

      expect(store.theme).toBe('dark')
      expect(localStorage.getItem(STORAGE_KEY)).toBe('dark')
      await nextTick()
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    })
  })
})
