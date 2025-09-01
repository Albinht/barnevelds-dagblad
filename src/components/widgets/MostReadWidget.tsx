import Link from 'next/link'
import { getArticlesData } from '@/lib/serverData'

export default async function MostReadWidget() {
  const articles = await getArticlesData()
  // Sort by comments (proxy for "most read") and take top 5
  const mostReadArticles = articles
    .sort((a: any, b: any) => (b.comments || 0) - (a.comments || 0))
    .slice(0, 5)

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
        Meest Gelezen
      </h3>
      <div className="space-y-4">
        {mostReadArticles.map((article, index) => (
          <article key={article.id} className="group">
            <Link 
              href={`/artikel/${article.slug}`}
              className="block hover:bg-gray-50 -mx-2 px-2 py-2 rounded transition-colors"
            >
              <div className="flex items-start space-x-3">
                {/* Ranking Number */}
                <span className="flex-shrink-0 text-2xl font-bold text-gray-300 leading-none">
                  {index + 1}
                </span>
                
                {/* Article Info */}
                <div className="flex-1 min-w-0 pt-1">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#0F47AF] line-clamp-2 mb-1 transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{article.category}</span>
                    <span className="mx-1">•</span>
                    <span>{article.comments} reacties</span>
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
      
      {/* View All Link */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link 
          href="/populair"
          className="block text-center text-sm text-[#0F47AF] hover:text-blue-700 font-medium transition-colors"
        >
          Alle populaire artikelen →
        </Link>
      </div>
    </div>
  )
}