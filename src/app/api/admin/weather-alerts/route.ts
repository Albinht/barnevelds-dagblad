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

    const alerts = await prisma.weatherAlert.findMany({
      orderBy: { startDate: 'desc' }
    })

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error('Error fetching weather alerts:', error)
    return NextResponse.json({ error: 'Failed to fetch weather alerts' }, { status: 500 })
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

    const alert = await prisma.weatherAlert.create({
      data: {
        type: body.type,
        message: body.message,
        severity: body.severity,
        active: body.active,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate)
      }
    })

    return NextResponse.json({ alert })
  } catch (error) {
    console.error('Error creating weather alert:', error)
    return NextResponse.json({ error: 'Failed to create weather alert' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}