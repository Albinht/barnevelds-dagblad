# 🔐 Editorial Dashboard Authentication System - Complete Implementation Guide

## 📋 **Project Overview**
This document provides a comprehensive guide to implement a secure authentication system for the Barnevelds Dagblad editorial dashboard. The system will protect admin functionality behind a simple login while maintaining security best practices.

## 🎯 **Goals & Requirements**
- **Secure Access**: Protect `/admin/*` routes behind authentication
- **Simple Login**: Username/password authentication without external providers
- **Session Management**: Secure, HTTP-only cookie sessions with 24-hour expiration
- **Editorial Dashboard**: Professional interface for content management
- **API Protection**: Secure all admin API endpoints
- **User Experience**: Clean, intuitive admin interface matching site branding

## 🏗️ **System Architecture**

### **Authentication Flow**
1. **Unauthenticated Access**: User visits `/admin/*` → Redirect to `/admin/login`
2. **Login Process**: Enter credentials → Server validates → Create JWT session → Set HTTP-only cookie
3. **Authenticated Access**: Session cookie validated via middleware → Access granted
4. **Session Management**: Auto-refresh on activity, logout clears session
5. **API Protection**: All admin APIs check session validity

### **Security Model**
- **Password Security**: bcrypt hashing with salt rounds
- **Session Security**: JWT tokens with secure, HTTP-only, SameSite cookies
- **Route Protection**: Next.js middleware validates sessions
- **CSRF Protection**: SameSite cookies prevent cross-site requests
- **XSS Protection**: HTTP-only cookies prevent JavaScript access

## 📁 **Complete File Structure**
```
barnevelds-dagblad/
├── .env.local                           # Environment variables (CREATE)
├── package.json                         # Updated dependencies
├── middleware.ts                        # Route protection (CREATE)
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── page.tsx            # Login page (CREATE)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx            # Dashboard home (CREATE)
│   │   │   ├── articles/
│   │   │   │   └── page.tsx            # Article management (CREATE)
│   │   │   ├── businesses/
│   │   │   │   └── page.tsx            # Business management (CREATE)
│   │   │   ├── layout.tsx              # Protected admin layout (CREATE)
│   │   │   ├── nieuwe-artikel/page.tsx # Existing - no changes needed
│   │   │   └── bedrijf-toevoegen/page.tsx # Existing - no changes needed
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts      # Login endpoint (CREATE)
│   │   │   │   ├── logout/route.ts     # Logout endpoint (CREATE)
│   │   │   │   └── session/route.ts    # Session validation (CREATE)
│   │   │   ├── articles/route.ts       # UPDATE - Add auth protection
│   │   │   ├── bedrijven/route.ts      # UPDATE - Add auth protection
│   │   │   └── upload/route.ts         # UPDATE - Add auth protection
│   ├── lib/
│   │   ├── auth.ts                     # Authentication utilities (CREATE)
│   │   ├── session.ts                  # Session management (CREATE)
│   │   └── middleware-utils.ts         # Middleware helpers (CREATE)
│   ├── components/
│   │   └── admin/
│   │       ├── LoginForm.tsx           # Login form component (CREATE)
│   │       ├── AdminHeader.tsx         # Admin navigation (CREATE)
│   │       ├── AdminSidebar.tsx        # Admin sidebar navigation (CREATE)
│   │       └── ProtectedRoute.tsx      # Client-side route protection (CREATE)
│   └── types/
│       └── auth.ts                     # Authentication types (CREATE)
```

## 🔧 **Step-by-Step Implementation**

### **Step 1: Environment Setup**

#### **1.1 Install Dependencies**
```bash
npm install bcryptjs jsonwebtoken js-cookie
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

#### **1.2 Create Environment File (.env.local)**
```env
# Admin Credentials
ADMIN_USERNAME=editor
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters_long

# Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**🔒 Security Note**: In production, use a strong password and generate a secure JWT secret:
```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **Step 2: Authentication Core**

#### **2.1 Authentication Utilities (src/lib/auth.ts)**
```typescript
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export interface AuthUser {
  username: string
  loginTime: string
}

export interface JWTPayload {
  username: string
  iat: number
  exp: number
}

const JWT_SECRET = process.env.JWT_SECRET!
const ADMIN_USERNAME = process.env.ADMIN_USERNAME!
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!

// Validate admin credentials
export async function validateCredentials(username: string, password: string): Promise<boolean> {
  if (username !== ADMIN_USERNAME) return false
  
  // In development, allow plain text password comparison
  if (process.env.NODE_ENV === 'development') {
    return password === ADMIN_PASSWORD
  }
  
  // In production, use bcrypt comparison
  // You'll need to hash the password and store it in env
  return bcrypt.compare(password, ADMIN_PASSWORD)
}

// Generate JWT token
export function generateToken(username: string): string {
  return jwt.sign(
    { username },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

// Get current session from cookies
export async function getCurrentSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (!token) return null
    
    const payload = verifyToken(token)
    if (!payload) return null
    
    return {
      username: payload.username,
      loginTime: new Date(payload.iat * 1000).toISOString()
    }
  } catch {
    return null
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession()
  return !!session
}

// Hash password for production use
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}
```

#### **2.2 Session Management (src/lib/session.ts)**
```typescript
import { NextResponse } from 'next/server'
import { generateToken } from './auth'

export interface SessionConfig {
  httpOnly: boolean
  secure: boolean
  sameSite: 'strict' | 'lax' | 'none'
  maxAge: number
  path: string
}

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
```

### **Step 3: Route Protection Middleware**

#### **3.1 Middleware (middleware.ts)**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './src/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for public routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }
  
  // Allow access to login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }
  
  // Check for auth token
  const token = request.cookies.get('auth-token')?.value
  
  if (!token || !verifyToken(token)) {
    // Redirect to login with return URL
    const loginUrl = new URL('/admin/login', request.url)
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
```

### **Step 4: Authentication API Endpoints**

#### **4.1 Login API (src/app/api/auth/login/route.ts)**
```typescript
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
```

#### **4.2 Logout API (src/app/api/auth/logout/route.ts)**
```typescript
import { clearSession } from '@/lib/session'

export async function POST() {
  return clearSession()
}
```

#### **4.3 Session Check API (src/app/api/auth/session/route.ts)**
```typescript
import { getCurrentSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getCurrentSession()
    
    if (!session) {
      return Response.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    return Response.json({ 
      authenticated: true, 
      user: session 
    })
    
  } catch (error) {
    return Response.json(
      { error: 'Session check failed' },
      { status: 500 }
    )
  }
}
```

### **Step 5: Admin Dashboard UI Components**

#### **5.1 Login Form Component (src/components/admin/LoginForm.tsx)**
```typescript
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginForm() {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams?.get('returnUrl') || '/admin/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (response.ok) {
        router.push(returnUrl)
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Barnevelds Dagblad
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Editorial Dashboard Login
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

#### **5.2 Admin Header Component (src/components/admin/AdminHeader.tsx)**
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AdminHeaderProps {
  username?: string
}

export default function AdminHeader({ username }: AdminHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard" className="text-xl font-bold text-gray-900">
              Barnevelds Dagblad - Editorial
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {username}
            </span>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
```

### **Step 6: Protected Admin Pages**

#### **6.1 Admin Layout (src/app/admin/layout.tsx)**
```typescript
import { getCurrentSession } from '@/lib/auth'
import AdminHeader from '@/components/admin/AdminHeader'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getCurrentSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader username={session.username} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
```

#### **6.2 Login Page (src/app/admin/login/page.tsx)**
```typescript
import LoginForm from '@/components/admin/LoginForm'

export default function LoginPage() {
  return <LoginForm />
}
```

#### **6.3 Dashboard Page (src/app/admin/dashboard/page.tsx)**
```typescript
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editorial Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your news website content and business listings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/nieuwe-artikel"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-2">New Article</h3>
          <p className="text-sm text-gray-600">Create and publish new news articles</p>
        </Link>

        <Link
          href="/admin/bedrijf-toevoegen"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-2">Add Business</h3>
          <p className="text-sm text-gray-600">Add new businesses to the directory</p>
        </Link>

        <Link
          href="/admin/articles"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Articles</h3>
          <p className="text-sm text-gray-600">Edit and delete existing articles</p>
        </Link>
      </div>
    </div>
  )
}
```

### **Step 7: API Route Protection Updates**

#### **7.1 Update Articles API (src/app/api/articles/route.ts)**
Add authentication check to POST method:
```typescript
import { getCurrentSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  // Check authentication for POST requests
  const session = await getCurrentSession()
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // ... existing POST logic
}
```

#### **7.2 Update Upload API (src/app/api/upload/route.ts)**
Add authentication check:
```typescript
import { getCurrentSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getCurrentSession()
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // ... existing upload logic
}
```

## 🚀 **Deployment & Production Setup**

### **Production Environment Variables**
```env
# Production credentials
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_hashed_password_here
JWT_SECRET=your_production_jwt_secret_64_characters_long
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### **Password Hashing for Production**
```javascript
// Run this script to generate password hash
const bcrypt = require('bcryptjs');
const password = 'your_secure_password';
const hash = bcrypt.hashSync(password, 12);
console.log('Hashed password:', hash);
```

### **Security Checklist**
- [ ] Strong JWT secret (minimum 32 characters)
- [ ] Secure password policy enforced
- [ ] HTTPS enabled in production
- [ ] Environment variables properly secured
- [ ] Session timeout configured appropriately
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] Rate limiting on login endpoint

## 🔧 **Testing & Verification**

### **Test Scenarios**
1. **Unauthenticated Access**: Visit `/admin/dashboard` → Should redirect to `/admin/login`
2. **Invalid Login**: Wrong credentials → Should show error message
3. **Successful Login**: Correct credentials → Should redirect to dashboard
4. **Session Persistence**: Refresh page → Should remain logged in
5. **Logout**: Click logout → Should clear session and redirect to login
6. **API Protection**: Call admin APIs without auth → Should return 401
7. **Session Expiry**: Wait 24 hours → Should require re-login

### **Manual Testing Commands**
```bash
# Test login API
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"editor","password":"your_password"}'

# Test protected API
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -b "auth-token=your_jwt_token" \
  -d '{"title":"Test Article","content":"Test content"}'
```

## 📚 **Additional Features to Consider**

### **Future Enhancements**
1. **Multiple Users**: Database-backed user management
2. **Role-Based Access**: Different permission levels
3. **Activity Logging**: Track admin actions
4. **Password Reset**: Email-based password recovery
5. **Two-Factor Authentication**: Enhanced security
6. **Session Management**: View and revoke active sessions
7. **Audit Trail**: Log all content changes
8. **Bulk Operations**: Mass content management tools

### **Monitoring & Analytics**
- Login attempt monitoring
- Session duration analytics
- Content creation statistics
- Error rate monitoring
- Performance metrics

## 🆘 **Troubleshooting Guide**

### **Common Issues**

**1. "JWT Secret Not Found" Error**
- Ensure `.env.local` exists with `JWT_SECRET`
- Restart development server after adding env vars

**2. Middleware Not Working**
- Check `middleware.ts` is in project root
- Verify `config.matcher` patterns
- Ensure Next.js version compatibility

**3. Session Not Persisting**
- Check cookie settings in browser dev tools
- Verify `secure` setting matches environment (HTTP vs HTTPS)
- Check `SameSite` policy compatibility

**4. Login Redirect Loop**
- Verify middleware authentication logic
- Check session verification function
- Ensure login page is excluded from protection

**5. API Routes Still Accessible**
- Add authentication checks to all admin APIs
- Verify middleware covers API routes
- Test with browser dev tools network tab

### **Debug Commands**
```bash
# Check environment variables
node -e "console.log(process.env.JWT_SECRET ? 'JWT_SECRET exists' : 'JWT_SECRET missing')"

# Verify bcrypt hashing
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.compareSync('password', '$2a$12$...'))"

# Test JWT generation
node -e "const jwt=require('jsonwebtoken'); console.log(jwt.sign({username:'test'}, 'secret', {expiresIn:'1h'}))"
```

## 📞 **Support & Maintenance**

### **Regular Maintenance Tasks**
1. **Weekly**: Review login logs and failed attempts
2. **Monthly**: Update dependencies and security patches
3. **Quarterly**: Review and rotate JWT secrets
4. **Yearly**: Password policy review and updates

### **Security Updates**
- Monitor for Next.js security updates
- Keep authentication dependencies current
- Regular security audits of admin interface
- Review and update session timeout policies

---

**🎯 Implementation Status**: Ready for development
**🔒 Security Level**: Production-ready with industry standards
**⏱️ Estimated Time**: 1-2 days for complete implementation
**🛠️ Maintenance**: Low-maintenance, self-contained system