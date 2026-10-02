import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const summary =
  'Applied AI engineer who ships agents with their evals attached. A year inside a regulated commercial ' +
  'lender taking systems from business discovery through IT intake and security review to corporate ' +
  'handoff, alongside a founder’s multi-tenant payments platform that a real business runs on. MEng in ' +
  'Computing & Software at McMaster, where my project formally verifies that an LLM pipeline cannot ' +
  'release an uncited claim or leak a confidential one.'

const experiences = [
  {
    role: 'Applied AI Engineer',
    company: 'LaunchGood',
    companyUrl: 'https://www.launchgood.com/',
    location: 'Remote',
    startDate: 'Oct 2026',
    endDate: null,
    current: true,
    bullets: [
      'Senior (P3) hire into the pod that owns AI initiatives at a global crowdfunding platform: production agents and automations across operations, trust and safety, support and finance, each gated by evaluation suites in CI (deterministic checks, LLM-as-judge, human review). The hiring bar was a deployed, evaluated prototype: Zakat-Eligibility Triage.',
    ],
    tech: ['Python', 'LLM agents', 'Evaluation suites', 'LLM-as-judge'],
    order: 0,
  },
  {
    role: 'Associate Account Manager (Software Engineering scope)',
    company: 'Mitsubishi HC Capital Canada',
    companyUrl: 'https://www.mhccna.com/',
    location: 'Burlington, ON',
    startDate: 'Sept 2025',
    endDate: 'Oct 2026',
    current: false,
    bullets: [
      'Built one bilingual TypeScript application to replace 13 Excel pricing calculators across 14 manufacturers and 9 pricing engines; rate configs are versioned Postgres rows with an audit log, so repricing never needs a code deploy.',
      'Carried it through enterprise SDLC: formal IT intake (a nine-document security-scoped submission), a leadership review, an IT pre-review, then a handoff of source, calculation spec and 16 written rulings (capital and FMV leases, loans, residuals, cost-of-funds ladders) to corporate IT, which now owns it and is deploying it from that documentation.',
      'Validated its finance core (payment, rate and IRR functions) against the booking system of record: 45 funded deals reproduced to within half a cent given each deal’s booked rate and structure, so the arithmetic is proven on real flows, not its own output.',
      'Gated it behind a 1,370-test suite with mutation-tested assertions, funded-deal fixtures kept server-only and expected-fail tests holding known gaps open; it caught 7 of 9 engines silently quoting wrong terms.',
      'Co-designed, with two colleagues, a collections risk scorecard from six years of delinquency history: five bands separate average default probability 0.647 to 0.017 on the scored live book, a 38x spread with no reversals; model selection used customer-grouped cross-validation.',
      'Approved for launch and announced org-wide by the SVP in Sept. 2026 as a risk-based prioritization tool after it re-scored a 1,748-contract book, ranking 1,023 contracts carrying $66.4M of net investment; collections managers now work from its daily list.',
      'Built the AI document-validation service: LLM extraction checked against a documented rules checklist, behind a deterministic intake-and-retry state machine, returning a READY / NOT READY verdict on a deal package at a median of 4.9 minutes over 56 runs; advisory only, zero incremental spend on data already held.',
    ],
    tech: ['TypeScript', 'Next.js', 'PostgreSQL', 'Python', 'LLM extraction', 'Mutation testing'],
    order: 1,
  },
  {
    role: 'Software Engineer & Founder',
    company: 'SKomp Studio',
    companyUrl: 'https://www.solsticepilates.ca/',
    location: 'Remote',
    startDate: 'Jan 2024',
    endDate: null,
    current: true,
    bullets: [
      'Built Incite, a white-label multi-tenant booking-and-payments platform on a 74-model Prisma schema and 196 REST API routes: scheduling, waitlists, Square payments, memberships, ticketing and per-tenant theming.',
      'Its flagship tenant runs its entire operation on it: $45K+ CAD processed since launch across 640 registered users, 1,380 confirmed bookings and 105 active memberships, all self-serve with no parallel manual system.',
      'Money is the part that cannot be wrong: idempotent payments, webhook signature verification and tenant isolation enforced in a tenant-scoped data-access layer, guarded by a build-failing test for unscoped models.',
      'Run it to enterprise standards: 6,000+ automated tests gating every merge, Playwright suites as required status checks, Gitleaks secret scanning in CI, and branch-protected pull requests with a preview deploy per change.',
      'Rebuilt my training app, SKomp Forge, into an agentic coach across 11 Swift 6 modules, shipping to TestFlight: 36 tool schemas pinned in both Swift and Python and diff-tested for drift, every write a typed proposal the lifter confirms by tap, and full-duplex voice holding P90 313ms text-to-first-audio under a 1,500ms budget.',
      'Mentored 100+ learners through algorithms, systems design and interview preparation, running every engagement end to end since 2024: acquisition, pricing, curriculum design, live sessions and follow-up review.',
    ],
    tech: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL (Neon)', 'Square', 'Swift 6', 'SwiftUI', 'OpenAI Realtime'],
    order: 2,
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
      'As one of three engineers in a 30 to 40 person development organization, migrated a legacy Django monolith to Node.js on AWS Lambda for per-request billing, tuned PostgreSQL indexes to kill the sequential scans behind balance lookup and stood up Jenkins and GitHub Actions CI/CD.',
    ],
    tech: ['Python', 'Node.js', 'AWS Lambda', 'PostgreSQL', 'CI/CD'],
    order: 3,
  },
]

const educations = [
  {
    degree: 'Master of Engineering (MEng), Computing & Software',
    school: 'McMaster University',
    location: 'Hamilton, ON',
    startDate: 'Sept 2025',
    endDate: '2027 (expected)',
    details: [
      'Mac Study Companion, co-supervised by Dr. Richard Paige and Dr. William Farmer and judged complete by both in Sept. 2026: a lecture-to-study-notes pipeline in which no claim reaches a student until it cites its exact source. A Z3/SMT encoder emits a four-conjunct verification condition (completeness, support gating, non-interference over a confidentiality lattice, recall floor); the gate refuses if any conjunct fails.',
      'Model-checked the pipeline in TLA+ (4 properties over 2,647 states at the shipped configuration), with a deliberately broken mutant spec that must fail in CI so a green check is never vacuous. On a 10-lecture corpus the gate took citation precision from 0.604 to 0.960; recall 1.000 and leak rate 0.000 hold by construction, since the gate’s conjuncts are the predicates being measured.',
      'Delivered as 9 hexagonal microservices over Redis Streams behind 2,489 backend tests, with a 32-page project report. Earlier built PodcastHub, six event-driven services over a RabbitMQ topic exchange.',
      'A+ - Simple Type Theory',
      'A - Microservice Architectures',
    ].join('\n'),
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
  Languages: ['Python', 'TypeScript', 'JavaScript', 'Java', 'SQL', 'Swift', 'C'],
  'AI & Agents': [
    'LLM APIs (Anthropic, OpenAI)',
    'Agent orchestration',
    'LangGraph',
    'Structured outputs',
    'RAG',
    'Vector search (LanceDB, MongoDB Atlas)',
    'BGE-M3 embeddings',
    'Ollama',
    'Evaluation harnesses',
    'LLM-as-judge',
  ],
  'Backend & Data': [
    'REST/JSON APIs',
    'Microservices',
    'Event-driven architecture',
    'RabbitMQ',
    'Redis Streams',
    'WebSockets',
    'Node.js',
    'FastAPI',
    'Prisma',
    'PostgreSQL',
    'Google Workspace APIs',
  ],
  'Cloud & DevOps': [
    'AWS Lambda',
    'Vercel',
    'Docker',
    'Linux',
    'systemd',
    'Kernel-namespace sandboxing',
    'Jenkins',
    'GitHub Actions',
    'Gitleaks',
  ],
  'Testing & Formal Methods': ['TDD', 'pytest', 'Vitest', 'Playwright', 'JUnit', 'Mutation testing', 'TLA+', 'Z3/SMT2'],
  Domain: [
    'Regulated financial services',
    'Equipment and lease finance',
    'Credit underwriting submissions',
    'Financial statement analysis',
    'NPV and IRR math',
    'Collections risk scoring',
  ],
}

async function main() {
  await prisma.resumeDocument.upsert({
    where: { id: 'default' },
    update: {
      title: 'Resume',
      subtitle: 'Applied AI Engineer · Agentic Systems, Backend & Formal Verification',
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
      subtitle: 'Applied AI Engineer · Agentic Systems, Backend & Formal Verification',
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
