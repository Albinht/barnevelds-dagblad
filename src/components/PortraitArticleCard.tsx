import Link from 'next/link'
import Image from 'next/image'
import PremiumBadge from './PremiumBadge'
import { Article } from '@/types/article'
import { formatDateShort } from '@/lib/dateUtils'

interface PortraitArticleCardProps {
  article: Article
}

export default function PortraitArticleCard({ article }: PortraitArticleCardProps) {
  return (
    <Link href={`/artikel/${article.slug}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-[3/4]">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {article.premium && <PremiumBadge />}
          
          {/* Author label overlay */}
          <div className="absolute bottom-2 left-2 flex items-center">
            <span className="bg-brand-darkred text-white text-xs font-bold px-2 py-1 rounded uppercase">
              {article.author}
            </span>
            {article.comments > 0 && (
              <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded ml-1">
                {article.comments}
              </span>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-brand-blue transition-colors line-clamp-3">
            {article.title}
          </h3>
          <div className="text-xs text-gray-500 mt-2">
            {formatDateShort(article.timestamp)}
          </div>
        </div>
      </div>
    </Link>
  )
}