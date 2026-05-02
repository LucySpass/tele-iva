import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useSearchStore } from '../../stores/search'

// `useDebounce` schedules a real setTimeout when the watcher runs. Microtasks
// have to flush before fake timers can advance the underlying timer.
async function flush() {
  await Promise.resolve()
  await Promise.resolve()
}

describe('useSearchStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with an empty query and debounced query', () => {
    const store = useSearchStore()
    expect(store.query).toBe('')
    expect(store.debouncedQuery).toBe('')
  })

  it('reflects query writes immediately', () => {
    const store = useSearchStore()
    store.query = 'breaking'
    expect(store.query).toBe('breaking')
  })

  it('debounces query into debouncedQuery by 300ms', async () => {
    const store = useSearchStore()
    store.query = 'breaking'
    await flush()

    vi.advanceTimersByTime(299)
    expect(store.debouncedQuery).toBe('')

    vi.advanceTimersByTime(1)
    expect(store.debouncedQuery).toBe('breaking')
  })

  it('clear() empties query and propagates to debouncedQuery', async () => {
    const store = useSearchStore()
    store.query = 'mad men'
    await flush()
    vi.advanceTimersByTime(300)
    expect(store.debouncedQuery).toBe('mad men')

    store.clear()
    expect(store.query).toBe('')
    await flush()
    vi.advanceTimersByTime(300)
    expect(store.debouncedQuery).toBe('')
  })

  it('only emits the latest value when typed in bursts', async () => {
    const store = useSearchStore()

    store.query = 'b'
    await flush()
    vi.advanceTimersByTime(100)

    store.query = 'br'
    await flush()
    vi.advanceTimersByTime(100)

    store.query = 'bre'
    await flush()
    vi.advanceTimersByTime(299)

    expect(store.debouncedQuery).toBe('')

    vi.advanceTimersByTime(1)
    expect(store.debouncedQuery).toBe('bre')
  })
})
