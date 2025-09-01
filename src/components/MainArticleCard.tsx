import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types/article'
import { formatDateShort } from '@/lib/dateUtils'

interface MainArticleCardProps {
  article: Article
}

export default function MainArticleCard({ article }: MainArticleCardProps) {
  return (
    <Link href={`/artikel/${article.slug}`} className="block relative group">
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h2 className="text-white text-2xl font-bold leading-tight mb-2 group-hover:text-brand-yellow transition-colors">
            {article.title}
          </h2>
          <p className="text-white/90 text-sm line-clamp-2 mb-2">
            {article.summary}
          </p>
          <div className="flex items-center text-white/80 text-xs">
            <span>{article.author}</span>
            <span className="mx-2">•</span>
            <span>{formatDateShort(article.timestamp)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}