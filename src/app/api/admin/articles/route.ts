import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

// GET all articles with pagination and filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: any = {}
    if (category) where.category = category
    if (published !== null) where.published = published === 'true'
    if (featured !== null) where.featured = featured === 'true'
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, username: true, email: true }
          },
          _count: {
            select: { comments: true }
          }
        }
      }),
      prisma.article.count({ where })
    ])
    
    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

// POST create new article
export async function POST(request: Request) {
  const isAuth = await isAuthenticated()
  if (!isAuth) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  try {
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      summary,
      content,
      image,
      category,
      tags,
      premium,
      featured,
      published,
      authorId
    } = body
    
    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug }
    })
    
    if (existingArticle) {
      return NextResponse.json(
        { error: 'Article with this slug already exists' },
        { status: 400 }
      )
    }
    
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        summary,
        content,
        image,
        category,
        tags: tags || [],
        premium: premium || false,
        featured: featured || false,
        published: published || false,
        publishedAt: published ? new Date() : null,
        authorId: authorId || 'dev-user' // Use default for now
      },
      include: {
        author: {
          select: { id: true, username: true, email: true }
        }
      }
    })
    
    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}