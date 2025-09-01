import { Article } from '@/types/article'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const ARTICLES_FILE = path.join(process.cwd(), 'data', 'articles.json')

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Initialize articles file with sample data if it doesn't exist
async function initializeArticlesFile() {
  await ensureDataDirectory()
  
  try {
    await fs.access(ARTICLES_FILE)
  } catch {
    // File doesn't exist, create it with sample data
    const { sampleArticles } = await import('@/data/sampleArticles')
    await fs.writeFile(ARTICLES_FILE, JSON.stringify(sampleArticles, null, 2))
  }
}

// Get all articles
export async function getArticles(): Promise<Article[]> {
  await initializeArticlesFile()
  
  try {
    const data = await fs.readFile(ARTICLES_FILE, 'utf8')
    const articles: Article[] = JSON.parse(data)
    
    // Sort by timestamp descending (newest first)
    return articles.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  } catch (error) {
    console.error('Error reading articles:', error)
    return []
  }
}

// Get article by ID
export async function getArticleById(id: string): Promise<Article | null> {
  const articles = await getArticles()
  return articles.find(article => article.id === id) || null
}

// Add new article
export async function addArticle(articleData: Omit<Article, 'id' | 'timestamp'>): Promise<Article> {
  const articles = await getArticles()
  
  const newArticle: Article = {
    ...articleData,
    id: uuidv4(),
    timestamp: new Date().toISOString(),
  }
  
  articles.unshift(newArticle) // Add to beginning
  
  await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2))
  
  return newArticle
}

// Update existing article
export async function updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
  const articles = await getArticles()
  const index = articles.findIndex(article => article.id === id)
  
  if (index === -1) {
    return null
  }
  
  articles[index] = { ...articles[index], ...updates }
  
  await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2))
  
  return articles[index]
}

// Delete article
export async function deleteArticle(id: string): Promise<boolean> {
  const articles = await getArticles()
  const filteredArticles = articles.filter(article => article.id !== id)
  
  if (filteredArticles.length === articles.length) {
    return false // Article not found
  }
  
  await fs.writeFile(ARTICLES_FILE, JSON.stringify(filteredArticles, null, 2))
  
  return true
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}