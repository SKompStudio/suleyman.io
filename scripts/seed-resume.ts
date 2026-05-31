import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const summary =
  'Equipment-finance professional and full-stack/ML engineer. I underwrite and structure ' +
  'multi-million-dollar equipment leases while shipping production software — multi-tenant SaaS, ' +
  'AI products, and internal finance automation. Currently funding 200% of monthly quota at ' +
  'Mitsubishi HC Capital and completing an MEng in Computing & Software (A+ in type theory and ' +
  'microservices). Targeting roles at the intersection of finance and engineering.'

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
      'Funded $4M against a $2M monthly target (200% of quota) in both April and May FY26, and have exceeded funding quota every month since my second month in the role.',
      'Underwrite and structure equipment leases and loans (FMV, capital, and vendor-finance structures) across construction, transportation, and material-handling; spread customer financial statements and compute coverage, net-investment, and residual metrics for credit decisions.',
      'Designed and shipped internal automation that replaced fragile manual Excel and credit workflows — including a web quoting app that consolidated 13 manufacturer-specific calculators into one validated tool — cutting per-task turnaround from minutes to seconds.',
      'Took sole ownership of the end-to-end lease-transfer desk, enabling the account-management team to post some of its strongest funding numbers.',
    ],
    tech: ['Credit analysis', 'Financial spreading', 'Power BI', 'Python', 'Next.js'],
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
      'Migrated a legacy Python/Django monolith to a Node.js AWS Lambda serverless architecture, improving scalability and reducing infrastructure costs by 20%.',
      'Optimized PostgreSQL performance through indexing, caching, and query tuning, cutting response times by 20%.',
      'Automated balance-verification workflows with Puppeteer and Axios, increasing operational efficiency by 25%.',
      'Established Jenkins and GitHub Actions CI/CD pipelines, reducing deployment times by 30%.',
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
      subtitle: 'Equipment-finance professional & full-stack/ML engineer',
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
      subtitle: 'Equipment-finance professional & full-stack/ML engineer',
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
