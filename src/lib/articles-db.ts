import { prisma } from '@/lib/prisma'

export interface DatabaseArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  summary: string
  content: string
  image: string
  category: string
  tags: string[]
  premium: boolean
  featured: boolean
  published: boolean
  views: number
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  authorId: string
  author: {
    id: string
    username: string
    email: string
  }
}

export async function getArticleBySlug(slug: string): Promise<DatabaseArticle | null> {
  try {
    const article = await prisma.article.findUnique({
      where: { 
        slug: slug,
        published: true 
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    })
    
    return article as DatabaseArticle | null
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

export async function getAllArticles(): Promise<DatabaseArticle[]> {
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' }
    })
    
    return articles as DatabaseArticle[]
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

export async function getFeaturedArticles(limit: number = 3): Promise<DatabaseArticle[]> {
  try {
    const articles = await prisma.article.findMany({
      where: { 
        published: true,
        featured: true 
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: limit
    })
    
    return articles as DatabaseArticle[]
  } catch (error) {
    console.error('Error fetching featured articles:', error)
    return []
  }
}

export async function getRelatedArticles(currentSlug: string, category: string, limit: number = 3): Promise<DatabaseArticle[]> {
  try {
    const articles = await prisma.article.findMany({
      where: { 
        published: true,
        category: category,
        slug: { not: currentSlug }
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: limit
    })
    
    return articles as DatabaseArticle[]
  } catch (error) {
    console.error('Error fetching related articles:', error)
    return []
  }
}

export async function createArticle(data: {
  slug: string
  title: string
  excerpt: string
  summary: string
  content: string
  image: string
  category: string
  tags: string[]
  premium: boolean
  featured: boolean
  published: boolean
  authorId: string
  publishedAt?: Date
}): Promise<DatabaseArticle | null> {
  try {
    const article = await prisma.article.create({
      data: {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        summary: data.summary,
        content: data.content || '',
        image: data.image,
        category: data.category,
        tags: data.tags,
        premium: data.premium,
        featured: data.featured,
        published: data.published,
        publishedAt: data.publishedAt || (data.published ? new Date() : null),
        authorId: data.authorId
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    })
    
    return article as DatabaseArticle
  } catch (error) {
    console.error('Error creating article:', error)
    return null
  }
}

export async function updateArticle(id: string, data: Partial<{
  slug: string
  title: string
  excerpt: string
  summary: string
  content: string
  image: string
  category: string
  tags: string[]
  premium: boolean
  featured: boolean
  published: boolean
  publishedAt: Date | null
}>): Promise<DatabaseArticle | null> {
  try {
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.published && !data.publishedAt ? new Date() : data.publishedAt
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    })
    
    return article as DatabaseArticle
  } catch (error) {
    console.error('Error updating article:', error)
    return null
  }
}

export async function deleteArticle(id: string): Promise<boolean> {
  try {
    await prisma.article.delete({
      where: { id }
    })
    return true
  } catch (error) {
    console.error('Error deleting article:', error)
    return false
  }
}

export async function getOrCreateUser(email: string, name?: string): Promise<string | null> {
  try {
    // First try to find existing user
    let user = await prisma.user.findUnique({
      where: { email }
    })
    
    // If not found, create new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          username: email.split('@')[0],
          role: 'EDITOR'
        }
      })
    }
    
    return user.id
  } catch (error) {
    console.error('Error getting/creating user:', error)
    return null
  }
}