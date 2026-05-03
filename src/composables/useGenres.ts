import { computed, type ComputedRef, type MaybeRefOrGetter, toValue } from 'vue'

import type { Show } from '../types/show'

export interface GenreGroup {
  genre: string
  shows: Show[]
}

export interface UseGenresOptions {
  // Cap shows per genre — useful for horizontal lists where only the top N fit.
  limitPerGenre?: number
}

export function useGenres(
  shows: MaybeRefOrGetter<Show[] | undefined>,
  options: UseGenresOptions = {},
): ComputedRef<GenreGroup[]> {
  return computed(() => {
    const list = toValue(shows) ?? []
    const buckets = new Map<string, Show[]>()

    for (const show of list) {
      for (const genre of show.genres) {
        const bucket = buckets.get(genre)
        if (bucket) bucket.push(show)
        else buckets.set(genre, [show])
      }
    }

    const { limitPerGenre } = options

    return Array.from(buckets.entries())
      .map(([genre, items]) => {
        const sorted = [...items].sort(byRatingDesc)
        return {
          genre,
          shows: limitPerGenre ? sorted.slice(0, limitPerGenre) : sorted,
        }
      })
      .sort(
        (a, b) =>
          b.shows.length - a.shows.length || a.genre.localeCompare(b.genre),
      )
  })
}

function byRatingDesc(a: Show, b: Show): number {
  const left = a.rating.average ?? -Infinity
  const right = b.rating.average ?? -Infinity
  return right - left
}
