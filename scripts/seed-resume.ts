import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const summary =
  'Software engineer who builds the tooling a finance desk actually runs on: a production quoting ' +
  'engine matching TValue, the industry lease-math standard, to the penny; a multi-tenant ' +
  'booking-and-payments platform processing real revenue; a self-hosted agentic platform ' +
  'with sandboxed workers and fail-closed gates. Equipment-finance experience at Mitsubishi HC Capital ' +
  'gives me domain fluency most engineers don’t have. Finishing an MEng in Computing & Software ' +
  'at McMaster.'

const experiences = [
  {
    role: 'Associate Account Manager, Equipment Finance',
    company: 'Mitsubishi HC Capital Canada',
    companyUrl: 'https://www.mitsubishihcca.com/',
    location: 'Burlington, ON',
    startDate: 'Sept 2025',
    endDate: null,
    current: true,
    bullets: [
      'Rebuilt 13 abandoned Excel calculators (30–45 sheets each) as one Next.js / React app covering all 11 product lines; reverse-engineered the manufacturers’ lease and subsidy math and pinned penny-parity with TValue with 72 automated tests; the desk’s one trusted pricing tool.',
      'Untangled three structurally different subsidy formulas, proved three regional dealer workbooks were re-skins of one template, and collapsed them into shared calculation engines; authored the architecture and handoff documentation that lets the company’s IT org own and extend the tool.',
      'Built an AI document-validation prototype (OCR + ML + rules) for deal-funding review and took it through the company’s first internal innovation review; in pilot on 50+ live deal packages, it cuts review from 1–2 hours to about 5 minutes, each verdict logged to a per-deal audit trail.',
      'Designed a predictive collections scorecard with the credit and portfolio teams: a dual-track model that auto-triages low-risk accounts and scores the rest by recovery priority across about $17–18M of assets in recovery. Each one-point lift in the portfolio recovery rate is worth about $1M; owned the business case, won approval, and now lead the Phase 1 rollout with the desk’s Power BI portfolio and variance reporting behind it.',
      'Carry an equipment-finance sales book alongside the engineering work: funded $4M against a $2M monthly target (200% of quota) in each of April and May 2026 and have exceeded funding quota every month since my second month in the role.',
    ],
    tech: ['Next.js', 'React', 'TypeScript', 'Python', 'OCR + ML', 'Credit & recovery modeling', 'TValue', 'Power BI'],
    order: 0,
  },
  {
    role: 'Founder & Software Engineer',
    company: 'SKomp Studio',
    companyUrl: 'https://www.solsticepilates.ca/',
    location: 'Remote',
    startDate: 'Jan 2024',
    endDate: null,
    current: true,
    bullets: [
      'Founded a software studio and designed, shipped, and now operate its flagship client platform, Solstice Pilates (solsticepilates.ca), solo: a multi-tenant booking-and-payments system (37-model Prisma schema, 106 API routes) with scheduling, FIFO waitlists and capacity gating, Square payments and recurring memberships with tax handling, digital waivers, and a 23-page admin portal.',
      'Runs live operations ($40K+ CAD processed across 850+ bookings, 450+ registered users) and ships a client-driven roadmap on 1,600+ automated tests, including 70 Playwright e2e specs against every Vercel preview, shadow-DB checks across all 49 versioned migrations, and Gitleaks secret scanning in CI.',
      'Engineered for money-handling correctness: idempotent Square payment processing, webhook signature verification, and row-level tenant isolation via a scoped Prisma client.',
      'Landed five production fixes in parallel in one agent-orchestrated session, each in its own git worktree with its own test-and-verify loop, merged through branch-protected PRs.',
      'Coached 100+ learners through algorithms, systems design, and technical-interview prep in the studio’s mentorship arm, taking each engagement from acquisition through delivery.',
    ],
    tech: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL (Neon)', 'Square', 'AWS SES/SNS'],
    order: 1,
  },
  {
    role: 'Junior Web Developer',
    company: 'Giftcash Inc.',
    companyUrl: null,
    location: 'Remote',
    startDate: 'May 2021',
    endDate: 'Jun 2022',
    current: false,
    bullets: [
      'Migrated a legacy Python/Django monolith to Node.js on AWS Lambda, trading always-on server overhead for per-request billing, and tuned PostgreSQL with indexing, caching, and query rewrites; that killed the sequential scans behind the gift-card lookup flow.',
      'Automated gift-card balance verification with a Puppeteer + Axios pipeline and stood up Jenkins and GitHub Actions CI/CD so merges deployed without manual release steps.',
    ],
    tech: ['Python', 'Node.js', 'AWS Lambda', 'PostgreSQL', 'Puppeteer', 'CI/CD'],
    order: 2,
  },
]

const educations = [
  {
    degree: 'Master of Engineering (MEng), Computing & Software',
    school: 'McMaster University',
    location: 'Hamilton, ON',
    startDate: 'Sept 2025',
    endDate: '2026',
    details:
      'Year 1 complete with A+ in Simple Type Theory and Microservices-Oriented Architectures. Research with Dr. Farmer and Dr. Paige on an LLM-based study companion that combines retrieval over course material with locally served models. Built PodcastHub for the distributed-systems course: five event-driven microservices across Node/Express and Python/FastAPI (six containers, with a dedicated FFmpeg worker), each a hexagonal bounded context, choreographed over a RabbitMQ topic exchange with MinIO object storage.',
    order: 0,
  },
  {
    degree: 'Bachelor of Applied Science (BASc), Honours Computer Science',
    school: 'McMaster University',
    location: 'Hamilton, ON',
    startDate: 'Sept 2018',
    endDate: 'Nov 2024',
    details: null,
    order: 1,
  },
]

const skillsByCategory: Record<string, string[]> = {
  Languages: ['TypeScript', 'Python', 'SQL', 'Java', 'C', 'Swift', 'JavaScript', 'Bash'],
  'Frameworks & Runtimes': ['Next.js', 'React', 'Node.js', 'FastAPI', 'Prisma', 'React Native', 'PyTorch'],
  'Data & Infrastructure': ['PostgreSQL (Neon)', 'MongoDB', 'AWS', 'GCP', 'Vercel', 'Docker', 'Redis'],
  'AI & Agentic': [
    'Claude API',
    'Multi-agent orchestration',
    'RAG & vector search',
    'Local LLMs (Ollama, qwen2.5)',
    'Whisper',
    'MCP',
  ],
  'Finance & Domain': [
    'Equipment & lease finance',
    'Amortization (PMT/PV/FV/RATE/IRR, TValue-validated)',
    'Subsidy & blended-rate modeling',
    'Credit-scorecard & recovery modeling',
    'Deal-funding workflows',
    'Power BI',
  ],
  Practices: ['TDD (Vitest, Playwright)', 'CI/CD', 'GitHub Actions', 'systemd automation'],
}

async function main() {
  await prisma.resumeDocument.upsert({
    where: { id: 'default' },
    update: {
      title: 'Resume',
      subtitle: 'Software Engineer · Fintech & Finance Platforms',
      summary,
      location: 'Burlington, ON',
      email: 'suley.kiani@outlook.com',
      phone: '+1 (289) 788-8260',
      pdfUrl: '/resume-1page.pdf',
      pdfFilename: 'Suleyman_Kiani_Resume.pdf',
    },
    create: {
      id: 'default',
      title: 'Resume',
      subtitle: 'Software Engineer · Fintech & Finance Platforms',
      summary,
      location: 'Burlington, ON',
      email: 'suley.kiani@outlook.com',
      phone: '+1 (289) 788-8260',
      pdfUrl: '/resume-1page.pdf',
      pdfFilename: 'Suleyman_Kiani_Resume.pdf',
    },
  })

  await prisma.resumeExperience.deleteMany({})
  for (const exp of experiences) {
    await prisma.resumeExperience.create({ data: { ...exp, visible: true } })
  }

  await prisma.resumeEducation.deleteMany({})
  for (const edu of educations) {
    await prisma.resumeEducation.create({ data: { ...edu, visible: true } })
  }

  await prisma.resumeSkill.deleteMany({})
  for (const [category, names] of Object.entries(skillsByCategory)) {
    for (let i = 0; i < names.length; i++) {
      await prisma.resumeSkill.create({
        data: { category, name: names[i], order: i, visible: true },
      })
    }
  }

  console.log(
    `Seeded resume: ${experiences.length} experiences, ${educations.length} education entries, ` +
      `${Object.values(skillsByCategory).flat().length} skills, 1 document.`,
  )
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
