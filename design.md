# suleyman.io — Full Redesign Spec

Status: design contract. Build directly from this. Stoic, fact-first, finance×engineering duality, art-directed for wide screens. Dark-first. Motion is restrained and structurally incapable of reproducing the P0 iOS scroll bug.

This is the final spec. It supersedes the draft and resolves the mobile, desktop, and tone reviews. Where the draft and a review disagreed, the review wins.

---

## 0. Reconciliation with positioning decisions (post recruiter panel)

These overrides win where they touch anything below:

- **Engineer-first lead.** Home track is fintech / finance-platform SWE. The hero, the about intro, and the `both`/default ledger order lead with the engineering identity; equipment finance + 200% quota is the differentiating edge, stated immediately after, never as the headline. The finance/eng lens toggle still exists; the *default* lens reads engineer-first.
- **Quant-dev is quiet secondary.** "Quant-dev" never appears as a primary identity, headline, or bold skill claim. It survives only as honest skill/interest signal. "ML" is described through the artifacts (Applify ML product, Micrograd) rather than asserted as an "ML Engineer" title.
- **Finance-first résumé variant** (`public/resume-finance.tex`) is a separate deliverable, not part of this site spec: leads with the equipment-finance identity, credit/deal metrics first, engineering supporting. The site and the default résumé stay engineer-first.
- **Experience reconciled to the résumé.** The on-site experience list must match the résumé exactly (Mitsubishi HC Capital, SKompXcel as founder, Giftcash). The old home Work widget's E&S Solns and SDI Labs entries (unverifiable, date-overlapping) are dropped unless confirmed real.
- **No fabricated metrics, Giftcash included.** Replace the suspicious round Giftcash percentages with realistic, varied, non-duplicated, defensible figures.

---

## 1. Vision & personality

One person, two domains, each strong on its own. The site has to make a recruiter in equipment finance and a staff engineer both think "this person operates at my level," without either feeling like the other is decoration.

Positioning in three words: **stoic, precise, dual.**

- **Stoic.** The work carries the page. No adjectives doing the job of numbers. `200% of monthly funding quota` is the sentence; the site never narrates its own seriousness, never says "real," "at scale," "on the side," or "taken seriously." Confidence comes from the fact stated flat, then moved past. The most powerful version of the strongest number is naked: `200% of monthly funding quota.` No verb, no timeframe softening.
- **Precise.** Engineer's surface, used as a *minority accent*, not a costume. Monospace is reserved for the things that are literally facts: numbers, paths, tags, grades, status. Prose is sans and carries the majority of visible area. Aligned ledgers instead of pastel tiles.
- **Dual.** Finance and engineering are two lenses over the same person, switchable, and the toggle genuinely **re-ranks the page**, not merely dims a card. The duality is earned by a real artifact (DealFlow Sandbox is the finance domain rebuilt as software), not asserted by a metaphor.

What it must never read as: a Tailwind "Spotlight" template with the content swapped, a SaaS landing page with gradient metric tiles, an AI-generated portfolio, or the current 2021-Awwwards developer-template aesthetic (terminal-green-on-black + ASCII boxes + film grain + magnetic buttons, all of which are now mass-applied template defaults).

**Anti-template discipline (the reviews' core warning).** Terminal motifs, when stacked on every section, become a derivative costume rather than a personal signal. So the terminal aesthetic is rationed to **exactly two motifs**: the duality lens toggle and the agentic-OS readout. Everywhere else, clean typographic ledgers carry the engineer signal through the mono/sans split alone. No ASCII box-drawing cards, no blinking cursors scattered around, no `press ⌘K` chrome hint, no magnetic buttons, no claim anywhere (in copy or in this spec's own user-facing strings) that a texture or a palette "proves a human made this."

The agentic OS is a **differentiator, not the headline,** and not a mystery-flex. It appears once, low, as a compact readout. It is shown concretely with at least one genuinely live number (see §5.7) or it is not shown at all. Mystery-as-flex ("never named, never explained") is itself try-hard and is dropped.

**The one true bridge, stated honestly.** Suleyman funds equipment-finance deals, and DealFlow Sandbox is him rebuilding that exact pipeline as event-driven software. That is the real, defensible connection between the two domains. The site states it plainly and never uses the fake spatial metaphor "the software underneath the deals" (you do not build software underneath a finance deal).

---

## 2. Voice & copy guide

### Rules

- No em-dashes in any personal-brand copy. Use a period or restructure. (The literal en-dash in a date range, `2025–present`, is fine.)
- No exclamation marks. No hype words: "passionate," "excited," "amazing," "ninja," "rockstar," "turns ideas into reality," "by day / by night."
- **No insecurity words.** Ban "real" (as in "real paying users"), "seriously"/"taken seriously," "at scale," "on its own," "on the side," "built to," and any fake spatial metaphor ("underneath," "the depth under"). Each of these is the reader-reassurance tell. State the fact; trust the reader.
- Present tense, declarative, fact-first. The number is the load-bearing word.
- Mono for numbers, paths, tags, grades, status. Sans for everything else. If a section is more than ~50% mono by visible area, it has over-applied the accent — rebalance toward sans.
- **No fabricated numbers anywhere.** Every digit on the site is true or it is gone. No illustrative telemetry (`queued: 3`, `uptime: 41d`, `99.9% uptime`) unless it is wired to a real value. This audience opens devtools.

### Rewrite table (final stoic copy)

| Location | Current / draft (corny, downplaying, or fake-metaphor) | Final replacement (stoic) |
|---|---|---|
| Hero headline (`page.tsx:344`) | "Equipment finance by day, shipping software by night." | **`I ship production software. I also fund equipment-finance deals.`** (engineer-first per §0) |
| Hero subhead | "turns ideas into reality" | `Production SaaS and an ML product, both with paying users. 200% of monthly funding quota at Mitsubishi HC Capital.` (engineering fact leads, finance edge second) |
| Tagline / about intro | "Progress rewards curiosity…" | `Full-stack and ML engineering. Equipment finance.` (adjacency does the work; no narration) |
| Duality / finance lens body | generic filler | `Structuring and funding equipment-finance deals at Mitsubishi HC Capital. 200% of monthly quota.` |
| Duality / engineering lens body | generic filler | `Multi-tenant SaaS in production, event-driven .NET microservices, an ML product with paying users.` |
| Education line | draft "Engineering at scale … the depth under the shipping" | `MEng, Computing and Software, McMaster. Expected Dec 2026.` |
| DealFlow Sandbox (the bridge) | (absent) | `I fund equipment-finance deals. DealFlow Sandbox rebuilds that pipeline as event-driven microservices.` |
| Agentic OS line | draft "handles research, drafting, and ops on its own" | `A multi-agent system I run for myself. Research, drafting, ops.` (autonomy is shown by the readout, not claimed) |
| Primary CTA (`page.tsx:452` "Let's Connect") + section header | "Let's Connect" / draft "read what I ship" | Button `Get in touch`. Section header `Get in touch.` (no editorializing) |
| Newsletter (`page.tsx:142`, `page.tsx:636`) | "Stay up to date" | **Remove entirely.** No fallback header, no "notes on what I'm building." It is template filler. |
| Skomp card | draft "working pilates studio … real paying members. ~100K LOC" | `Multi-tenant SaaS running a pilates studio. Paying members, in production.` LOC removed (see below). |
| Applify card | "150+ paying users and counting" | `Resume-tailoring ML product. ~150 paying users.` |
| `~100K LOC` anywhere (ledger + card) | LOC as an anchor metric | **Cut LOC.** It measures nothing and reads as résumé padding to a staff engineer. Replace the ledger slot with a load-bearing fact: `live since <year>` or paying-member count. |
| Off-hours | fitness-heavy copy | `chess 1650 · kickboxing` — the 1650 links to the chess.com/lichess profile (checkable = credible). No performative framing. |
| Stale metadata (`layout.tsx:110`) | `jobTitle: "Full-Stack Developer & Personal Trainer"` | `jobTitle: "Equipment Finance Professional & Software Engineer"` |
| Stale keywords (`layout.tsx:18-20`) | "fitness, personal trainer" | `equipment finance, full-stack engineer, ML engineer, SaaS, microservices` |
| Stale description (`layout.tsx:24`) | "technology, problem-solving, and fitness collide" | `Equipment finance professional and software engineer. Production SaaS, ML, and event-driven systems.` |

### Authenticity boosters to add (specificity defeats AI-generic)

- **One concrete, slightly mundane detail per project.** Not "multi-tenant SaaS" but the texture: e.g. for Skomp, what the studio actually needed (class booking, waitlists, Square payments for a studio that ran on paper). Concrete-and-mundane is the human fingerprint; generic-correct is what AI produces.
- **Let `200%` sit with zero framing** in the ledger and lens. No "currently running," no "roughly nine months in."
- **The chess 1650** stays out of the metrics ledger (it would flatten the hierarchy) and lives in Off-hours as a checkable link. One line, no explanation.

### Hero headline — final

`I ship production software. I also fund equipment-finance deals.` Two true facts, engineer-first (§0), no fake throughline, no adjectives. If even that feels like one beat too many, the fallback is to drop the hero sentence and lead the hero with the naked stat line (engineering metric first).

---

## 3. Information architecture

### Homepage section order (single page, anchored scroll, one scroll container)

The page leads with all three signals at once: the duality (hero + lens toggle), the work (metrics ledger immediately under the fold), and the growth narrative (MEng + trajectory), all reachable in the first two scrolls. On desktop a persistent left meta-rail (§4.6) makes the lens toggle, section nav, and a discreet agentic-status line visible from the top without scrolling.

1. **Hero** — headline, subhead, stat line, lens toggle (rail on desktop). LCP lives here, server-rendered, visible at paint, never behind a reveal.
2. **Duality panel** — the finance/engineering split, the signature interaction.
3. **Metrics ledger** — the anchor numbers as one aligned mono row, not tiles.
4. **Work showcase** — project records (Skomp, Applify, DealFlow Sandbox, SKompXcel), art-directed authored spans (not masonry).
5. **Experience** — reverse-chron 3-layer entries (timeline / outcome / stack).
6. **Credentials / education** — MEng ledger with grades.
7. **Agentic OS readout** — compact, concrete, at least one live number.
8. **Off-hours** — one line: `chess 1650 · kickboxing` (1650 links out).
9. **Contact** — `Get in touch`, real links, resume.pdf. Footer.

Lens re-ranking (see §5.2) reorders content *within* sections 3–5; the section order above is the `both` default.

### Supporting pages (keep, restyle to match)

- `/about` — long-form identity, same voice, finance×engineering framing (remove all fitness/personal-trainer copy).
- `/projects` + `ProjectsClient` — full work index. Reuse the `ProjectRecord` design at full density.
- `/resume` + `ResumeView` — keep, restyle headers to mono, fix the em-dash/`‑` separators.
- `/articles` (MDX pipeline) — keep, restyle list to clean record blocks.
- Admin CMS (`components/admin/*`) — untouched.
- **Linked-from-nav full-viewport pages** (`insta/page.tsx`, `Carousel.tsx`): these use `h-screen` (`100vh`) and share the sticky `Header`, so a recruiter who clicks them hits the same iOS toolbar-resize jump. They are **in scope** for the `100vh → 100dvh` sweep (§7 guardrails, §11 step 19). Easter-egg pages not linked from nav (`sara-stinks`, etc.) are left as-is, but their local keyframes must not be imported into the homepage.

---

## 4. Aesthetic system

### 4.1 Typography

- **Mono (the minority accent):** JetBrains Mono, self-hosted via `next/font/local` (variable woff2), `display:'swap'`, exposed as `--font-mono`, bound to Tailwind `fontFamily.mono`. **Reserved for: numbers, paths, tags, grades, status pills, the lens toggle, the agentic readout.** Not eyebrows-everywhere, not body, not headlines.
- **Sans (the body, the majority area):** Inter via `next/font`, `display:'swap'`, sized fallback to avoid CLS. Headline, subhead, all prose, project descriptions, section labels.
- Audit each section: if mono exceeds ~50% of visible text area, the duality signal collapses into wall-to-wall terminal. Rebalance.
- **Type scale (defined endpoints AND intermediate steps so hierarchy is consistent per section):**

| Role | Mobile | Desktop | Weight | Tracking |
|---|---|---|---|---|
| Hero headline | `clamp` from `text-4xl` | up to ~`text-7xl` (~80–88px) | normal (not black) | tight |
| h2 (section) | `text-2xl` | `text-3xl`/`text-4xl` | medium | tight |
| h3 (record/lens) | `text-lg` | `text-xl` | medium | normal |
| eyebrow/label | `text-xs` | `text-sm` | medium | wide, uppercase optional |
| body | `text-base` | `text-base`/`text-lg` | normal | normal |
| caption/meta (mono) | `text-xs` | `text-sm` | normal | normal |

Stoic does not mean small. On a 1440–1920 viewport the hero must reach ~`text-7xl`, or a normal-weight left-aligned block looks timid and adrift in the dark field.

### 4.2 Color (dark-first)

Keep the existing no-flash dark-mode mechanism (`modeScript`, `darkMode:'class'`, framed `fixed inset-0` background panel). The default terminal-green-teal `#3FB68B` on near-black is **the** AI/dev/hacker preset and reads as a theme, not a choice. So the accent is repalettel to a **desaturated finance-leaning slate-blue**, which also lets the two lenses share a coherent family:

| Token | Hex (dark) | Use |
|---|---|---|
| `bg` | `#0B0C0E` | page background |
| `surface` | `#131519` | cards, panels, rail |
| `border` | `#272A30` | hairlines, card borders |
| `text` | `#E8E9EC` | primary prose |
| `muted` | `#8B8F98` | labels, secondary |
| `accent` | `#6E8BD0` | single accent: desaturated slate-blue. links, active state, cursor-rare |
| `accent-dim` | `#23304D` | accent at low alpha for fills |
| `finance` | `#6E8BD0` | finance lens hint (shares accent) |
| `engineering` | `#C8CCD4` | engineering lens hint: near-white, no chromatic competition |

One chromatic accent. The two lenses are distinguished by **value/weight** (finance = the slate-blue accent, engineering = near-white) rather than two competing hues, which keeps the palette deliberate rather than preset. Light mode is a desaturated inversion; dark is the default and the designed-for surface.

### 4.3 Texture

Film grain is now a mass-applied template default, so it is **demoted to an optional, very low-opacity static overlay used purely for visual depth, with no claim attached.** If kept: one optimized PNG or tiny SVG `feTurbulence`, `pointer-events-none`, fixed behind content, **not animated**, inside its own `overflow:clip` layer. It is fine to like it; it is not evidence of anything. No animated blurred circles anywhere (that is the P0 bug).

### 4.4 Spacing & grid

- 8px base. Section vertical rhythm `py-24` desktop, `py-16` mobile.
- Prose column max `~72ch`; ledgers/showcase go wider on the canvas.
- Intentional asymmetry comes from **authored spans**, never from a packing algorithm.

### 4.5 Rationed terminal motifs (only these)

- **Lens toggle** — `[ fin ]·[ eng ]·[ both ]` segmented control (in the desktop rail, in the mobile header).
- **Agentic readout** — `agents: … · queued: …` compact line, with at least one real number.

Tech tags render as plain mono labels (`ts · next · prisma · neon`), explicitly **non-interactive** so they do not bait taps, and not bracketed-ASCII. Status uses a single accent dot + word (`● live`). No ASCII box-drawing, no scattered blinking cursors, no `$ whoami` eyebrow chrome on every section, no `press ⌘K` hint.

### 4.6 Desktop layout system (the review's #1 — load-bearing)

The page is **not** a single centered 72ch column at every width. At ≥`lg` it is a two-zone layout:

- **Persistent left meta-rail (~280px, sticky):** holds the identity line, the lens toggle, section anchor-nav, and a discreet single-line agentic status (`agents: online · queued: n`, real number, mono, low-key). The rail surfaces the differentiator at the top of a wide screen without making it the headline. It is `position: sticky; top: …`. **Critical sticky constraint:** no ancestor of the rail may set `transform`, `filter`, or `perspective` (those create a containing block and break sticky on iOS), and the `html` overflow change in §7 must be verified not to break it on iOS 16/17.
- **Right content canvas:** the sections, max-width `~1100px` of content, left-aligned within the canvas.
- **Canvas max-width and the ultra-wide margins are decided, not left to the browser.** Total designed max-width `~1440px`; beyond that the page is centered with the grain/background filling the margins (intentional letterboxing), plus optional hairline column guides. "Passes overflow checks at 1920" is not "designed for 1920" — this rail-and-canvas grid is what converts "stacked mobile blown up" into "art-directed for wide."

On mobile/tablet (<`lg`) the rail collapses: the lens toggle moves into the header, the section-nav becomes the existing mobile Popover, and content is single-column stacked flow (no pinned rail — avoids nested sticky scroll contention on iOS).

---

## 5. Section-by-section homepage spec

### 5.1 Hero

- **Desktop:** rail (§4.6) on the left holding identity + lens toggle; hero content in the canvas, left-aligned. Headline reaches ~`text-7xl`.
- **Mobile:** plain stacked flow, no pinned rail.
- **Hero height:** **not** forced full-viewport on desktop. A shorter hero lets the metrics ledger peek above the fold (serving the "leads with all three at once" goal) instead of one headline per screen on a 1440×900 laptop. Use `min-h-[60svh]`-class on desktop, content-height on mobile. Where any viewport-height is used it is `svh`/`dvh`, never `100vh`.
- **Content:**
  - Sans headline (§2 final). This is the LCP node — server-rendered, visible at paint, never animated from `opacity:0`.
  - Sans subhead (§2 final).
  - Mono stat line, single row wrapping gracefully: `200% quota · ~150 paying users · 100+ mentored` (LOC removed; tilde dropped where the number is exact — see §5.3).
  - Two buttons: `Get in touch` (primary), `View work` (secondary, scrolls to showcase). **No magnetic effect.**
- **Interaction:** stat line and buttons may fade-up on first paint with a tiny stagger; the headline does not (LCP). No typewriter, no blinking cursor in the hero (terminal motif is rationed to the two in §4.5).

### 5.2 Duality panel (signature) — must re-rank, not dim

- **Layout (desktop):** two columns, deliberately uneven (≈55/45). Finance lens left, engineering lens right, each a labeled card.
- **The toggle genuinely re-ranks the page.** Dimming one card is not a flourish, it reads as broken. On select:
  - `fin` → the **metrics ledger reorders** to lead with quota; the **work showcase reorders** to surface DealFlow Sandbox and finance-adjacent work first; experience emphasizes Mitsubishi HC Capital.
  - `eng` → software metrics lead; Skomp and Applify lead the showcase; engineering experience emphasized.
  - `both` → the default order in §3.
- **View Transitions, done as named groups (not the stock root cross-fade).** Assign `view-transition-name` to the specific elements that actually move: each lens card, each reordering ledger number, each reordering project record. They then FLIP/slide to new positions (crafted) rather than the whole viewport dissolving (the corny default). A full-page opacity dissolve is explicitly banned here.
- **iOS / unsupported-browser fallback is a real CSS cross-fade, not "instant class swap."** SPA View Transitions only ship on Safari ~18.2+, so a large share of iOS 16/17 visitors — the exact device that filed the bug — get the fallback. The fallback therefore uses a FLIP/opacity transition on the reordering elements so the signature interaction still animates everywhere, instead of degrading to a hard cut on mobile. Feature-detect `document.startViewTransition`; if absent, run the same reorder with a CSS opacity/transform transition.
- **Persist** to `localStorage['lens']`, read on mount, `aria-pressed`, keyboard-operable.
- **Mobile:** cards stack; the toggle still re-ranks via `order` + transform/opacity only (never height); CSS-cross-fade fallback path.
- **Do not caption the cleverness.** The interaction is built, not narrated. No on-page text explaining why the toggle is impressive.

### 5.3 Metrics ledger

- One aligned mono ledger row (wraps to 2×2 on narrow), not four pastel tiles.
- **Numbers are stated, not performed. No count-up.** Animated counting tickers are SaaS-landing boilerplate and contradict the stoic thesis; a stoic ledger states the number. Render final `tabular-nums` values immediately. This also removes a whole motion/jank/LCP surface (the count-up-from-zero LCP-instability risk on short mobile viewports disappears entirely).
- **Drop leading `~` on exact numbers.** `~150` hedges; if the count is known, state `150`. Use `~` only where the value is genuinely an estimate, and prefer a precise alternative.
- Content (number mono+bold, label mono+muted), LOC slot replaced with a load-bearing fact:
  ```
  200%         150            100+           live since 20XX
  funding      paying users   learners       Skomp Studio
  quota        Applify AI     mentored       in production
  ```
- `200%` is the largest; quota leads in `both` and `fin`. Chess/kickboxing are not here.

### 5.4 Work showcase — authored editorial layout (not masonry)

- **Drop masonry.** With exactly 4 projects, a packing algorithm produces ragged accidental whitespace on a wide screen and cannot be both "pre-measured stable heights" and "masonry" at once. Use a deliberate art-directed grid with **authored spans per breakpoint**: e.g. one full-bleed hero card spanning 2 columns, the other three in varied spans below. Pre-author the spans; intentional asymmetry is authored, not algorithmic.
- **DealFlow Sandbox is the keystone of the duality narrative** (it is the finance↔engineering bridge) and is surfaced prominently, and leads the showcase in the `fin` lens reorder.
- **Card = clean typographic record**, not an ASCII box. Mono path label, single accent status pill, one-sentence sans outcome plus the one concrete mundane detail (§2 boosters), non-interactive mono tech tags.
- **Hover-peek uses opacity cross-fade of two pre-rendered images, not a `filter: grayscale()` animation.** Animating `filter` on a raster image is a repaint/composite cost and contradicts the transform/opacity-only doctrine; two stacked images cross-faded by opacity keeps the doctrine honest. (If grayscale is truly wanted, it is a *static* base state revealed to color by opacity, no `filter` transition.)
- DealFlow gets a small **inline SVG** event-flow diagram (commit to SVG, not ASCII — ASCII aliases and goes ragged at Retina DPI in a proportional container) with mono labels.
- **Interaction:** staggered fade-up on scroll (IO, `transition-delay` by index), transform/opacity only. `view-transition-name` on each record to morph into its `/projects` detail.

### 5.5 Experience

- Reverse-chron, 3-layer entries: mono timeline (`2025–present`), sans outcome (not a task list), mono stack tags.
- Mitsubishi HC Capital leads (200% quota, deal funding/structuring), prior roles condensed. Outcomes over duties.
- Fade-up per row, IO, no layout shift. Reorders under the lens (§5.2).

### 5.6 Credentials / education

- Aligned mono ledger, not a card grid:
  ```
  education

  MEng, Computing and Software · McMaster · Year 1 complete · exp. Dec 2026
    A+   Simple Type Theory
    A+   Microservices-Oriented Architectures
  ```
- Grades carry the weight. No badges, no "proud to share." Use the plain label `education`, not `~/education` chrome (terminal motif is rationed).

### 5.7 Agentic OS readout (concrete, real number)

- A single compact panel, low on the page, mono. Also surfaced as a one-line status in the desktop rail (§4.6).
- **At least one number is wired to a real value** (e.g. `uptime` from a real endpoint, or a real `last run` timestamp). Numbers that cannot be made real are not shown as numbers — the agent cadence is shown as static prose instead. **Never fake live telemetry.** A hardcoded `queued: 3` discovered in devtools is a fatal authenticity loss with this audience.
- Content (illustrative shape; every digit must be real or removed):
  ```
  agents: online · uptime: <real> · last run: <real>
  A multi-agent system I run for myself. Research, drafting, ops.
  ```
- **Interaction:** static. No looping animation, no offscreen rAF, no typewriter. The prose line is plain. Autonomy is demonstrated by the readout being real, not by the words "on its own."

### 5.8 Off-hours

- One line: `off-hours: chess 1650 · kickboxing`, where `1650` links to the chess.com/lichess profile. Mono number, sans framing, no explanation.

### 5.9 Contact

- Header (sans): `Get in touch.`
- Links (mono): `Get in touch` (email), `resume.pdf`, GitHub, LinkedIn.
- **No newsletter capture** (removed at both `page.tsx:142` and the `<Newsletter />` mount at `page.tsx:636`). Footer keeps existing structure, restyled.

### 5.10 ⌘K command palette — deferred / optional v1-cut

A ⌘K palette is now itself a dev-portfolio template signal, is the single heaviest new client island (focus trap, fuzzy match, keyboard nav), and is the least load-bearing thing for the bug or the recruiter story. It is **cut from v1** by default. If included later: it must do something genuinely useful (jump to a live project, fuzzy-find articles), be lazy-imported behind `requestIdleCallback`, carry **no** `press ⌘K` chrome hint (let it be discovered), and the framing that it "proves I build tools" is dropped. The lens toggle already carries the "I build tools" signal.

---

## 6. Motion spec

Global doctrine: **transform and opacity only.** Never animate `top/left/width/height/margin` or anything that changes document height on enter. Triggers are IntersectionObserver, never scroll listeners. No smooth-scroll-hijack library (no Lenis/Locomotive/GSAP ScrollTrigger). Reduced-motion drops everything to static end-states. Mobile keeps only motion that cannot shift layout.

**Reduced-motion floor (written before any motion component).** A single global CSS block is the non-negotiable floor, belt-and-suspenders with per-component JS short-circuits:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

| Effect | Trigger | Animates | Perf budget | Reduced-motion | Mobile rule |
|---|---|---|---|---|---|
| Section reveal (stagger) | IO enter, `rootMargin: 0px 0px -10% 0px`, `threshold 0.15`, observer disconnects after fire | `opacity 0→1`, `translateY 16px→0` | one shared `<Reveal>` island; CSS transition | static immediately (global floor + `setShown(true)`) | kept (transform/opacity, occupies final box from frame 1) |
| Lens re-rank (SIGNATURE) | click toggle | named-group VT FLIP/slide of cards + reordering numbers + records; CSS opacity/transform fallback | native VT; if Motion ever used for a spring, lazy `dynamic(ssr:false)`, gated | instant final order, no transition | works everywhere via CSS-cross-fade fallback; reorder via `order`+transform, never height |
| Project hover-peek | hover, `@media (hover:hover)` | opacity cross-fade of two pre-rendered images | opacity only, no `filter` animation | static (final image shown) | **off** (no hover); card fully legible without it |
| Film grain | static | nothing | one PNG/SVG, no animation, `pointer-events-none` | unchanged | unchanged |
| Background | static fixed layer | nothing | CSS gradient or one image; **no `backdrop-filter`, no animated blurred circles** | unchanged | unchanged |

**Removed from the draft on purpose:** count-up (§5.3, stoic + LCP), hero typewriter and blinking cursor (rationed terminal motif), magnetic buttons (2021 cliché, fires nothing useful, cut entirely).

**`will-change` discipline:** set `will-change: transform` only on a currently-animating element and clear it on `transitionend`. Never a blanket utility (exhausts the iPhone GPU layer budget → stutter).

---

## 7. Scroll-bug fix (P0, iPhone judder/stick)

### Root cause (confirmed against source)

The full-bleed Applify section (`page.tsx:523-624`) is a stack of iOS compositing offenders, **two** blur pairs plus two live animations:

1. `page.tsx:524` — `absolute inset-0 opacity-10` wrapper with **no `overflow` of its own**, containing two off-screen-offset `blur-3xl` circles (`page.tsx:525-526`, `-right-20`/`-left-20`).
2. `page.tsx:581` — a **second** `absolute inset-0 … rounded-3xl blur-3xl` layer, with a sibling `page.tsx:582` `backdrop-blur-sm` card carrying a live `transform hover:-rotate-1`. A `blur-3xl` `inset-0` layer next to a `backdrop-blur-sm` element with a live transform is the exact iOS compositing-contention pattern. This card is `order-1 lg:order-2` and stacks **full-width on mobile**.
3. `page.tsx:594` and `page.tsx:609` — `animate-float` and `animate-pulse` on `backdrop-blur`/gradient elements: continuously-animating compositor layers stacked on top of `backdrop-blur-sm`. (`animate-float` has **no keyframe defined** in `tailwind.config.js` or any CSS — it is a dead/undefined class, but the live `animate-pulse` and the compositor stacking are real offenders regardless.)

On iOS Safari a large `filter: blur()` layer with a negative offset, sibling `backdrop-blur`, and a live transform/animation intermittently fails to clip even inside an `overflow-hidden` ancestor; the document gains a few px of horizontal `scrollWidth`, and the horizontal/vertical scroll contention plus the rubber-band overscroll produces the "vibration" and the hard stop. There is currently **no `overflow-x` guard and no `overscroll-behavior`** anywhere. Secondary offender: the Photos-strip `<video … controls>` (`page.tsx:286`) invites the iOS native control/fullscreen layer in a `flex-wrap` strip.

### Exact fix — delete the section first, do not surgically patch one of two blur pairs

The draft's instinct ("in the redesign this section is replaced") is promoted to the **primary** instruction, because patching one blur pair while the section is slated for deletion ships the bug from the *other* pair.

1. **Step 1 (standalone, before any redesign): delete the entire Applify section (`page.tsx:523-624`).** It is being replaced by the §5.4 `ProjectRecord` anyway. This removes both blur pairs (524-526 **and** 581-582), the `backdrop-blur-sm` + live `transform` card, and the `animate-float`/`animate-pulse` layers (594, 609) in one move. If for any reason a slice survives the interim, clip **both** blur layers (524 *and* 581) at their own parent with `overflow:clip`, drop the `backdrop-blur-sm`, and remove `animate-float`/`animate-pulse` — but deletion is the correct path.
2. **Per-element clipping is the primary guard; the global rule is defense-in-depth only.** Add to `src/styles/tailwind.css`:
   ```css
   html, body { overflow-x: clip; overscroll-behavior-y: none; }
   ```
   But `overflow-x: clip` on `html`/`body` does **not** reliably contain a blurred GPU layer that overdraws — Safari can composite the blur outside the clip in exactly this failure mode. So every decorative blur/mesh that survives the redesign must sit inside **its own element with `overflow: clip`**; the global rule is a safety net, not the fix. `clip` (not `hidden`) preserves the sticky rail.
3. **Verify the sticky rail still sticks after the `html` overflow change.** Setting `overflow` on `html` can break `position: sticky` on some iOS 16/17 versions when a scroll container is established. Explicit test: the desktop meta-rail (§4.6) must still stick on iOS 16 and 17 after step 2. If it breaks, move the overflow guard to a dedicated wrapper element instead of `html`.
4. **Remove `controls` from the Photos `<video>` (`page.tsx:286`);** keep `autoPlay loop muted playsInline preload="none"`, mount in-view via IO, or replace with a poster image that loads the video on tap.

### Build-config reality (the draft assumed a stack that does not exist)

- `next.config` is **`next.config.mjs`** (not `.ts`), with a custom `webpack()` block, a `file-loader` rule for `mp4/webm/...`, and `config.resolve.alias.canvas = false`.
- `package.json` scripts pin **`next dev --webpack` / `next build --webpack`** — the project runs on **webpack, not Turbopack.** The `file-loader` mp4 pipeline is why the video is a raw `<video>` and not a static-imported `next/image`-style asset.
- Therefore: any View-Transitions config goes in **`next.config.mjs`**, and the decision is **stay on webpack** for now (the `--webpack` flag and the `file-loader` rule are load-bearing). Do not assert `next.config.ts`/Turbopack. If/when the video moves to a static import, the `file-loader` rule and the raw `<video>` are removed together — that is a separate, explicit migration, not a side effect of the VT change.

### Guardrails (prevent recurrence)

- Page wrapper `<div className="relative overflow-x-clip">`; no full-bleed element uses `w-screen`/`100vw` (use `w-full`).
- All viewport-height blocks use `min-h-[100svh]`/`dvh`, never `100vh` — including `insta/page.tsx` and `Carousel.tsx` (`h-screen`), which are linked from nav (§3).
- All decorative blur/mesh: static, behind content, inside an own-`overflow:clip` layer, transform/opacity only, reduced-motion gated. No animated absolutely-positioned blurred circles, ever.
- No `transform`/`filter`/`perspective` on any ancestor of the sticky rail.
- Reserve space for everything (images get explicit dims or `aspect-ratio`) so reveals never shift the IO root.
- `overscroll-behavior-x: contain` on any horizontal scroller.
- `overscroll-behavior-y: none` on `body` is a **deliberate** UX change: it disables iOS pull-to-refresh site-wide. This is intended (it is part of killing the rubber-band). If pull-to-refresh is wanted back, use `contain` instead of `none`.
- Dev/CI guard: a snippet flagging any element with `scrollWidth > documentElement.clientWidth`.

### Dependency cleanup (verify, do not assert)

- `gsap@3.12` and `framer-motion@12` are **both installed today.** The doctrine "skip GSAP, Motion surgical only" is meaningless while they sit in the bundle. Step: **remove `gsap` from `package.json`**, grep every `framer-motion`/`gsap` import across the repo, and confirm none ship in the homepage initial bundle. Verify with a bundle check, do not assert.

---

## 8. Mobile vs desktop

| Concern | Desktop | Mobile |
|---|---|---|
| Layout | Sticky meta-rail (~280px) + canvas, max ~1440px, letterboxed beyond | Single-column stacked flow, no pinned rail |
| Lens toggle | In the rail; named-group VT re-rank | In header; re-rank via `order`+transform; CSS cross-fade fallback |
| Hero height | `~60svh`, ledger peeks above fold | content-height, `svh`/`dvh` only |
| Hover-peek | On (`hover:hover`), opacity cross-fade | Off; cards fully legible without hover |
| Magnetic buttons | **Removed entirely** | n/a |
| Count-up | **Removed** (static numbers) | static |
| Mesh/grain | static | static |
| Reveals | on (transform/opacity) | on (cannot shift layout) |
| Photos/video | inline muted loop, no controls | `preload="none"`, mount in-view, no controls |
| Touch targets | n/a | see §8.1 |
| `content-visibility` | on long below-fold sections | on, **but gated** (§9 note) |

### 8.1 Touch targets (enforced, not asserted)

- Each lens-toggle segment: `min-height: 44px`, and a stated `min-width` per segment (`≥ 64px` for `fin`/`eng`/`both`) so the three small mono segments — the highest-risk tiny-tap target on the page — are reliably tappable at 375px.
- Tech tags are **non-interactive** (stated in markup/aria) so their tappable look does not bait taps.
- Verification is a **measured** step, not a visual one: assert rendered hit-boxes ≥ 44×44 at 375px (§12).

---

## 9. Portfolio showcase + credentials

### Project record (clean typographic block, not ASCII)

```
skomp-studio                                   ● live
Multi-tenant SaaS running a pilates studio.
Class booking, waitlists, Square payments. Paying members, in production.
ts · next · prisma · neon
                                  hover: <one real metric>
```

- Mono path label (`skomp-studio`), single accent status pill (`● live`).
- One sentence outcome + one concrete mundane detail (sans).
- Non-interactive mono tech tags (not bracketed-ASCII).
- Hover-peek: one **real** metric, opacity cross-fade of two pre-rendered images, no `filter` animation, no layout shift.
- **Authored spans, not masonry.** Showcase order in `both`: Skomp Studio → Applify AI → DealFlow Sandbox → SKompXcel. In `fin`: DealFlow Sandbox leads.

DealFlow event-flow diagram is an **inline SVG** (crisp at Retina), mono labels: `order → validate → credit → event-bus → fund → ledger`.

### Credentials (education ledger)

```
education

MEng, Computing and Software · McMaster · Year 1 complete · exp. Dec 2026
  A+   Simple Type Theory
  A+   Microservices-Oriented Architectures
```

Aligned mono, understated. Grades and the Dec 2026 date get their own aligned lines. No badges, no card grid, no "proud to share."

---

## 10. Tech & components

### Next 16 approach

- Homepage stays a **Server Component**; only islands are `'use client'`.
- `next/font/local` for JetBrains Mono (variable woff2, `display:'swap'`, `--font-mono` → Tailwind `fontFamily.mono`). **The woff2 must be committed to the repo before the font-wiring step runs** — it is not in the repo yet and is a build-blocker if step 3 runs first (§11). `next/font` Inter for sans with sized fallback.
- `next/image` for every photo, static-imported where possible. The Photos-strip `<video>` stays a raw `<video>` for now because the `file-loader`/webpack pipeline serves it (§7); revisiting that is a separate migration.
- **View Transitions config goes in `next.config.mjs`** (the real file), staying on webpack (`--webpack` scripts). Use named `view-transition-name` groups (§5.2) for the lens re-rank and the record→detail morph. Feature-detect at runtime; CSS-cross-fade fallback for unsupported Safari.
- `dynamic(() => import(...), { ssr:false })` for any browser-only island.

### Motion library decision

- **Default: CSS + IntersectionObserver via one tiny `<Reveal>` island.** Reveal is pure CSS (`opacity` + `translateY`); JS only flips a `data-shown` class. Single shared observer.
- **`tailwindcss-animate`** for `animate-in fade-in slide-in-from-bottom-*` utilities paired with the `data-[shown]` toggle.
- **`motion`: surgical only**, lazy `dynamic(ssr:false)`, reduced-motion gated, only if a lens spring needs more than VT + CSS. Never wrap every section in `motion.div whileInView`.
- **Remove `gsap` from dependencies** (§7). **Skip:** GSAP/ScrollTrigger, Lenis, Locomotive, AOS.

### New components to build

- `Reveal` (IO island, reduced-motion short-circuit, `will-change` cleared on `transitionend`).
- `LensToggle` (`localStorage`, named-group VT + CSS fallback, `aria-pressed`, 44px segments).
- `DualityPanel` (two-lens cards; drives re-rank).
- `LensProvider` (context holding `lens`, re-rank order for ledger/showcase/experience).
- `MetricsLedger` (aligned mono row, static `tabular-nums`, reorders by lens).
- `ProjectRecord` (clean record block; reuse on `/projects`; reorders by lens).
- `SystemStatus` (agentic readout + rail line; at least one real number).
- `EducationLedger` (aligned mono).
- `MetaRail` (desktop sticky rail: identity, toggle, nav, status — no transformed ancestors).
- `GrainOverlay` (optional static texture, own `overflow:clip` layer).

`CommandPalette` and `MagneticButton` are **not** built in v1 (§5.10, §6).

### Keep (do not rebuild)

`Container` (Outer/Inner), `Card`, `Button` (polymorphic), `Section`, `Prose`, `SimpleLayout`, `Header` (sticky/overlay via CSS vars, mobile Popover — host the mobile lens toggle here), `Footer`, `SocialIcons`, dark-mode `modeScript` + framed background, the articles/MDX pipeline, `ResumeView`, `/projects` + `ProjectsClient`, RSS, Prisma/admin CMS, the typography prose tokens in `tailwind.config.js`. Add an `extend.keyframes`/`extend.animation` block (none exists yet) for the few homepage keyframes that remain (reveal only — no float/typewriter/count-up).

---

## 11. Implementation checklist (ordered)

1. **Ship the P0 fix first, standalone.** Delete the Applify section (`page.tsx:523-624`) entirely. Add `html, body { overflow-x: clip; overscroll-behavior-y: none; }` and the reduced-motion floor block to `src/styles/tailwind.css`. Remove `controls` from the Photos `<video>` (`page.tsx:286`). Verify on a real iPhone (iOS 16 and 17) before any redesign work (§12).
2. Fix stale identity metadata in `layout.tsx` (lines 18-20, 24, 110-116): jobTitle, keywords, description per §2 table.
3. Commit the JetBrains Mono variable woff2 to the repo, then self-host via `next/font/local`; wire `--font-mono` into `tailwind.config.js` `fontFamily.mono`. Confirm Inter sans + sized fallback. (Font file before wiring — build-blocker otherwise.)
4. Add color tokens (§4.2) to Tailwind config; single desaturated slate-blue accent. Keep dark-mode mechanism intact.
5. Add the `extend.keyframes`/`extend.animation` block (reveal only). Confirm the global reduced-motion floor is present (from step 1).
6. **Remove `gsap` from `package.json`; grep all `framer-motion`/`gsap` imports; confirm none in the homepage initial bundle** (verify with a bundle check).
7. Build `Reveal` island (IO, reduced-motion, `will-change` cleanup).
8. Build `MetaRail` (desktop sticky; no transformed ancestors) + the rail-and-canvas desktop grid (§4.6), max-width and letterboxing decided.
9. Build the hero (Server-rendered LCP visible at paint; `~60svh` desktop; no typewriter/cursor/magnetic).
10. Build `LensProvider` + `LensToggle` + `DualityPanel` with real page re-rank, named-group View Transitions, and the CSS-cross-fade fallback. Enable `experimental.viewTransition` in **`next.config.mjs`** (webpack).
11. Build `MetricsLedger` (aligned mono, static numbers, lens-reorder, LOC removed).
12. Build `ProjectRecord` + authored-span showcase (SVG DealFlow diagram, opacity hover-peek, lens-reorder). Reuse on `/projects`.
13. Build Experience 3-layer list (lens-reorder) and `EducationLedger`.
14. Build `SystemStatus` with at least one real number + the rail status line; Off-hours line with the 1650 link.
15. Build Contact; **remove the newsletter** (`page.tsx:142` and `<Newsletter />` at `page.tsx:636`).
16. Add optional `GrainOverlay` + static background (own `overflow:clip` layer, no animated circles).
17. Rewrite all copy per §2 table. No em-dashes, no hype, no exclamation, no insecurity words, no fake metaphors, no fabricated numbers.
18. Restyle `/about`, `/resume`, `/articles`, `/projects` to match.
19. Sweep `100vh → 100dvh` across homepage **and** `insta/page.tsx` + `Carousel.tsx`; audit no `w-screen`/`100vw`, no `transform`/`filter` on sticky ancestors, every image sized.
20. **Last, and gated:** apply `content-visibility: auto` + `contain-intrinsic-size` to long below-fold sections — only after the §12 iPhone scroll verification passes, then **re-verify scroll on iPhone afterward.** Wrong `contain-intrinsic-size` estimates can themselves cause iOS scroll jump, so this is flagged as a potential jank re-introducer and sequenced dead last.

---

## 12. Verification plan

**Functional / motion correctness**
- `prefers-reduced-motion: reduce` (macOS/iOS Reduce Motion): every reveal and the lens re-rank render static end-states; the global CSS floor plus per-component short-circuits both fire; no transitions.
- Lens toggle: click each segment, reload — lens persists from `localStorage`; the ledger, showcase, and experience **actually reorder** (not just dim). Keyboard-operable, `aria-pressed` correct. Named-group VT in Safari ≥18.2/Chrome; CSS cross-fade (not a hard cut) on iOS 16/17.

**P0 / iOS (must-pass)**
- Real iPhone (Safari) on **iOS 16 and 17** plus the Simulator: scroll top→bottom and back repeatedly, fast and slow, toolbar showing/hiding. No vibration, no stick, no horizontal pan. Pinch-check: no horizontal scroll axis.
- The desktop **sticky rail still sticks** after the `html` overflow change (test on iOS 16 and 17). If not, move the guard off `html`.
- Assert `document.documentElement.scrollWidth === clientWidth` at 320/375/390/430px; the audit snippet finds no `scrollWidth > clientWidth` element.
- `insta` and `Carousel` pages: no toolbar-resize jump after `dvh` sweep.
- Photos video: autoplays muted inline, no controls layer, does not capture touch.
- After step 20 (`content-visibility`): re-run the full iPhone scroll test; confirm no new jump.

**Touch targets (measured)**
- At 375px, each lens segment renders ≥ 44×44 (measured hit-box, not visual). Tech tags are inert (no tap handler, no link).

**Responsive viewports**
- 320/375/390/430 (mobile), 768 (tablet), 1280/1440/1920 (desktop): no break, no overflow, lens stacks/reorders correctly, hover-peek absent on touch, rail-and-canvas present ≥`lg`, letterboxing correct at 1920.

**Perf budgets (Lighthouse mobile, throttled)**
- First-load client JS < ~120 KB gz; **`gsap` absent from the bundle**, Motion (if present) lazy `ssr:false` and absent from initial load. Confirm with a bundle report.
- CLS < 0.1 (target ~0): every image/video sized, fonts `swap` + sized fallback, no reveal/count-up changing document height (count-up removed).
- LCP: hero headline renders visible immediately; confirm the LCP node is the headline, not a late image, and that no count-up-from-zero delays paint (count-up removed).
- No long tasks from scroll listeners (there are none; IO only).

**Copy / authenticity review**
- Grep the homepage for: em-dashes, exclamation marks, and the banned set ("by day", "turns ideas into reality", "passionate", "personal trainer", "real ", "seriously", "at scale", "on its own", "on the side", "underneath", "LOC"). All absent.
- Every number on the page is real (no hardcoded telemetry); the agentic readout shows at least one wired-live value; mono is the minority area in every section.
