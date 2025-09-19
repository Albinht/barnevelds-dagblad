import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const events = await prisma.event.findMany({
      orderBy: { date: 'desc' }
    })

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        date: new Date(body.date),
        time: body.time,
        location: body.location,
        category: body.category,
        organizer: body.organizer,
        price: body.price || null,
        website: body.website || null,
        image: body.image || null,
        published: body.published
      }
    })

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}