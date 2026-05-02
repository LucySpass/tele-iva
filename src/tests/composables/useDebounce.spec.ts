import { effectScope, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebounce } from '../../composables/useDebounce'

// Vue's default watcher runs in a microtask. After mutating the source we
// flush microtasks before advancing fake timers, otherwise the timer is
// never scheduled.
async function flush() {
  await Promise.resolve()
  await Promise.resolve()
}

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('seeds the debounced ref with the source value', () => {
    const scope = effectScope()
    scope.run(() => {
      const source = ref('hello')
      const debounced = useDebounce(source, 200)
      expect(debounced.value).toBe('hello')
    })
    scope.stop()
  })

  it('delays propagation by the configured time', async () => {
    const scope = effectScope()
    await scope.run(async () => {
      const source = ref('a')
      const debounced = useDebounce(source, 300)

      source.value = 'ab'
      await flush()

      vi.advanceTimersByTime(299)
      expect(debounced.value).toBe('a')

      vi.advanceTimersByTime(1)
      expect(debounced.value).toBe('ab')
    })
    scope.stop()
  })

  it('only emits the latest value when changes are rapid', async () => {
    const scope = effectScope()
    await scope.run(async () => {
      const source = ref('a')
      const debounced = useDebounce(source, 300)

      source.value = 'ab'
      await flush()
      vi.advanceTimersByTime(100)

      source.value = 'abc'
      await flush()
      vi.advanceTimersByTime(100)

      source.value = 'abcd'
      await flush()
      vi.advanceTimersByTime(299)

      expect(debounced.value).toBe('a')

      vi.advanceTimersByTime(1)
      expect(debounced.value).toBe('abcd')
    })
    scope.stop()
  })

  it('cancels the pending update when the scope is disposed', async () => {
    const scope = effectScope()
    const source = ref('a')
    let debounced!: ReturnType<typeof useDebounce<string>>

    scope.run(() => {
      debounced = useDebounce(source, 300)
    })

    source.value = 'b'
    await flush()

    scope.stop()

    vi.advanceTimersByTime(1000)
    expect(debounced.value).toBe('a')
  })
})
