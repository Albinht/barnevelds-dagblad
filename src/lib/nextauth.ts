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
  debug: true, // TEMPORARY: Enable debug for troubleshooting
  logger: {
    error: (code, metadata) => {
      console.error('NextAuth Error:', code, metadata)
    },
    warn: (code) => {
      console.warn('NextAuth Warning:', code)
    },
    debug: (code, metadata) => {
      console.log('NextAuth Debug:', code, metadata)
    }
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔐 SignIn callback triggered')
      console.log('User:', user)
      console.log('Account:', account)
      console.log('Profile:', profile)
      
      const email = user.email
      
      if (!email) {
        console.log('❌ No email provided by Google')
        return '/auth/error?error=NoEmail'
      }
      
      if (!ADMIN_EMAIL_WHITELIST.includes(email)) {
        console.log('❌ Login blocked - email not whitelisted:', email)
        console.log('Whitelist:', ADMIN_EMAIL_WHITELIST)
        return `/auth/error?error=AccessDenied&email=${encodeURIComponent(email)}`
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
  pages: {
    signIn: '/login',
    error: '/auth/error', // Custom error page
  },
}

// Helper function to check if user has admin access
export function checkAdminAccess(email: string): boolean {
  return ADMIN_EMAIL_WHITELIST.includes(email)
}