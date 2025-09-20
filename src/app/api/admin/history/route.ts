import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all historical stories
    const stories = await prisma.historicalStory.findMany({
      orderBy: [
        { published: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      stories
    })
  } catch (error) {
    console.error('Error fetching historical stories:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch historical stories'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.excerpt || !body.content || !body.period || !body.year) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new historical story
    const story = await prisma.historicalStory.create({
      data: {
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        period: body.period,
        year: body.year,
        image: body.image || null,
        tags: body.tags || [],
        published: body.published !== false
      }
    })

    return NextResponse.json({
      success: true,
      story
    })
  } catch (error) {
    console.error('Error creating historical story:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create historical story'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}