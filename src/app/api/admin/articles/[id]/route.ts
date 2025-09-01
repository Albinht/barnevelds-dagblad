import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

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
  const isAuth = await isAuthenticated()
  if (!isAuth) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  try {
    const { id } = await params
    const body = await request.json()
    
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...body,
        publishedAt: body.published && !body.publishedAt ? new Date() : body.publishedAt,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: { id: true, username: true, email: true }
        }
      }
    })
    
    return NextResponse.json(article)
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

// DELETE article
export async function DELETE(request: Request, { params }: Params) {
  const isAuth = await isAuthenticated()
  if (!isAuth) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  try {
    const { id } = await params
    
    await prisma.article.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}