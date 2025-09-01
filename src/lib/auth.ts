import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import type { AuthUser, JWTPayload } from '@/types/auth'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET!
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!
const ADMIN_USERNAME = process.env.ADMIN_USERNAME!
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!

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
    
    if (!user) return false
    
    return bcrypt.compare(password, user.password)
  } catch (error) {
    console.error('Database authentication error:', error)
    // Fallback to hardcoded credentials if database is not available
    if (username === ADMIN_USERNAME) {
      if (process.env.NODE_ENV === 'development') {
        return password === ADMIN_PASSWORD
      }
      return bcrypt.compare(password, ADMIN_PASSWORD)
    }
    return false
  }
}

// Generate JWT token
export function generateToken(username: string, userId?: string): string {
  return jwt.sign(
    { username, userId: userId || 'dev-user' },
    JWT_SECRET,
    { expiresIn: '30d' }
  )
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

// Get current session from cookies
export async function getCurrentSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (!token) return null
    
    const payload = verifyToken(token)
    if (!payload) return null
    
    return {
      username: payload.username,
      loginTime: new Date(payload.iat * 1000).toISOString()
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