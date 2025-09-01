import Link from 'next/link'
import { Article } from '@/types/article'
import { formatTime } from '@/lib/dateUtils'

interface NewsTickerProps {
  articles: Article[]
}

export default function NewsTicker({ articles }: NewsTickerProps) {
  const latestArticles = articles
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-brand-darkred text-brand-blue px-4 py-3">
        <h3 className="font-bold text-sm uppercase">NET BINNEN</h3>
      </div>
      
      {/* News items */}
      <div className="divide-y divide-gray-200">
        {latestArticles.map((article) => (
          <Link 
            key={article.id}
            href={`/artikel/${article.slug}`}
            className="block p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start space-x-2">
              <span className="text-brand-darkred text-xs font-bold mt-0.5 flex-shrink-0">
                {formatTime(article.timestamp)}
              </span>
              {article.premium && (
                <span className="bg-brand-yellow text-black text-xs font-bold px-1 rounded uppercase flex-shrink-0">
                  PREMIUM
                </span>
              )}
              <p className="text-gray-900 text-sm leading-tight line-clamp-2">
                {article.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
      
      {/* More button */}
      <div className="p-3 border-t border-gray-200">
        <Link 
          href="/nieuws"
          className="block text-center text-brand-blue font-bold text-sm hover:text-blue-700 transition-colors uppercase"
        >
          BEKIJK MEER ARTIKELEN
        </Link>
      </div>
    </div>
  )
}