# suleyman.io — "JARVIS" wow pass (v2 direction)

Supersedes the stoic v1 where they conflict. v1 was correct that the copy must not be corny and the motion must be performant; it was WRONG that the site should be visually minimal/flat. This pass adds the wow. Intensity: **bold but controlled** — cinematic and clearly elevated, but still reads senior/serious. Never cheesy sci-fi, never neon-gaudy, never an Iron-Man fan page. The wow comes from craft and restraint, not volume.

## The thesis (new)
Suleyman built his own **JARVIS**: a personal, multi-agent AI operating system he runs across his machines to compound his research, ops, and engineering — while also being an equipment-finance professional who ships production software. The site itself should feel like a refined **command-center HUD** for that system. The finance × engineering duality stays (the lens toggle), but the **agentic OS is the centerpiece and the signature.**

## Hard content changes
- **REMOVE DealFlow Sandbox entirely** from the homepage showcase (it's legacy, built for someone else — it does not represent current work). Replace its slot with the Agentic OS.
- **ADD the Agentic OS / multi-device setup as the centerpiece** (see §System Console).
- MHCCNA stays as *evidence of output in the Experience section only* — "shipped multiple internal automation and AI tools in production" — never as clickable project cards, never with internal system names, data, or stakeholders (confidential).
- Product showcase uses the REAL screenshots now in `public/images/showcase/` (`skomp-studio.png`, `solstice.png`, `applify.png`, `skompxcel.png`).

## Confidentiality guardrail (still load-bearing)
Showcase the agentic OS's existence, scale, and capabilities impressively, but keep PROPRIETARY specifics out: no client data, no MHC internal system/automation names, no credentials, no architecture detail that exposes confidential work. Describe capabilities generically ("email-triggered document automation", "scheduled research + ops briefings", "multi-agent orchestration with fail-closed gates"). No fabricated live telemetry — every number is true or it's static prose.

## Aesthetic system (JARVIS, bold-but-controlled)
- **Base:** near-black `#06080B`, panels `#0C1016`, hairlines low-alpha cyan `rgba(91,200,255,0.12)`.
- **Primary accent — "system" cyan:** `#5BC8FF` (arc-reactor). Used for the live/active/system glow, links, the online pulse. Glows are SUBTLE (small blur radius, low alpha) — restraint is the whole game.
- **Warm micro-accent — gold:** `#E8B84B`, used sparingly for a single highlight (e.g., the active lens = engineering, or a key metric). Iron-Man gold, a whisper not a coat.
- **Lens duality colors:** finance = the cyan-blue; engineering = warm white / gold-leaning. Switching the lens visibly shifts the page's accent temperature.
- **Type:** keep JetBrains Mono (data, labels, HUD readouts, system console) + Inter (prose, headlines). Mono is the "machine" voice; sans carries meaning.
- **HUD motifs (rationed, tasteful):** thin corner brackets on the hero + console, a faint dotted/▦ grid behind the hero, a single soft cyan radial glow. NO scanlines everywhere, NO blinking cursors scattered, NO ASCII boxes. One coherent HUD, not a costume.

## Section order (v2)
1. **Hero** — JARVIS boot + identity (engineer-first, agentic-OS framing).
2. **Lens toggle + duality** — fin/eng/both, now a full accent/emphasis transformation.
3. **System Console (THE centerpiece)** — the agentic OS as a living HUD/system map.
4. **Metrics ledger** — refined, with a subtle HUD frame.
5. **Work showcase** — real product screenshots in browser frames, hover depth.
6. **Experience** — MHC (200% quota + "shipped multiple internal automation/AI tools"), SKompXcel, Giftcash.
7. **Live signals** — GitHub contributions + LeetCode, framed as system readouts.
8. **Education** — MEng ledger, A+ grades.
9. **Contact** — stoic.

## §Hero — "system online"
- LCP headline is server-rendered, visible at paint, NEVER animated from opacity:0. On top of it, a one-shot ~700ms "boot" enhancement: a thin cyan sweep + a mono line that resolves (e.g. `system: online` / `operator: suleyman kiani`). Reduced-motion → instant final state, no boot.
- Headline (engineer-first, agentic framing, not corny). Options to choose from in build:
  - `I ship production software, fund equipment-finance deals, and run a system that runs the rest.`
  - or keep `I ship production software. I also fund equipment-finance deals.` with a mono sub-line: `+ a personal multi-agent OS that runs my research and ops.`
- Ambient: faint grid + one soft cyan glow + corner brackets. All static or GPU-cheap.

## §System Console — the agentic OS (signature, replaces DealFlow)
A custom-built HUD panel — the visual + emotional centerpiece. It should make a visitor think "this person built their own JARVIS."
- A titled console (mono), e.g. `~/agentic-os` with a live `● online` cyan pulse.
- **A system map:** nodes for the machine mesh (always-on server, dev machines, phone as a control surface) and the agent/automation layer (research, ops/briefings, email-triggered document workflows, voice-note routing, an orchestrator→worker model). Connections between nodes with subtle directional data-pulses (transform/opacity only, paused under reduced-motion). Use an inline SVG (crisp), animated tastefully.
- Real, non-proprietary facts as readouts: number of machines, number of skills/automations, always-on watchers, cadence ("nightly briefings", "weekly deep-research") — true values from real life, framed as a console. NO fake counters.
- One honest line of prose: what it is and why (a personal operating system that compounds research, ops, and engineering). Built on Claude — mention tastefully, do not over-expose the internal architecture.
- This is the part that must feel genuinely wow. Spend the craft here.

### System Console — narrative emphasis (refinement)
Lead the agentic-OS story on TWO ideas, conceptually (NO implementation IP, NO client/MHC specifics, NO architecture that could be copied):
- **Advanced + self-healing.** The system watches itself: liveness/health checks catch stuck or failed processes, alert on real problems, and recover automatically; autonomous work runs behind deterministic, fail-closed gates. Convey "it keeps itself running" — a self-monitoring, self-recovering operating system, not a pile of scripts. A subtle visual cue is welcome (e.g. a node that flickers to a `recovering…` state then back to `● online`), but every label stays true and generic.
- **Karpathy-inspired.** Credit the lineage openly: inspired by Andrej Karpathy's "LLM OS" / agentic vision and his LLM-Wiki memory pattern — a layered memory architecture (session memory → project memory → curated knowledge vaults) that compounds knowledge over time. Karpathy's ideas are public; referencing them signals sophistication without exposing anything proprietary. A short line like `inspired by Karpathy's LLM-OS · compounding memory` fits the HUD.
Keep it conceptual and inspirational. Never show real internal automation names, code, credentials, dashboards, or confidential work.

## §Work showcase — real visuals
- Cards use the captured screenshots in a minimal **browser frame** (a thin top bar + dot + the URL in mono). Hover (desktop, hover:hover): subtle scale (1.02), a few degrees of tilt toward the cursor, and a soft cyan edge glow. Mobile: static, fully legible, no tilt.
- Order/lead reorders under the lens (eng → Skomp/Applify lead; fin → … ). Projects: **Skomp Studio**, **Applify AI**, **SKompXcel** (+ the Agentic OS is its own Console section, not a card). NO DealFlow.

## §Lens = full transformation
- The fin/eng/both toggle re-themes the page: accent temperature shifts (finance cyan-blue ↔ engineering warm/gold), the metrics ledger + showcase reorder, and the emphasis copy changes. Smooth (View Transitions where supported, CSS cross-fade fallback). It should read as an obvious, satisfying mode-switch — a showpiece, not a dim.

## §Live signals (real data only)
- **GitHub:** fetch public contribution data (e.g. github-contributions API or the GraphQL contributions calendar via a tiny server route) → render a contribution heatmap in the HUD style. Real numbers.
- **LeetCode:** the site already has a `/leetcode` data path — reuse it to show solved count / ranking as a readout.
- Frame both as system telemetry. If a source is down, degrade gracefully (hide, don't fake).

## Motion doctrine (unchanged from v1, still enforced)
Transform/opacity only. IntersectionObserver reveals (springy stagger, but they must occupy final layout box from frame 1 — no layout shift). A global `prefers-reduced-motion` floor kills everything to static. `will-change` ONLY on a currently-animating element, cleared on transitionend (do NOT leave a blanket `[will-change]` utility on every reveal — that was a v1 mistake that piled up GPU layers). No animated blurred circles, no backdrop-filter on scroll, no 100vh/ w-screen, no overflow:clip on html/body or on a scroll-ancestor wrapper. **Do NOT touch `Header.tsx`'s `isHomePage = false`** (that fix is why the page scrolls on iOS).

## Performance / verification
- Homepage stays a Server Component; islands are `'use client'`. Live-data fetches are server routes or cached.
- tsc clean, tests green, `next build` succeeds, 0px horizontal overflow at 375/1440, no fabricated telemetry, reduced-motion verified, Lighthouse-reasonable JS. Verify on the deployed preview with screenshots at iPhone + desktop, light + dark.
