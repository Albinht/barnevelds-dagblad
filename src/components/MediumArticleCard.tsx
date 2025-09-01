import Link from 'next/link'
import Image from 'next/image'
import PremiumBadge from './PremiumBadge'
import { Article } from '@/types/article'
import { formatDateShort } from '@/lib/dateUtils'

interface MediumArticleCardProps {
  article: Article
}

export default function MediumArticleCard({ article }: MediumArticleCardProps) {
  return (
    <Link href={`/artikel/${article.slug}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-[4/3]">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {article.premium && <PremiumBadge />}
        </div>
        
        <div className="p-4">
          <div className="text-xs text-brand-blue font-semibold uppercase mb-2">
            {article.category}
          </div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-brand-blue transition-colors line-clamp-3">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {article.summary}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{article.author}</span>
            <span>{formatDateShort(article.timestamp)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}