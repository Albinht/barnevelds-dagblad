import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

console.log('🚀 NextAuth config loading...')
console.log('🔑 GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing')
console.log('🔑 GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing')
console.log('🔑 NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing')

// Whitelist of email addresses that can access admin functions
const ADMIN_EMAIL_WHITELIST = [
  'al.hasan.al@gmail.com',
  'schilderenopnummerwinkel@gmail.com', 
  'editor@barneveldsdagblad.nl',
  'redacteur@barneveldsdagblad.nl',
]

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: false, // Disable debug logging
  logger: {
    error: (code, metadata) => {
      // Only log actual errors, not 401 unauthorized
      if (code !== 'CLIENT_FETCH_ERROR') {
        console.error(code, metadata)
      }
    },
    warn: () => {},
    debug: () => {}
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log('🔐 SignIn callback triggered for:', user.email)
      const email = user.email
      
      if (!email || !ADMIN_EMAIL_WHITELIST.includes(email)) {
        console.log('❌ Login blocked for email:', email)
        return false
      }
      
      console.log('✅ Login allowed for email:', email)
      return true
    },

    async jwt({ token, user }) {
      if (user) {
        console.log('🔑 JWT: Adding user data for', user.email)
        token.role = 'ADMIN'
        token.email = user.email
        token.name = user.name
      }
      return token
    },

    async session({ session, token }) {
      console.log('📝 Session callback for token:', token?.email)
      if (token) {
        session.user.role = token.role as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
}

// Helper function to check if user has admin access
export function checkAdminAccess(email: string): boolean {
  return ADMIN_EMAIL_WHITELIST.includes(email)
}