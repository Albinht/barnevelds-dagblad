export interface Article {
  id: string
  title: string
  summary: string
  excerpt: string
  content?: string  // Full article content (HTML or Markdown)
  image: string
  category: string
  premium: boolean
  author: string
  timestamp: string
  publishedAt: string
  updatedAt?: string  // Last update timestamp
  comments: number
  tags: string[]
  slug: string
  readTime?: number  // Estimated reading time in minutes
}