import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(_request: NextRequest) {
  try {
    // Get active traffic info from database
    const trafficInfo = await prisma.trafficInfo.findMany({
      where: {
        active: true,
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } }
        ]
      },
      orderBy: [
        { severity: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // Get active weather alerts
    const weatherAlerts = await prisma.weatherAlert.findMany({
      where: {
        active: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() }
      },
      orderBy: {
        severity: 'desc'
      }
    })

    // Map severity for sorting
    const severityOrder = { high: 3, medium: 2, low: 1 }

    // Format the response
    const formattedTraffic = trafficInfo.map(info => ({
      id: info.id,
      type: info.type,
      location: info.location,
      description: info.description,
      severity: info.severity,
      startDate: info.startDate?.toISOString(),
      endDate: info.endDate?.toISOString()
    }))

    const formattedAlerts = weatherAlerts.map(alert => ({
      id: alert.id,
      type: 'weather',
      location: 'Barneveld',
      description: alert.message,
      severity: alert.severity,
      startDate: alert.startDate.toISOString(),
      endDate: alert.endDate.toISOString()
    }))

    // Combine traffic and weather alerts
    const allAlerts = [...formattedTraffic, ...formattedAlerts].sort((a, b) => {
      const severityDiff = (severityOrder[b.severity as keyof typeof severityOrder] || 0) -
                           (severityOrder[a.severity as keyof typeof severityOrder] || 0)
      if (severityDiff !== 0) return severityDiff

      // If same severity, sort by date
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0
      return dateB - dateA
    })

    return NextResponse.json({
      success: true,
      data: allAlerts,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Traffic API error:', error)

    // Return empty array on error
    return NextResponse.json({
      success: false,
      data: [],
      error: 'Failed to fetch traffic information'
    })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.type || !body.location || !body.description || !body.severity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new traffic info
    const trafficInfo = await prisma.trafficInfo.create({
      data: {
        type: body.type,
        location: body.location,
        description: body.description,
        severity: body.severity,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        active: body.active !== false
      }
    })

    return NextResponse.json({
      success: true,
      data: trafficInfo
    })
  } catch (error) {
    console.error('Traffic POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create traffic info' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    // Update traffic info
    const trafficInfo = await prisma.trafficInfo.update({
      where: { id: body.id },
      data: {
        type: body.type,
        location: body.location,
        description: body.description,
        severity: body.severity,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        active: body.active
      }
    })

    return NextResponse.json({
      success: true,
      data: trafficInfo
    })
  } catch (error) {
    console.error('Traffic PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update traffic info' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    // Delete traffic info
    await prisma.trafficInfo.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Traffic info deleted successfully'
    })
  } catch (error) {
    console.error('Traffic DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete traffic info' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}