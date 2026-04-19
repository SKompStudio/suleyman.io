import 'dotenv/config'
import bcrypt from 'bcrypt'
import { prisma } from '../src/lib/prisma'

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  console.log('== Admin login verifier ==')
  console.log('ADMIN_EMAIL set?   ', !!email, email ? `(${email})` : '')
  console.log('ADMIN_PASSWORD set?', !!password, password ? `(length=${password.length})` : '')
  console.log('DATABASE_URL host: ', process.env.DATABASE_URL?.match(/@([^/]+)/)?.[1] ?? 'unknown')
  console.log('')

  if (!email || !password) {
    console.error('Cannot verify without ADMIN_EMAIL + ADMIN_PASSWORD in env')
    process.exit(1)
  }

  const user = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase().trim() },
  })

  if (!user) {
    console.error('✗ NO USER FOUND in AdminUser table for email:', email)
    const all = await prisma.adminUser.findMany({ select: { email: true, createdAt: true } })
    console.error('   Existing admin users:', all)
    process.exit(2)
  }

  console.log('✓ User found')
  console.log('  id:          ', user.id)
  console.log('  email:       ', user.email)
  console.log('  createdAt:   ', user.createdAt)
  console.log('  hash prefix: ', user.passwordHash.slice(0, 12), '...')
  console.log('')

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (ok) {
    console.log('✓ bcrypt.compare SUCCEEDED — credentials are correct.')
    console.log('  If login still fails in the browser, the issue is in the NextAuth flow, not the credentials.')
  } else {
    console.log('✗ bcrypt.compare FAILED — password does not match stored hash.')
    console.log('  This means either (a) the stored hash is for a different password, or')
    console.log('  (b) ADMIN_PASSWORD in .env.local has been changed since seeding.')
  }
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
