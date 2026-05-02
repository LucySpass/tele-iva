import { ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useSearch } from '../../composables/useSearch'

interface TestShow {
  id: number
  name: string
  summary: string
}

const shows: TestShow[] = [
  { id: 1, name: 'Breaking Bad', summary: 'A chemistry teacher turns to crime.' },
  { id: 2, name: 'Better Call Saul', summary: 'A lawyer with questionable ethics.' },
  { id: 3, name: 'The Wire', summary: 'Baltimore drug trade, season by season.' },
  { id: 4, name: 'Succession', summary: 'A media empire and its heirs.' },
  { id: 5, name: 'Mad Men', summary: 'Advertising on Madison Avenue.' },
]

describe('useSearch', () => {
  it('returns an empty array for an empty query', () => {
    const query = ref('')
    const results = useSearch(shows, query, { keys: ['name'] })
    expect(results.value).toEqual([])
  })

  it('returns an empty array for a whitespace-only query', () => {
    const query = ref('   ')
    const results = useSearch(shows, query, { keys: ['name'] })
    expect(results.value).toEqual([])
  })

  it('matches by exact title', () => {
    const query = ref('Breaking Bad')
    const results = useSearch(shows, query, { keys: ['name'] })
    expect(results.value[0]?.id).toBe(1)
  })

  it('matches with typos thanks to fuzziness', () => {
    const query = ref('Brekaing')
    const results = useSearch(shows, query, { keys: ['name'], threshold: 0.4 })
    expect(results.value.some((show) => show.id === 1)).toBe(true)
  })

  it('does not match against fields outside the configured keys', () => {
    const query = ref('chemistry')
    const results = useSearch(shows, query, { keys: ['name'] })
    expect(results.value).toEqual([])
  })

  it('respects the limit option', () => {
    const query = ref('e')
    const limited = useSearch(shows, query, { keys: ['name'], threshold: 1, limit: 2 })
    expect(limited.value.length).toBeLessThanOrEqual(2)
  })

  it('reacts to query changes', () => {
    const query = ref('Breaking')
    const results = useSearch(shows, query, { keys: ['name'] })
    expect(results.value[0]?.id).toBe(1)

    query.value = 'Succession'
    expect(results.value[0]?.id).toBe(4)
  })

  it('reacts to source changes', () => {
    const source = ref<TestShow[]>([])
    const query = ref('Breaking')
    const results = useSearch(source, query, { keys: ['name'] })
    expect(results.value).toEqual([])

    source.value = shows
    expect(results.value[0]?.id).toBe(1)
  })

  it('handles an undefined source gracefully', () => {
    const source = ref<TestShow[] | undefined>(undefined)
    const query = ref('anything')
    const results = useSearch(source, query, { keys: ['name'] })
    expect(results.value).toEqual([])
  })
})
