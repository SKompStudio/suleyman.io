'use client'

import { Terminal } from './Terminal'
import type { OutputLine } from './types'

const GREETING: OutputLine[] = [
  {
    text: "suleyman.io ▸ operator console. type 'help', or start typing.",
    tone: 'accent',
  },
]

// LAZY inline wrapper for the home hero. Same engine + registry as the overlay,
// no dialog/trap/scroll-lock. Enhances on top of the server-rendered shell.
export default function HomeTerminal() {
  return <Terminal variant="inline" greeting={GREETING} />
}
