import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const alert = await prisma.weatherAlert.update({
      where: { id: params.id },
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
    console.error('Error updating weather alert:', error)
    return NextResponse.json({ error: 'Failed to update weather alert' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.weatherAlert.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting weather alert:', error)
    return NextResponse.json({ error: 'Failed to delete weather alert' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}