# suleyman.io — Canonical Design Contract

Status: **canonical**. This is the single source of truth for the suleyman.io redesign. Build directly from this. It supersedes and reconciles the prior `design.md` (stoic v1) and `design-jarvis.md` (HUD v2) into one coherent direction.

**Chosen direction:** **PROOF OF WORK base, with OPERATOR'S TERMINAL woven in.** The site is an anti-portfolio. The thesis is evidence-first. The signature is a live operator console / conductor event stream, integrated *into* the evidence layout, not bolted on as a separate hero or a separate section.

The two governing mocks:
- Base layout, grammar, and information architecture: `_directions/suleyman-io/proof-of-work.html`
- Borrowed signature element (the live agentic-OS console + conductor event stream): `_directions/suleyman-io/operator-terminal.html`

Where the two mocks differ, **proof-of-work wins on structure** (hero grammar, evidence surfaces, page flow) and **operator-terminal wins on the console treatment** (the live event stream, the status rail, the panel telemetry cards).

Where this contract and the older docs conflict, **this contract wins.** The Jarvis HUD foundations (palette, masked grid, hairline structure, motion doctrine, confidentiality guardrails, reduced-motion floor) survive from those docs and are restated here as load-bearing.

---

## 1. THESIS — the anti-portfolio

**"I don't have a portfolio. I have a running system."**

This is the entire positioning. Suleyman is not presenting a gallery of finished case studies frozen in the past. He is presenting a **system that is running right now**: a self-built agentic OS that researches, audits, ships code, and applies to jobs while he sleeps. Everything on the page is live in production, framed as a readout, not a retrospective.

The identity is **evidence-first founder/engineer.** The proof is the work that ships itself. The page's job is to make a senior engineer and a serious recruiter both think: *this person operates a real system at a level I respect, and I can verify it.*

Three load-bearing properties of the thesis:

- **Evidence over assertion.** Every claim is backed by a real running system. No adjectives doing the job of numbers. The number is the load-bearing word. If a fact can't be shown concretely (a real count, a real timestamp, a real status), it is stated as plain prose or it is cut.
- **Live over static.** The framing is present-tense and operational: `57 units live`, `last deploy 9h ago`, `all gates fail-closed`. The site reads like a status board for a system that is up, not a slideshow of things that happened.
- **System over CV.** The differentiator is that the work is *self-running*. An autobuilder that ships tested projects nightly. A career engine that prospects and tailors with a human two-tap gate. A conductor that orchestrates 57 services. This is the headline, not a footnote.

What the thesis must never become:
- A mystery-flex ("a system I never name, never explain"). Mystery-as-flex is try-hard. The system is named, shown, and concretely numbered, or it is not shown.
- A confidentiality leak. The agentic OS's *existence, scale, and capabilities* are shown impressively; proprietary specifics (client data, MHC internal system/automation names, credentials, copyable architecture detail) stay out. Capabilities are described generically. See §10.

---

## 2. HERO grammar (proof-of-work, NOT centered avatar+bio)

The hero is the anti-portfolio thesis statement, top-left-anchored, with a live system status eyebrow above it and a live metric strip below it. **There is no centered avatar. There is no bio paragraph as the lead. There is no "Hi, I'm Suleyman" greeting.**

### Grammar (top to bottom)

1. **Top bar (nav):** brand mark `SK` glyph + `Suleyman Kiani` / `Founder · Skomp Studio` on the left; mono nav links (`work · agentic os · architecture · writing`) + a `Resume ↗` CTA on the right. This is the operator-terminal/proof-of-work shared top bar.

2. **Status eyebrow (the live now-line):** a pill, mono, with a pulsing green status dot:
   `● SYSTEMS NOMINAL · 57 units live · last deploy <real> ago`
   This is the first thing that signals "live system, not portfolio." At least one value in it must be wired to a real source (see §5 and §10); values that cannot be made real are dropped from the eyebrow, not faked.

3. **The thesis headline (the payoff line):** two lines, sans, large (~`text-6xl`/60px desktop), tight tracking, top-left aligned:
   ```
   I don't have a portfolio.
   I have a running system.
   ```
   - Line 1 is in primary text color, with `I don't have a portfolio.` plain.
   - **Line 2 (`I have a running system.`) carries the cyan→gold gradient payoff** (see §6 TYPE). This is the single most important visual moment on the page: the cyan→gold ramp on the second clause is the "payoff."
   - This is the **LCP node.** Server-rendered, visible at paint, NEVER animated from `opacity:0`. An optional one-shot ~700ms cyan boot-sweep may pass over it on first paint (reduced-motion → instant final state), but the text itself is present and legible from frame 1.

4. **Subhead (sans, evidence-dense, ~54ch):** states what the systems are, in plain present tense, ending on "live in production right now, not a case study." Example (final copy, adjust facts to real values):
   `Software engineer and founder of Skomp Studio. I build agentic systems that ship themselves: a self-hosted agentic OS, an autonomous career engine, an autobuilder that researches, codes, tests and deploys projects while I sleep. Everything below is live in production right now, not a case study.`

5. **Live metric strip (4-up, immediately under the subhead):** the anchor numbers as one bordered mono strip — NOT pastel tiles, NOT a count-up ticker. See §5. The strip peeks the evidence above the fold; the hero is not forced to full-viewport height.

### Hero rules

- Hero height is content-driven (or `~60svh` desktop), never `100vh`. The metric strip and the top of the evidence layout should be reachable in the first scroll.
- No magnetic buttons, no typewriter, no blinking cursor in the hero. The terminal motif is rationed to the operator console (§4) and the build feed.
- The headline never moves on scroll. No parallax on the LCP.

---

## 3. INFORMATION ARCHITECTURE (single page, anchored scroll)

The proof-of-work layout is a **two-column evidence grid** under the hero, not a vertical stack of marketing sections. The left column is the shipped-systems service dashboard (the primary evidence). The right column is the live proof rail (the operator console, the build feed, the commit heatmap, the stack). The operator console is woven into this grid as the top of the right rail — it is part of the evidence, not a separate full-bleed section.

Section order:

1. **Hero** — status eyebrow, thesis headline (cyan→gold payoff), subhead, live metric strip (§2, §5).
2. **Evidence grid** (the body of the page, `1.55fr / 1fr` desktop split):
   - **Left column — Shipped Systems** (service dashboard with status badges; the primary evidence surface, §5).
   - **Right column — Live proof rail:**
     - **Operator console + conductor event stream** (the SIGNATURE, §4) — woven in at the top of the rail.
     - **Build feed** (`// build feed ·live`) — recent conductor heartbeat lines.
     - **Commit activity heatmap** (GitHub-style, cyan ramp, §5).
     - **Working stack** (mono chips).
3. **Experience** — reverse-chron, outcome-first (MHC: 200% quota + "shipped multiple internal automation and AI tools in production"; SKompXcel as founder; Giftcash). MHC internal system names never appear (§10).
4. **Education** — MEng ledger, A+ grades, aligned mono (§5).
5. **Contact** — stoic. `Get in touch.`, real links, resume.pdf. Footer.

On desktop, an optional persistent status line (the operator-terminal top status bar: `SYS OPERATIONAL · UPTIME · NODE skomp-server · UTC clock`) may run as a thin bar; it must carry only real or honestly-static values.

Supporting pages (`/about`, `/projects`, `/resume`, `/articles`, admin CMS) are kept and restyled to match. The full work index lives at `/projects`; the homepage shows a curated service-dashboard subset with a `view all →` affordance.

---

## 4. SIGNATURE element — the live operator console + conductor event stream

This is the borrowed soul of the operator-terminal mock, **woven into the proof-of-work evidence grid** as the top of the right-hand live rail. It is not a separate hero and not a bolt-on. It is the live, beating center of the "I have a running system" thesis — the thing that makes a visitor believe the system is real and up *right now*.

### Composition (from `operator-terminal.html`, integrated)

- **Console frame:** a titled panel with a head bar — three lamps (red/gold/green), a mono title `agentic-os / status`, and a right-aligned `● MONITORING` / `● LIVE` indicator. Subtle border in low-alpha cyan, faint inset glow. The whole panel sits on the dark surface with the hairline top-accent line shared by all cards.

- **Telemetry cards (2×2 grid inside the console):** compact mono readouts, each with a left accent bar (cyan, one gold). Examples (every number real or removed, §10):
  - `Agents live · N watchers · all gates green · 0 stranded`
  - `Shipped this wk · N builds · published / in review` (gold accent card)
  - `Jobs in pipeline · N tracked · tailored · awaiting tap`
  - `KB / RAG memory · 3 vaults · synced · bge-m3 indexed`

- **Conductor event stream (the live feed):** the signature motion. A titled feed (`conductor · event stream`) with a `● LIVE` pulse, rendering recent real events in mono rows: `<ts> <icon> <agent> <message> <tag>`. Examples:
  ```
  04:30:12  ▪  autobuilder shipped deal-audit-cli · 25/25 tests
  04:18:44  ▪  career-engine tailored resume → approval queue
  03:55:01  ▪  auto-research ingested topic → 3 vaults
  03:30:00  ▪  v1-watcher audited deal · READY reply sent
  ```
  Icons are tiny square cyan/gold/green dots. Rows alternate a near-transparent stripe. The feed reads as a tail of a real log.

- **Self-healing cue (tasteful, true):** one node/line may flicker to a `recovering…` state then resolve back to `● online`, conveying that the system watches itself (liveness/health checks, fail-closed gates, auto-recovery). Every label stays true and generic. This is the "advanced + self-healing" narrative from the Jarvis doc, kept conceptual.

- **Lineage line (one mono line):** `inspired by Karpathy's LLM-OS · compounding memory`. Karpathy's ideas are public; the reference signals sophistication without exposing anything proprietary.

- **One honest prose line:** what it is and why, generic: a personal multi-agent operating system that compounds research, ops, and engineering, with deterministic fail-closed gates and human-tapped publishes. Built on Claude (mentioned tastefully, no internal architecture exposed).

### Data honesty (load-bearing)

The console is the highest-stakes authenticity surface on the page. **No fabricated live telemetry.** A hardcoded `queued: 3` discovered in devtools is a fatal authenticity loss with this audience. Every number is wired to a real value (a server route reading real state — live unit count, last-run timestamps, real build/job counts, real vault sync state) or it is shown as honest static prose. If a source is down, degrade gracefully (hide or freeze with a stale-marker), never fake. See §10.

### Motion

The event-stream feed may animate new lines in (transform/opacity only, occupying final box from frame 1). Directional data-pulses on any system-map connectors are transform/opacity only and pause under reduced-motion. No looping rAF that runs offscreen. Reduced-motion → the feed renders its current lines static, no animation.

---

## 5. EVIDENCE surfaces

The page is built out of four concrete evidence surfaces. All four are real material only (§11). All four use mono for data, sans for prose, the cyan/gold functional accents, and the hairline card structure.

### 5.1 Live metric strip (hero)

A single bordered 4-up strip (wraps 2×2 on narrow). Each cell: a large mono number (cyan emphasis, gold for a single accent digit) + a small mono uppercase label. **Numbers are stated, not counted-up** (count-up is SaaS boilerplate and contradicts the thesis; render final `tabular-nums` immediately). Example content (use real values):

```
57            3 +1           14k+            100%
live          always-on      autonomous      human-gated
systemd units email watchers commits         publishes
```

`57` and the watcher count are wired to real system state where possible; `100%` (human-gated publishes) is a true policy fact. No leading `~` on exact numbers.

### 5.2 Shipped Systems — service dashboard (NOT project cards)

The primary evidence surface, left column. This is a **service dashboard**, not a grid of portfolio project cards. Each row is a running system with a status badge, framed as "is it up," not "here's a case study."

Row anatomy:
- **Status dot** (cyan = live/now, gold = accent/key, green = healthy) + **system name** (sans, semibold).
- **One-sentence capability description** (sans, ~46ch), concrete and present-tense.
- **Mono tech tags** (non-interactive, plain mono, not bracketed-ASCII).
- **Right-aligned status readout** (mono): a big word (`live` / `nightly` / `prod` / `2-tap`) + a small qualifier (`24/7 uptime` / `2:00am ET` / `paying client` / `apply gate`).

Real systems (the catalog — real material only, §11):
- **The Agentic OS** — self-built operating layer across two machines: conductor, memory/RAG, 57 timers, watcher jails; runs unattended on a home server. `live · 24/7 uptime`.
- **The Career Engine** — always-on prospect → tailor → approval loop; aggregates ATS sources, grounds every resume claim to a fact inventory, auto-applies behind a two-tap human gate. `2-tap · apply gate`.
- **The Autobuilder** — mines ideas from a knowledge vault, then researches, specs, builds, tests, and previews a full project nightly; sandboxed, fail-closed, never auto-published. `nightly · 2:00am ET`.
- **Solstice — Skomp Studio** — production SaaS for a real client. Next.js 16 + Neon Postgres + Prisma on Vercel; read-only Sentry triage + an advisory improvement-pool agent. `prod · paying client`.

Footer of the card: `// curated from a live catalog — not a screenshot gallery` and a `view all →` to `/projects`. Badge in the card head: `● ALL RUNNING`.

### 5.3 Build feed (live)

Right rail, under the console. A terminal-styled card showing recent conductor heartbeat lines (`✓` ok / `▶` building / `dim` notes), e.g. `career-tailor drained 2 jobs → queue`, `v1-watcher audit READY · 4m reply`, `autobuilder building slug#…`, `kb-autocommit 3 vaults snapshotted`, `restic backup 9 snapshots · B2`, closing on `— all gates fail-closed · publishes human-tapped`. Real or honestly-static; the `last 30s` badge is decorative framing, not a fake live counter unless wired.

### 5.4 Commit heatmap (GitHub-style, cyan ramp)

Right rail. A 26-week × 7-day contribution grid in the **cyan ramp** (`rgba(91,200,255,.06)` empty → `.22` → `.42` → `.66` → solid `--cyan`). Header badge `26 wks`; footer `build-in-public · half a year` with a `less ▢▢▢▢▢ more` scale legend. **Wire to real GitHub contribution data** (a tiny cached server route over the public contributions calendar). If the source is down, degrade gracefully — do not ship a permanently fabricated grid as if it were live; a deterministic placeholder is acceptable only if clearly not presented as a live number.

### 5.5 Working stack

Right rail, bottom. Mono chips with cyan-bolded key technologies: `Next.js 16 · TypeScript · Python · Neon Postgres · Prisma · Vercel · systemd · Anthropic · LanceDB · Playwright`. Plain, non-interactive.

---

## 6. TYPE

- **Sans — Inter** (self-hosted via `next/font`, `display:swap`, sized fallback). Carries the headline, subhead, all prose, system names, descriptions. The majority of visible area is sans.
- **Mono — JetBrains Mono** (self-hosted via `next/font/local`, variable woff2, `display:swap`, `--font-mono` → Tailwind `fontFamily.mono`). **Reserved for all data and readouts:** numbers, paths, tags, grades, status pills, nav links, the metric strip, the console, the event stream, the build feed, the heatmap legend, the stack chips. The woff2 must be committed before the font-wiring step (build-blocker otherwise).
- **The mono/sans split is the engineering signal.** If any section exceeds ~50% mono by visible area, rebalance toward sans — except inside the console, which is legitimately a machine surface.

### The cyan→gold accent split (the payoff line)

The single signature type treatment: the second clause of the hero headline (`I have a running system.`) renders with a left-to-right gradient that ramps **cyan → light-cyan → gold**:

```css
background: linear-gradient(100deg, var(--cyan), #A9E4FF 60%, var(--gold));
-webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
```

Cyan reads as "live / now / system"; gold reads as "the payoff / the accent." The ramp visually performs the thesis: the live system *is* the payoff. This gradient is used **only on the payoff line** — it is not sprinkled across other headings.

Type scale: hero headline ~`text-6xl` (60px) desktop / `clamp` down on mobile, normal-to-bold weight, tight tracking; section h2 `text-3xl`/`text-4xl`; record/system names `text-lg`/`text-xl`; mono data `text-xs`/`text-sm`; metric-strip numbers ~30px mono bold.

---

## 7. COLOR

Functional, not decorative. Three load-bearing roles plus surface/text neutrals.

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#06080B` | page background (near-black) |
| `--ink-2` | `#0A0E14` | gradient floor for panels |
| `--panel` | `#0C1118` | cards, console, panels |
| `--panel-2` | `#0E141C` | secondary panel surface |
| `--line` | `rgba(91,200,255,.12)` | cyan hairline borders, structure |
| `--line-2` | `rgba(255,255,255,.06)` | neutral hairline dividers |
| `--cyan` | `#5BC8FF` | **live / now / system.** Status dots, active state, links, console accent, heatmap ramp, the cyan half of the payoff gradient. |
| `--gold` | `#E8B84B` | **the payoff / the accent.** Used sparingly: the payoff-line gradient terminus, one key metric digit, one gold telemetry card, the `▶ building` marker. A whisper, not a coat. |
| `--green` | `#46E5A0` | health / OK status (the live dot, `✓` feed lines, `● ALL RUNNING`). |
| `--txt` | `#E6EEF6` | primary prose |
| `--txt-2` | `#9FB0C0` | secondary prose, labels |
| `--txt-3` | `#5E6E7E` | muted meta, dim feed lines |

Rules:
- Cyan is the system color and may appear throughout (structure, status, links). Gold is rationed to genuine payoff/accent moments — if gold appears more than ~3–4 times on screen, it has become decoration; pull it back.
- No second chromatic hue. The page is cyan + gold over near-black, with green reserved strictly for health status.
- Dark is the default and the designed-for surface. (A light mode, if kept, is a desaturated inversion; the design target is dark.)

---

## 8. HUD texture

Restrained, structural, no glow blobs.

- **Masked grid:** a fixed, very-low-alpha cyan grid (`linear-gradient` 1px lines, ~46–48px cells) behind content, **radially masked** so it fades out away from the upper-right focal area (`mask-image: radial-gradient(... at 70% 0%, #000 35%, transparent 78%)`). `pointer-events:none`, `z-index:0`, static.
- **Two soft radial glows** in the page background only: one cyan upper-right (~10% alpha), one faint gold lower-left (~5% alpha). These are large, soft, static CSS gradients on the body — **not** animated blurred circles, not `backdrop-filter`, not the iOS-killing blur layers. (This is the one allowed ambient glow; it is a wash, not a blob.)
- **Hairline structure:** every card has a 1px cyan top-accent line (`linear-gradient(90deg, transparent, rgba(91,200,255,.35), transparent)`) and low-alpha borders. Dividers between rows are `--line-2`. This hairline language is the HUD texture — structure, not ornament.
- **Optional scanline** (operator-terminal mock): a near-invisible repeating-linear-gradient overlay (`rgba(255,255,255,.012)`, `mix-blend-mode:overlay`), static, `pointer-events:none`. Allowed only on the console panel or as a whole-page wash at this near-zero alpha; never a heavy CRT effect.

Banned textures: glow blobs / animated blurred circles, film grain as a claim, `backdrop-filter` on scrolling content, heavy scanlines everywhere, ASCII box-drawing cards.

---

## 9. MOTION + reduced-motion floor

Doctrine (unchanged, enforced): **transform and opacity only.** Never animate `top/left/width/height/margin` or anything that changes document height on enter. Triggers are IntersectionObserver, never scroll listeners. No smooth-scroll hijack (no Lenis/Locomotive/GSAP ScrollTrigger). Reveals must occupy their final layout box from frame 1 (no layout shift). `will-change:transform` only on a currently-animating element, cleared on `transitionend` — never a blanket utility.

| Effect | Trigger | Animates | Reduced-motion |
|---|---|---|---|
| Hero boot sweep (one-shot, optional) | first paint | cyan sweep + mono line resolve over the (already-visible) headline | instant final state, no boot |
| Section reveal (stagger) | IO enter, observer disconnects after fire | `opacity 0→1`, `translateY 16→0` | static immediately |
| Conductor event-stream feed | feed mount / new line | new rows fade/slide in, transform/opacity, final box from frame 1 | current lines static |
| Console data-pulses / self-heal cue | ambient | transform/opacity pulse; `recovering…→online` flicker | paused / static |
| Commit heatmap | static render | nothing | unchanged |
| Background grid + glows | static | nothing | unchanged |

**Reduced-motion floor (non-negotiable, written before any motion component):**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```
Belt-and-suspenders with per-component JS short-circuits. Mobile keeps only motion that cannot shift layout; hover effects are `@media (hover:hover)` only.

iOS scroll safety (carried from prior docs, load-bearing): no `100vh` (use `svh`/`dvh`), no `w-screen`/`100vw`, no animated blurred circles, no `backdrop-filter` on scroll. **Do NOT touch `Header.tsx`'s `isHomePage = false`** (that fix is why the page scrolls on iOS). Decorative blur/mesh, if any survives, sits in its own `overflow:clip` layer; the global `overflow-x:clip` is defense-in-depth only.

---

## 10. ANTI-SLOP bans

Hard bans. A build that violates any of these is not done.

- **No portfolio template.** No Tailwind "Spotlight" clone, no SaaS landing page with gradient metric tiles, no generic dev-portfolio chrome (no `press ⌘K` hint, no magnetic buttons, no scattered blinking cursors).
- **No avatar+bio hero.** The hero is the anti-portfolio thesis (§2). No centered headshot, no "Hi, I'm…" greeting as the lead.
- **No project-card grid.** Shipped work is a **service dashboard with status badges** (§5.2), framed as "is it running," not a masonry/card gallery of case studies.
- **No lorem / no filler.** No newsletter capture, no "stay up to date," no placeholder copy.
- **No em-dashes in brand copy** (house rule). Use a period or restructure. (A literal en-dash in a date range, `2025–present`, is fine.) Also banned: exclamation marks; hype words (`passionate`, `excited`, `amazing`, `ninja`, `rockstar`, `turns ideas into reality`, `by day / by night`); insecurity words (`real` as in "real paying users", `seriously`, `at scale`, `on its own`, `on the side`); fake spatial metaphors (`underneath`, `the depth under`).
- **Every claim backed by a real running system.** No fabricated numbers anywhere. No illustrative telemetry (`queued: 3`, `uptime: 41d`) unless wired to a real value. This audience opens devtools — a hardcoded counter is a fatal authenticity loss.
- **No confidentiality leak.** Show the agentic OS's existence, scale, and capabilities impressively; keep proprietary specifics out — no client data, no MHC internal system/automation names, no credentials, no copyable architecture detail. Describe capabilities generically ("email-triggered document automation", "scheduled research + ops briefings", "multi-agent orchestration with fail-closed gates"). MHC appears only as Experience evidence ("shipped multiple internal automation and AI tools in production"), never as a clickable system.
- **No mystery-flex.** The system is named, shown, and concretely numbered, or it is not shown.

---

## 11. Real material only

Every system, number, and label on the page must trace to real life. The approved catalog:

- **The Agentic OS** — conductor + 57 systemd units across two machines, memory/RAG vaults, watcher jails (bubblewrap), self-healing health/liveness timers, fail-closed gates, human-tapped publishes. Inspired by Karpathy's LLM-OS / LLM-Wiki memory pattern.
- **The Career Engine** — always-on prospect → tailor → iOS approval queue; ATS aggregation; claim-grounding to a fact inventory; two-tap human apply gate.
- **The Autobuilder** — nightly research → spec → build → test → preview in an isolated worktree; sandboxed; fail-closed two-tier publish gate; never auto-publishes.
- **Solstice (Skomp Studio)** — production SaaS for a paying client; Next.js 16 / Neon / Prisma / Vercel; read-only Sentry triage; advisory improvement-pool agent.
- **The watchers** — always-on email-triggered document automations (generically: email-triggered document workflows; never name the internal MHC lanes).
- **The RAG vaults** — three knowledge vaults, bge-m3 indexed, synced; the compounding-memory layer.
- **57 services** — the live systemd timer/unit count (wire to real `systemctl` state where the metric strip surfaces it).
- **Experience facts** — Mitsubishi HC Capital (200% of monthly funding quota; "shipped multiple internal automation and AI tools in production"), SKompXcel (founder), Giftcash. MEng, Computing and Software, McMaster, A+ grades, exp. Dec 2026.

Numbers wired to real sources (a tiny cached server route): live unit count, last-deploy/last-run timestamps, build/job counts, vault sync state, GitHub contributions. Anything not wireable is shown as honest static prose, never as a fake live number.

---

## 12. Component / section checklist

Build order and the components each section needs.

1. **P0 / iOS safety first** — confirm `Header.tsx` `isHomePage=false` untouched; reduced-motion floor + `overflow-x:clip`/`overscroll-behavior` in CSS; no `100vh`/`w-screen`; no animated blur circles. Verify scroll on a real iPhone before redesign.
2. **Fonts + tokens** — commit JetBrains Mono woff2; wire `--font-mono`; Inter sans with sized fallback; add the §7 color tokens to Tailwind; dark-mode mechanism intact.
3. **`GridBackground`** — fixed masked cyan grid + two static radial glows + optional near-zero scanline (own layer, `pointer-events:none`).
4. **`TopBar` / nav** — brand `SK` glyph, identity, mono nav links, `Resume ↗` CTA.
5. **`StatusEyebrow`** — pulsing dot + live now-line (`SYSTEMS NOMINAL · N units live · last deploy <real>`), at least one wired value.
6. **`Hero`** — thesis headline with the cyan→gold payoff gradient on line 2 (LCP, server-rendered, visible at paint); subhead; optional one-shot boot sweep.
7. **`MetricStrip`** — bordered 4-up mono strip, static `tabular-nums`, real values (§5.1).
8. **`EvidenceGrid`** — the `1.55fr/1fr` desktop two-column layout (stacks on mobile).
9. **`ShippedSystems`** — service-dashboard card: status-dot rows, capability sentence, mono tags, right-aligned status readout, `● ALL RUNNING` badge, `view all →` footer (§5.2).
10. **`OperatorConsole`** (SIGNATURE) — console frame + lamps + `● MONITORING`; 2×2 telemetry cards (one gold); the Karpathy lineage line; one honest prose line; self-heal cue. All numbers real (§4, §10).
11. **`ConductorFeed`** — live event-stream feed inside/under the console, mono rows `<ts> <icon> <agent> <msg> <tag>`, `● LIVE`, real events, transform/opacity line-in motion (§4).
12. **`BuildFeed`** — terminal-styled recent-heartbeat card (`✓`/`▶`/dim), closing on the fail-closed/human-tapped line (§5.3).
13. **`CommitHeatmap`** — 26×7 cyan-ramp grid wired to real GitHub contributions, graceful degrade (§5.4).
14. **`WorkingStack`** — mono chips, cyan-bolded keys (§5.5).
15. **`Experience`** — reverse-chron, outcome-first; MHC generically (no internal names); lens-/value-emphasis; no fabricated metrics (§3, §10).
16. **`EducationLedger`** — aligned mono, A+ grades, Dec 2026 (§3).
17. **`Contact`** — `Get in touch.`, real links, resume.pdf, footer; no newsletter.
18. **Restyle** `/about`, `/projects`, `/resume`, `/articles` to match.
19. **Wire the real-data routes** (units, timestamps, counts, GitHub, vault state); confirm no hardcoded telemetry survives.
20. **Verify** — reduced-motion static end-states; 0px horizontal overflow at 375/1440; iPhone scroll clean; LCP is the headline; `next build` + `tsc` clean; grep the homepage for the banned set (§10) and confirm absent; confirm every on-page number is real.

---

## 13. Verification gate (must-pass before ship)

- **iOS scroll:** real iPhone (Safari, iOS 16 + 17) top↔bottom repeatedly, toolbar showing/hiding — no vibration, no stick, no horizontal pan. `scrollWidth === clientWidth` at 320/375/390/430.
- **Authenticity:** every number on the page is real or honest-static; the operator console + conductor feed + metric strip + heatmap show no fabricated live telemetry; devtools-inspectable values trace to real sources.
- **Anti-slop grep:** homepage contains no em-dash, no exclamation, none of the banned hype/insecurity words (§10); no avatar+bio hero; no project-card masonry; no newsletter.
- **Confidentiality:** no client data, no MHC internal system/automation names, no credentials, no copyable architecture detail anywhere in markup or copy.
- **Motion:** reduced-motion renders all static; LCP headline visible at paint, never opacity-animated; no animated blur circles; `will-change` cleared on `transitionend`.
- **Perf:** first-load client JS reasonable; `gsap` absent from bundle; CLS < 0.1; LCP node is the headline.
- **Visual:** the cyan→gold payoff gradient renders on the hero line-2 only; gold appears ≤ ~3–4 times on screen; the operator console reads as live and is the clear signature.

---

*Canonical as of 2026-06-22. Supersedes design.md (stoic v1) and design-jarvis.md (HUD v2). The proof-of-work anti-portfolio is the base; the operator console + conductor event stream is the woven-in signature; the Jarvis HUD palette, masked-grid texture, motion doctrine, reduced-motion floor, and confidentiality guardrails are retained.*
