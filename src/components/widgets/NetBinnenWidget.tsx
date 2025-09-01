import Link from 'next/link'
import { getArticlesData } from '@/lib/serverData'
import { formatTime } from '@/lib/dateUtils'

export default async function NetBinnenWidget() {
  const articles = await getArticlesData()
  const latestArticles = articles.slice(0, 5) // Get 5 most recent articles

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
      {/* Blue Header */}
      <div className="bg-[#0F47AF] px-4 py-3">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">
          NET BINNEN
        </h3>
      </div>
      
      {/* Articles List */}
      <div className="divide-y divide-gray-100">
        {latestArticles.map((article, index) => (
          <div key={article.id} className="relative">
            <Link 
              href={`/artikel/${article.slug}`}
              className="block p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-start pr-12">
                {/* Article Info */}
                <div className="flex-1 min-w-0">
                  {/* Category Badge */}
                  {article.premium && (
                    <div className="mb-2">
                      <span className="inline-block bg-[#FCDD0C] text-black px-2 py-1 text-xs font-bold rounded uppercase">
                        PREMIUM
                      </span>
                    </div>
                  )}
                  
                  {/* Article Title */}
                  <h4 className="font-bold text-black text-base mb-1 line-clamp-2 leading-tight hover:text-[#0F47AF] transition-colors">
                    {article.title}
                  </h4>
                  
                  {/* Meta Info */}
                  <div className="flex items-center text-xs text-gray-600">
                    <span>{article.category}</span>
                    <span className="mx-1">•</span>
                    <span>{formatTime(article.timestamp)}</span>
                  </div>
                </div>
                
                {/* Ranking Number */}
                <div className="absolute top-4 right-4">
                  <span className="text-4xl font-bold text-gray-300">
                    {index + 1}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {/* Action Button */}
      <div className="p-4 bg-gray-50">
        <Link 
          href="/"
          className="block bg-[#0F47AF] text-white font-bold text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm"
        >
          BEKIJK ALLE NIEUWS →
        </Link>
      </div>
    </div>
  )
}