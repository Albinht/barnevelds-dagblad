import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

// GET all bedrijven with pagination and filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const active = searchParams.get('active')
    const search = searchParams.get('search')
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: any = {}
    if (category) where.category = category
    if (featured !== null) where.featured = featured === 'true'
    if (active !== null) where.active = active === 'true'
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    const [bedrijven, total] = await Promise.all([
      prisma.bedrijf.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { featured: 'desc' },
          { name: 'asc' }
        ]
      }),
      prisma.bedrijf.count({ where })
    ])
    
    return NextResponse.json({
      bedrijven,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching bedrijven:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bedrijven' },
      { status: 500 }
    )
  }
}

// POST create new bedrijf
export async function POST(request: Request) {
  const isAuth = await isAuthenticated()
  if (!isAuth) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  try {
    const body = await request.json()
    const {
      name,
      slug,
      description,
      category,
      logo,
      website,
      phone,
      email,
      address,
      city,
      featured,
      active
    } = body
    
    // Check if slug already exists
    const existingBedrijf = await prisma.bedrijf.findUnique({
      where: { slug }
    })
    
    if (existingBedrijf) {
      return NextResponse.json(
        { error: 'Bedrijf with this slug already exists' },
        { status: 400 }
      )
    }
    
    const bedrijf = await prisma.bedrijf.create({
      data: {
        name,
        slug,
        description,
        category,
        logo: logo || null,
        website: website || null,
        phone: phone || null,
        email: email || null,
        address: address || null,
        city: city || 'Barneveld',
        featured: featured || false,
        active: active !== false
      }
    })
    
    return NextResponse.json(bedrijf, { status: 201 })
  } catch (error) {
    console.error('Error creating bedrijf:', error)
    return NextResponse.json(
      { error: 'Failed to create bedrijf' },
      { status: 500 }
    )
  }
}