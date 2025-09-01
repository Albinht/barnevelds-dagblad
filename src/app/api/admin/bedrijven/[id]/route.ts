import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

interface Params {
  params: Promise<{ id: string }>
}

// GET single bedrijf by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params
    
    const bedrijf = await prisma.bedrijf.findUnique({
      where: { id }
    })
    
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

// PUT update bedrijf
export async function PUT(request: Request, { params }: Params) {
  const isAuth = await isAuthenticated()
  if (!isAuth) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  try {
    const { id } = await params
    const body = await request.json()
    
    const bedrijf = await prisma.bedrijf.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date()
      }
    })
    
    return NextResponse.json(bedrijf)
  } catch (error) {
    console.error('Error updating bedrijf:', error)
    return NextResponse.json(
      { error: 'Failed to update bedrijf' },
      { status: 500 }
    )
  }
}

// DELETE bedrijf
export async function DELETE(request: Request, { params }: Params) {
  const isAuth = await isAuthenticated()
  if (!isAuth) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  try {
    const { id } = await params
    
    await prisma.bedrijf.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting bedrijf:', error)
    return NextResponse.json(
      { error: 'Failed to delete bedrijf' },
      { status: 500 }
    )
  }
}