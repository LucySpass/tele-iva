import { useQuery } from '@tanstack/vue-query'

import { fetchShows } from '../api/tvmaze'

const ONE_HOUR = 1000 * 60 * 60

export function useShows() {
  return useQuery({
    queryKey: ['shows'],
    queryFn: ({ signal }) => fetchShows(0, signal),
    staleTime: ONE_HOUR,
  })
}
