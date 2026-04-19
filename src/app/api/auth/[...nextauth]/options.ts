import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import type { AuthOptions, SessionStrategy } from 'next-auth'
import { prisma } from '@/lib/prisma'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('[auth] missing email or password')
          throw new Error('Please enter both email and password')
        }

        const normalizedEmail = credentials.email.toLowerCase().trim()

        let user
        try {
          user = await prisma.adminUser.findUnique({
            where: { email: normalizedEmail },
          })
        } catch (err) {
          console.error('[auth] database error while looking up admin user:', err)
          throw new Error('Server error — check dev terminal for database logs')
        }

        if (!user) {
          console.log('[auth] no admin user found for', normalizedEmail)
          throw new Error(`No admin account found for "${normalizedEmail}"`)
        }

        const valid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!valid) {
          console.log('[auth] password mismatch for', normalizedEmail, '(entered length:', credentials.password.length, ')')
          throw new Error('Incorrect password')
        }

        console.log('[auth] success for', normalizedEmail)
        return {
          id: user.id,
          email: user.email,
          name: 'Admin',
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isAdmin = true
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub ?? '')
        session.user.isAdmin = Boolean(token.isAdmin)
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
}
