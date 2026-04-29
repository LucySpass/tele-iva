import { useQuery } from '@tanstack/vue-query'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'

import { fetchShow } from '../api/tvmaze'

const ONE_HOUR = 1000 * 60 * 60

export function useShow(id: MaybeRefOrGetter<number | string>) {
  return useQuery({
    queryKey: computed(() => ['show', toValue(id)]),
    queryFn: ({ signal }) => fetchShow(Number(toValue(id)), signal),
    staleTime: ONE_HOUR,
    enabled: computed(() => {
      const value = toValue(id)
      return value !== '' && value !== null && value !== undefined && !Number.isNaN(Number(value))
    }),
  })
}
