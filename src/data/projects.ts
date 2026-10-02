export interface ProjectLink {
  href: string
  label: string
}

export interface ProjectLogo {
  type: 'image' | 'icon'
  src?: string
  name?: string
  className?: string
}

export interface ProjectOverride {
  name: string
  description: string
  link: ProjectLink
  logo: ProjectLogo
  timeframe: string
  tech: string[]
  featured?: boolean
  priority?: number
  badges?: string[]
  visibility?: string
}

export const projectOverrides: Record<string, ProjectOverride> = {
  'kianis4/delta-hacks-12': {
    name: 'Mike Ross AI',
    description:
      'Agentic legal associate for instant, cited access to Canadian law. A LangGraph state machine routes intent and runs jurisdiction-aware vector retrieval (provincial queries auto-merge federal law) over a 16,000-chunk corpus of seven Canadian statutes (MongoDB Atlas vector search, Google text-embedding-004), with Gemini 2.0 Flash structured outputs, multi-turn thread memory, and a draft-to-PDF pipeline for legal notices. FastAPI backend, Next.js 16 frontend. Built for Delta Hacks 12.',
    link: { href: 'https://mike-ross.ca/', label: 'mike-ross.ca' },
    logo: { type: 'icon', name: 'ai', className: 'text-cyan-400' },
    timeframe: 'Jan 2026',
    tech: [
      'Python',
      'LangGraph',
      'Gemini 2.0 Flash',
      'MongoDB Atlas',
      'FastAPI',
      'Next.js 16',
      'TypeScript',
    ],
    featured: true,
    priority: 3,
    badges: ['Agentic AI', 'RAG'],
  },
  'kianis4/applify-ai': {
    name: 'Applify AI',
    description:
      'Production SaaS for AI-powered resume tailoring. Event-driven background jobs (Inngest) run multi-minute LLM pipelines with step-level checkpointing; OpenAI Responses API with Zod-validated structured outputs; ~90% inference cost reduction via prompt-cache-optimized prefixes; middleware-enforced JWT auth for premium gating; 5-job CI pipeline with Dependabot and Sentry observability.',
    link: { href: 'https://applify-ai.com/', label: 'applify-ai.com' },
    logo: { type: 'image', src: '/ApplifyLogo.svg' },
    timeframe: 'Feb 2025 - Present',
    tech: [
      'TypeScript',
      'Next.js 15',
      'React 19',
      'PostgreSQL',
      'Prisma 7',
      'Inngest',
      'OpenAI GPT-5.1',
      'Stripe',
      'Upstash Redis',
      'Vercel Blob',
      'Sentry',
    ],
    featured: true,
    priority: 1,
    badges: ['Production SaaS', 'AI'],
  },
  'kianis4/recipeshack': {
    name: 'Full Stack Recipe Management',
    description:
      'Comprehensive recipe platform with advanced search, responsive UI, and Django REST backend serving 300+ ingredients.',
    link: { href: 'https://github.com/kianis4/RecipeShack', label: 'GitHub' },
    logo: { type: 'icon', name: 'django', className: 'text-green-700' },
    timeframe: 'Mar 2023 - Apr 2025',
    tech: ['React', 'Django', 'MongoDB', 'Chakra UI'],
  },
  'kianis4/workout_tracker': {
    name: 'Workout Tracking App',
    description:
      'Flutter fitness tracker using BLoC pattern, Firebase sync, and automated CI with GitHub Actions.',
    link: {
      href: 'https://github.com/kianis4/workout_tracker',
      label: 'GitHub',
    },
    logo: { type: 'icon', name: 'flutter', className: 'text-blue-400' },
    timeframe: 'Apr 2024 - Apr 2025',
    tech: ['Flutter', 'Dart', 'Firebase', 'BLoC'],
  },
  'kianis4/personal-cv': {
    name: 'Interactive Portfolio Platform',
    description:
      'Modern personal portfolio with GSAP animations, responsive SASS design, and EmailJS-powered contact workflow.',
    link: { href: 'https://github.com/kianis4/Personal-CV', label: 'GitHub' },
    logo: { type: 'icon', name: 'code', className: 'text-purple-600' },
    timeframe: 'Feb 2023 - Apr 2025',
    tech: ['React', 'GSAP', 'SASS', 'EmailJS'],
  },
  'kianis4/personal-cv-backend': {
    name: 'Portfolio Backend API',
    description:
      'Node/Express backend with JWT auth, GridFS media storage, and external API integrations for social feeds.',
    link: {
      href: 'https://github.com/kianis4/Personal-CV-Backend',
      label: 'GitHub',
    },
    logo: { type: 'icon', name: 'node', className: 'text-emerald-600' },
    timeframe: 'May 2023 - Apr 2025',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'JWT'],
  },
  'kianis4/saftey-net': {
    name: 'Crime Analysis System',
    description:
      "Desktop app analyzing NYC crime data with spatial insights and safest-path routing using Dijkstra's algorithm.",
    link: { href: 'https://github.com/kianis4/Saftey-Net', label: 'GitHub' },
    logo: { type: 'icon', name: 'java', className: 'text-blue-700' },
    timeframe: 'Mar 2023 - Apr 2025',
    tech: ['Java SE 10', 'OpenCSV', 'Google Gson', 'LocationIQ API'],
  },
  'kianis4/ai-31-chatbot': {
    name: 'AI Course Chatbot',
    description:
      'Knowledge-based chatbot using backward chaining and structured inference for course Q&A.',
    link: { href: 'https://github.com/kianis4/AI-31-Chatbot', label: 'GitHub' },
    logo: { type: 'icon', name: 'ai', className: 'text-accent' },
    timeframe: 'Mar 2025',
    tech: ['Python', 'Rule-Based Inference', 'CLI'],
  },
  'kianis4/load-balancer': {
    name: 'Load Balancing System',
    description:
      'Multi-threaded load balancer with health checks and multiple routing algorithms for resilient backend traffic.',
    link: { href: 'https://github.com/kianis4/load-balancer', label: 'GitHub' },
    logo: { type: 'icon', name: 'server', className: 'text-red-500' },
    timeframe: 'Feb 2025',
    tech: ['Python 3', 'Sockets', 'Multi-threading'],
  },
  'kianis4/skompxcel-ai-code-mentor': {
    name: 'AI Coding Interview Platform',
    description:
      'Generative AI interview simulator with GPT-4 prompts, Docker sandbox execution, and chat UX.',
    link: {
      href: 'https://github.com/kianis4/SKompXcel-AI-Code-Mentor',
      label: 'GitHub',
    },
    logo: { type: 'icon', name: 'openai', className: 'text-green-500' },
    timeframe: 'Feb 2025',
    tech: ['TypeScript', 'Next.js', 'Node.js', 'OpenAI GPT-4'],
  },
  'kianis4/birthday-calendar': {
    name: 'Calendar Application',
    description:
      'Personal calendar for daily reflections powered by Next.js, TypeScript, and React Calendar.',
    link: {
      href: 'https://github.com/kianis4/birthday-calendar',
      label: 'GitHub',
    },
    logo: { type: 'icon', name: 'calendar', className: 'text-indigo-600' },
    timeframe: 'Dec 2024',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
  },
  'kianis4/torch-bigram-language-model': {
    name: 'Bigram Language Model',
    description:
      'Character-level PyTorch model with custom sampling and negative log-likelihood training.',
    link: {
      href: 'https://github.com/kianis4/torch-bigram-language-model',
      label: 'GitHub',
    },
    logo: { type: 'icon', name: 'python', className: 'text-yellow-600' },
    timeframe: 'Jan 2025',
    tech: ['PyTorch', 'Tensor Operations', 'Model Training'],
  },
  'kianis4/-neural-networks-zero-to-hero.': {
    name: 'Neural Network Framework',
    description:
      'Educational framework recreating Micrograd with automatic differentiation and gradient computation.',
    link: {
      href: 'https://github.com/kianis4/-neural-networks-zero-to-hero.',
      label: 'GitHub',
    },
    logo: { type: 'icon', name: 'ai', className: 'text-blue-600' },
    timeframe: 'Jan 2025',
    tech: ['Python', 'Jupyter Notebook', 'Micrograd'],
  },
}

export interface CustomProject {
  slug: string
  name: string
  description: string
  link: ProjectLink
  logo: ProjectLogo
  timeframe: string
  tech: string[]
  featured?: boolean
  priority?: number
  badges?: string[]
  source: string
  github?: string | null
  visibility?: string
  stats?: {
    stars?: number
    forks?: number
    issues?: number
    watchers?: number
  } | null
  updatedAt?: string | null
  createdAt?: string | null
  githubSlug?: string | null
}

export const customProjects: CustomProject[] = [
  {
    slug: 'zakat-eligibility-triage',
    name: 'Zakat-Eligibility Triage',
    description:
      'An AI triage agent for crowdfunding campaigns that does everything except decide. It reads a campaign, assembles the evidence a zakat determination turns on, quotes the organizer in their own words at exact character offsets, names what is missing or contested, refuses when the text cannot carry a determination, and hands the file to a qualified human reviewer. It never issues a ruling. Two model calls with structured outputs, byte-checked quotes, a deterministic four-rule refusal, human-only outcomes enforced by Postgres CHECK constraints, and an n8n layer that owns the clock and the megaphone while the code owns the rules.',
    link: {
      href: 'https://zakat-eligibility-triage-n8n.vercel.app',
      label: 'zakat-eligibility-triage-n8n.vercel.app',
    },
    logo: { type: 'image', src: '/ZakatTriage.svg' },
    timeframe: 'Aug - Sep 2026',
    tech: [
      'Next.js',
      'TypeScript',
      'Drizzle',
      'Postgres (Neon)',
      'pgvector',
      'Vercel AI SDK',
      'claude-sonnet-5',
      'n8n',
    ],
    featured: true,
    priority: 0,
    badges: ['Flagship', 'Human-in-the-loop'],
    source: 'custom',
    visibility: 'public',
    github: 'https://github.com/kianis4/zakat-eligibility-triage',
  },
  {
    slug: 'skomp-forge',
    name: 'SKomp Forge',
    description:
      'Agentic iOS training coach, built across 11 Swift 6 modules with 52 architecture decision records carrying the tradeoffs. The agent exposes 36 tool schemas pinned in both Swift and Python and diff-tested so the two can never silently drift, and every write is a typed proposal the lifter confirms by tap, with an audit row recorded either way. Full-duplex voice on gpt-realtime runs 24 kHz PCM16 in both directions with server-side VAD and true barge-in, holding P90 313ms text-to-first-audio against a 1,500ms budget; the phone never holds an API key, only a 60-second ephemeral token minted server-side with the persona and tool schemas bound at mint. A dual-vendor proxy swaps OpenAI and Anthropic behind a six-method protocol, runs under systemd on a private tailnet with a daily token cap, and is covered by 178 passing tests. Reads 6 HealthKit types on view and persists none of them, and logs a meal from a photo into seven macro fields, with the model barred from claiming any label or portion was measured rather than estimated.',
    link: { href: '', label: 'Private beta' },
    logo: { type: 'icon', name: 'swift', className: 'text-orange-500' },
    timeframe: 'Feb 2025 - Present',
    tech: [
      'Swift 6',
      'SwiftUI',
      'SwiftData',
      'OpenAI Realtime',
      'HealthKit',
      'Python',
      'FastAPI',
      'WatchOS',
    ],
    featured: true,
    priority: 1,
    badges: ['Agentic AI', 'iOS'],
    source: 'custom',
    visibility: 'private',
    github: null,
  },
  {
    slug: 'skomp-studio',
    name: 'Skomp Studio',
    description:
      'Production multi-tenant SaaS platform for fitness studio management, on a 74-model Prisma schema and 196 API routes. Its flagship tenant runs its entire operation on it with no parallel manual system: $45K+ CAD processed since launch across 640 registered users, 1,380 confirmed bookings and 105 active memberships. Tenant isolation enforced in a tenant-scoped data-access layer (a scoped Prisma client), guarded by a build-failing test for unscoped models; Square SDK with idempotent payments and per-studio credentials; AWS SES/SNS/AppSync for email, SMS and real-time messaging; 6,000+ automated tests gating every merge, Playwright suites as required status checks, branch-protected CI with shadow-DB migration checks and Gitleaks secret scanning.',
    link: { href: 'https://skomp.studio/', label: 'skomp.studio' },
    logo: { type: 'image', src: '/SKomp.svg' },
    timeframe: 'Jul 2025 - Present',
    tech: [
      'TypeScript',
      'Next.js 15',
      'React 19',
      'PostgreSQL',
      'Prisma 7',
      'Square',
      'AWS SES/SNS',
      'AWS AppSync',
      'NextAuth.js',
      'Sentry',
    ],
    featured: true,
    priority: 2,
    badges: ['Production SaaS', 'Multi-tenant'],
    source: 'custom',
    visibility: 'private',
    github: null,
  },
  {
    slug: 'podcast-hub',
    name: 'PodcastHub',
    description:
      'Event-driven microservices platform for remote multi-guest podcast recording and broadcast-grade mastering, extended with an automated post-production and publishing pipeline. Six services communicate over a RabbitMQ topic exchange with dead-letter queues, each built on a hexagonal architecture. WebRTC captures multi-track audio, uploaded to object storage in checksummed chunks. FFmpeg masters the result with EBU R128 loudness normalization and multi-track mixing, driven by an event-driven session state machine. faster-whisper produces word-level timestamps; AI generates show notes, chapters, and titles with a deterministic fallback; RSS 2.0 feeds handle distribution. Verified end-to-end against a Docker Compose stack.',
    link: {
      href: 'https://github.com/kianis4/CAS-735-PodcastHub',
      label: 'GitHub',
    },
    logo: { type: 'image', src: '/PodcastHub.svg' },
    timeframe: '2025 - Present',
    tech: [
      'TypeScript',
      'Next.js',
      'React',
      'Node.js',
      'Python',
      'FastAPI',
      'RabbitMQ',
      'PostgreSQL',
      'MinIO',
      'Redis',
      'Docker',
      'FFmpeg',
      'faster-whisper',
      'WebRTC',
    ],
    featured: false,
    priority: 6,
    badges: ['Microservices', 'Event-driven'],
    source: 'custom',
    visibility: 'public',
    github: 'https://github.com/kianis4/CAS-735-PodcastHub',
  },
  {
    slug: 'skompxcel',
    name: 'SKompXcel',
    description:
      'Academic excellence platform and mentorship service supporting 100+ learners with guided career roadmaps.',
    link: { href: 'https://skompxcel.com/', label: 'skompxcel.com' },
    logo: { type: 'image', src: '/SKomp.svg' },
    timeframe: 'Jan 2024 - Present',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Google Cloud'],
    featured: false,
    priority: 10,
    badges: ['Mentorship'],
    source: 'custom',
  },
  {
    slug: 'interactive-fitness-portfolio',
    name: 'Interactive Fitness Portfolio',
    description:
      'Personal portfolio showcasing fitness achievements with Instagram and Spotify integrations and SSR optimizations.',
    link: { href: 'https://suleyman.io/', label: 'Personal Portfolio' },
    logo: { type: 'icon', name: 'react', className: 'text-blue-500' },
    timeframe: 'Oct 2024 - May 2025',
    tech: ['Next.js', 'React', 'Tailwind CSS', 'API Integration'],
    badges: ['Personal'],
    source: 'custom',
  },
  {
    slug: 'es-solns',
    name: 'E&S Solns.',
    description:
      'Automation and workflow solutions for small businesses focused on digital transformation initiatives.',
    link: { href: 'https://www.es-soln.com/', label: 'es-soln.com' },
    logo: { type: 'icon', name: 'typescript', className: 'text-purple-500' },
    timeframe: '2023 - Present',
    tech: ['Web Development', 'Automation', 'Consulting'],
    badges: ['Consulting'],
    source: 'custom',
  },
  {
    slug: 'evergreen-renos',
    name: 'Evergreen Renos',
    description:
      'Operations portal for renovation business improving customer experience and project management.',
    link: {
      href: 'https://www.evergreenrenos.ca/',
      label: 'evergreenrenos.ca',
    },
    logo: { type: 'icon', name: 'chrome', className: 'text-green-600' },
    timeframe: '2023',
    tech: ['Web Development', 'CMS', 'Project Management'],
    badges: ['Client Work'],
    source: 'custom',
  },
  {
    slug: 'mac-study-companion',
    name: 'Mac Study Companion',
    description:
      "M.Eng Software Engineering research project at McMaster, supervised by Dr. William Farmer and Dr. Richard Paige. A study companion built for students with ADHD that turns lecture recordings into verified study notes: every released sentence cites the minute of audio it came from, and any sentence the checker cannot prove is visibly held back with its reason shown, never silently dropped. A fail-closed release gate discharges per-response verification conditions in Z3 (completeness, support gating, non-interference, a citation-recall floor), and the pipeline state machine is model-checked in TLA+. The Socratic tutor is given only the solution steps the student's own typed work has demonstrated, so it cannot reveal an answer it was never told. Nine Python FastAPI microservices, hexagonal ports and adapters, over a Redis Streams bus. On a 58-minute MIT lecture the gate released 23 of 29 generated claims and held back 6 with their reasons.",
    link: {
      href: '/architecture',
      label: 'Architecture & gallery',
    },
    logo: { type: 'image', src: '/MacStudyCompanion.svg' },
    timeframe: '2026',
    tech: [
      'Python',
      'FastAPI',
      'Next.js',
      'React',
      'TypeScript',
      'Redis Streams',
      'PostgreSQL',
      'Z3',
      'TLA+',
      'DeBERTa NLI',
      'Whisper',
      'Docker',
    ],
    featured: true,
    priority: 1,
    badges: ['M.Eng research', 'Formal verification'],
    source: 'custom',
    visibility: 'private',
    github: null,
  },
]
