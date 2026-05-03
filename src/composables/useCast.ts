import { useQuery } from '@tanstack/vue-query'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'

import { fetchCast } from '../api/tvmaze'

const ONE_HOUR = 1000 * 60 * 60

/**
 * Cast for a show. `enabled` lets the parent (a tab) hold off the request
 * until the user activates that tab.
 */
export function useCast(
  showId: MaybeRefOrGetter<number | string>,
  enabled: MaybeRefOrGetter<boolean> = true,
) {
  return useQuery({
    queryKey: computed(() => ['cast', toValue(showId)]),
    queryFn: ({ signal }) => fetchCast(Number(toValue(showId)), signal),
    staleTime: ONE_HOUR,
    enabled: computed(() => {
      if (!toValue(enabled)) return false
      const id = toValue(showId)
      return (
        id !== '' &&
        id !== null &&
        id !== undefined &&
        !Number.isNaN(Number(id))
      )
    }),
  })
}
