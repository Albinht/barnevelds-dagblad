import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import { handlePutFallback, handleDeleteFallback } from './fallback-route'
import { revalidatePath, revalidateTag } from 'next/cache'

interface Params {
  params: Promise<{ id: string }>
}

// GET single article by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params
    
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, username: true, email: true }
        },
        comments: {
          where: { approved: true },
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: { id: true, username: true }
            }
          }
        },
        media: true
      }
    })
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    // Increment view count
    await prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } }
    })
    
    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}

// PUT update article
export async function PUT(request: Request, { params }: Params) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    console.log('PUT Article - Session:', session?.user?.email || 'No session')
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }
    
    const { id } = await params
    const body = await request.json()
    
    console.log('Updating article:', id)
    console.log('Update data:', body)
    
    // Prepare update data - remove fields that might cause issues
    const updateData: Record<string, unknown> = {
      title: body.title,
      excerpt: body.excerpt,
      summary: body.summary,
      content: body.content,
      image: body.image,
      category: body.category,
      tags: body.tags || [],
      premium: body.premium || false,
      featured: body.featured || false,
      published: body.published !== false,
      authorName: body.author || body.authorName, // Support custom author name
      updatedAt: new Date()
    }
    
    // Only update publishedAt if article is being published for the first time
    if (body.published && body.publishedAt === undefined) {
      updateData.publishedAt = new Date()
    } else if (body.publishedAt) {
      updateData.publishedAt = new Date(body.publishedAt)
    }
    
    const article = await prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { id: true, username: true, email: true }
        }
      }
    })
    
    console.log('Article updated successfully')
    
    // Revalidate all pages that might show this article
    revalidatePath('/', 'layout')
    revalidatePath(`/artikel/${article.slug}`)
    revalidatePath(`/${article.category?.toLowerCase()}`)
    revalidatePath('/112-meldingen')
    
    return NextResponse.json(article)
  } catch (error) {
    console.error('Error updating article - Details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    })
    
    // If database fails, try JSON fallback
    if (error instanceof Error && error.message.includes('database')) {
      console.log('Database error, trying JSON fallback')
      return handlePutFallback(request, { params })
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to update article',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE article
export async function DELETE(request: Request, { params }: Params) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    console.log('DELETE Article - Session:', session?.user?.email || 'No session')
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }
    
    const { id } = await params
    console.log('Deleting article:', id)
    
    // First check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id }
    })
    
    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    await prisma.article.delete({
      where: { id }
    })
    
    console.log('Article deleted successfully')
    
    // Revalidate all pages after deletion
    revalidatePath('/', 'layout')
    revalidatePath(`/${existingArticle.category?.toLowerCase()}`)
    revalidatePath('/112-meldingen')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting article - Details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    })
    
    // If database fails, try JSON fallback
    if (error instanceof Error && error.message.includes('database')) {
      console.log('Database error, trying JSON fallback')
      return handleDeleteFallback(request, { params })
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to delete article',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}