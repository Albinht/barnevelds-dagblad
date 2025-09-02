import { NextRequest } from 'next/server'
import { validateCredentials } from '@/lib/auth'
import { createSession } from '@/lib/session'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const ip = request.headers.get('X-Forwarded-For') || request.headers.get('X-Real-IP') || 'unknown'
  
  try {
    const { username, password } = await request.json()
    
    if (!username || !password) {
      logger.security('LOGIN_FAILED', username || 'unknown', {
        reason: 'Missing credentials',
        ip,
        userAgent: request.headers.get('user-agent')
      })
      
      return Response.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }
    
    const isValid = await validateCredentials(username, password)
    
    if (!isValid) {
      logger.security('LOGIN_FAILED', username, {
        reason: 'Invalid credentials',
        ip,
        userAgent: request.headers.get('user-agent')
      })
      
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    logger.security('LOGIN_SUCCESS', username, {
      ip,
      userAgent: request.headers.get('user-agent'),
      duration: Date.now() - startTime
    })
    
    return createSession(username)
    
  } catch (error) {
    logger.error('Login error', error, {
      ip,
      userAgent: request.headers.get('user-agent'),
      duration: Date.now() - startTime
    })
    
    return Response.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}