import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export function loggingMiddleware(request: NextRequest) {
  const startTime = Date.now()
  
  // Log incoming request
  logger.api(
    request.method,
    request.nextUrl.pathname,
    0, // Status code not known yet
    0, // Duration not known yet
    {
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      ip: request.headers.get('X-Forwarded-For') || request.headers.get('X-Real-IP'),
    }
  )

  return NextResponse.next()
}

// Helper function to log API responses (use in API routes)
export function logApiResponse(
  method: string,
  path: string,
  statusCode: number,
  startTime: number,
  metadata?: Record<string, any>
) {
  const duration = Date.now() - startTime
  logger.api(method, path, statusCode, duration, metadata)
}