import { NextRequest } from 'next/server'
import { validateCredentials } from '@/lib/auth'
import { createSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    if (!username || !password) {
      return Response.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }
    
    const isValid = await validateCredentials(username, password)
    
    if (!isValid) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    return createSession(username)
    
  } catch (error) {
    console.error('Login error:', error)
    return Response.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}