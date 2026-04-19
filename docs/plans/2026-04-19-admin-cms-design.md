# Admin CMS for suleyman.io — Design Doc

**Date:** 2026-04-19
**Author:** Suleyman (via Claude brainstorm)
**Status:** Draft — awaiting approval before Phase 1

---

## Goal

Replace MDX-file blog authoring and hardcoded project lists with an authenticated admin surface (`/admin/*`) where Suleyman can:

- Write, edit, draft, schedule, and publish blog posts without touching git.
- Curate which GitHub projects appear on the public portfolio, reorder them, override name/description/tech/logo, and hide noise.
- Create fully-manual project entries (e.g. private/production apps like Skomp Studio) with rich metadata and live-site links.
- Upload cover images and in-post media via one API.

Public site continues to render fast via on-demand revalidation — no rebuilds per edit.

## Non-Goals

- Multi-user editor — single admin (Suleyman) only.
- Migrating the MHCCA `/deals` Supabase board. It coexists, untouched.
- Case-study pages per project (nice future work; out of scope for MVP).
- Comments/engagement on blog posts.
- Scheduled *cross-posting* to Dev.to/Medium (manual for now).

## Decisions Log

| Decision | Choice | Rationale |
|---|---|---|
| Database | **Neon Postgres** via Vercel Marketplace | Matches Applify AI stack; Marketplace auto-provisions env vars; serverless adapter native to Vercel |
| ORM | **Prisma 7** with Neon serverless adapter | Identical to Applify AI — zero new learning curve |
| Auth | **NextAuth.js** with credentials provider, JWT strategy | Identical to Applify AI; middleware-enforced `/admin/*` gate; no session DB queries on every request |
| Editor | **TipTap** (body stored as JSON) | Matches Skomp Studio stack; better UX than markdown; supports images/embeds; reviewable JSON in DB |
| Media | **Vercel Blob** (public store `suleyman-media`) | One API, auto-injected token, Next.js `Image` works against Blob URLs |
| Revalidation | Tag-based (`revalidateTag('posts' \| 'projects')`) inside admin mutations | Instant public updates without rebuilds; no cron, no manual bust |
| Seed source of truth | Existing MDX + `src/data/projects.ts` | One-shot seed script; can be re-run safely (upsert by slug) |
| Coexistence | Neon for CMS, Supabase stays for `/deals` | Zero migration risk; different concerns; two DBs is fine when they never interact |

## Architecture

```
PUBLIC (SSG + on-demand revalidation, revalidateTag)
  /                       → home (DB: recent posts + featured projects)
  /articles               → blog index (DB-backed, tag: 'posts')
  /articles/[slug]        → post page (renders TipTap JSON)
  /projects               → GitHub live fetch MERGED with DB overrides/custom
                             (tag: 'projects')

ADMIN (/admin/*, NextAuth-gated; single user)
  /admin                  → dashboard (drafts, recent activity, quick actions)
  /admin/posts            → list, filter by status, "New post" button
  /admin/posts/new        → TipTap editor, save draft / publish / schedule
  /admin/posts/[id]       → edit existing
  /admin/projects         → all GitHub repos + DB customs in one table;
                             toggle visibility, featured, priority, inline override
  /admin/projects/new     → manual custom project (non-GitHub) + logo upload
  /admin/projects/[slug]  → edit override or custom entry
  /admin/media            → Vercel Blob library, upload, copy URL

API (server actions preferred; API routes for webhooks/uploads)
  Server actions          → createPost, updatePost, publishPost, deletePost,
                             upsertProjectEntry, toggleProjectVisibility
  /api/media/upload       → Vercel Blob signed upload
  /api/auth/[...nextauth] → NextAuth
```

## Data Model (Prisma)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

enum PostStatus {
  DRAFT
  SCHEDULED
  PUBLISHED
  ARCHIVED
}

model Post {
  id          String     @id @default(cuid())
  slug        String     @unique
  title       String
  description String
  body        Json       // TipTap JSON
  coverImage  String?    // Blob URL
  tags        String[]
  status      PostStatus @default(DRAFT)
  publishedAt DateTime?
  scheduledAt DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([status, publishedAt])
  @@index([slug])
}

enum ProjectSource {
  GITHUB      // has a githubSlug, merges with live fetch
  CUSTOM      // fully manual (e.g. Skomp Studio private repo)
}

model ProjectEntry {
  id            String        @id @default(cuid())
  slug          String        @unique      // URL-safe slug
  source        ProjectSource
  githubSlug    String?       @unique      // "kianis4/applify-ai"
  name          String?                    // null = use GitHub data
  description   String?
  linkHref      String?
  linkLabel     String?
  logoType      String?                    // 'image' | 'icon'
  logoSrc       String?                    // Blob URL or asset path
  logoIconName  String?
  logoClassName String?
  timeframe     String?
  tech          String[]                   @default([])
  badges        String[]                   @default([])
  featured      Boolean       @default(false)
  priority      Int           @default(99)
  visibility    String        @default("public")  // public | private
  visible       Boolean       @default(true)      // admin toggle to hide from public grid
  githubUrl     String?                    // for private repos with link destination
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@index([visible, featured, priority])
}

model Media {
  id          String   @id @default(cuid())
  url         String   @unique
  pathname    String
  contentType String
  size        Int
  alt         String?
  uploadedAt  DateTime @default(now())
}
```

**Key design notes on `ProjectEntry`:**
- One table for *both* GitHub overrides and custom entries. `source` discriminates. `githubSlug` is unique but nullable.
- All override fields are nullable; `getProjectsData()` falls back to live GitHub data when a field is null.
- `visible: false` is how the admin hides a GitHub repo from the portfolio (today you can't hide — auto-pull shows everything).
- `featured` + `priority` pin showpiece apps to the top.

## Revalidation Strategy

Public pages are SSG with `next: { tags: [...] }` on DB reads:

```ts
// src/app/articles/page.tsx
export default async function Articles() {
  const posts = await prisma.post.findMany({ where: { status: 'PUBLISHED' }, ... })
  // Next.js caches; tag used for invalidation
}
```

Admin mutations call `revalidateTag('posts')` or `revalidateTag('projects')`:

```ts
'use server'
export async function publishPost(id: string) {
  await prisma.post.update({ where: { id }, data: { status: 'PUBLISHED', publishedAt: new Date() }})
  revalidateTag('posts')
  revalidatePath('/articles')
}
```

Public pages re-render within ~1s of save. No rebuilds. No cron.

## Migration & Seed Strategy

**One-shot `scripts/seed-from-source.ts`:**

1. **Projects:** Read `src/data/projects.ts`. For each entry in `projectOverrides`, upsert a `ProjectEntry` with `source: GITHUB`, `githubSlug` set. For each in `customProjects`, upsert with `source: CUSTOM`, `slug` set. Idempotent — re-running updates only changed fields.
2. **Posts:** Read every `.mdx` file under `src/content/articles/`. Parse frontmatter (author, date, title, description). Convert body markdown → TipTap JSON via `@tiptap/html` or best-effort markdown-to-TipTap converter. Upsert by slug. Status: `PUBLISHED`, `publishedAt` = frontmatter `date`.
3. **Image paths:** Images under `/public/images/` keep working as static assets during transition. New uploads go to Vercel Blob. Optional future task: migrate old images to Blob.

After seed runs, `src/data/projects.ts` becomes obsolete and is deleted; `getProjectsData()` switches to reading `ProjectEntry`. MDX files stay on disk as backup but are no longer imported at build.

## Auth Flow

- `AdminUser` seeded manually with bcrypt hash at provisioning (one user: you).
- NextAuth credentials provider: email + password.
- JWT strategy; `token.isAdmin: true` claim.
- `middleware.ts` rewrite: any `/admin/*` request without `isAdmin` JWT redirects to `/admin/login`.
- Login page: `/admin/login`, simple form, no public signup.

## Env Vars (to be set via Vercel dashboard / Marketplace)

| Var | Source |
|---|---|
| `DATABASE_URL` | Neon Marketplace auto-inject |
| `DIRECT_URL` | Neon Marketplace auto-inject (migrations) |
| `NEXTAUTH_SECRET` | Generated |
| `NEXTAUTH_URL` | Vercel system env |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob auto-inject |
| `ADMIN_EMAIL` | Manual (seed helper) |
| `ADMIN_PASSWORD_HASH` | Manual (bcrypt of chosen password) |

Existing Supabase vars (`NEXT_PUBLIC_SUPABASE_URL`, etc.) stay for `/deals`.

## Phased Implementation Plan

Each phase is a shippable unit with its own PR.

### Phase 0 — Provisioning (30 min)
- [ ] Install Neon on this Vercel project via Marketplace
- [ ] Install Vercel Blob
- [ ] Pull env vars to local with `vercel env pull`
- [ ] Verify DB connection from `npx prisma studio`

### Phase 1 — Schema + Auth scaffold (1-2 sessions)
- [ ] `npm i prisma @prisma/client next-auth bcrypt @tiptap/...`
- [ ] Write `prisma/schema.prisma`, run first migration
- [ ] `src/lib/prisma.ts`, `src/lib/auth.ts`
- [ ] `/admin/login` + NextAuth route + middleware gate
- [ ] Seed one AdminUser
- [ ] Placeholder `/admin` dashboard ("you're in")

### Phase 2 — Projects admin (2-3 sessions)
- [ ] `/admin/projects` list page — table merging GitHub live fetch + DB entries
- [ ] Inline toggles: visible, featured, priority
- [ ] `/admin/projects/[slug]` edit form for overrides
- [ ] `/admin/projects/new` form for custom entries + logo upload to Blob
- [ ] Server actions with `revalidateTag('projects')`
- [ ] Update `getProjectsData()` to merge DB overrides instead of static `projectOverrides`
- [ ] Seed script: `src/data/projects.ts` → `ProjectEntry`
- [ ] Delete `src/data/projects.ts`

### Phase 3 — Blog admin (3-4 sessions)
- [ ] TipTap editor component (`/admin/posts/[id]`)
- [ ] Cover image upload + tags + status + schedule
- [ ] `/admin/posts` list
- [ ] Public `/articles/[slug]` renders TipTap JSON
- [ ] `/articles` list from DB
- [ ] Seed script: MDX → `Post` rows (markdown → TipTap JSON best-effort)
- [ ] Verify each old post renders; fix edge cases by hand

### Phase 4 — Polish (1-2 sessions)
- [ ] Media library page
- [ ] Dashboard widget: draft count, recent posts, recent deploys
- [ ] Scheduled-publish cron (Vercel Cron hourly) flips `SCHEDULED` → `PUBLISHED` when `scheduledAt < now`
- [ ] (Optional) Import-from-GitHub helper in `/admin/projects/new`

### Phase 5 — Decommission (15 min)
- [ ] Delete obsolete MDX article files (kept as backup through Phase 3)
- [ ] Delete `src/data/projects.ts`
- [ ] Update README with new authoring workflow

## Security Checklist

- Middleware gates `/admin/*` before any data fetch.
- Server actions double-check `session.user.isAdmin` on every mutation.
- Login endpoint rate-limited (reuse pattern from Applify AI).
- Bcrypt for admin password (cost 12).
- Zod validation on every server action input.
- Blob uploads require admin session; no public upload endpoint.
- CSRF: NextAuth provides built-in protection for credentials flow.

## Open Questions

1. **Do we want a public RSS feed from DB?** Current `src/lib/generateRssFeed.tsx` reads MDX — needs rewrite to read `Post` table. Low effort, high value. Recommend yes.
2. **Slug collisions during MDX → DB migration** — a few MDX files have slugs derived from filenames; confirm none duplicate.
3. **Inline React components in existing MDX** (e.g. `<Image>`, custom divs) — TipTap JSON won't capture arbitrary React. Strategy: convert those to standard TipTap nodes (image node, blockquote, raw HTML block if needed). Edge cases fixed by hand during Phase 3.
4. **Should `customProjects` like E&S Solns, Evergreen Renos, SKompXcel move to the DB too?** Recommend yes — they're exactly the kind of thing the admin is meant to manage.

## Success Criteria

- I can write and publish a blog post in under 3 minutes without opening a terminal.
- I can add a new production project (name, description, tech, logo, live URL) in under 2 minutes.
- I can hide a noisy GitHub repo from the portfolio with one click.
- Public pages update within 5 seconds of a save (no rebuild).
- Existing `/deals` board keeps working, untouched.
