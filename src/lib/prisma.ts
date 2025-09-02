import { PrismaClient } from '@prisma/client'

function createFreshPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL
  const poolSize = parseInt(process.env.DATABASE_POOL_SIZE || '10', 10)
  const connectionTimeout = parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '30000', 10)
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required')
  }
  
  console.log('=== Creating FRESH Prisma Client ===')
  console.log('NODE_ENV:', process.env.NODE_ENV)
  console.log('DATABASE_URL:', databaseUrl ? 'Set' : 'Not set')
  console.log('Pool size:', poolSize)
  console.log('Connection timeout:', connectionTimeout)
  
  return new PrismaClient({
    datasources: {
      db: {
        url: `${databaseUrl}${databaseUrl.includes('?') ? '&' : '?'}connection_limit=${poolSize}&connect_timeout=${Math.floor(connectionTimeout / 1000)}`,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error', 'warn'],
  })
}

// In development, always create fresh client to avoid caching issues
const isDevelopment = process.env.NODE_ENV !== 'production'

let prisma: PrismaClient

if (isDevelopment) {
  // Always fresh client in development
  console.log('Development mode: Creating fresh Prisma client')
  prisma = createFreshPrismaClient()
} else {
  // Use global caching in production
  const globalForPrisma = global as unknown as { prisma: PrismaClient }
  prisma = globalForPrisma.prisma || createFreshPrismaClient()
  globalForPrisma.prisma = prisma
}

export { prisma }