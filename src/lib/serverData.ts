import fs from 'fs/promises'
import path from 'path'
import { Article } from '@/types/article'
import { Bedrijf } from '@/types/bedrijf'
import { getAllArticles } from './articles-db'

// Server-side data loading functions
export async function getBedrijvenData(): Promise<Bedrijf[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'bedrijven.json')
    const data = await fs.readFile(filePath, 'utf8')
    const bedrijven = JSON.parse(data)
    
    // Filter for featured companies
    return bedrijven.filter((bedrijf: Bedrijf) => bedrijf.featured)
  } catch (error) {
    console.error('Error loading bedrijven:', error)
    return []
  }
}

export async function getArticlesData(): Promise<Article[]> {
  try {
    // First try to get from database
    const dbArticles = await getAllArticles()
    if (dbArticles && dbArticles.length > 0) {
      // Transform database articles to match Article type
      return dbArticles.map(article => ({
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        summary: article.summary,
        content: article.content,
        image: article.image,
        category: article.category,
        tags: article.tags,
        premium: article.premium,
        author: article.author.username || article.author.email,
        publishedAt: article.publishedAt?.toISOString().split('T')[0] || '',
        comments: 0,
        timestamp: article.createdAt.toISOString()
      }))
    }
  } catch (dbError) {
    console.error('Database error, falling back to JSON:', dbError)
  }
  
  // Fallback to JSON if database fails or is empty
  try {
    const filePath = path.join(process.cwd(), 'data', 'articles.json')
    const data = await fs.readFile(filePath, 'utf8')
    const articles = JSON.parse(data)
    
    // Sort by timestamp/publishedAt descending (newest first)
    return articles.sort((a: Article, b: Article) => {
      const dateA = new Date(a.publishedAt || a.timestamp || 0)
      const dateB = new Date(b.publishedAt || b.timestamp || 0)
      return dateB.getTime() - dateA.getTime()
    })
  } catch (error) {
    console.error('Error loading articles:', error)
    return []
  }
}