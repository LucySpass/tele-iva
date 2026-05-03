import { useQuery } from '@tanstack/vue-query'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'

import { fetchShow } from '../api/tvmaze'

const ONE_HOUR = 1000 * 60 * 60

export function useShow(id: MaybeRefOrGetter<number | string>) {
  return useQuery({
    queryKey: computed(() => ['show', toValue(id)]),
    queryFn: ({ signal }) => {
      const numId = Number(toValue(id))
      if (Number.isNaN(numId)) throw new Error('Invalid show ID')
      return fetchShow(numId, signal)
    },
    staleTime: ONE_HOUR,
    enabled: computed(() => {
      const value = toValue(id)
      return value !== '' && value !== null && value !== undefined
    }),
  })
}
