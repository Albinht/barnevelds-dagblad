import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getArticles } from '@/lib/articles'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json([])
  }

  try {
    const articles = await prisma.article.findMany({
      where: {
        AND: [
          { published: true },
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { excerpt: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
              { summary: { contains: query, mode: 'insensitive' } }
            ]
          }
        ]
      },
      include: {
        author: {
          select: { username: true }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: 20
    })

    // Transform to match expected format
    const transformedArticles = articles.map(a => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      image_url: a.image,
      category: a.category,
      tags: a.tags,
      premium: a.premium,
      published_at: a.publishedAt?.toISOString(),
      author: a.author.username,
      views: a.views
    }))

    return NextResponse.json(transformedArticles)
  } catch (error) {
    // Fallback to JSON file when database is unavailable
    console.log('Database unavailable, using JSON fallback for search')
    const articles = await getArticles()
    const lowerQuery = query.toLowerCase()
    
    const filtered = articles.filter(article => 
      article.publishedAt && // Check if article is published
      (article.title.toLowerCase().includes(lowerQuery) ||
       article.excerpt.toLowerCase().includes(lowerQuery) ||
       (article.content && article.content.toLowerCase().includes(lowerQuery)) ||
       article.summary.toLowerCase().includes(lowerQuery))
    ).slice(0, 20)
    
    return NextResponse.json(filtered)
  }
}