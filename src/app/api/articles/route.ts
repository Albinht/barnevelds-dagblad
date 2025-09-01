import { NextRequest, NextResponse } from 'next/server'
import { getArticles, addArticle, generateSlug } from '@/lib/articles'
import { Article } from '@/types/article'

// GET - Get all articles
export async function GET() {
  try {
    const articles = await getArticles()
    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

// POST - Add new article
export async function POST(request: NextRequest) {
  try {
    // Check authentication for POST requests
    const { getCurrentSession } = await import('@/lib/auth')
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'summary', 'excerpt', 'category', 'author']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Generate slug if not provided
    if (!body.slug) {
      body.slug = generateSlug(body.title)
    }
    
    // Set defaults
    const articleData: Omit<Article, 'id' | 'timestamp'> = {
      title: body.title,
      summary: body.summary,
      excerpt: body.excerpt,
      image: body.image || '/barneveldsdagblad.jpeg',
      category: body.category,
      premium: body.premium || false,
      author: body.author,
      publishedAt: body.publishedAt || new Date().toISOString().split('T')[0],
      comments: body.comments || 0,
      tags: body.tags || [],
      slug: body.slug,
    }
    
    const newArticle = await addArticle(articleData)
    
    return NextResponse.json(newArticle, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}