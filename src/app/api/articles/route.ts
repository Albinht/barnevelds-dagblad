import { NextRequest, NextResponse } from 'next/server'
import { getArticles, addArticle, generateSlug } from '@/lib/articles'
import { getAllArticles, createArticle, getOrCreateUser } from '@/lib/articles-db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'

// GET - Get all articles (with database fallback)
export async function GET() {
  try {
    // Try to get articles from database first
    try {
      const dbArticles = await getAllArticles()
      if (dbArticles && dbArticles.length > 0) {
        // Transform database articles to match frontend format
        const transformedArticles = dbArticles.map(article => ({
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          summary: article.summary,
          content: article.content,
          image: article.image,
          category: article.category,
          tags: article.tags,
          premium: article.premium,
          author: article.author.username || article.author.email,
          publishedAt: article.publishedAt?.toISOString().split('T')[0] || '',
          comments: 0,
          timestamp: article.createdAt.toISOString()
        }))
        return NextResponse.json(transformedArticles)
      }
    } catch (dbError) {
      console.log('Database unavailable, falling back to JSON files')
    }
    
    // Fallback to JSON files if database is unavailable
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
    // Get session using NextAuth
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'summary', 'excerpt', 'category']
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
    
    try {
      // Get or create user in database
      const userId = await getOrCreateUser(session.user.email, session.user.name || undefined)
      
      if (!userId) {
        throw new Error('Failed to get or create user')
      }
      
      // Create article in database
      const dbArticle = await createArticle({
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt,
        summary: body.summary,
        content: body.content || '',
        image: body.image || '/barneveldsdagblad.jpeg',
        category: body.category,
        tags: body.tags || [],
        premium: body.premium || false,
        featured: body.featured || false,
        published: body.published !== false,
        authorId: userId,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date()
      })
      
      if (dbArticle) {
        console.log('Article created in database:', dbArticle.id)
        return NextResponse.json(dbArticle, { status: 201 })
      }
    } catch (dbError) {
      console.error('Database error, falling back to JSON:', dbError)
    }
    
    // Fallback to JSON file storage if database fails
    const articleData = {
      title: body.title,
      summary: body.summary,
      excerpt: body.excerpt,
      image: body.image || '/barneveldsdagblad.jpeg',
      category: body.category,
      premium: body.premium || false,
      author: session.user.name || session.user.email,
      publishedAt: body.publishedAt || new Date().toISOString().split('T')[0],
      comments: 0,
      tags: body.tags || [],
      slug: body.slug,
      content: body.content || ''
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