import type {
  CastCredit,
  CastMember,
  Episode,
  Person,
  Show,
} from '../types/show'

const API_BASE = 'https://api.tvmaze.com'

export class TVMazeError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = 'TVMazeError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, init)
  if (!response.ok) {
    throw new TVMazeError(response.status, `TVMaze ${response.status}: ${response.statusText}`)
  }
  return response.json() as Promise<T>
}

// TVMaze paginates the show index in chunks of 250. Page 0 covers the most
// popular shows (sorted by id ascending, but with rich genre coverage).
export function fetchShows(page = 0, signal?: AbortSignal): Promise<Show[]> {
  return request<Show[]>(`/shows?page=${page}`, { signal })
}

export function fetchShow(id: number, signal?: AbortSignal): Promise<Show> {
  return request<Show>(`/shows/${id}`, { signal })
}

export function fetchCast(showId: number, signal?: AbortSignal): Promise<CastMember[]> {
  return request<CastMember[]>(`/shows/${showId}/cast`, { signal })
}

export function fetchEpisodes(showId: number, signal?: AbortSignal): Promise<Episode[]> {
  return request<Episode[]>(`/shows/${showId}/episodes`, { signal })
}

export function fetchPerson(personId: number, signal?: AbortSignal): Promise<Person> {
  return request<Person>(`/people/${personId}`, { signal })
}

/**
 * Cast credits with the full Show inlined under `_embedded.show`.
 */
export function fetchPersonCredits(
  personId: number,
  signal?: AbortSignal,
): Promise<CastCredit[]> {
  return request<CastCredit[]>(`/people/${personId}/castcredits?embed=show`, { signal })
}
