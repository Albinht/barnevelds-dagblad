import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './src/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for public routes
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // Allow access to login page
  if (pathname === '/login') {
    return NextResponse.next()
  }
  
  // Allow public API routes (GET requests for articles, etc.)
  if (pathname.startsWith('/api/') && request.method === 'GET') {
    return NextResponse.next()
  }
  
  // Check for auth token for protected routes
  const token = request.cookies.get('auth-token')?.value
  
  if (!token || !verifyToken(token)) {
    // For API routes, return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // For admin pages, redirect to login with return URL
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('returnUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/articles/:path*',
    '/api/bedrijven/:path*',
    '/api/upload/:path*'
  ]
}