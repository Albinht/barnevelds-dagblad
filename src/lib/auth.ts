import bcrypt from 'bcryptjs'
import type { AuthUser } from '@/types/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

// Admin credentials are optional - NextAuth handles authentication
if (process.env.NODE_ENV === 'development' && (!ADMIN_USERNAME || !ADMIN_PASSWORD)) {
  console.warn('ADMIN_USERNAME and ADMIN_PASSWORD not set - using NextAuth only')
}

// Validate admin credentials (for backward compatibility)
export async function validateCredentials(username: string, password: string): Promise<boolean> {
  // First check hardcoded credentials for development
  if (process.env.NODE_ENV === 'development') {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return true
    }
  }
  
  // Then check database
  try {
    const user = await prisma.user.findUnique({
      where: { username }
    })
    
    if (!user || !user.password) return false
    
    return await bcrypt.compare(password, user.password)
  } catch (error) {
    console.error('Database authentication error:', error)
    // Fallback to hardcoded credentials if database is not available
    if (username === ADMIN_USERNAME && ADMIN_PASSWORD) {
      if (process.env.NODE_ENV === 'development') {
        return password === ADMIN_PASSWORD
      }
      return await bcrypt.compare(password, ADMIN_PASSWORD)
    }
    return false
  }
}

// JWT functions are deprecated - using NextAuth for authentication
// These functions are kept for backward compatibility but return null
export function generateToken(_username: string, _userId?: string, _role: string = 'ADMIN'): string {
  console.warn('generateToken is deprecated - use NextAuth for authentication')
  return ''
}

export function verifyToken(_token: string): unknown | null {
  console.warn('verifyToken is deprecated - use NextAuth for authentication')
  return null
}

// Get current session - now uses NextAuth
export async function getCurrentSession(): Promise<AuthUser | null> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) return null
    
    return {
      username: session.user.name || session.user.email,
      loginTime: new Date().toISOString()
    }
  } catch {
    return null
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession()
  return !!session
}

// Hash password for production use
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Create or get admin user in database
export async function ensureAdminUser() {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.warn('ADMIN_USERNAME and ADMIN_PASSWORD not configured - skipping admin user creation')
    return null
  }
  
  try {
    const existingUser = await prisma.user.findUnique({
      where: { username: ADMIN_USERNAME }
    })
    
    if (!existingUser) {
      const hashedPassword = await hashPassword(ADMIN_PASSWORD)
      return await prisma.user.create({
        data: {
          username: ADMIN_USERNAME,
          email: 'editor@barneveldsdagblad.nl',
          password: hashedPassword,
          role: 'ADMIN'
        }
      })
    }
    
    return existingUser
  } catch (error) {
    console.error('Error ensuring admin user:', error)
    return null
  }
}