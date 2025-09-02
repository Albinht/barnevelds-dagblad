import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getBedrijven } from '@/lib/bedrijven'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json([])
  }

  try {
    // Search with case-insensitive matching using Prisma
    const businesses = await prisma.bedrijf.findMany({
      where: {
        AND: [
          { active: true },
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { category: { contains: query, mode: 'insensitive' } },
              { address: { contains: query, mode: 'insensitive' } }
            ]
          }
        ]
      },
      orderBy: [
        { featured: 'desc' },
        { name: 'asc' }
      ],
      take: 20
    })
    
    console.log(`Found ${businesses.length} businesses in database`)

    // Transform to match expected format
    const transformedBusinesses = businesses.map(b => ({
      id: b.id,
      name: b.name,
      description: b.description,
      category: b.category,
      logo_url: b.logo,
      website: b.website,
      phone: b.phone,
      email: b.email,
      address: b.address,
      city: b.city,
      is_spotlight: b.featured
    }))

    return NextResponse.json(transformedBusinesses)
  } catch {
    // Fallback to JSON file when database is unavailable
    console.log('Database unavailable, using JSON fallback for business search')
    const businesses = await getBedrijven()
    const lowerQuery = query.toLowerCase()
    
    const filtered = businesses.filter(business => 
      business.naam.toLowerCase().includes(lowerQuery) ||
      business.beschrijving.toLowerCase().includes(lowerQuery) ||
      business.categorie.toLowerCase().includes(lowerQuery) ||
      business.adres.toLowerCase().includes(lowerQuery)
    ).slice(0, 20)
    
    // Transform to match expected format
    const transformedBusinesses = filtered.map(b => ({
      id: b.id,
      name: b.naam,
      description: b.beschrijving,
      category: b.categorie,
      logo_url: b.logo,
      website: b.website,
      phone: b.telefoon,
      email: '',
      address: b.adres,
      city: 'Barneveld',
      is_spotlight: b.featured
    }))
    
    return NextResponse.json(transformedBusinesses)
  }
}