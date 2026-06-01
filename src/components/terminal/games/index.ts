// Lazy game loader map. The engine calls loadGame(<id>)() inside the command
// run path, so a game's code is only fetched when the command is invoked — a
// phone never downloads game code unless asked.

import type { ComponentType } from 'react'

export type CrackProps = { hard?: boolean; onExit: (summary: string) => void }
export type PlayProps = { reduced: boolean; onExit: (summary: string) => void }
export type BigoProps = { onExit: (summary: string) => void }

export const GAME_LOADERS = {
  crack: () =>
    import('./crack').then((m) => m.default as ComponentType<CrackProps>),
  play: () =>
    import('./play').then((m) => m.default as ComponentType<PlayProps>),
  bigo: () =>
    import('./bigo').then((m) => m.default as ComponentType<BigoProps>),
} as const

export type GameId = keyof typeof GAME_LOADERS
