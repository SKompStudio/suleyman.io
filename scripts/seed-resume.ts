import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const summary =
  'Software engineer who builds the financial tooling a finance desk actually runs on: a ' +
  'production quoting engine that matches the industry-standard lease-math engine (TValue) to the ' +
  'penny, a multi-tenant booking-and-payments SaaS on Square serving live studio operators, and a ' +
  'self-hosted multi-agent system that automates real funding-deal document workflows. An ' +
  'equipment-finance background at Mitsubishi HC Capital gives me domain fluency most engineers ' +
  'don’t have. Finishing an MEng in Computing & Software at McMaster.'

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
      'Designed and am implementing a predictive collections scorecard with the credit and portfolio teams that prioritizes about $17–18M of assets in recovery, where each 1% of recovery improvement is worth about $1M; owned the business case, won approval to proceed, and am driving the rollout.',
      'Automated the desk’s most repetitive document work (power-of-attorney, asset-registration, and pre-funding packages) into email-triggered services that reply within minutes with complete, ready-to-file documents.',
      'Carry an equipment-finance sales book, funding 200% of new-business target ($4M against $2M).',
    ],
    tech: ['Next.js', 'React', 'TypeScript', 'Python', 'OCR + ML', 'Credit & recovery modeling', 'TValue'],
    order: 0,
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
      'Migrated a legacy Python/Django monolith to a Node.js AWS Lambda serverless architecture (per-request billing, no always-on servers) and tuned PostgreSQL with targeted indexing and caching on the hottest read paths.',
      'Automated gift-card balance verification across providers with a Puppeteer + Axios pipeline and stood up Jenkins / GitHub Actions CI/CD, replacing manual checks and manual releases.',
    ],
    tech: ['Python', 'Node.js', 'AWS Lambda', 'PostgreSQL', 'Puppeteer', 'CI/CD'],
    order: 1,
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
      'Research with Dr. Farmer and Dr. Paige on an LLM-based study companion that combines retrieval with local model serving. A+ in Simple Type Theory and Microservices-Oriented Architectures.',
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
