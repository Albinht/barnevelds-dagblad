import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'

// Rate limiting store (simple in-memory for demo, use Redis in production)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>()

function isRateLimited(ip: string, limit: number = 100, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const windowStart = now - windowMs
  
  const record = rateLimitMap.get(ip)
  
  if (!record || record.timestamp < windowStart) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return false
  }
  
  if (record.count >= limit) {
    return true
  }
  
  record.count++
  return false
}

export default withAuth(
  function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const ip = request.headers.get('X-Forwarded-For') || request.headers.get('X-Real-IP') || 'unknown'
    
    // Apply rate limiting to API routes
    if (pathname.startsWith('/api/')) {
      if (isRateLimited(ip, 100, 15 * 60 * 1000)) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        )
      }
    }
    
    // Add comprehensive security headers
    const response = NextResponse.next()
    
    // Basic security headers
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    // HTTPS enforcement
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    
    // Content Security Policy - Restrictive but allows necessary resources
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://accounts.google.com https://www.googleapis.com",
      "frame-src 'self' https://accounts.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
    
    response.headers.set('Content-Security-Policy', cspDirectives)
    
    // Permissions Policy - Restrict browser features
    response.headers.set('Permissions-Policy', 
      'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
    )
    
    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow public routes
        if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/')) {
          return true
        }
        
        // Allow auth endpoints
        if (pathname.startsWith('/api/auth/')) {
          return true
        }
        
        // Allow public API routes (GET requests for articles, etc.) but not admin routes
        if (pathname.startsWith('/api/') && req.method === 'GET') {
          // Block admin API routes
          if (pathname.startsWith('/api/admin/')) {
            return !!token
          }
          // Allow public API routes (articles, bedrijven, etc.)
          return true
        }
        
        // Allow POST/PUT/DELETE to public API routes (for contact forms, etc.)
        if (pathname.startsWith('/api/')) {
          // Block admin API routes
          if (pathname.startsWith('/api/admin/')) {
            return !!token
          }
          // Block article/business creation without auth
          if (pathname.startsWith('/api/articles') || 
              pathname.startsWith('/api/bedrijven') ||
              pathname.startsWith('/api/upload')) {
            return !!token
          }
          // Allow other API routes (newsletter, contact, etc.)
          return true
        }
        
        // Require authentication for admin routes
        return !!token
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/articles/:path*',
    '/api/bedrijven/:path*',
    '/api/upload/:path*'
  ]
}