import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useSearchStore } from '../stores/search'

function readQueryParam(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

/**
 * Wires the search store to the URL.
 */
export function useSearchNavigation() {
  const route = useRoute()
  const router = useRouter()
  const store = useSearchStore()

  // Seed from URL on first call (e.g. landing on /search?q=foo).
  const initial = readQueryParam(route.query.q)
  if (initial && store.query !== initial) {
    store.query = initial
  }

  watch(
    () => store.debouncedQuery,
    (next) => {
      const trimmed = next.trim()
      const onSearchPage = route.name === 'search'

      if (onSearchPage) {
        const current = readQueryParam(route.query.q)
        if (trimmed === current) return
        const nextQuery = { ...route.query }
        if (trimmed) nextQuery.q = trimmed
        else delete nextQuery.q
        router.replace({ query: nextQuery })
        return
      }

      if (trimmed.length === 0) return
      router.push({ name: 'search', query: { q: trimmed } })
    },
  )

  watch(
    () => route.query.q,
    (next) => {
      const value = readQueryParam(next)
      if (value !== store.query) store.query = value
    },
  )
}
