import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useDebounce } from '../composables/useDebounce'

/**
 * Single source of truth for the search input value.
 */
export const useSearchStore = defineStore('search', () => {
  const query = ref('')
  const debouncedQuery = useDebounce(query, 300)

  function clear() {
    query.value = ''
  }

  return { query, debouncedQuery, clear }
})
