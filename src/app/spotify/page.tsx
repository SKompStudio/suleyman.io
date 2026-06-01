import { Suspense } from 'react'
import { SpotifyDashboard } from './SpotifyDashboard'

export const metadata = {
  title: 'Spotify',
  description:
    'A live readout of what I listen to — top artists, tracks, genres, and audio features — plus a taste-compatibility blend you can run against your own Spotify.',
}

export default function SpotifyPage() {
  return (
    <Suspense fallback={null}>
      <SpotifyDashboard />
    </Suspense>
  )
}
