# 🗄️ Database Implementation Plan - Barnevelds Dagblad

## 📋 Overzicht
Complete database setup voor Barnevelds Dagblad met Prisma, PostgreSQL, authenticatie en artikel management.

---

## ⚡ Phase 1: Database Setup & Configuratie

### 1.1 PostgreSQL Setup (Vercel Postgres)
```bash
# Installeer dependencies
npm install @prisma/client prisma
npm install @vercel/postgres

# Initialiseer Prisma
npx prisma init

# Pull database URL van Vercel
vercel env pull .env.local
```

### 1.2 Environment Variables
```env
# .env.local
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 📊 Phase 2: Database Schema Design

### 2.1 Complete Prisma Schema
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// User Management
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String?
  role          Role      @default(USER)
  isActive      Boolean   @default(true)
  lastLogin     DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  articles      Article[]
  bedrijven     Bedrijf[]
  sessions      Session[]
  
  @@index([email])
}

enum Role {
  USER
  AUTHOR
  EDITOR
  ADMIN
}

// Article Management
model Article {
  id            String    @id @default(cuid())
  slug          String    @unique
  title         String
  summary       String
  excerpt       String?
  content       String    @db.Text
  image         String?
  category      String
  tags          String[]
  premium       Boolean   @default(false)
  featured      Boolean   @default(false)
  published     Boolean   @default(false)
  publishedAt   DateTime?
  views         Int       @default(0)
  readTime      Int?      // in minutes
  
  // SEO
  metaTitle     String?
  metaDesc      String?
  
  // Relations
  authorId      String
  author        User      @relation(fields: [authorId], references: [id])
  comments      Comment[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([slug])
  @@index([category])
  @@index([published, publishedAt])
}

// Comments System
model Comment {
  id            String    @id @default(cuid())
  content       String    @db.Text
  approved      Boolean   @default(false)
  
  // Relations
  articleId     String
  article       Article   @relation(fields: [articleId], references: [id], onDelete: Cascade)
  
  // Guest comments
  guestName     String?
  guestEmail    String?
  
  createdAt     DateTime  @default(now())
  
  @@index([articleId])
}

// Bedrijven (Business Directory)
model Bedrijf {
  id            String    @id @default(cuid())
  naam          String
  beschrijving  String    @db.Text
  categorie     String
  adres         String
  postcode      String?
  stad          String    @default("Barneveld")
  telefoon      String?
  email         String?
  website       String?
  logo          String?
  
  // Features
  featured      Boolean   @default(false)
  label         Label?
  verified      Boolean   @default(false)
  
  // Opening hours (JSON)
  openingHours  Json?
  
  // Relations
  ownerId       String?
  owner         User?     @relation(fields: [ownerId], references: [id])
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([categorie])
  @@index([featured])
}

enum Label {
  NIEUW
  PREMIUM
  AANBIEDING
}

// Session Management
model Session {
  id            String    @id @default(cuid())
  sessionToken  String    @unique
  userId        String
  expires       DateTime
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}

// Newsletter Subscriptions
model Newsletter {
  id            String    @id @default(cuid())
  email         String    @unique
  isActive      Boolean   @default(true)
  categories    String[]  // Interested categories
  createdAt     DateTime  @default(now())
  
  @@index([email])
}

// Media/Uploads
model Media {
  id            String    @id @default(cuid())
  filename      String
  url           String
  type          String    // image/video/document
  size          Int       // in bytes
  alt           String?
  caption       String?
  uploadedBy    String?   // userId
  createdAt     DateTime  @default(now())
  
  @@index([type])
}
```

---

## 🔐 Phase 3: Authentication Implementation

### 3.1 Install Auth Dependencies
```bash
npm install next-auth @next-auth/prisma-adapter
npm install bcryptjs @types/bcryptjs
npm install jsonwebtoken @types/jsonwebtoken
```

### 3.2 NextAuth Configuration
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() }
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  }
})

export { handler as GET, handler as POST }
```

---

## 🚀 Phase 4: CRUD API Implementation

### 4.1 Articles API
```typescript
// app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

// GET - List articles
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  const published = searchParams.get('published') === 'true'
  const featured = searchParams.get('featured') === 'true'
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  const where = {
    ...(category && { category }),
    ...(published && { published: true }),
    ...(featured && { featured: true }),
  }

  const articles = await prisma.article.findMany({
    where,
    include: {
      author: {
        select: { name: true, email: true }
      },
      _count: {
        select: { comments: true }
      }
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    skip: offset,
  })

  const total = await prisma.article.count({ where })

  return NextResponse.json({
    articles,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    }
  })
}

// POST - Create article
export async function POST(request: NextRequest) {
  const session = await getServerSession()
  
  if (!session || !['ADMIN', 'AUTHOR', 'EDITOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()
  
  // Generate slug
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const article = await prisma.article.create({
    data: {
      ...data,
      slug,
      authorId: session.user.id,
      publishedAt: data.published ? new Date() : null,
      readTime: calculateReadTime(data.content),
    }
  })

  return NextResponse.json(article, { status: 201 })
}

// Helper function
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}
```

### 4.2 Bedrijven API
```typescript
// app/api/bedrijven/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const categorie = searchParams.get('categorie')
  const featured = searchParams.get('featured') === 'true'

  const bedrijven = await prisma.bedrijf.findMany({
    where: {
      ...(categorie && { categorie }),
      ...(featured && { featured: true }),
    },
    orderBy: [
      { featured: 'desc' },
      { naam: 'asc' }
    ]
  })

  return NextResponse.json(bedrijven)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()
  
  const bedrijf = await prisma.bedrijf.create({
    data: {
      ...data,
      ownerId: session.user.id,
    }
  })

  return NextResponse.json(bedrijf, { status: 201 })
}
```

---

## 🌱 Phase 5: Database Seeding

### 5.1 Seed Script
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@barneveldsdagblad.nl' },
    update: {},
    create: {
      email: 'admin@barneveldsdagblad.nl',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    }
  })

  // Create sample articles
  const categories = ['Lokaal Nieuws', 'Sport', 'Politiek', 'Economie', 'Cultuur']
  
  for (const category of categories) {
    for (let i = 1; i <= 5; i++) {
      await prisma.article.create({
        data: {
          slug: `${category.toLowerCase().replace(' ', '-')}-artikel-${i}`,
          title: `${category} Artikel ${i}`,
          summary: `Dit is een voorbeeld artikel voor ${category}`,
          excerpt: `Korte samenvatting van ${category} artikel ${i}`,
          content: `<p>Volledige inhoud van het artikel...</p>`,
          category,
          tags: [category.toLowerCase(), 'barneveld', 'nieuws'],
          published: true,
          publishedAt: new Date(),
          authorId: admin.id,
          featured: i === 1,
        }
      })
    }
  }

  // Create sample bedrijven
  const bedrijfCategories = ['Horeca', 'Winkel', 'Dienstverlening']
  
  for (const cat of bedrijfCategories) {
    for (let i = 1; i <= 3; i++) {
      await prisma.bedrijf.create({
        data: {
          naam: `${cat} Bedrijf ${i}`,
          beschrijving: `Beschrijving van ${cat} bedrijf ${i}`,
          categorie: cat,
          adres: `Hoofdstraat ${i}`,
          postcode: `377${i} AB`,
          telefoon: `0342-${i}00000`,
          email: `info@bedrijf${i}.nl`,
          featured: i === 1,
        }
      })
    }
  }

  console.log('✅ Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 5.2 Package.json Script
```json
{
  "scripts": {
    "db:seed": "tsx prisma/seed.ts",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  }
}
```

---

## 🔄 Phase 6: Migration Commands

```bash
# Development migration
npx prisma migrate dev --name init

# Push to production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

---

## 🛠️ Phase 7: Utility Functions

### 7.1 Prisma Client Singleton
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 7.2 Database Helpers
```typescript
// lib/db-helpers.ts
import { prisma } from './prisma'

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: {
      author: true,
      comments: {
        where: { approved: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })
}

export async function incrementArticleViews(id: string) {
  return prisma.article.update({
    where: { id },
    data: { views: { increment: 1 } }
  })
}

export async function getPopularArticles(limit = 5) {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { views: 'desc' },
    take: limit
  })
}

export async function searchArticles(query: string) {
  return prisma.article.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { summary: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ]
    }
  })
}
```

---

## 📈 Phase 8: Performance Optimization

### 8.1 Database Indexes
```prisma
// Add to schema.prisma models
@@index([published, category, publishedAt])
@@index([slug])
@@index([authorId])
@@fulltext([title, summary, content]) // For PostgreSQL full-text search
```

### 8.2 Connection Pooling
```typescript
// lib/prisma.ts with connection pool
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})
```

---

## 🚢 Phase 9: Deployment Checklist

### 9.1 Environment Setup
```bash
# Vercel environment variables
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
```

### 9.2 Production Migration
```bash
# Run migrations on production
npx prisma migrate deploy

# Verify schema
npx prisma db pull

# Generate client
npx prisma generate
```

### 9.3 Monitoring
```typescript
// lib/monitoring.ts
import { prisma } from './prisma'

export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'healthy' }
  } catch (error) {
    return { status: 'unhealthy', error }
  }
}
```

---

## 📊 Phase 10: Admin Dashboard Queries

### 10.1 Dashboard Statistics
```typescript
// app/api/admin/stats/route.ts
export async function GET() {
  const [
    totalArticles,
    publishedArticles,
    totalUsers,
    totalBedrijven,
    recentArticles,
    popularArticles
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { published: true } }),
    prisma.user.count(),
    prisma.bedrijf.count(),
    prisma.article.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: true }
    }),
    prisma.article.findMany({
      take: 5,
      orderBy: { views: 'desc' },
      where: { published: true }
    })
  ])

  return NextResponse.json({
    stats: {
      totalArticles,
      publishedArticles,
      totalUsers,
      totalBedrijven
    },
    recentArticles,
    popularArticles
  })
}
```

---

## ✅ Completion Checklist

- [ ] Prisma schema defined
- [ ] Database migrations created
- [ ] Authentication implemented
- [ ] CRUD APIs built
- [ ] Seed data added
- [ ] Admin dashboard connected
- [ ] Search functionality added
- [ ] Performance indexes added
- [ ] Production deployment tested
- [ ] Monitoring setup complete

---

## 🎯 Next Steps

1. **Backup Strategy**: Implement automated backups via Vercel/Neon
2. **Caching**: Add Redis for session storage and query caching
3. **Search**: Implement Algolia or MeiliSearch for advanced search
4. **Analytics**: Add PostHog or Plausible for tracking
5. **CDN**: Configure Cloudinary for image optimization
6. **Webhooks**: Add webhook support for external integrations

---

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Main_Page)