import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const summary =
  'Software engineer who builds the financial tooling a finance desk actually runs on. Shipped a ' +
  'production quoting engine that replaces 13 manufacturer Excel calculators and matches the ' +
  'industry-standard lease-math engine (TValue) to the penny; built and operate a multi-tenant ' +
  'booking-and-payments platform processing real revenue on Square; run a self-hosted multi-agent ' +
  'system that automates funding-deal document work end to end. An equipment-finance background at ' +
  'Mitsubishi HC Capital gives me domain fluency most engineers don’t have. Finishing an MEng in ' +
  'Computing & Software at McMaster.'

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
      'Replaced 13 abandoned Excel calculators (30–45 sheets each) with one Next.js / React web app spanning all 11 product lines, reverse-engineering each manufacturer’s lease and subsidy math to hit exact penny-parity with TValue on every test deal; backed by 72 automated tests.',
      'Reverse-engineered three structurally different subsidy formulas and proved three regional dealer workbooks were re-skins of one template, collapsing them into shared calculation engines; wrote a platform-independent architecture and handoff doc so IT can rebuild the tool on any stack.',
      'Built a working AI document-validation prototype (OCR + ML + rules) for deal-funding review and carried it through the company’s first internal innovation review; it now runs as a live email service that audits real deal packages unattended.',
      'Designed and am implementing a predictive collections scorecard with the credit and portfolio teams: a dual-track model that auto-triages low-risk accounts and scores the rest by recovery priority across about $17–18M of assets in recovery, where each 1% of recovery improvement is worth about $1M; owned the business case, won approval to proceed, and am driving the phased rollout.',
      'Automated the desk’s most repetitive document work (power-of-attorney, asset-registration, and pre-funding packages) into email-triggered services that reply within minutes with complete, ready-to-file documents.',
      'Carry an equipment-finance sales book alongside the engineering work: funded $4M against a $2M monthly target (200% of quota) in April and May 2026 and have exceeded funding quota every month since my second month in the role.',
    ],
    tech: ['Next.js', 'React', 'TypeScript', 'Python', 'OCR + ML', 'Credit & recovery modeling', 'TValue', 'Power BI'],
    order: 0,
  },
  {
    role: 'Founder',
    company: 'SKompXcel Academic Solutions',
    companyUrl: null,
    location: 'Remote',
    startDate: 'Jan 2024',
    endDate: null,
    current: true,
    bullets: [
      'Founded a mentorship practice and have coached 100+ learners through algorithms, systems design, and technical-interview preparation, owning client acquisition, scheduling, curriculum, and delivery end to end.',
      'Built the practice’s web platform myself (Next.js, TypeScript, Google Cloud).',
    ],
    tech: ['Next.js', 'TypeScript', 'Google Cloud'],
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
      'Migrated a legacy Python/Django monolith to a Node.js AWS Lambda serverless architecture, trading always-on server overhead for per-request billing.',
      'Tuned PostgreSQL performance with targeted indexing, caching, and query rewrites on the hottest read paths, eliminating the sequential scans behind the gift-card lookup flow.',
      'Automated gift-card balance verification across providers with a Puppeteer + Axios pipeline, replacing manual per-card checks.',
      'Stood up Jenkins and GitHub Actions CI/CD so merges deployed without manual release steps.',
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
    endDate: 'Dec 2026 (expected)',
    details:
      'Year 1 complete with A+ in Simple Type Theory and Microservices-Oriented Architectures. Research with Dr. Farmer and Dr. Paige on an LLM-based study companion that combines retrieval over course material with locally served models. Built PodcastHub for the distributed-systems course: six event-driven microservices across Node/Express and Python/FastAPI, each a hexagonal bounded context, choreographed over a RabbitMQ topic exchange with MinIO object storage and FFmpeg media processing.',
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
