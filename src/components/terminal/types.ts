export type Tone = 'normal' | 'accent' | 'muted' | 'gold' | 'error'

// A single rendered output line. `run` lets a token be clickable (fills + runs
// a command); `href` makes it an anchor (external link / mailto / pdf).
export interface OutputLine {
  text: string
  tone?: Tone
  href?: string
  external?: boolean
  // Clickable command tokens embedded in the line: substrings that, when
  // clicked, run the given command. Rendered as buttons inline.
  runs?: { token: string; command: string }[]
}

export interface CommandResult {
  lines: OutputLine[]
  // Imperative side effects the engine performs after printing the lines.
  navigate?: string // router.push target
  openUrl?: string // window.open target (new tab)
  clear?: boolean // wipe scrollback
  startGame?: 'crack' | 'play'
  setAccent?: string // theme cycle: new --hud-accent hex
}

export interface CommandContext {
  args: string[]
  raw: string
  // Real-data fetchers (cached API routes). Defined on the client engine.
  fetchProjects: () => Promise<TerminalProject[]>
  fetchLangs: () => Promise<{ langs: LangStat[]; totalRepos: number }>
  fetchCommits: () => Promise<TerminalCommit[]>
  fetchContributions: () => Promise<ContributionSummary>
  fetchLeetcode: () => Promise<LeetcodeSummary>
  navigate: (path: string) => void
}

export interface Command {
  name: string
  aliases?: string[]
  desc: string
  hidden?: boolean
  group?: 'core' | 'data' | 'fun'
  run: (ctx: CommandContext) => CommandResult | Promise<CommandResult>
}

export interface TerminalProject {
  slug: string
  name: string
  description: string
  tech: string[]
  featured: boolean
  href: string | null
  label: string | null
  github: string | null
}

export interface LangStat {
  language: string
  repoCount: number
  bytes: number
}

export interface TerminalCommit {
  sha7: string
  message: string
  repo: string
  ageRelative: string
}

export interface ContributionSummary {
  total: number
  currentStreak: number
  longestStreak: number
  lastActive: string
}

export interface LeetcodeSummary {
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  ranking: number | null
}
