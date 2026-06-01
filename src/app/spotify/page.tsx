import { Suspense } from 'react'
import { SpotifyDashboard } from './SpotifyDashboard'
import { buildMeta } from '@/lib/buildMeta'

export const metadata = buildMeta({
  title: 'Spotify',
  description:
    'A live readout of what I listen to: top artists, tracks, genres, and audio features, plus a taste-compatibility blend you can run against your own Spotify.',
  path: '/spotify',
})

export default function SpotifyPage() {
  return (
    <Suspense fallback={null}>
      <SpotifyDashboard />
    </Suspense>
  )
}
