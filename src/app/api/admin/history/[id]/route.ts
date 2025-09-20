import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Update historical story
    const story = await prisma.historicalStory.update({
      where: { id },
      data: {
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        period: body.period,
        year: body.year,
        image: body.image,
        tags: body.tags || [],
        published: body.published
      }
    })

    return NextResponse.json({
      success: true,
      story
    })
  } catch (error) {
    console.error('Error updating historical story:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update historical story'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete historical story
    await prisma.historicalStory.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Historical story deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting historical story:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete historical story'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}