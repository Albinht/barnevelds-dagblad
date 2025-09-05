import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/articles-db'

// Security: Validate API key
function validateApiKey(request: Request): boolean {
  const apiKey = request.headers.get('X-API-Key')
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET
  
  if (!webhookSecret) {
    console.error('N8N_WEBHOOK_SECRET not configured')
    return false
  }
  
  return apiKey === webhookSecret
}

// Generate unique slug from title
function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  
  // Add timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36).slice(-6)
  return `${baseSlug}-${timestamp}`
}

// Article data interface
interface ArticleData {
  title: string
  excerpt: string
  content: string
  category: string
  summary?: string
  image?: string
  imageUrl?: string  // Alternative to 'image' for clarity
  imageCredit?: string  // Credit/source for the image
  tags?: string[]
  source?: string
  sourceUrl?: string
  authorName?: string
  premium?: boolean
  featured?: boolean
  slug?: string
  [key: string]: unknown // Allow indexing for validation
}

// Validate required fields
function validateArticleData(data: ArticleData): string | null {
  const requiredFields = ['title', 'excerpt', 'content', 'category']
  
  for (const field of requiredFields) {
    const value = data[field]
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `Missing required field: ${field}`
    }
  }
  
  // Validate excerpt length (should be short)
  if (data.excerpt.length > 200) {
    return 'Excerpt too long (max 200 characters)'
  }
  
  // Validate category
  const validCategories = [
    'Nieuws', 'Sport', 'Show', 'Kijk Podcast', 'Puzzel', 
    'Geldmaand', 'Mijn Gemeente', 'Praat Mee', 'Auto', 
    'Geld', 'Koken & Eten', 'Wonen', 'Gezond', 
    'Achter de Schermen', '112 Meldingen'
  ]
  
  if (!validCategories.includes(data.category)) {
    return `Invalid category. Must be one of: ${validCategories.join(', ')}`
  }
  
  return null
}

export async function POST(request: Request) {
  try {
    // 1. Check API key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API key' },
        { status: 401 }
      )
    }
    
    // 2. Parse request body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
    
    // 3. Validate required fields
    const validationError = validateArticleData(body)
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      )
    }
    
    // 4. Check for duplicate articles (by title)
    const existingArticle = await prisma.article.findFirst({
      where: {
        title: body.title
      }
    })
    
    if (existingArticle) {
      return NextResponse.json(
        { 
          error: 'Article with this title already exists',
          existingId: existingArticle.id,
          existingSlug: existingArticle.slug
        },
        { status: 409 }
      )
    }
    
    // 5. Generate unique slug
    const slug = body.slug || generateSlug(body.title)
    
    // 6. Get or create n8n bot user
    const n8nEmail = 'n8n-bot@barnevelds-dagblad.nl'
    const userId = await getOrCreateUser(n8nEmail, 'n8n Automation')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Failed to create/get automation user' },
        { status: 500 }
      )
    }
    
    // 7. Prepare tags with source
    const tags = body.tags || []
    if (body.source && !tags.includes(body.source)) {
      tags.push(body.source)
    }
    
    // Add 112 tag if category is 112 Meldingen
    if (body.category === '112 Meldingen' && !tags.includes('112')) {
      tags.push('112')
    }
    
    // 8. Build author name with source
    let authorName = 'Redactie'
    if (body.source) {
      authorName = `Bron: ${body.source}`
    } else if (body.authorName) {
      authorName = body.authorName
    }
    
    // 8.5. If imageCredit is provided, append it to the content
    let finalContent = body.content
    if (body.imageCredit && (body.imageUrl || body.image)) {
      // Add image credit as HTML at the end of content
      finalContent = `${body.content}\n\n<p class="image-credit text-sm text-gray-600 italic mt-2">${body.imageCredit}</p>`
    }
    
    // 9. Create article in database
    const article = await prisma.article.create({
      data: {
        slug,
        title: body.title,
        excerpt: body.excerpt,
        summary: body.summary || body.excerpt,
        content: finalContent,
        image: body.imageUrl || body.image || '',  // Support both imageUrl and image
        category: body.category,
        tags,
        premium: body.premium || false,
        featured: body.featured || false,
        published: true, // Auto-publish n8n articles
        publishedAt: new Date(),
        authorName,
        authorId: userId,
        views: 0
      },
      include: {
        author: {
          select: { id: true, username: true, email: true }
        }
      }
    })
    
    // 10. Log successful creation
    console.log(`[n8n Webhook] Article created: ${article.id} - ${article.title}`)
    if (body.sourceUrl) {
      console.log(`[n8n Webhook] Source: ${body.sourceUrl}`)
    }
    
    // 11. Return success response
    return NextResponse.json({
      success: true,
      article: {
        id: article.id,
        slug: article.slug,
        title: article.title,
        url: `/artikel/${article.slug}`,
        publishedAt: article.publishedAt
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('[n8n Webhook] Error creating article:', error)
    
    // Don't expose internal errors
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for testing webhook availability
export async function GET(request: Request) {
  // Check if API key is provided for GET (optional)
  const hasValidKey = validateApiKey(request)
  
  return NextResponse.json({
    status: 'Webhook endpoint active',
    authenticated: hasValidKey,
    acceptedMethod: 'POST',
    requiredHeaders: ['X-API-Key'],
    requiredFields: ['title', 'excerpt', 'content', 'category'],
    optionalFields: ['summary', 'image', 'imageUrl', 'imageCredit', 'tags', 'source', 'sourceUrl', 'premium', 'featured']
  })
}