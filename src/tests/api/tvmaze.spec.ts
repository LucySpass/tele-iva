import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  fetchCast,
  fetchEpisodes,
  fetchPerson,
  fetchPersonCredits,
  fetchShow,
  fetchShows,
  TVMazeError,
} from '../../api/tvmaze'

const mockFetch = vi.fn()

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch)
})

afterEach(() => {
  vi.restoreAllMocks()
})

function okResponse(body: unknown) {
  return new Response(JSON.stringify(body), { status: 200 })
}

function errorResponse(status: number, statusText: string) {
  return new Response(null, { status, statusText })
}

describe('request helper (via fetchShows)', () => {
  it('returns parsed JSON on success', async () => {
    const shows = [{ id: 1, name: 'Test' }]
    mockFetch.mockResolvedValue(okResponse(shows))

    const result = await fetchShows()
    expect(result).toEqual(shows)
  })

  it('throws TVMazeError on non-OK response', async () => {
    mockFetch.mockResolvedValue(errorResponse(404, 'Not Found'))

    await expect(fetchShows()).rejects.toThrow(TVMazeError)
    await expect(fetchShows()).rejects.toThrow('TVMaze 404: Not Found')
  })

  it('includes status on error', async () => {
    mockFetch.mockResolvedValue(errorResponse(429, 'Too Many Requests'))

    try {
      await fetchShows()
      expect.unreachable()
    } catch (e) {
      expect(e).toBeInstanceOf(TVMazeError)
      expect((e as TVMazeError).status).toBe(429)
      expect((e as TVMazeError).name).toBe('TVMazeError')
    }
  })

  it('forwards the abort signal', async () => {
    mockFetch.mockResolvedValue(okResponse([]))
    const controller = new AbortController()

    await fetchShows(0, controller.signal)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal: controller.signal }),
    )
  })
})

describe('endpoint URLs', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue(okResponse({}))
  })

  it('fetchShows hits /shows?page=N', async () => {
    await fetchShows(2)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.tvmaze.com/shows?page=2',
      expect.any(Object),
    )
  })

  it('fetchShows defaults to page 0', async () => {
    await fetchShows()
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.tvmaze.com/shows?page=0',
      expect.any(Object),
    )
  })

  it('fetchShow hits /shows/:id', async () => {
    await fetchShow(42)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.tvmaze.com/shows/42',
      expect.any(Object),
    )
  })

  it('fetchCast hits /shows/:id/cast', async () => {
    await fetchCast(7)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.tvmaze.com/shows/7/cast',
      expect.any(Object),
    )
  })

  it('fetchEpisodes hits /shows/:id/episodes', async () => {
    await fetchEpisodes(7)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.tvmaze.com/shows/7/episodes',
      expect.any(Object),
    )
  })

  it('fetchPerson hits /people/:id', async () => {
    await fetchPerson(5)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.tvmaze.com/people/5',
      expect.any(Object),
    )
  })

  it('fetchPersonCredits hits /people/:id/castcredits with embed', async () => {
    await fetchPersonCredits(5)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.tvmaze.com/people/5/castcredits?embed=show',
      expect.any(Object),
    )
  })
})
