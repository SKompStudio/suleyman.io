import 'dotenv/config'
import bcrypt from 'bcrypt'
import { prisma } from '../src/lib/prisma'

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local to seed the admin user.')
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.adminUser.upsert({
    where: { email: email.toLowerCase().trim() },
    update: { passwordHash },
    create: { email: email.toLowerCase().trim(), passwordHash },
  })

  console.log(`✓ Admin user seeded: ${user.email} (id: ${user.id})`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
