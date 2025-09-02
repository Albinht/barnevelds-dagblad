import NewsHomepage from '@/components/NewsHomepage'
import { getAllArticles } from '@/lib/articles-db'
import { getFeaturedBedrijven } from '@/lib/bedrijven'
import { getArticles } from '@/lib/articles'

export default async function Home() {
  try {
    // Try to get articles from database first
    let articleData = []
    try {
      const dbArticles = await getAllArticles()
      articleData = dbArticles.map(article => ({
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
    } catch (dbError) {
      console.error('Database error, falling back to JSON:', dbError)
      // Fall back to JSON if database fails
      articleData = await getArticles()
    }
    
    const bedrijvenData = await getFeaturedBedrijven().catch(() => [])
    
    return <NewsHomepage articles={articleData} bedrijven={bedrijvenData} />
  } catch (error) {
    console.error('Error loading homepage data:', error)
    return <NewsHomepage articles={[]} bedrijven={[]} />
  }
}
