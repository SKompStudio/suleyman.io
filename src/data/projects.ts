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
    link: { href: 'https://github.com/kianis4/workout_tracker', label: 'GitHub' },
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
    link: { href: 'https://github.com/kianis4/Personal-CV-Backend', label: 'GitHub' },
    logo: { type: 'icon', name: 'node', className: 'text-emerald-600' },
    timeframe: 'May 2023 - Apr 2025',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'JWT'],
  },
  'kianis4/saftey-net': {
    name: 'Crime Analysis System',
    description:
      'Desktop app analyzing NYC crime data with spatial insights and safest-path routing using Dijkstra\'s algorithm.',
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
    logo: { type: 'icon', name: 'ai', className: 'text-teal-600' },
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
    link: { href: 'https://github.com/kianis4/SKompXcel-AI-Code-Mentor', label: 'GitHub' },
    logo: { type: 'icon', name: 'openai', className: 'text-green-500' },
    timeframe: 'Feb 2025',
    tech: ['TypeScript', 'Next.js', 'Node.js', 'OpenAI GPT-4'],
  },
  'kianis4/birthday-calendar': {
    name: 'Calendar Application',
    description:
      'Personal calendar for daily reflections powered by Next.js, TypeScript, and React Calendar.',
    link: { href: 'https://github.com/kianis4/birthday-calendar', label: 'GitHub' },
    logo: { type: 'icon', name: 'calendar', className: 'text-indigo-600' },
    timeframe: 'Dec 2024',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
  },
  'kianis4/overload-pro-ios': {
    name: 'iOS Overload Management',
    description:
      'UIKit app for system load optimization using MVVM, Alamofire networking, and Core Data persistence.',
    link: { href: 'https://github.com/kianis4/overload-pro-ios', label: 'GitHub' },
    logo: { type: 'icon', name: 'swift', className: 'text-orange-500' },
    timeframe: 'Feb 2025',
    tech: ['Swift', 'UIKit', 'Core Data', 'MVVM'],
  },
  'kianis4/torch-bigram-language-model': {
    name: 'Bigram Language Model',
    description:
      'Character-level PyTorch model with custom sampling and negative log-likelihood training.',
    link: { href: 'https://github.com/kianis4/torch-bigram-language-model', label: 'GitHub' },
    logo: { type: 'icon', name: 'python', className: 'text-yellow-600' },
    timeframe: 'Jan 2025',
    tech: ['PyTorch', 'Tensor Operations', 'Model Training'],
  },
  'kianis4/-neural-networks-zero-to-hero': {
    name: 'Neural Network Framework',
    description:
      'Educational framework recreating Micrograd with automatic differentiation and gradient computation.',
    link: { href: 'https://github.com/kianis4/-neural-networks-zero-to-hero', label: 'GitHub' },
    logo: { type: 'icon', name: 'ai', className: 'text-blue-600' },
    timeframe: 'Jan 2025',
    tech: ['Python', 'Jupyter Notebook', 'Micrograd'],
  },
  'kianis4/progressiveoverloadapp': {
    name: 'Fitness Tracking App',
    description:
      'SwiftUI application for progressive overload tracking with Core Data storage and Combine async flows.',
    link: { href: 'https://github.com/kianis4/ProgressiveOverloadApp', label: 'GitHub' },
    logo: { type: 'icon', name: 'mobile', className: 'text-red-600' },
    timeframe: 'Oct 2024',
    tech: ['Swift', 'SwiftUI', 'Core Data', 'Combine'],
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
    slug: 'skomp-studio',
    name: 'Skomp Studio',
    description:
      'Production multi-tenant SaaS platform for fitness studio management. 99K+ lines of TypeScript, 500+ users, $20K+ CAD processed. Row-level tenant isolation via a scopedPrisma client; Square SDK with idempotent payments and per-studio credentials; AWS SES/SNS/AppSync for email, SMS and real-time messaging; 411 Vitest unit tests and Playwright E2E against every Vercel preview; branch-protected CI with shadow-DB migration checks and Gitleaks secret scanning.',
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
    github: 'https://github.com/kianis4/skomp-studio',
  },
  {
    slug: 'skompxcel',
    name: 'SKompXcel',
    description:
      'Academic excellence platform and mentorship service supporting 20+ CS students with guided career roadmaps.',
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
    link: { href: 'https://www.evergreenrenos.ca/', label: 'evergreenrenos.ca' },
    logo: { type: 'icon', name: 'chrome', className: 'text-green-600' },
    timeframe: '2023',
    tech: ['Web Development', 'CMS', 'Project Management'],
    badges: ['Client Work'],
    source: 'custom',
  },
]
