import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import type { AuthUser, JWTPayload } from '@/types/auth'

const JWT_SECRET = process.env.JWT_SECRET!
const ADMIN_USERNAME = process.env.ADMIN_USERNAME!
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!

// Validate admin credentials
export async function validateCredentials(username: string, password: string): Promise<boolean> {
  if (username !== ADMIN_USERNAME) return false
  
  // In development, allow plain text password comparison
  if (process.env.NODE_ENV === 'development') {
    return password === ADMIN_PASSWORD
  }
  
  // In production, use bcrypt comparison
  // You'll need to hash the password and store it in env
  return bcrypt.compare(password, ADMIN_PASSWORD)
}

// Generate JWT token
export function generateToken(username: string): string {
  return jwt.sign(
    { username },
    JWT_SECRET,
    { expiresIn: '24h' }
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