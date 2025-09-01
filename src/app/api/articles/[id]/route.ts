import { NextRequest, NextResponse } from 'next/server'
import { getArticleById, updateArticle, deleteArticle } from '@/lib/articles'

interface Params {
  params: {
    id: string
  }
}

// GET - Get article by ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const article = await getArticleById(params.id)
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}

// PUT - Update article
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Check authentication for PUT requests
    const { getCurrentSession } = await import('@/lib/auth')
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const updatedArticle = await updateArticle(params.id, body)
    
    if (!updatedArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(updatedArticle)
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

// DELETE - Delete article
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Check authentication for DELETE requests
    const { getCurrentSession } = await import('@/lib/auth')
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const success = await deleteArticle(params.id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Article deleted successfully' })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}