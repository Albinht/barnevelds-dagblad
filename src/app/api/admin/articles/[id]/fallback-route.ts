import { NextResponse } from 'next/server'
import { getArticles, updateArticle, deleteArticle } from '@/lib/articles'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'

interface Params {
  params: Promise<{ id: string }>
}

// Fallback handlers for when database is not available
export async function handlePutFallback(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { id } = await params
    const body = await request.json()
    
    console.log('Using JSON fallback for article update')
    
    const updatedArticle = await updateArticle(id, body)
    
    if (!updatedArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(updatedArticle)
  } catch (error) {
    console.error('Fallback update error:', error)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

export async function handleDeleteFallback(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { id } = await params
    
    console.log('Using JSON fallback for article deletion')
    
    const success = await deleteArticle(id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Fallback delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}