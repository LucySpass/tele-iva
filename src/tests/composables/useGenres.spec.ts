import { describe, expect, it } from 'vitest'
import { ref } from 'vue'

import { useGenres } from '../../composables/useGenres'
import type { Show } from '../../types/show'

let nextId = 1

function makeShow(name: string, genres: string[], rating: number | null = null): Show {
  return {
    id: nextId++,
    url: `https://example.test/${name}`,
    name,
    type: 'Scripted',
    language: 'English',
    genres,
    status: 'Running',
    runtime: 60,
    averageRuntime: 60,
    premiered: null,
    ended: null,
    officialSite: null,
    schedule: { time: '', days: [] },
    rating: { average: rating },
    weight: 0,
    network: null,
    webChannel: null,
    image: null,
    summary: null,
    updated: 0,
  }
}

describe('useGenres', () => {
  it('returns an empty array when input is undefined', () => {
    const result = useGenres(undefined)
    expect(result.value).toEqual([])
  })

  it('returns an empty array when input is empty', () => {
    const result = useGenres([])
    expect(result.value).toEqual([])
  })

  it('groups shows by genre, including shows in multiple genres', () => {
    const a = makeShow('A', ['Drama', 'Comedy'])
    const b = makeShow('B', ['Drama'])
    const c = makeShow('C', ['Comedy'])

    const result = useGenres([a, b, c])
    const byGenre = Object.fromEntries(result.value.map((g) => [g.genre, g.shows.map((s) => s.name)]))

    expect(byGenre.Drama).toEqual(expect.arrayContaining(['A', 'B']))
    expect(byGenre.Drama).toHaveLength(2)
    expect(byGenre.Comedy).toEqual(expect.arrayContaining(['A', 'C']))
    expect(byGenre.Comedy).toHaveLength(2)
  })

  it('sorts shows within a genre by rating descending', () => {
    const low = makeShow('Low', ['Drama'], 6.0)
    const high = makeShow('High', ['Drama'], 9.2)
    const mid = makeShow('Mid', ['Drama'], 7.5)

    const result = useGenres([low, high, mid])
    const drama = result.value.find((g) => g.genre === 'Drama')

    expect(drama?.shows.map((s) => s.name)).toEqual(['High', 'Mid', 'Low'])
  })

  it('places shows with null ratings at the bottom of their genre', () => {
    const rated = makeShow('Rated', ['Drama'], 7.0)
    const unrated = makeShow('Unrated', ['Drama'], null)

    const result = useGenres([unrated, rated])
    const drama = result.value.find((g) => g.genre === 'Drama')

    expect(drama?.shows.map((s) => s.name)).toEqual(['Rated', 'Unrated'])
  })

  it('sorts genres by show count descending', () => {
    const result = useGenres([
      makeShow('A', ['Comedy']),
      makeShow('B', ['Drama']),
      makeShow('C', ['Drama']),
      makeShow('D', ['Drama']),
      makeShow('E', ['Sports']),
      makeShow('F', ['Sports']),
    ])

    expect(result.value.map((g) => g.genre)).toEqual(['Drama', 'Sports', 'Comedy'])
  })

  it('breaks genre ties alphabetically', () => {
    const result = useGenres([
      makeShow('A', ['Comedy']),
      makeShow('B', ['Drama']),
      makeShow('C', ['Action']),
    ])

    expect(result.value.map((g) => g.genre)).toEqual(['Action', 'Comedy', 'Drama'])
  })

  it('applies limitPerGenre after sorting by rating', () => {
    const shows = [
      makeShow('Low', ['Drama'], 5.0),
      makeShow('High', ['Drama'], 9.0),
      makeShow('Mid', ['Drama'], 7.0),
      makeShow('Top', ['Drama'], 9.5),
    ]
    const result = useGenres(shows, { limitPerGenre: 2 })
    const drama = result.value.find((g) => g.genre === 'Drama')

    expect(drama?.shows.map((s) => s.name)).toEqual(['Top', 'High'])
  })

  it('reflects genre size after limitPerGenre when ranking genres', () => {
    // Comedy has 5 shows, Drama has 2. With limit 2 they tie on size,
    // alphabetical tiebreak puts Comedy first.
    const shows = [
      ...Array.from({ length: 5 }, (_, i) => makeShow(`C${i}`, ['Comedy'], i)),
      makeShow('D1', ['Drama'], 8),
      makeShow('D2', ['Drama'], 7),
    ]
    const result = useGenres(shows, { limitPerGenre: 2 })

    expect(result.value.map((g) => ({ genre: g.genre, count: g.shows.length }))).toEqual([
      { genre: 'Comedy', count: 2 },
      { genre: 'Drama', count: 2 },
    ])
  })

  it('reacts to ref source changes', () => {
    const source = ref<Show[]>([makeShow('A', ['Drama'])])
    const result = useGenres(source)

    expect(result.value.map((g) => g.genre)).toEqual(['Drama'])

    source.value = [makeShow('B', ['Comedy']), makeShow('C', ['Comedy'])]
    expect(result.value).toHaveLength(1)
    expect(result.value[0]?.genre).toBe('Comedy')
    expect(result.value[0]?.shows).toHaveLength(2)
  })

  it('accepts a getter source backed by a ref', () => {
    const source = ref<Show[]>([makeShow('A', ['Drama'])])
    const result = useGenres(() => source.value)
    expect(result.value[0]?.genre).toBe('Drama')

    source.value = [makeShow('B', ['Sports']), makeShow('C', ['Sports'])]
    expect(result.value[0]?.genre).toBe('Sports')
  })

  it('does not mutate the input array', () => {
    const shows = [
      makeShow('Low', ['Drama'], 5.0),
      makeShow('High', ['Drama'], 9.0),
    ]
    const snapshot = shows.map((s) => s.name)
    useGenres(shows).value
    expect(shows.map((s) => s.name)).toEqual(snapshot)
  })

  it('skips shows with no genres', () => {
    const result = useGenres([makeShow('Genreless', []), makeShow('Drama show', ['Drama'])])
    expect(result.value).toHaveLength(1)
    expect(result.value[0]?.genre).toBe('Drama')
  })
})
