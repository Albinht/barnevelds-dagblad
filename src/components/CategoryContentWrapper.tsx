'use client'

import { useState } from 'react'
import ArticleCard from './ArticleCard'
import { Article } from '@/types/article'

interface CategoryContentWrapperProps {
  category: string
  initialArticles: Article[]
  allArticles: Article[]
  hasMore: boolean
  showLoadMore: boolean
}

export default function CategoryContentWrapper({
  category,
  initialArticles,
  allArticles,
  hasMore,
  showLoadMore
}: CategoryContentWrapperProps) {
  const [displayedArticles, setDisplayedArticles] = useState(initialArticles)
  const [isLoading, setIsLoading] = useState(false)
  const [currentHasMore, setCurrentHasMore] = useState(hasMore)

  const loadMore = async () => {
    setIsLoading(true)
    
    // Simulate loading delay
    setTimeout(() => {
      const nextBatch = allArticles.slice(displayedArticles.length, displayedArticles.length + 12)
      setDisplayedArticles(prev => [...prev, ...nextBatch])
      setCurrentHasMore(displayedArticles.length + nextBatch.length < allArticles.length)
      setIsLoading(false)
    }, 500)
  }

  return (
    <>
      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Load More Button */}
      {showLoadMore && currentHasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="bg-[#0F47AF] text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? 'Bezig met laden...' : 'Meer artikelen laden'}
          </button>
        </div>
      )}

      {/* No More Articles Message */}
      {showLoadMore && !currentHasMore && displayedArticles.length > initialArticles.length && (
        <div className="mt-12 text-center text-gray-600">
          <p>Je hebt alle artikelen in de categorie &quot;{category}&quot; bekeken.</p>
        </div>
      )}
    </>
  )
}