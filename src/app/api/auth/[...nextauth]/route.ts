import NextAuth from 'next-auth'
import { authOptions } from '@/lib/nextauth'

console.log('🚀 NextAuth handler initializing...')
console.log('🔧 Auth options loaded:', !!authOptions)

const handler = NextAuth(authOptions)

console.log('✅ NextAuth handler created successfully')

export { handler as GET, handler as POST }