import fs from 'fs/promises'
import path from 'path'
import { Article } from '@/types/article'
import { Bedrijf } from '@/types/bedrijf'

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