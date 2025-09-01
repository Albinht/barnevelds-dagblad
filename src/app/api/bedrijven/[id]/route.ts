import { NextRequest, NextResponse } from 'next/server'
import { getBedrijfById, updateBedrijf, deleteBedrijf } from '@/lib/bedrijven'

interface Params {
  params: {
    id: string
  }
}

// GET - Get bedrijf by ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const bedrijf = await getBedrijfById(params.id)
    
    if (!bedrijf) {
      return NextResponse.json(
        { error: 'Bedrijf not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(bedrijf)
  } catch (error) {
    console.error('Error fetching bedrijf:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bedrijf' },
      { status: 500 }
    )
  }
}

// PUT - Update bedrijf
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Check authentication for PUT requests
    const { getCurrentSession } = await import('@/lib/auth')
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const updatedBedrijf = await updateBedrijf(params.id, body)
    
    if (!updatedBedrijf) {
      return NextResponse.json(
        { error: 'Bedrijf not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(updatedBedrijf)
  } catch (error) {
    console.error('Error updating bedrijf:', error)
    return NextResponse.json(
      { error: 'Failed to update bedrijf' },
      { status: 500 }
    )
  }
}

// DELETE - Delete bedrijf
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Check authentication for DELETE requests
    const { getCurrentSession } = await import('@/lib/auth')
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const success = await deleteBedrijf(params.id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Bedrijf not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Bedrijf deleted successfully' })
  } catch (error) {
    console.error('Error deleting bedrijf:', error)
    return NextResponse.json(
      { error: 'Failed to delete bedrijf' },
      { status: 500 }
    )
  }
}