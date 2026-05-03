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

export interface PersonImage {
  medium: string
  original: string
}

export interface PersonBirthplace {
  name: string
  code: string
  timezone: string
}

export interface Person {
  id: number
  url: string
  name: string
  country: PersonBirthplace | null
  birthday: string | null
  deathday: string | null
  gender: string | null
  image: PersonImage | null
  updated: number
}

export interface Character {
  id: number
  url: string
  name: string
  image: PersonImage | null
}

export interface CastMember {
  person: Person
  character: Character
  self: boolean
  voice: boolean
}

export interface Episode {
  id: number
  url: string
  name: string
  season: number
  number: number | null
  type: string
  airdate: string | null
  airtime: string | null
  airstamp: string | null
  runtime: number | null
  rating: ShowRating
  image: ShowImage | null
  summary: string | null
}

/**
 * One credit returned by `/people/:id/castcredits?embed=show`. The `embed=show`
 * query string inlines the full Show under `_embedded.show`, so we don't need
 * a follow-up request per credit.
 */
export interface CastCredit {
  self: boolean
  voice: boolean
  _links: {
    show: { href: string }
    character?: { href: string; name?: string }
  }
  _embedded?: {
    show?: Show
  }
}
