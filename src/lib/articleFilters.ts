export interface Article {
  id: string
  title: string
  summary: string
  excerpt: string
  content?: string
  image: string
  category: string
  tags?: string[]
  premium: boolean
  featured?: boolean
  author: string
  publishedAt: string
  updatedAt?: string
  comments?: number
  slug: string
  timestamp?: string
}

export interface FilterOptions {
  limit?: number
  featured?: boolean
  premium?: boolean
  excludeIds?: string[]
}

/**
 * Filter articles by category
 */
export function getArticlesByCategory(
  articles: Article[], 
  category: string,
  options: FilterOptions = {}
): Article[] {
  const { limit, featured, premium, excludeIds = [] } = options
  
  let filtered = articles
    .filter(article => 
      article.category.toLowerCase() === category.toLowerCase() &&
      !excludeIds.includes(article.id)
    )
    
  // Apply additional filters
  if (featured !== undefined) {
    filtered = filtered.filter(article => !!article.featured === featured)
  }
  
  if (premium !== undefined) {
    filtered = filtered.filter(article => article.premium === premium)
  }
  
  // Sort by publish date (newest first)
  filtered.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.timestamp || 0)
    const dateB = new Date(b.publishedAt || b.timestamp || 0)
    return dateB.getTime() - dateA.getTime()
  })
  
  // Apply limit
  if (limit) {
    filtered = filtered.slice(0, limit)
  }
  
  return filtered
}

/**
 * Filter articles by tag
 */
export function getArticlesByTag(
  articles: Article[],
  tag: string,
  options: FilterOptions = {}
): Article[] {
  const { limit, featured, premium, excludeIds = [] } = options
  
  let filtered = articles
    .filter(article => 
      (article.tags?.includes(tag.toLowerCase()) ||
       article.category.toLowerCase() === tag.toLowerCase()) &&
      !excludeIds.includes(article.id)
    )
    
  // Apply additional filters
  if (featured !== undefined) {
    filtered = filtered.filter(article => !!article.featured === featured)
  }
  
  if (premium !== undefined) {
    filtered = filtered.filter(article => article.premium === premium)
  }
  
  // Sort by publish date (newest first)
  filtered.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.timestamp || 0)
    const dateB = new Date(b.publishedAt || b.timestamp || 0)
    return dateB.getTime() - dateA.getTime()
  })
  
  // Apply limit
  if (limit) {
    filtered = filtered.slice(0, limit)
  }
  
  return filtered
}

/**
 * Get featured articles
 */
export function getFeaturedArticles(
  articles: Article[],
  options: FilterOptions = {}
): Article[] {
  const { limit = 5, excludeIds = [] } = options
  
  return articles
    .filter(article => 
      (article.featured || article.premium) &&
      !excludeIds.includes(article.id)
    )
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.timestamp || 0)
      const dateB = new Date(b.publishedAt || b.timestamp || 0)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, limit)
}

/**
 * Get latest articles across all categories
 */
export function getLatestArticles(
  articles: Article[],
  options: FilterOptions = {}
): Article[] {
  const { limit = 10, excludeIds = [] } = options
  
  return articles
    .filter(article => !excludeIds.includes(article.id))
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.timestamp || 0)
      const dateB = new Date(b.publishedAt || b.timestamp || 0)  
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, limit)
}

/**
 * Get most read articles (based on comment count as proxy)
 */
export function getMostReadArticles(
  articles: Article[],
  options: FilterOptions = {}
): Article[] {
  const { limit = 5, excludeIds = [] } = options
  
  return articles
    .filter(article => !excludeIds.includes(article.id))
    .sort((a, b) => {
      // Sort by comments count, then by publish date
      const commentsA = a.comments || 0
      const commentsB = b.comments || 0
      
      if (commentsA !== commentsB) {
        return commentsB - commentsA
      }
      
      // If same comment count, sort by date
      const dateA = new Date(a.publishedAt || a.timestamp || 0)
      const dateB = new Date(b.publishedAt || b.timestamp || 0)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, limit)
}

/**
 * Search articles by title or content
 */
export function searchArticles(
  articles: Article[],
  query: string,
  options: FilterOptions = {}
): Article[] {
  const { limit = 20, excludeIds = [] } = options
  
  if (!query.trim()) {
    return []
  }
  
  const searchTerm = query.toLowerCase().trim()
  
  return articles
    .filter(article => 
      !excludeIds.includes(article.id) &&
      (article.title.toLowerCase().includes(searchTerm) ||
       article.summary.toLowerCase().includes(searchTerm) ||
       article.excerpt.toLowerCase().includes(searchTerm) ||
       article.content?.toLowerCase().includes(searchTerm))
    )
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.timestamp || 0)
      const dateB = new Date(b.publishedAt || b.timestamp || 0)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, limit)
}

/**
 * Get related articles based on category and tags
 */
export function getRelatedArticles(
  articles: Article[],
  currentArticle: Article,
  options: FilterOptions = {}
): Article[] {
  const { limit = 4 } = options
  
  // Exclude current article
  const excludeIds = [currentArticle.id, ...(options.excludeIds || [])]
  
  // First try to get articles from same category
  let related = getArticlesByCategory(articles, currentArticle.category, {
    limit: limit * 2,
    excludeIds
  })
  
  // If not enough, get articles with matching tags
  if (related.length < limit && currentArticle.tags?.length) {
    for (const tag of currentArticle.tags) {
      const tagArticles = getArticlesByTag(articles, tag, {
        limit: limit * 2,
        excludeIds: [...excludeIds, ...related.map(a => a.id)]
      })
      related = [...related, ...tagArticles]
      
      if (related.length >= limit) break
    }
  }
  
  // Remove duplicates and limit
  const uniqueRelated = related.filter((article, index, self) => 
    self.findIndex(a => a.id === article.id) === index
  )
  
  return uniqueRelated.slice(0, limit)
}

/**
 * Get articles for category page (hero + grid articles)
 */
export function getCategoryPageArticles(
  articles: Article[],
  categoryOrTag: string
) {
  // Try to get articles by category first, then by tag
  let categoryArticles = getArticlesByCategory(articles, categoryOrTag, { limit: 50 })
  
  if (categoryArticles.length === 0) {
    categoryArticles = getArticlesByTag(articles, categoryOrTag, { limit: 50 })
  }
  
  // Get hero article (first featured or first article)
  const heroArticle = categoryArticles.find(article => article.featured) || categoryArticles[0]
  
  // Get grid articles (excluding hero)
  const gridArticles = categoryArticles
    .filter(article => article.id !== heroArticle?.id)
    .slice(0, 12) // Show 12 articles in grid
  
  return {
    heroArticle,
    gridArticles,
    totalArticles: categoryArticles.length
  }
}