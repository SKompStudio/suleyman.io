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

## Content rules (learned the hard way)

- **Every claim must be sourced and defensible.** No round percentages without a basis
  (the old Giftcash 20/25/30% were flagged as reading fabricated by a 6-recruiter
  panel — `docs/recruiter-review.md`). Current vetted numbers: 200% of quota ($4M vs
  $2M), $17–18M recovery book, 850+ Solstice tests, 500+ users, $20K+ CAD, 100+ learners.
- **Solstice leads with "built the entire platform solo"**, with the payment-bug fixes
  as the production-ownership proof, never as the headline.
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
