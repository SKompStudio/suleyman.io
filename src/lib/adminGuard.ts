import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized — admin session required')
  }
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) {
    throw new UnauthorizedError()
  }
  return session
}
