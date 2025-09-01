import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types/article'
import { formatTime } from '@/lib/dateUtils'

interface SmallArticleCardProps {
  article: Article
}

export default function SmallArticleCard({ article }: SmallArticleCardProps) {
  return (
    <Link href={`/artikel/${article.slug}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-[16/9]">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="p-3">
          <div className="text-xs text-brand-blue font-semibold uppercase mb-1">
            {article.category}
          </div>
          <h3 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-brand-blue transition-colors line-clamp-2">
            {article.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            <span>{article.author}</span>
            <span>{formatTime(article.timestamp)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}