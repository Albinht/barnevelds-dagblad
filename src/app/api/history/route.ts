import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Public API route - no authentication required for GET
export async function GET(_request: NextRequest) {
  try {
    // Get all published historical stories
    const stories = await prisma.historicalStory.findMany({
      where: {
        published: true
      },
      orderBy: [
        { period: 'asc' },
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        period: true,
        year: true,
        image: true,
        tags: true,
        published: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Group stories by period for easier frontend use
    const storiesByPeriod = stories.reduce((acc, story) => {
      if (!acc[story.period]) {
        acc[story.period] = []
      }
      acc[story.period].push(story)
      return acc
    }, {} as Record<string, typeof stories>)

    return NextResponse.json({
      success: true,
      stories,
      storiesByPeriod
    })
  } catch (error) {
    console.error('Error fetching historical stories:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch historical stories',
      stories: []
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}