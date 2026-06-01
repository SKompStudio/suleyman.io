import { describe, it, expect } from 'vitest'
import { scoreBlend, aggregateGenres, isTimeRange } from './spotify'

const artist = (name: string, genres: string[] = [], img?: string) => ({
  name,
  genres,
  images: img ? [{ url: img }] : [],
})

describe('isTimeRange', () => {
  it('accepts the three valid ranges', () => {
    expect(isTimeRange('short_term')).toBe(true)
    expect(isTimeRange('medium_term')).toBe(true)
    expect(isTimeRange('long_term')).toBe(true)
  })
  it('rejects anything else', () => {
    expect(isTimeRange('weekly')).toBe(false)
    expect(isTimeRange(null)).toBe(false)
    expect(isTimeRange(undefined)).toBe(false)
  })
})

describe('aggregateGenres', () => {
  it('rank-weights genres (earlier artists count more)', () => {
    const out = aggregateGenres([artist('A', ['rock']), artist('B', ['jazz'])])
    expect(out[0].genre).toBe('rock')
    expect(out[0].count).toBeGreaterThan(out[1].count)
  })
  it('sums duplicate genres across artists', () => {
    const out = aggregateGenres([artist('A', ['pop']), artist('B', ['pop'])])
    expect(out).toHaveLength(1)
    expect(out[0].genre).toBe('pop')
  })
})

describe('scoreBlend', () => {
  it('identical taste scores 100%', () => {
    const list = [artist('A', ['rock']), artist('B', ['jazz'])]
    const r = scoreBlend(list, list)
    expect(r.matchPercent).toBe(100)
    expect(r.sharedArtistCount).toBe(2)
  })

  it('zero overlap scores 0% with no shared items', () => {
    const v = [artist('A', ['rock'])]
    const o = [artist('Z', ['classical'])]
    const r = scoreBlend(v, o)
    expect(r.matchPercent).toBe(0)
    expect(r.sharedArtistCount).toBe(0)
    expect(r.sharedGenreCount).toBe(0)
    expect(r.sharedArtists).toHaveLength(0)
  })

  it('partial overlap surfaces shared artists and genres, bounded 0..100', () => {
    const v = [artist('A', ['rock']), artist('B', ['pop'])]
    const o = [artist('A', ['rock']), artist('C', ['metal'])]
    const r = scoreBlend(v, o)
    expect(r.matchPercent).toBeGreaterThan(0)
    expect(r.matchPercent).toBeLessThanOrEqual(100)
    expect(r.sharedArtists.map((s) => s.name)).toContain('A')
    expect(r.sharedGenres).toContain('rock')
  })

  it('carries the owner cover image for shared artists', () => {
    const v = [artist('A', ['rock'])]
    const o = [artist('A', ['rock'], 'https://img/a.jpg')]
    const r = scoreBlend(v, o)
    expect(r.sharedArtists[0].coverImage).toBe('https://img/a.jpg')
  })

  it('reports each side top genre', () => {
    const v = [artist('A', ['hip hop'])]
    const o = [artist('B', ['indie'])]
    const r = scoreBlend(v, o)
    expect(r.visitorTopGenre).toBe('hip hop')
    expect(r.ownerTopGenre).toBe('indie')
  })
})
