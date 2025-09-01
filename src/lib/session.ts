import { NextResponse } from 'next/server'
import { generateToken } from './auth'
import type { SessionConfig } from '@/types/auth'

// Default session configuration
export const sessionConfig: SessionConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60, // 24 hours in seconds
  path: '/'
}

// Create authenticated session
export function createSession(username: string): NextResponse {
  const token = generateToken(username)
  
  const response = NextResponse.json({ 
    success: true, 
    user: { username },
    message: 'Login successful' 
  })
  
  response.cookies.set('auth-token', token, sessionConfig)
  
  return response
}

// Clear session (logout)
export function clearSession(): NextResponse {
  const response = NextResponse.json({ 
    success: true, 
    message: 'Logout successful' 
  })
  
  response.cookies.set('auth-token', '', {
    ...sessionConfig,
    maxAge: 0
  })
  
  return response
}

// Refresh session (extend expiration)
export function refreshSession(username: string): NextResponse {
  const token = generateToken(username)
  
  const response = NextResponse.json({ 
    success: true, 
    user: { username } 
  })
  
  response.cookies.set('auth-token', token, sessionConfig)
  
  return response
}