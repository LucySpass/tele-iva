import Fuse, { type IFuseOptions } from 'fuse.js'
import { computed, markRaw, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue'

export interface UseSearchOptions<T> {
  /** Fields on each item to search. The brief calls for name-only; pass `['name']`. */
  keys: NonNullable<IFuseOptions<T>['keys']>
  /** 0 = exact match, 1 = match anything. Default 0.3 — fuzzy enough to forgive typos. */
  threshold?: number
  /** Cap result count. Useful for keeping the DOM small on broad queries. */
  limit?: number
}

/**
 * Reactive Fuse.js search.
 *
 * The Fuse index is rebuilt when `source` changes (cheap for a few thousand
 * items) but not on every keystroke — that's the job of debouncing the query
 * before it reaches this composable.
 *
 * `markRaw` keeps Vue from making Fuse's internal index reactive, which would
 * be a costly mistake on a list of thousands of shows.
 */
export function useSearch<T>(
  source: MaybeRefOrGetter<T[] | undefined>,
  query: MaybeRefOrGetter<string>,
  options: UseSearchOptions<T>,
): ComputedRef<T[]> {
  const fuse = computed(() => {
    const items = toValue(source) ?? []
    return markRaw(
      new Fuse(items, {
        keys: options.keys,
        threshold: options.threshold ?? 0.3,
        ignoreLocation: true,
      }),
    )
  })

  return computed(() => {
    const q = toValue(query).trim()
    if (q.length === 0) return []
    const fuseOptions = options.limit !== undefined ? { limit: options.limit } : undefined
    return fuse.value.search(q, fuseOptions).map((result) => result.item)
  })
}
