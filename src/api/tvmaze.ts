import type { Show } from '../types/show'

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
