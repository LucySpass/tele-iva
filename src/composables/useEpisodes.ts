import { useQuery } from '@tanstack/vue-query'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'

import { fetchEpisodes } from '../api/tvmaze'

const ONE_HOUR = 1000 * 60 * 60

export function useEpisodes(
  showId: MaybeRefOrGetter<number | string>,
  enabled: MaybeRefOrGetter<boolean> = true,
) {
  return useQuery({
    queryKey: computed(() => ['episodes', toValue(showId)]),
    queryFn: ({ signal }) => fetchEpisodes(Number(toValue(showId)), signal),
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
