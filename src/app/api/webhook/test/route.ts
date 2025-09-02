import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

// Test endpoint to validate webhook setup without creating articles
export async function POST(request: Request) {
  try {
    // 1. Check API key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { 
          error: 'Unauthorized - Invalid API key',
          hint: 'Make sure X-API-Key header matches N8N_WEBHOOK_SECRET'
        },
        { status: 401 }
      )
    }
    
    // 2. Parse request body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { 
          error: 'Invalid JSON in request body',
          hint: 'Check your JSON syntax'
        },
        { status: 400 }
      )
    }
    
    // 3. Validate structure
    const validationResults = {
      hasTitle: !!body.title,
      hasExcerpt: !!body.excerpt,
      hasContent: !!body.content,
      hasCategory: !!body.category,
      excerptLength: body.excerpt ? body.excerpt.length : 0,
      validCategory: false,
      duplicateCheck: false
    }
    
    // Check category validity
    const validCategories = [
      'Nieuws', 'Sport', 'Show', 'Kijk Podcast', 'Puzzel', 
      'Geldmaand', 'Mijn Gemeente', 'Praat Mee', 'Auto', 
      'Geld', 'Koken & Eten', 'Wonen', 'Gezond', 
      'Achter de Schermen', '112 Meldingen'
    ]
    
    if (body.category) {
      validationResults.validCategory = validCategories.includes(body.category)
    }
    
    // 4. Check for duplicate (if title provided)
    if (body.title) {
      try {
        const existingArticle = await prisma.article.findFirst({
          where: {
            title: body.title
          }
        })
        validationResults.duplicateCheck = !existingArticle
      } catch {
        // Database not available (e.g., local development)
        console.log('[Webhook Test] Database check skipped - not connected')
        validationResults.duplicateCheck = true // Assume no duplicate in dev
      }
    }
    
    // 5. Determine if request would succeed
    const wouldSucceed = 
      validationResults.hasTitle &&
      validationResults.hasExcerpt &&
      validationResults.hasContent &&
      validationResults.hasCategory &&
      validationResults.excerptLength <= 200 &&
      validationResults.validCategory &&
      validationResults.duplicateCheck
    
    // 6. Build response
    const response: Record<string, unknown> = {
      success: true,
      message: 'Webhook test completed',
      wouldCreateArticle: wouldSucceed,
      validation: validationResults,
      receivedData: {
        title: body.title || '[MISSING]',
        excerpt: body.excerpt ? `${body.excerpt.substring(0, 50)}...` : '[MISSING]',
        contentLength: body.content ? body.content.length : 0,
        category: body.category || '[MISSING]',
        tags: body.tags || [],
        hasImage: !!body.image,
        hasSource: !!body.source
      }
    }
    
    // Add hints if validation would fail
    const hints = []
    if (!validationResults.hasTitle) hints.push('Title is required')
    if (!validationResults.hasExcerpt) hints.push('Excerpt is required')
    if (!validationResults.hasContent) hints.push('Content is required')
    if (!validationResults.hasCategory) hints.push('Category is required')
    if (validationResults.excerptLength > 200) hints.push('Excerpt too long (max 200 chars)')
    if (!validationResults.validCategory && body.category) hints.push(`Invalid category: ${body.category}`)
    if (!validationResults.duplicateCheck) hints.push('Article with this title already exists')
    
    if (hints.length > 0) {
      response['hints'] = hints
    }
    
    return NextResponse.json(response, { status: 200 })
    
  } catch (error) {
    console.error('[Webhook Test] Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Test failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for basic info
export async function GET(request: Request) {
  const hasValidKey = validateApiKey(request)
  
  // Get some stats if authenticated
  let stats = null
  if (hasValidKey) {
    try {
      const articleCount = await prisma.article.count()
      const categoryCount = await prisma.article.groupBy({
        by: ['category'],
        _count: true
      })
      
      stats = {
        totalArticles: articleCount,
        categoriesInUse: categoryCount.map(c => c.category)
      }
    } catch {
      // Ignore database errors in test endpoint
      stats = 'Database not connected (development mode)'
    }
  }
  
  return NextResponse.json({
    endpoint: 'Webhook Test Endpoint',
    purpose: 'Test your webhook configuration without creating articles',
    authenticated: hasValidKey,
    productionEndpoint: '/api/webhook/articles',
    method: 'POST',
    requiredHeaders: ['X-API-Key', 'Content-Type: application/json'],
    requiredFields: ['title', 'excerpt', 'content', 'category'],
    validCategories: [
      'Nieuws', 'Sport', 'Show', 'Kijk Podcast', 'Puzzel', 
      'Geldmaand', 'Mijn Gemeente', 'Praat Mee', 'Auto', 
      'Geld', 'Koken & Eten', 'Wonen', 'Gezond', 
      'Achter de Schermen', '112 Meldingen'
    ],
    stats: stats || 'Authenticate to see statistics'
  })
}