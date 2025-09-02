import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import { getOrCreateUser } from '@/lib/articles-db'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

// GET all articles for admin view (simplified for admin panel)
export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    
    // const skip = (page - 1) * limit // Not used with findMany without pagination
    
    // Build where clause with proper typing
    const where: Prisma.ArticleWhereInput = {}
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
    
    // For admin panel, get all articles without pagination
    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, username: true, email: true }
        },
        _count: {
          select: { comments: true }
        }
      }
    })
    
    // Transform to match admin panel format - INCLUDE SLUG!
    const transformedArticles = articles.map(article => ({
      id: article.id,
      slug: article.slug,  // Important for view links!
      title: article.title,
      excerpt: article.excerpt,
      summary: article.summary,
      content: article.content,
      image: article.image,
      category: article.category,
      tags: article.tags,
      premium: article.premium,
      featured: article.featured,
      published: article.published,
      author: article.authorName || article.author.username || article.author.email,
      authorName: article.authorName,
      publishedAt: article.publishedAt?.toISOString().split('T')[0] || '',
      comments: article._count.comments,
      timestamp: article.createdAt.toISOString()
    }))
    
    return NextResponse.json(transformedArticles)
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
  // Check authentication
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
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
      published
    } = body
    
    // Generate slug if not provided
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug: finalSlug }
    })
    
    if (existingArticle) {
      // Add timestamp to make unique
      const uniqueSlug = `${finalSlug}-${Date.now()}`
      body.slug = uniqueSlug
    } else {
      body.slug = finalSlug
    }
    
    // Get or create user
    const userId = await getOrCreateUser(
      session.user.email,
      session.user.name || undefined
    )
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Failed to identify user' },
        { status: 500 }
      )
    }
    
    // Automatically add "112" tag if category is "112"
    let finalTags = tags || []
    if (category === '112' || category === '112 Meldingen') {
      if (!finalTags.includes('112')) {
        finalTags = [...finalTags, '112']
      }
    }
    
    const article = await prisma.article.create({
      data: {
        title,
        slug: body.slug,
        excerpt,
        summary,
        content,
        image,
        category,
        tags: finalTags,
        premium: premium || false,
        featured: featured || false,
        published: published || false,
        publishedAt: published ? new Date() : null,
        authorName: body.author || body.authorName, // Custom author name
        authorId: userId  // Use authenticated user
      },
      include: {
        author: {
          select: { id: true, username: true, email: true }
        }
      }
    })
    
    // Revalidate all pages that might show this new article
    revalidatePath('/', 'layout')
    revalidatePath(`/${category?.toLowerCase()}`)
    revalidatePath('/112-meldingen')
    
    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}