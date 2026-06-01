'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'

import {
  installGlobalShortcut,
  useCommandPalette,
} from './useCommandPalette'

// LAZY boundary #1 — the overlay engine + registry are only requested once the
// palette opens (or is prefetched on intent). Nothing heavy is in this module.
const CommandPalette = dynamic(() => import('./CommandPalette'), {
  ssr: false,
  loading: () => null,
})

// Prefetch entry point handed to the trigger chip(s): touching the dynamic
// import warms the chunk before the actual open.
function prefetch() {
  void import('./CommandPalette')
}

export function CommandPaletteMount() {
  const { isOpen, close } = useCommandPalette()

  useEffect(() => {
    installGlobalShortcut()
  }, [])

  return (
    <>
      {isOpen && <CommandPalette onClose={close} prefetch={prefetch} />}
    </>
  )
}

export { prefetch as prefetchPalette }
