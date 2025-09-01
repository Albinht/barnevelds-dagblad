import { NextRequest, NextResponse } from 'next/server'
import { getBedrijven, addBedrijf } from '@/lib/bedrijven'
import { Bedrijf } from '@/types/bedrijf'

// GET - Get all bedrijven
export async function GET() {
  try {
    const bedrijven = await getBedrijven()
    return NextResponse.json(bedrijven)
  } catch (error) {
    console.error('Error fetching bedrijven:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bedrijven' },
      { status: 500 }
    )
  }
}

// POST - Add new bedrijf
export async function POST(request: NextRequest) {
  try {
    // Check authentication for POST requests
    const { getCurrentSession } = await import('@/lib/auth')
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['naam', 'beschrijving', 'categorie', 'adres']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Set defaults
    const bedrijfData: Omit<Bedrijf, 'id' | 'timestamp'> = {
      naam: body.naam,
      beschrijving: body.beschrijving,
      categorie: body.categorie,
      adres: body.adres,
      telefoon: body.telefoon || undefined,
      website: body.website || undefined,
      logo: body.logo || '/barneveldsdagblad.jpeg',
      featured: body.featured || false,
      label: body.label || null,
    }
    
    const newBedrijf = await addBedrijf(bedrijfData)
    
    return NextResponse.json(newBedrijf, { status: 201 })
  } catch (error) {
    console.error('Error creating bedrijf:', error)
    return NextResponse.json(
      { error: 'Failed to create bedrijf' },
      { status: 500 }
    )
  }
}