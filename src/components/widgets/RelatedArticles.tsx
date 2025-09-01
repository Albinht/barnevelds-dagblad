import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types/article'
import { getArticles } from '@/lib/articles'
import { formatDateShort } from '@/lib/dateUtils'

interface RelatedArticlesProps {
  currentArticle: Article
  limit?: number
}

export default async function RelatedArticles({ 
  currentArticle, 
  limit = 3 
}: RelatedArticlesProps) {
  const articles = await getArticles()
  
  // Find related articles based on:
  // 1. Same category
  // 2. Shared tags
  // 3. Exclude current article
  const relatedArticles = articles
    .filter(article => article.id !== currentArticle.id)
    .map(article => {
      let relevanceScore = 0
      
      // Same category = +3 points
      if (article.category === currentArticle.category) {
        relevanceScore += 3
      }
      
      // Shared tags = +1 point per shared tag
      const sharedTags = article.tags?.filter(tag => 
        currentArticle.tags?.includes(tag)
      ) || []
      relevanceScore += sharedTags.length
      
      return { ...article, relevanceScore }
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit)

  if (relatedArticles.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
        Gerelateerde Artikelen
      </h3>
      <div className="space-y-4">
        {relatedArticles.map((article) => (
          <article key={article.id} className="group">
            <Link 
              href={`/artikel/${article.slug}`}
              className="block hover:bg-gray-50 -mx-2 px-2 py-3 rounded transition-colors"
            >
              <div className="flex space-x-3">
                {/* Article Image */}
                {article.image && (
                  <div className="flex-shrink-0 w-16 h-16 relative overflow-hidden rounded">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                
                {/* Article Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#0F47AF] line-clamp-2 mb-1 transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{article.category}</span>
                    <span className="mx-1">•</span>
                    <span>
                      {formatDateShort(article.timestamp)}
                    </span>
                    {article.premium && (
                      <>
                        <span className="mx-1">•</span>
                        <span className="text-[#FCDD0C] font-medium">PREMIUM</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
      
      {/* View More Link */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link 
          href={`/categorie/${currentArticle.category.toLowerCase()}`}
          className="block text-center text-sm text-[#0F47AF] hover:text-blue-700 font-medium transition-colors"
        >
          Meer {currentArticle.category} →
        </Link>
      </div>
    </div>
  )
}