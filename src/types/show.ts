export interface Country {
  name: string
  code: string
  timezone: string
}

export interface Network {
  id: number
  name: string
  country: Country | null
  officialSite: string | null
}

export interface WebChannel {
  id: number
  name: string
  country: Country | null
  officialSite: string | null
}

export interface ShowImage {
  medium: string
  original: string
}

export interface ShowRating {
  average: number | null
}

export interface ShowSchedule {
  time: string
  days: string[]
}

export interface Show {
  id: number
  url: string
  name: string
  type: string
  language: string | null
  genres: string[]
  status: string
  runtime: number | null
  averageRuntime: number | null
  premiered: string | null
  ended: string | null
  officialSite: string | null
  schedule: ShowSchedule
  rating: ShowRating
  weight: number
  network: Network | null
  webChannel: WebChannel | null
  image: ShowImage | null
  summary: string | null
  updated: number
}
