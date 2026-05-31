# Recruiter Panel Review — Suleyman Kiani

Consolidated from a 6-persona hiring panel (quant-dev, fintech hiring manager, big-tech SWE, equipment-finance/credit, AI-startup founder/staff-eng, technical recruiter), cross-checked against the actual resume `.tex` sources, the live site, and the projects data file. Target tracks: fintech / quant-dev / finance-platform SWE / equipment-finance-credit.

---

## 1. Executive summary

To a rigorous recruiter today, Suleyman reads as a **genuinely rare finance+engineering hybrid wrapped in generalist-founder packaging that undersells the engineering and oversells the labels.** The core facts are strong and uncommon — he underwrites multi-million-dollar leases, hits 200% of quota, and independently ships a ~100K-line multi-tenant SaaS with real paying users and ~800 tests — which is a combination almost no candidate can fake. But the presentation buries that signal: the headline metric is a sales quota, the site home is a SaaS marketing page (gradients, animated stars, a chess-rating tile next to revenue), the skills line claims C/C++/Java/Swift and "ML engineer" with zero supporting evidence, and three different surfaces (resume, site Work list, DB resume) tell three different employment stories. The verdict is unanimous-ish: **maybe-leaning-yes for fintech / finance-platform SWE and for an "AM who automates" finance seat; firm no for pure quant-dev; and the credit desk worries he'll leave for a dev job.** He is one focused editing pass and one or two public proof artifacts away from converting most of those maybes to yes.

---

## 2. Consensus strengths (praised by multiple personas)

1. **The finance+engineering hybrid is real and hard to fake** (all 6). DSCR / net-investment / FMV / vendor-finance fluency on the same page as production TypeScript is a genuine differentiator. Most candidates fake one side.
2. **Skomp Studio is the anchor artifact** (1, 2, 3, 5). ~100K-line multi-tenant TS, hexagonal, row-level tenant isolation, ~800 tests, live paying customer, real Square payments. Every persona named this as the bullet that earns the interview.
3. **200% of quota is concrete and memorable** (2, 3, 4, 6). Scannable, unusual on an engineer's resume, and finance-relevant. Reviewers remember it.
4. **The site's own engineering is better than the resume claims** (1, 2, 3, 5, 6). The `/projects` page (live GitHub API merge with DB overrides, status dots, filtering) and the Prisma-backed `/resume` are cited repeatedly as the strongest *evidence of ability* on the whole property — better than most resume bullets.
5. **DealFlow Sandbox is the perfect bridge artifact** (3, 4, 5, 6). Equipment-finance pipeline as event-driven .NET microservices ties his domain to engineering — exactly the on-target proof a fintech screen wants.
6. **ATS-clean LaTeX** (1, 2, 3, 6). `\pdfgentounicode=1`, no columns, all four links present, parseable. Won't get auto-rejected on mechanics.
7. **Micrograd + Simple Type Theory A+** are the latent rigor signals (1, 3). Both are quant/CS-fundamentals positives — and both are buried.

---

## 3. Consensus weaknesses / red flags (ranked by frequency × severity)

| # | Flag | Raised by | Severity |
|---|------|-----------|----------|
| 1 | **Suspicious round percentages, contradictory across versions.** Giftcash: "20%" appears twice (infra cost AND response time) on the 2-page; 1-page collapses them. Plus 25% and 30%. Four round numbers from a 2021 junior role, inconsistent between the two PDFs. Reads as fabricated/reused. | 1,2,3,5,6 | **Critical** — fastest auto-reject; integrity flag |
| 2 | **Employment history conflicts across surfaces.** Site `page.tsx` Work list shows E&S Solns (Co-Founder), SDI Labs (Intern Jun 2019–Aug 2022, which *overlaps* Giftcash May 2021–Aug 2022), SKompXcel — none on the resume. A careful screener cross-referencing reads this as an integrity flag, not just untidiness. | 2,3,5,6 | **Critical** — integrity |
| 3 | **Headline is a sales quota, not engineering.** Lead Experience bullet + hero stat is "200% of quota." For SWE/quant screens this signals "account manager who codes." | 1,2,3,5 | **High** — miscues the whole read |
| 4 | **Unbacked skills / inflated labels.** C/C++, Java, Swift listed with zero project evidence; "full-stack/**ML** engineer" and "quant-dev" target unsupported (no NumPy/pandas/scipy, no trained model with a metric, no C++ perf work). Screeners discount the whole skills line and doubt the *true* parts. | 1,3,5,6 | **High** |
| 5 | **"Personal Agentic OS" reads as buzzword soup.** "Multi-agent across 4 machines, RAG, deterministic fail-closed publish gates" — no metric, no repo, no users. Undercuts the credible projects beside it. | 1,2,3,5,6 | **High** |
| 6 | **Vanity counts framed as achievements.** "~100K-line", "122 API routes", "38 data models" — to engineers, line count is a cost, not a win; reads as over-engineered for one tenant. | 1,2,3,6 | **Medium-High** |
| 7 | **Site home is marketing, not a hiring page.** Gradient hero, `animate-float`/`animate-pulse`, hardcoded 5-star decoration, full Applify sales hero ("5-minute setup"), `export const dynamic = 'force-dynamic'` on a static page. Lowers the technical-seriousness estimate. | 1,2,3,5,6 | **High** (redesign-critical) |
| 8 | **"1650 Chess Rating" as a top-4 hero metric** sits at equal weight to 200% quota and dilutes the serious numbers. 1650 reads as average to anyone who plays. | 1,2,3,4,5,6 | **Medium** |
| 9 | **No quant signal at all.** No C++/low-latency, no p50/p99, no Big-O, no NumPy/pandas, no backtest, no contest rating, no DSA evidence. | 1,3,6 | **High for quant track only** |
| 10 | **No money-correctness evidence** despite billing real customers via Square. Nothing on idempotency, reconciliation, webhook replay, decimal/money handling, ledger, audit trail — the single most relevant thing for fintech and it's absent. | 2,3 | **High for fintech track** |
| 11 | **Vague/puffery bullets.** "enabling the team to post some of its strongest funding numbers" (team credit, no metric); "**contributed to** a Python predictive default-risk model" (weasel verb on the single most quant-relevant line). | 1,2,3,4,5 | **Medium** |
| 12 | **No finance project on the `/projects` grid.** Confirmed in `src/data/projects.ts`: recipe app, workout trackers, crime analysis, calendar, bigram model — and **DealFlow Sandbox is not even present.** A finance reviewer clicking "Projects" finds nothing for them. | 4 | **High for finance track** |
| 13 | **Two emails, no headline title.** Resume uses `kianis4@mcmaster.ca`; site uses `suley.kiani@outlook.com`. No one-line role title under the name — the 6-second scan never resolves "what is he." | 3,6 | **Medium** |
| 14 | **6-year BASc (2018–2024) unexplained**; 9 months FT tenure; MEng in progress as primary positioning. Silent question marks. | 1,2,3,4,6 | **Low-Medium** |
| 15 | **Stale prod artifacts.** `force-dynamic` on the static home; a shipped dev comment ("video support needs checking in Next.js 16/React 19"); `/resume` can render an empty "being updated" state — a dead-end if a recruiter lands there. | 1,2,3,6 | **Low** but each is a competence tell |

**Metrics that read as inflated/unverifiable:** the four Giftcash percentages (20/20/25/30); "minutes to seconds" with no baseline; "strongest funding numbers" (team credit); "compound throughput" (Agentic OS); "~150 paying users" and "100+ learners" (real but unverifiable and small for big-tech). The **system counts (13 calculators, ~800 tests, 122 routes, 38 models) are the trustworthy ones** because they're concrete and falsifiable — lead with those, not the percentages.

---

## 4. Positioning verdict — does the hybrid help or hurt, per track

| Track | Hybrid effect | How to tailor |
|---|---|---|
| **Fintech / finance-platform SWE** | **Helps most — this is the home track.** The finance+payments+SWE combo is the whole pitch. | Lead with software identity + 200% quota as proof of finance credibility. Surface Square/payments, add one money-correctness bullet, promote DealFlow to #2. Keywords: idempotency, reconciliation, ledger, double-entry, webhooks, PCI, decimal/money types. |
| **Quant-dev** | **Hurts / insufficient.** A sales-quota headline is anti-signal; no C++, no latency, no numerical stack. | Either **drop this target** until backed, or build one C++ low-latency artifact (order-book/matching-engine sim with measured p50/p99 µs) + a finance-ML model with a real metric (AUC, Sharpe). Make a 3rd quant-only 1-page variant led by Education (type theory, group-theory-for-ML) → quant projects → finance-as-engineering. |
| **Big-tech SWE** | **Neutral-to-helps.** Skomp + tests + architecture carry it; finance is interesting flavor. | De-emphasize finance/founder/chess as headline; lead the MHC role with the *engineering* bullet (quoting app). Add DSA/system-design signal. Drop unbacked languages. |
| **Equipment-finance / credit** | **Hurts.** "By day / by night" openly frames finance as the day job he escapes; credit managers fear he leaves in 12 months. | Make a **finance-first variant**: summary leads with underwriting/credit, MHC bullets re-ordered credit-first, software compressed to one bullet + two projects. Add a credit-*quality* metric (deal count, avg size, clean-funding rate), name systems of record (InfoLease/Salesforce/T-Value), decode "FY26." |

**Bottom line:** the hybrid is a strength *as flavor*, a liability *as headline*. Pick the lane per application; never co-headline "engineer AND financier AND quant AND ML" on one document.

---

## 5. Resume action list (prioritized, with before/after)

**P0 — credibility (free, do first; blocks auto-reject):**

1. **Reconcile the two PDFs and de-round Giftcash.** Pick ONE defensible number per achievement; make 1-page and 2-page agree.
   - *Before:* "reducing infrastructure costs by 20%" + "cutting response times by 20%" + "efficiency by 25%" + "deployment times by 30%"
   - *After:* one line, real or cut — e.g. "Migrated a Django monolith to Node.js on AWS Lambda and tuned PostgreSQL indexing/caching; p95 on the balance-verification endpoint 340ms→210ms." If the number isn't measurable, drop the number and keep the action.
2. **Fix the site Work list to match the resume exactly** (or delete the inline list and just link the PDF). Remove or reconcile E&S / SDI Labs / the SDI–Giftcash date overlap. (See §6 — this is also a redesign task.)
3. **Cut unbacked skills.** Remove C/C++, Java, Swift unless a project backs them. Drop "/ML" from the summary unless a model+metric is added.

**P1 — re-aim (wording/ordering):**

4. **Add a title line under the name**, before contact info.
   - *After:* `Software Engineer · Equipment Finance — Fintech / Finance Platforms`
5. **Rewrite the summary to lead with engineer + metric + target** (SWE/fintech variant):
   - *Before:* "Equipment-finance professional and full-stack/ML engineer who operates fluently in both worlds…"
   - *After:* "Software engineer with equipment-finance underwriting experience. I ship production software — a ~100K-line multi-tenant SaaS with live paying customers on Square — while funding 200% of monthly quota at Mitsubishi HC Capital. Targeting fintech / finance-platform engineering."
6. **For SWE apps, lead the MHC role with the engineering bullet**, demote quota to a supporting clause. Reframe the quoting app around correctness/risk, not speed:
   - *Before:* "consolidated 13 manufacturer-specific calculators into one validated tool — cutting per-deal turnaround from minutes to seconds."
   - *After:* "Built a TypeScript web quoting app consolidating 13 manufacturer pricing models into one validated tool used on live deals, eliminating a class of manual rate-calculation errors (adopted by [N] reps)."
7. **Own the default-risk model or cut it.** "Contributed to" → "Built [component]"; state model class, features, dataset size, validation metric, and the decision it drove. This is the single most quant-relevant line and currently the vaguest.
8. **Rewrite Skomp around correctness/scale, not line count:**
   - *Before:* "~100K-line… 122 API routes, 38 data models…"
   - *After:* "Multi-tenant SaaS processing live Square payments for a paying studio; row-level tenant isolation and ~800 tests gate every release — zero cross-tenant leaks or billing incidents since launch."
9. **Add a money-correctness bullet** (fintech variant, only if true; if not, build it then write it): "Designed idempotent Square payment + webhook handling with reconciliation against studio billing records; duplicate/failed charges caught before settlement."
10. **Fix Agentic OS or cut it.** 1-page: cut. 2-page: one line max, with a number and concrete mechanism — "Self-hosted multi-agent ops system (Python/FastAPI/Claude API) that auto-validates emailed funding-document packages and replies in ~4 min." No "compound throughput."
11. **Delete "strongest funding numbers"** puffery. Decode "FY26" to calendar months. Lead the quota streak: "Exceeded funding quota in 8 of 9 months; 200% of target in April & May 2026."

**P2 — keywords & structure:**

12. **Keyword pass per target** (earn each, don't stuff): fintech → idempotency, reconciliation, ledger, double-entry, webhooks, PCI, decimal/money; quant → time-series, backtesting, NumPy/pandas/scipy, Monte Carlo, p50/p99, Big-O; credit → credit adjudication, residual value, portfolio management, delinquency, InfoLease/Salesforce/T-Value.
13. **Resume variants:** 1-page is the keeper for SWE/fintech (trim 2-page projects: drop Micrograd/Mac Study Buddy/SKompXcel-as-project to one line each). Build a **finance-first** variant and (if pursued) a **quant-only** variant. Tailor per application; do not circulate one generic doc.
14. **One line of recency on the BASc** to pre-empt the 6-year question.
15. **Unify contact email** to one professional address across resume + site + `/resume`.

---

## 6. Portfolio / site implications for the redesign

**First screen (above the fold) must show, in this order:**
1. **Name + a one-line role title** ("Software Engineer · Equipment Finance — Fintech / Finance Platforms"). This is the #1 missing element; the scan must resolve "what is he" in 2 seconds.
2. **One tight sentence** of the hybrid pitch — concrete, no adjectives: "I ship a ~100K-line multi-tenant SaaS with paying customers and underwrite multi-million-dollar leases at 200% of quota."
3. **3 engineering-weighted metrics**, not 4 mixed ones. Keep 200% quota; replace the others with technical/verifiable facts (e.g. "~800 tests gating a live SaaS", "13 Excel calculators → 1 tool", "~150 paying users"). **Cut the 1650 chess tile** from the hero entirely (move to an "Off the clock" footer line at most).
4. **Direct links:** GitHub, LinkedIn, both live products, resume PDF.

**Lead with engineering.** Change the h1 — "Equipment finance by day, shipping software by night" frames software as the night-hobby and finance as the escaped day-job; it hurts both SWE and credit reads. New h1 should lead with the engineering identity and treat finance as the differentiator.

**Cut from the home page:**
- The full Applify sales hero (gradient section, floating badges, hardcoded 5 stars, "5-minute setup"). It's product marketing aimed at the wrong audience. Demote Applify to a normal project card.
- `animate-float`, `animate-pulse`, gradient-on-gradient tiles. Make the home look like `/projects` and `/resume` — those pages already prove restrained, professional taste; the home hides it.
- The stale dev comment in `Photos()` and `export const dynamic = 'force-dynamic'` on the static home (a competence tell when read as a work sample).

**Fix the integrity leaks (load-bearing):** the inline `Resume()` Work list must match the PDF exactly (remove/reconcile E&S, SDI Labs, the SDI–Giftcash overlap) or be deleted in favor of a PDF link. Unify the email. Ensure `/resume` is populated so it never renders the empty "being updated" dead-end (redirect to PDF as fallback).

**Project showcase:** the `/projects` grid is the strongest asset but is **polluted with coursework** (recipe app, workout trackers, crime analysis, calendar, bigram). Curate hard: feature **Skomp → DealFlow → Applify → Micrograd** up top; **add DealFlow Sandbox (it is currently absent from the data file)** and promote it to #2 — it is the single most on-target artifact for finance/fintech screens. Demote or hide generic coursework. Each featured project needs a one-line architecture/outcome blurb and a real link.

**Credentials / MEng formatting:** surface the MEng with the A+ in **Simple Type Theory** and the **group-theory-for-optimization/ML** course as rigor signals (these are quant/CS-fundamentals positives), not as a generic "Research & Learning" pastel card. State "Year 1 complete, expected Dec 2026."

**Copy register recruiters respond to:** stoic, concrete, quantified, no corny SaaS-funnel language. Replace "compounds how fast I research, build, and ship" / "turns day-dreams into reality" with verifiable specifics. No em-dashes-as-drama, no five-star decorations, no "Let's Connect" CTA card. Show, don't sell.

**ATS / scannability:** the PDFs are already ATS-clean — preserve that. For the site, ensure the metadata/`<h1>`/title text carries the target role keywords (fintech, finance-platform, payments) so it ranks and parses; the current home metadata leads with "equipment-finance professional," which miscues SWE intent.

---

## 7. Missing assets (wanted but don't exist yet)

1. **One public GitHub repo with a great README** for the project he's proudest of — ideally **DealFlow** or a finance-data project — skimmable in 90 seconds (architecture, tradeoffs, tests). Skomp/Applify are private, so the public proof is currently thin; the GitHub link is a leap of faith. (4, 5)
2. **A system-design writeup for Skomp** — one diagram + the tenant-isolation model + the Square idempotency/webhook/reconciliation flow + failure modes. Converts "100K lines" from a claim into demonstrated judgment. (2, 3, 5)
3. **A real finance-ML artifact with a metric** — the default-risk model owned end-to-end (model class, features, dataset size, AUC/lift, decision it drove), or a credit-scoring/backtest notebook. This is his unfair advantage and the thinnest-evidenced thing on the property. The entire quant gate. (1, 2, 3, 5)
4. **A C++ low-latency artifact** (order-book/matching-engine sim or lock-free queue) with measured p50/p99 µs and methodology — the single biggest mover for any quant-dev consideration. (1)
5. **A credit-quality metric + a credit-judgment story** — arrears/loss/clean-funding rate, plus one deal he restructured or declined. Volume proves he can sell; one structuring story proves he thinks like a credit officer. (4)
6. **Defensible, sourced latency/throughput numbers** to replace the round percentages — even one rigorously measured figure beats five suspicious ones. (1, 3)
7. **A curated, pinned GitHub** (top 6 = Skomp-adjacent / DealFlow / Micrograd, not abandoned coursework) and a LinkedIn that matches the resume's dates/roles exactly. (5, 6)

---

## 8. Top 10 highest-leverage actions (ranked)

1. **Reconcile the two PDFs + the site Work list; de-round the Giftcash metrics.** Free, kills the two integrity flags that cause the fastest auto-rejects. (Critical, near-zero effort.)
2. **Add a one-line role title under the name and rewrite the summary to lead with "software engineer" + the 200% metric + the fintech target.** Fixes the single biggest 6-second-scan failure and re-aims the document.
3. **De-market the home page:** kill gradients/animations/5-star decoration/the chess tile/the Applify sales hero; make it look like `/projects`. Lead with engineering. Change the "by day / by night" h1.
4. **Promote DealFlow Sandbox to #2 and add it to the projects grid (it's missing); curate the coursework out.** Give finance/fintech reviewers something on-target to click.
5. **Fix the two weakest bullets — Agentic OS and the default-risk model — so each has a number and a concrete mechanism; own "contributed to" → "built."**
6. **Reframe Skomp + the MHC quoting tool around correctness/payments/risk, not line count and speed.** Add one money-correctness bullet (if true).
7. **Cut unbacked skills (C/C++, Java, Swift) and drop "/ML" + "quant-dev" labels until backed.** Stop the skeptical-reader auto-discount; pick the lane honestly.
8. **Publish one public README-grade repo + one system-design writeup** (DealFlow or Skomp's tenant-isolation/payment flow). Converts claims into demonstrable proof.
9. **Build the finance-ML proof artifact** (default-risk model or backtest with a real metric) — the highest-value single artifact for finance-adjacent quant/fintech roles.
10. **Make tailored variants** (SWE/fintech 1-page = keeper; finance-first; optional quant-only led by type theory) and unify the contact email + BASc recency line across all surfaces.

*If the quant-dev track is a serious goal, add action 0: ship one C++ low-latency project with measured p50/p99 latency — without it, quant is a target with no supporting evidence and the answer stays "no."*
