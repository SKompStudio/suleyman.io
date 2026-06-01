import type { StaticImageData } from 'next/image'

import solstice from '@/images/showcase/solstice.png'
import applify from '@/images/showcase/applify.png'
import skompxcel from '@/images/showcase/skompxcel.png'

// Map a project slug to its real captured product screenshot. Only the four
// projects with real captures get a frame; everything else renders a HUD
// placeholder. No fabricated imagery.
const BY_SLUG: Record<string, StaticImageData> = {
  'skomp-studio': solstice,
  skompxcel,
}

const BY_NAME: Record<string, StaticImageData> = {
  'Applify AI': applify,
}

export function screenshotFor(slug: string, name: string): StaticImageData | null {
  return BY_SLUG[slug.toLowerCase()] ?? BY_NAME[name] ?? null
}
