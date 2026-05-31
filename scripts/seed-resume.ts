import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const summary =
  'Software engineer who ships production systems: a multi-tenant SaaS billing live customers on ' +
  'Square, an event-driven .NET microservices pipeline, and an ML autodiff engine built from ' +
  'scratch. I bring an underwriter’s instinct for correctness from the equipment-finance desk, ' +
  'where I fund 200% of monthly quota at Mitsubishi HC Capital while completing an MEng in ' +
  'Computing & Software. Targeting fintech and finance-platform engineering.'

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
      'Built a TypeScript web quoting app consolidating 13 manufacturer-specific pricing models into one validated tool used on live deals, eliminating a class of manual rate-calculation errors.',
      'Contributed Python modeling to a cross-functional predictive default-risk model and built Power BI portfolio and variance analyses supporting credit and collections decisions.',
      'Underwrite and structure equipment leases and loans (FMV, capital, and vendor-finance structures) across construction, transportation, and material-handling; spread customer financial statements and compute coverage and net-investment metrics for credit decisions.',
      'Funded $4M against a $2M monthly target (200% of quota) in April and May 2026, exceeding funding quota every month since my second month in the role.',
    ],
    tech: ['TypeScript', 'Python', 'Power BI', 'Credit analysis', 'Financial spreading'],
    order: 0,
  },
  {
    role: 'Junior Web Developer',
    company: 'Giftcash Inc.',
    companyUrl: null,
    location: 'Remote',
    startDate: 'May 2021',
    endDate: 'Aug 2022',
    current: false,
    bullets: [
      'Migrated a legacy Python/Django monolith to a Node.js AWS Lambda serverless architecture and tuned PostgreSQL indexing and caching; p95 on the balance-verification endpoint dropped from ~340ms to ~210ms.',
      'Automated balance-verification workflows with Puppeteer and built GitHub Actions CI/CD pipelines, replacing a manual multi-step release with a one-click deploy.',
    ],
    tech: ['Python', 'Node.js', 'AWS Lambda', 'PostgreSQL', 'GitHub Actions'],
    order: 1,
  },
]

const educations = [
  {
    degree: 'Master of Engineering (MEng), Computing and Software',
    school: 'McMaster University',
    location: 'Hamilton, ON',
    startDate: 'Sept 2025',
    endDate: 'Dec 2026 (expected)',
    details:
      'Year 1 complete with A+ in Simple Type Theory and Microservices-Oriented Architectures. Research focus on agentic systems and retrieval.',
    order: 0,
  },
  {
    degree: 'Bachelor of Applied Science (BASc), Computer Science',
    school: 'McMaster University',
    location: 'Hamilton, ON',
    startDate: 'Sept 2018',
    endDate: 'Nov 2024',
    details: null,
    order: 1,
  },
]

const skillsByCategory: Record<string, string[]> = {
  Languages: ['TypeScript', 'Python', 'SQL', 'C/C++', 'Java', 'Swift', 'JavaScript', 'Bash'],
  'Frameworks & Runtimes': [
    'Next.js',
    'React',
    'Node.js',
    'FastAPI',
    '.NET / ASP.NET Core',
    'Prisma',
    'React Native',
    'PyTorch',
  ],
  'Data & Infrastructure': [
    'PostgreSQL (Neon)',
    'MongoDB',
    'AWS',
    'GCP',
    'Vercel',
    'Docker',
    'RabbitMQ',
  ],
  'AI & Tooling': [
    'Claude API',
    'Agentic orchestration',
    'RAG & vector search',
    'MCP',
    'GitHub Actions',
    'Vitest',
    'Playwright',
  ],
  Finance: [
    'Credit analysis',
    'Financial-statement spreading',
    'DSCR & net-investment',
    'Lease/loan structuring',
    'Amortization modeling',
    'Power BI',
  ],
}

async function main() {
  await prisma.resumeDocument.upsert({
    where: { id: 'default' },
    update: {
      title: 'Resume',
      subtitle: 'Software Engineer · Equipment Finance — Fintech / Finance Platforms',
      summary,
      location: 'Burlington, ON',
      email: 'kianis4@mcmaster.ca',
      phone: '+1 (289) 788-8260',
      pdfUrl: '/resume-1page.pdf',
      pdfFilename: 'Suleyman_Kiani_Resume.pdf',
    },
    create: {
      id: 'default',
      title: 'Resume',
      subtitle: 'Software Engineer · Equipment Finance — Fintech / Finance Platforms',
      summary,
      location: 'Burlington, ON',
      email: 'kianis4@mcmaster.ca',
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
