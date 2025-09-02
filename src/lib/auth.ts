import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { AuthUser, JWTPayload } from '@/types/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'

const JWT_SECRET = process.env.JWT_SECRET
const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD environment variables are required')
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

// Generate JWT token with shorter expiry for better security
export function generateToken(username: string, userId?: string, role: string = 'ADMIN'): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }
  
  return jwt.sign(
    { 
      username, 
      userId: userId || 'dev-user', 
      role,
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { expiresIn: '24h' } // Reduced from 30d to 24h for better security
  )
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  if (!JWT_SECRET) {
    return null
  }
  
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
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
    throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be configured')
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