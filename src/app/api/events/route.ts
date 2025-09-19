import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Public API route - no authentication required for GET
export async function GET(_request: NextRequest) {
  try {
    // Get all published events
    const events = await prisma.event.findMany({
      where: {
        published: true,
        // Optionally filter for future events only
        // date: { gte: new Date() }
      },
      orderBy: { date: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        time: true,
        location: true,
        category: true,
        organizer: true,
        price: true,
        website: true,
        image: true,
        published: true
      }
    })

    // Format dates to ISO strings for consistency
    const formattedEvents = events.map(event => ({
      ...event,
      date: event.date.toISOString()
    }))

    return NextResponse.json({
      success: true,
      events: formattedEvents
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch events',
      events: []
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}