import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const trafficInfos = await prisma.trafficInfo.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ trafficInfos })
  } catch (error) {
    console.error('Error fetching traffic info:', error)
    return NextResponse.json({ error: 'Failed to fetch traffic info' }, { status: 500 })
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

    const trafficInfo = await prisma.trafficInfo.create({
      data: {
        type: body.type,
        location: body.location,
        description: body.description,
        severity: body.severity,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        active: body.active
      }
    })

    return NextResponse.json({ trafficInfo })
  } catch (error) {
    console.error('Error creating traffic info:', error)
    return NextResponse.json({ error: 'Failed to create traffic info' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}