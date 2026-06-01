import type {
  Command,
  CommandContext,
  CommandResult,
  LangStat,
  OutputLine,
  TerminalProject,
} from './types'

// ── The ONE registry. Imported by <Terminal> only (stays lazy). Every data
// command hits a cached API route; nav is a client push; resume opens a PDF;
// games are await import()'d by the engine on the `startGame` signal. ──────────

const EMAIL = 'suleyman@skompxcel.com'
const GITHUB = 'https://github.com/kianis4'
const LINKEDIN = 'https://www.linkedin.com/in/suleyman-kiani'

// Nav routes from Header.tsx (the 9 sections) + aliases.
const NAV_ROUTES: Record<string, string> = {
  about: '/about',
  projects: '/projects',
  architecture: '/architecture',
  resume: '/resume',
  articles: '/articles',
  spotify: '/spotify',
  insta: '/insta',
  social: '/insta',
  leetcode: '/leetcode',
  uses: '/uses',
}

export const NAV_KEYS = Object.keys(NAV_ROUTES)

const RESUME_FILES: Record<string, string> = {
  '--1': '/resume-1page.pdf',
  '--2': '/resume-2page.pdf',
  '--finance': '/resume-finance.pdf',
}

export const RESUME_VARIANTS = ['resume-1page', 'resume-2page', 'resume-finance']

function line(text: string, tone?: OutputLine['tone'], extra?: Partial<OutputLine>): OutputLine {
  return { text, tone, ...extra }
}

function bar(value: number, max: number, cells = 20): string {
  const filled = max > 0 ? Math.round((value / max) * cells) : 0
  return '█'.repeat(filled) + '░'.repeat(Math.max(0, cells - filled))
}

const help: Command = {
  name: 'help',
  desc: 'list commands',
  group: 'core',
  run: () => ({
    lines: [
      line('suleyman.io // operator console        type a command or click one', 'accent'),
      line(''),
      line('  whoami        who is this              langs       github language footprint', 'normal', {
        runs: [
          { token: 'whoami', command: 'whoami' },
          { token: 'langs', command: 'langs' },
        ],
      }),
      line('  ls            list projects / pages    stack       the tech I reach for first', 'normal', {
        runs: [
          { token: 'ls', command: 'ls' },
          { token: 'stack', command: 'stack' },
        ],
      }),
      line('  cat resume    open the resume PDF      git log     my latest public commits', 'normal', {
        runs: [
          { token: 'cat resume', command: 'cat resume' },
          { token: 'git log', command: 'git log' },
        ],
      }),
      line('  open <page>   jump to any section      uptime      live contribution streak', 'normal', {
        runs: [
          { token: 'open', command: 'ls pages' },
          { token: 'uptime', command: 'uptime' },
        ],
      }),
      line('  contact       how to reach me          leetcode    problem-solving stats', 'normal', {
        runs: [
          { token: 'contact', command: 'contact' },
          { token: 'leetcode', command: 'leetcode' },
        ],
      }),
      line('  theme         cycle accent hue         clear       wipe the screen', 'normal', {
        runs: [
          { token: 'theme', command: 'theme' },
          { token: 'clear', command: 'clear' },
        ],
      }),
      line(''),
      line("  tip: ↑/↓ history · Tab completes · ⌘K opens me anywhere · try 'play'", 'muted', {
        runs: [{ token: 'play', command: 'play' }],
      }),
    ],
  }),
}

const whoami: Command = {
  name: 'whoami',
  aliases: ['whoareyou'],
  desc: 'who is this',
  group: 'core',
  run: async (ctx): Promise<CommandResult> => {
    let count = 0
    let topLang = 'TypeScript'
    try {
      const [projects, langData] = await Promise.all([
        ctx.fetchProjects(),
        ctx.fetchLangs(),
      ])
      count = projects.length
      topLang = langData.langs[0]?.language ?? topLang
    } catch {
      /* degrade gracefully — identity is still real */
    }
    const lines: OutputLine[] = [
      line('suleyman kiani — software engineer · M.Eng @ McMaster', 'accent'),
      line('  building   Solstice (skomp-studio) + an agentic OS that runs itself'),
      line(`  shipping   ${count} public repos · ${topLang} primary · Toronto, ON`),
      line('  status     ● online · open to senior / staff conversations'),
      line("→ next: 'open about'  ·  'cat resume'  ·  'contact'", 'muted', {
        runs: [
          { token: 'open about', command: 'open about' },
          { token: 'cat resume', command: 'cat resume' },
          { token: 'contact', command: 'contact' },
        ],
      }),
    ]
    if (ctx.raw.trim().toLowerCase() === 'whoareyou') {
      lines.push(line("(you can also just read the page — i don't bite)", 'muted'))
    }
    return { lines }
  },
}

function projectRows(projects: TerminalProject[]): OutputLine[] {
  const ordered = [...projects].sort(
    (a, b) => Number(b.featured) - Number(a.featured)
  )
  const shown = ordered.slice(0, 12)
  const rows = shown.map((p) => {
    const tech = p.tech.slice(0, 3).join(' · ') || '—'
    const isLive = !!p.href && !/github\.com/i.test(p.href)
    const status = isLive ? '● live' : '↟ repo'
    const perms = isLive ? 'drwxr-xr-x' : '-rw-r--r--'
    const name = p.slug.padEnd(20).slice(0, 20)
    return line(`${perms}  ${name}  ${tech.padEnd(28).slice(0, 28)}  ${status}`, 'normal', {
      runs: [{ token: p.slug, command: `open ${p.slug}` }],
    })
  })
  const more = ordered.length - shown.length
  if (more > 0) {
    rows.push(
      line(`  … +${more} more → 'open projects'`, 'muted', {
        runs: [{ token: 'open projects', command: 'open projects' }],
      })
    )
  }
  return rows
}

const ls: Command = {
  name: 'ls',
  desc: 'list projects / pages',
  group: 'core',
  run: async (ctx): Promise<CommandResult> => {
    const sub = (ctx.args[0] || '').toLowerCase()
    if (sub === 'pages') {
      const rows = NAV_KEYS.filter((k) => k !== 'social').map((k) =>
        line(`-rw-r--r--  ${k.padEnd(16)}  ${NAV_ROUTES[k]}`, 'normal', {
          runs: [{ token: k, command: `open ${k}` }],
        })
      )
      return { lines: [line('pages//', 'accent'), ...rows] }
    }
    try {
      const projects = await ctx.fetchProjects()
      if (!projects.length) {
        return { lines: [line('no projects resolved — try \'open projects\'', 'muted')] }
      }
      return { lines: [line('projects//', 'accent'), ...projectRows(projects)] }
    } catch {
      return {
        lines: [line('fatal: unable to list projects (offline) — try \'open projects\'', 'error')],
      }
    }
  },
}

const catCmd: Command = {
  name: 'cat',
  desc: 'open the resume PDF',
  group: 'core',
  run: (ctx): CommandResult => {
    const target = (ctx.args[0] || '').toLowerCase()
    if (target !== 'resume') {
      return { lines: [line(`cat: ${ctx.args[0] || ''}: only 'cat resume' is supported`, 'error')] }
    }
    const flag = (ctx.args[1] || '').toLowerCase()
    if (RESUME_FILES[flag]) {
      return {
        lines: [line(`opening ${RESUME_FILES[flag].slice(1)} ↗`, 'accent')],
        openUrl: RESUME_FILES[flag],
      }
    }
    return {
      lines: [
        line('opening resume.pdf ↗', 'accent'),
        line('  variants:  resume-1page   resume-2page   resume-finance', 'muted', {
          runs: [
            { token: 'resume-1page', command: 'cat resume --1' },
            { token: 'resume-2page', command: 'cat resume --2' },
            { token: 'resume-finance', command: 'cat resume --finance' },
          ],
        }),
        line("  → 'cat resume --finance'  or  'open resume' for the in-page viewer", 'muted', {
          runs: [{ token: 'open resume', command: 'open resume' }],
        }),
      ],
      openUrl: '/resume.pdf',
    }
  },
}

const stack: Command = {
  name: 'stack',
  desc: 'the tech I reach for first',
  group: 'data',
  run: async (ctx): Promise<CommandResult> => {
    let top: LangStat[] = []
    try {
      top = (await ctx.fetchLangs()).langs.slice(0, 5)
    } catch {
      /* keep the curated stack even if langs are offline */
    }
    const truth = top.length
      ? `  ground truth → top langs by bytes: ${top.map((l) => l.language).join(' ')}`
      : '  ground truth → run \'langs\' for the live footprint'
    return {
      lines: [
        line('default reach-for stack', 'accent'),
        line('  front   Next.js 16 (App Router) · React 19 · Tailwind · TS'),
        line('  back    Vercel Functions · Neon Postgres · Prisma'),
        line('  ai      Anthropic Claude · local Whisper · agentic watchers'),
        line('  infra   systemd · Tailscale · Syncthing'),
        line(truth, 'muted', { runs: [{ token: 'langs', command: 'langs' }] }),
      ],
    }
  },
}

const langs: Command = {
  name: 'langs',
  desc: 'github language footprint',
  group: 'data',
  run: async (ctx): Promise<CommandResult> => {
    try {
      const { langs: stats, totalRepos } = await ctx.fetchLangs()
      if (!stats.length) {
        return { lines: [line('no language data available right now.', 'muted')] }
      }
      const totalBytes = stats.reduce((s, l) => s + l.bytes, 0)
      const maxBytes = stats[0].bytes
      const labelW = Math.min(
        14,
        Math.max(...stats.map((s) => s.language.length)) + 1
      )
      const rows = stats.map((s) => {
        const pct = totalBytes > 0 ? Math.round((s.bytes / totalBytes) * 100) : 0
        return line(`  ${s.language.padEnd(labelW)}${bar(s.bytes, maxBytes)}  ${pct}%`, 'accent')
      })
      return {
        lines: [
          line(`github language footprint  ·  ${totalRepos} repos aggregated`, 'accent'),
          ...rows,
          line("→ 'open architecture' for the full tech constellation", 'muted', {
            runs: [{ token: 'open architecture', command: 'open architecture' }],
          }),
        ],
      }
    } catch {
      return { lines: [line('fatal: unable to reach language stats (offline)', 'error')] }
    }
  },
}

function resolveOpenTarget(
  target: string,
  projects: TerminalProject[]
): { navigate?: string; openUrl?: string } | null {
  const t = target.toLowerCase()
  if (NAV_ROUTES[t]) return { navigate: NAV_ROUTES[t] }
  const proj = projects.find((p) => p.slug.toLowerCase() === t)
  if (proj) {
    if (proj.href && !/github\.com/i.test(proj.href)) return { openUrl: proj.href }
    return { navigate: `/projects#${proj.slug}` }
  }
  return null
}

const open: Command = {
  name: 'open',
  desc: 'jump to any section',
  group: 'core',
  run: async (ctx): Promise<CommandResult> => {
    const target = (ctx.args[0] || '').toLowerCase()
    if (!target) {
      return { lines: [line("usage: open <page|project>. try 'ls pages'.", 'muted', {
        runs: [{ token: 'ls pages', command: 'ls pages' }],
      })] }
    }
    if (target === 'resume') {
      return { lines: [line('→ routing to /resume …', 'accent')], navigate: '/resume' }
    }
    if (NAV_ROUTES[target]) {
      return {
        lines: [line(`→ routing to ${NAV_ROUTES[target]} …`, 'accent')],
        navigate: NAV_ROUTES[target],
      }
    }
    // could be a project slug
    try {
      const projects = await ctx.fetchProjects()
      const resolved = resolveOpenTarget(target, projects)
      if (resolved?.navigate) {
        return { lines: [line(`→ routing to ${resolved.navigate} …`, 'accent')], navigate: resolved.navigate }
      }
      if (resolved?.openUrl) {
        return { lines: [line(`opening ${resolved.openUrl} ↗`, 'accent')], openUrl: resolved.openUrl }
      }
    } catch {
      /* fall through to not-found */
    }
    return { lines: [line(`no such page: ${target}. try 'ls pages'.`, 'error', {
      runs: [{ token: 'ls pages', command: 'ls pages' }],
    })] }
  },
}

const gitLog: Command = {
  name: 'git',
  aliases: ['log'],
  desc: 'my latest public commits',
  group: 'data',
  run: async (ctx): Promise<CommandResult> => {
    // `git log` vs alias `log`
    if (ctx.raw.trim().toLowerCase().startsWith('git') && (ctx.args[0] || '').toLowerCase() !== 'log') {
      return { lines: [line(`git: '${ctx.args[0] || ''}' is not supported. try 'git log'.`, 'error')] }
    }
    try {
      const commits = await ctx.fetchCommits()
      if (!commits.length) {
        return { lines: [line('no recent public commits found.', 'muted')] }
      }
      const lines: OutputLine[] = []
      for (const c of commits) {
        lines.push(line(`commit ${c.sha7}  (${c.repo})`.padEnd(40) + c.ageRelative, 'accent'))
        lines.push(line(`    ${c.message}`))
      }
      lines.push(line("  … 'open projects' for the rest", 'muted', {
        runs: [{ token: 'open projects', command: 'open projects' }],
      }))
      return { lines }
    } catch {
      return {
        lines: [line('fatal: unable to reach origin (offline) — try \'open projects\'', 'error', {
          runs: [{ token: 'open projects', command: 'open projects' }],
        })],
      }
    }
  },
}

const uptime: Command = {
  name: 'uptime',
  desc: 'live contribution streak',
  group: 'data',
  run: async (ctx): Promise<CommandResult> => {
    try {
      const c = await ctx.fetchContributions()
      return {
        lines: [
          line('operator uptime', 'accent'),
          line(`  ● online            ${c.total} contributions / 365d`),
          line(`  load (streak)       ${c.currentStreak}d current · ${c.longestStreak}d peak`),
          line(`  last commit         ${c.lastActive}`),
          line('  coffee              ∞', 'muted'),
        ],
      }
    } catch {
      return { lines: [line('fatal: uptime telemetry offline.', 'error')] }
    }
  },
}

const leetcode: Command = {
  name: 'leetcode',
  aliases: ['lc'],
  desc: 'problem-solving stats',
  group: 'data',
  run: async (ctx): Promise<CommandResult> => {
    try {
      const s = await ctx.fetchLeetcode()
      const rankLine = s.ranking ? `  ranking             #${s.ranking.toLocaleString()}` : ''
      const lines = [
        line('leetcode // problem-solving', 'accent'),
        line(`  solved              ${s.totalSolved} total`),
        line(`  breakdown           ${s.easySolved} easy · ${s.mediumSolved} medium · ${s.hardSolved} hard`),
      ]
      if (rankLine) lines.push(line(rankLine))
      lines.push(line("→ 'open leetcode' for the calendar", 'muted', {
        runs: [{ token: 'open leetcode', command: 'open leetcode' }],
      }))
      return { lines }
    } catch {
      return { lines: [line('fatal: leetcode stats offline.', 'error')] }
    }
  },
}

const contact: Command = {
  name: 'contact',
  aliases: ['email', 'hire'],
  desc: 'how to reach me',
  group: 'core',
  run: (): CommandResult => ({
    lines: [
      line(`↗ ${EMAIL}   (click to compose)`, 'accent', {
        href: `mailto:${EMAIL}`,
      }),
      line('  github   github.com/kianis4     linkedin  /in/suleyman-kiani', 'normal'),
      line("  fastest  'open about' has the form · or just reply to this line", 'muted', {
        runs: [{ token: 'open about', command: 'open about' }],
      }),
    ],
  }),
}

const clear: Command = {
  name: 'clear',
  aliases: ['cls'],
  desc: 'wipe the screen',
  group: 'core',
  run: (): CommandResult => ({ lines: [], clear: true }),
}

const ACCENTS = ['#5BC8FF', '#E8B84B', '#7FE3FF']
const ACCENT_NAMES = ['arc-cyan', 'gold', 'ice']

const theme: Command = {
  name: 'theme',
  desc: 'cycle accent hue',
  group: 'core',
  run: (): CommandResult => {
    // Determine the next accent from the current CSS var (read in the engine).
    let current = '#5BC8FF'
    if (typeof document !== 'undefined') {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue('--hud-accent')
        .trim()
      if (v) current = v
    }
    const idx = ACCENTS.findIndex((a) => a.toLowerCase() === current.toLowerCase())
    const next = ACCENTS[(idx + 1) % ACCENTS.length]
    const nextName = ACCENT_NAMES[(idx + 1) % ACCENTS.length]
    return {
      lines: [line(`accent → ${nextName} (${next.slice(1)}). 'theme' again to cycle.`, 'accent')],
      setAccent: next,
    }
  },
}

const hi: Command = {
  name: 'hi',
  aliases: ['hey', 'yo', 'hello'],
  desc: 'say hi',
  hidden: true,
  group: 'fun',
  run: (): CommandResult => ({
    lines: [
      line("hey 👋  i'm suleyman's site. not sure where to start?", 'accent'),
      line('  [ see projects ]   [ read résumé ]   [ contact me ]', 'normal', {
        runs: [
          { token: '[ see projects ]', command: 'ls projects' },
          { token: '[ read résumé ]', command: 'cat resume' },
          { token: '[ contact me ]', command: 'contact' },
        ],
      }),
      line("  (or type 'help' to see everything — it's just buttons too)", 'muted', {
        runs: [{ token: 'help', command: 'help' }],
      }),
    ],
  }),
}

const sudo: Command = {
  name: 'sudo',
  desc: 'superuser',
  hidden: true,
  group: 'fun',
  run: (ctx): CommandResult => {
    const what = (ctx.args[0] || '').toLowerCase()
    if (what === 'hire') {
      return {
        lines: [
          line('[sudo] password for visitor: ········', 'gold'),
          line('✔ access granted. you have excellent taste.', 'gold'),
          line('→ routing to contact …', 'gold'),
        ],
        // run contact afterward by navigating the engine: handled via chained command
      }
    }
    return {
      lines: [line("nice try. you're not root here. but 'sudo hire' works.", 'gold', {
        runs: [{ token: 'sudo hire', command: 'sudo hire' }],
      })],
    }
  },
}

const reactor: Command = {
  name: 'reactor',
  desc: 'arc reactor',
  hidden: true,
  group: 'fun',
  run: (): CommandResult => ({
    lines: [
      line('        ╭───────╮', 'accent'),
      line('      ╭─┤ ◉◉◉◉◉ ├─╮', 'accent'),
      line('      │ │  ◉◉◉  │ │', 'accent'),
      line('      ╰─┤ ◉◉◉◉◉ ├─╯', 'accent'),
      line('        ╰───────╯', 'accent'),
      line('  core: stable · output: 100%', 'muted'),
    ],
  }),
}

const konami: Command = {
  name: 'konami',
  desc: 'crt mode',
  hidden: true,
  group: 'fun',
  run: (): CommandResult => ({
    lines: [line('crt mode engaged.', 'gold')],
    setAccent: 'crt-toggle',
  }),
}

const rmrf: Command = {
  name: 'rm',
  desc: 'remove',
  hidden: true,
  group: 'fun',
  run: (ctx): CommandResult => {
    const joined = ctx.args.join(' ').toLowerCase()
    if (joined.includes('-rf') && joined.includes('/')) {
      return {
        lines: [line('lol no. but here\'s a snake: ', 'gold')],
        startGame: 'crack',
      }
    }
    return { lines: [line("rm: refusing. this isn't your filesystem.", 'error')] }
  },
}

const crack: Command = {
  name: 'crack',
  desc: 'crack the access code',
  hidden: true,
  group: 'fun',
  run: (): CommandResult => ({ lines: [], startGame: 'crack' }),
}

const play: Command = {
  name: 'play',
  aliases: ['snake'],
  desc: 'play a game',
  hidden: true,
  group: 'fun',
  run: (ctx): CommandResult => {
    // `snake` alias historically → crack game; `play` → boot sequence.
    const isSnake = ctx.raw.trim().toLowerCase().startsWith('snake')
    return { lines: [], startGame: isSnake ? 'crack' : 'play' }
  },
}

export const COMMANDS: Command[] = [
  help,
  whoami,
  ls,
  catCmd,
  stack,
  langs,
  open,
  gitLog,
  uptime,
  leetcode,
  contact,
  clear,
  theme,
  hi,
  sudo,
  reactor,
  konami,
  rmrf,
  crack,
  play,
]

// name → command (incl. aliases) lookup.
export const COMMAND_MAP: Record<string, Command> = (() => {
  const m: Record<string, Command> = {}
  for (const c of COMMANDS) {
    m[c.name] = c
    for (const a of c.aliases ?? []) m[a] = c
  }
  return m
})()

// All invokable command words (for tab-completion / ghost), visible first.
export const COMMAND_WORDS: string[] = (() => {
  const words = new Set<string>()
  for (const c of COMMANDS) {
    words.add(c.name)
    for (const a of c.aliases ?? []) words.add(a)
  }
  return Array.from(words).sort()
})()

// Parse a raw line → command + args.
export function parse(raw: string): { name: string; args: string[]; command: Command | null } {
  const parts = raw.trim().split(/\s+/).filter(Boolean)
  const name = (parts[0] || '').toLowerCase()
  const args = parts.slice(1)
  // `git log` keeps `log` as args[0]; COMMAND_MAP['git'] handles it.
  return { name, args, command: COMMAND_MAP[name] ?? null }
}

// Commands that, after running, chain into another (sudo hire → contact).
export function chainAfter(raw: string): string | null {
  const t = raw.trim().toLowerCase()
  if (t === 'sudo hire') return 'contact'
  if (t.startsWith('rm ') && t.includes('-rf') && t.includes('/')) return null
  return null
}

export type { Command, CommandContext, CommandResult }
