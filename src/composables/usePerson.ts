import { useQuery } from '@tanstack/vue-query'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'

import { fetchPerson, fetchPersonCredits } from '../api/tvmaze'

const ONE_HOUR = 1000 * 60 * 60

function isValidId(value: number | string) {
  return value !== '' && value !== null && value !== undefined && !Number.isNaN(Number(value))
}

/**
 * Fetch the person record (no credits). Hero copy renders as soon as this
 * resolves; the filmography is fetched independently via `usePersonCredits`,
 * so the page fills in progressively.
 */
export function usePerson(id: MaybeRefOrGetter<number | string>) {
  return useQuery({
    queryKey: computed(() => ['person', toValue(id)]),
    queryFn: ({ signal }) => fetchPerson(Number(toValue(id)), signal),
    staleTime: ONE_HOUR,
    enabled: computed(() => isValidId(toValue(id))),
  })
}

/**
 * Fetch all cast credits for a person, with each credit's Show inlined via
 * the TVMaze `embed=show` query param. One request — no per-credit fan-out.
 */
export function usePersonCredits(id: MaybeRefOrGetter<number | string>) {
  return useQuery({
    queryKey: computed(() => ['person-credits', toValue(id)]),
    queryFn: ({ signal }) => fetchPersonCredits(Number(toValue(id)), signal),
    staleTime: ONE_HOUR,
    enabled: computed(() => isValidId(toValue(id))),
  })
}
