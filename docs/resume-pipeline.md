# Resume pipeline — how the resume stays current

The resume exists in two places that MUST move together:

1. **LaTeX sources** in `public/` — the downloadable PDFs.
   - `public/resume.tex` — canonical engineer 1-page (`resume-1page.tex` is a byte-identical copy; `resume.pdf`, `resume-1page.pdf`, and `Suleyman_Kiani_RESUME_2025.pdf` are the same build).
   - `public/resume-2page.tex` — engineer 2-page (same template constants as the 1-page; fill with content, never spacing).
   - `public/resume-finance.tex` — finance-first variant for credit / account-manager roles.
   - The `/resume` page's variant switcher (`src/app/resume/ResumePdfSwitcher.tsx`) embeds `-1page` / `-2page` / `-finance`.
2. **Prisma rows in Neon** — what the `/resume` page renders (`ResumeDocument`, `ResumeExperience`, `ResumeEducation`, `ResumeSkill`). Source of truth for these is `scripts/seed-resume.ts`.

## Update loop (run on the server)

```bash
cd ~/Code/suleyman.io

# 1. Edit content
#    - bullets/sections: public/resume*.tex  AND  scripts/seed-resume.ts (keep in sync)

# 2. Build PDFs (pdflatex is installed; run twice per file for layout)
cd public
for f in resume resume-2page resume-finance; do
  pdflatex -interaction=nonstopmode $f.tex >/dev/null
  pdflatex -interaction=nonstopmode $f.tex >/dev/null
done
cp resume.pdf resume-1page.pdf && cp resume.pdf Suleyman_Kiani_RESUME_2025.pdf
rm -f *.aux *.log *.out   # artifacts are gitignored anyway

# 3. Verify fit: 1-pagers must be exactly 1 full page, 2-pager exactly 2
pdfinfo resume.pdf | grep Pages          # = 1
pdfinfo resume-2page.pdf | grep Pages    # = 2
pdfinfo resume-finance.pdf | grep Pages  # = 1

# 4. Re-seed the live /resume page (DB creds: Vercel env, cached locally)
cd ~/Code/suleyman.io
set -a; . ~/.config/agentic-os/env/suleyman-io.env; set +a
npm run db:seed-resume

# 5. Ship the PDFs + seed change
git checkout -b resume-update && git add public/ scripts/seed-resume.ts
git commit -m "resume: <what changed>" && git push -u origin HEAD
gh pr create --fill && # merge after Vercel preview is green
```

`~/.config/agentic-os/env/suleyman-io.env` holds `DATABASE_URL` (mode 600). If it is
missing (fresh host), pull it from the Vercel project env: token `op-agentic read
"op://agentic-os/vercel/credential"`, project `suley-fitness-portfolio-fnv6`, team
`team_KJRDpSaK2GB0l5dqyjjUAXgq`, key `DATABASE_URL` (use `DATABASE_URL_UNPOOLED` if
Prisma complains about pgbouncer).

## Review team (standing)

Three custom agents in `~/Code/suley-agentic-os/agents/` (deployed via the
`~/.claude/agents` symlink; registry loads at session start):
`resume-reviewer-finance` (AAM/credit hiring screen), `resume-reviewer-swe`
(SWE hiring manager + 6-second scan + credibility audit), `resume-prose-editor`
(AI-tell hunter). Run all three in parallel after any content change, synthesize,
apply, then an independent `verifier` pass (page fits, claim grounding, name
fences, math coherence) before shipping. Proven pattern: 2026-06-12, two rounds.

## Content rules (learned the hard way)

- **Every claim must be sourced and defensible.** No round percentages without a basis
  (the old Giftcash 20/25/30% were flagged as reading fabricated by a 6-recruiter
  panel — `docs/recruiter-review.md`). Current vetted numbers: 200% of quota ($4M vs
  $2M, April + May 2026, every month since month two), $17–18M in-recovery stock with
  ~$1M per point of PORTFOLIO recovery rate (separate bases — never couple them),
  1,600+ Solstice tests (vitest list 2026-06-12: 1,648), 500+ users, **$40K+ CAD
  processed since launch** (owner-confirmed 2026-06-12), 100+ learners, 70 Playwright
  e2e specs per preview, shadow-DB migration checks, Gitleaks CI.
- **SKomp Studio is the founder ENTITY** (experience entry on every variant); Solstice
  Pilates is its flagship client platform, built and operated solo.
- **No payment-bug confession bullets** (owner decision 2026-06-12: bugs in
  self-authored software read unprofessional). Production rigor is shown through
  mechanisms: idempotent payments, webhook signature verification, row-level tenant
  isolation, test/CI counts.
- **MHC internals stay generic** on anything public: employer name is fine, internal
  tool/stakeholder names are not.
- **No em-dashes in resume prose.** No spacing tricks to fill pages — add or cut content.
- 2-page template constants must equal the 1-page ones (`\vspace{-2pt}/-7pt/-5pt`).

## Future: automated applying

Goal (not built yet): a server-side lane where Claude takes a job posting, picks the
right variant, tailors bullets within the sourced-facts inventory above, builds the PDF,
and tracks the application. The fact inventory + this pipeline are the foundation;
tailoring must never invent facts. Tracked in the vault:
`wiki/projects/2026-06-12-resume-pipeline.md`.

## Cover letters (added 2026-06-12)

`cover-letters/cover-letter-swe.tex` and `cover-letter-finance.tex` — same visual
identity as the resumes. Tailoring a letter to a posting = editing the THREE
`\newcommand` slots at the top (`\company`, `\role`, `\hook`); nothing else
changes. The finance letter's comment block carries the internal-MHCCNA promotion-case
guidance. Build: `pdflatex` in that dir.

## Visual verification loop (mandatory after every edit)

Compile (x2) -> `pdfinfo` page counts (1/2/1) -> orphan audit (the pdftotext -layout
script in the vault page; bullet last lines under ~40% of column width waste a line;
note pdftotext inserts blank lines between wrapped lines — skip them when grouping)
-> `pdftoppm -png` every page and LOOK at it. The sb2nov phantom-blank-line artifact
and orphaned headings only show visually.

## Research round (2026-06-12, three cited digests)

AI-labs digest: the platform's real vocabulary (bubblewrap jails, fail-closed gates,
cost circuit-breakers, 12-check gate-as-eval-pipeline) matches Anthropic's own
engineering posts — surface those nouns; reframe MEng research as LLM
citation-faithfulness verification (TLA+/SMT2); public artifact + referral are the
conversion multipliers. FAANG digest: XYZ formula, title parenthetical "(Internal
Software Engineering)", visible URL text for ATS, tests bound to what they gate.
Finance digest: MHCCNA's own AAM posting language, Tier-1 keyword map (credit
submission, vendor relationship, full deal cycle, FMV/capital), "(200% attainment)"
quota form, Propel (public product name) in Tools, CFLA Fundamentals as the fast
credential. Full digests in the session of 2026-06-12; key items folded into the
variants and the vault page.

## LaTeX end-of-line glitch (permanent fix, 2026-06-12)

The sb2nov \resumeItem macro carried a SPACE before \vspace{-2pt}. That space is
breakable glue: when a bullet's last line ends exactly flush, TeX wraps the
\vspace onto a phantom line that renders as an extra blank line under the bullet
(one character more, or a wrapped word, and it never triggers). Fixed by removing
the space ({#1\vspace{-2pt}}) in all variants — TeX cannot break without glue, so
the glitch is structurally impossible now. NEVER reintroduce that space. A
phantom-gap detector (pdftotext -bbox line-pitch scan) runs with the overflow test.
