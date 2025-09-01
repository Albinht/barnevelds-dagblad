import Image from 'next/image'
import Link from 'next/link'
import { Article } from '@/types/article'
import { formatDateShort } from '@/lib/dateUtils'

interface NewsGridProps {
  articles: Article[]
}

export default function NewsGrid({ articles }: NewsGridProps) {
  // Ensure we have at least 4 articles for the grid
  if (!articles || articles.length < 4) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <h3 className="text-xl font-bold text-gray-700 mb-2">Nieuws wordt geladen...</h3>
        <p className="text-gray-600">Er zijn momenteel niet genoeg artikelen beschikbaar voor de grid.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-2 h-auto md:h-[600px]">
      {/* Main Article - spans 2 columns and 2 rows (left side) */}
      <Link
        href={`/artikel/${articles[0].slug}`}
        className="md:col-span-2 md:row-span-2 relative group overflow-hidden h-[300px] md:h-auto"
      >
        <Image
          src={articles[0].image}
          alt={articles[0].title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="text-xs text-white/80 uppercase font-semibold mb-2">
            {articles[0].category}
          </div>
          <h2 className="text-white text-2xl font-bold leading-tight mb-2 group-hover:text-brand-yellow transition-colors">
            {articles[0].title}
          </h2>
          <p className="text-white/90 text-sm line-clamp-2 mb-2">
            {articles[0].summary}
          </p>
          <div className="flex items-center text-white/70 text-xs">
            <span>{articles[0].author}</span>
            <span className="mx-2">•</span>
            <span>{formatDateShort(articles[0].timestamp)}</span>
          </div>
        </div>
      </Link>

      {/* Top Right Article - Premium */}
      <Link
        href={`/artikel/${articles[1].slug}`}
        className="md:col-span-1 md:row-span-1 relative group overflow-hidden h-[200px] md:h-auto"
      >
        <Image
          src={articles[1].image}
          alt={articles[1].title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {articles[1].premium && (
          <div className="absolute top-2 right-2 bg-brand-yellow text-black text-xs font-bold px-2 py-1 rounded uppercase z-10">
            PREMIUM
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 p-3">
          <div className="text-xs text-brand-blue uppercase font-semibold mb-1">
            {articles[1].category}
          </div>
          <h3 className="font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-brand-blue transition-colors">
            {articles[1].title}
          </h3>
        </div>
      </Link>

      {/* Middle Right Article */}
      <Link
        href={`/artikel/${articles[2].slug}`}
        className="md:col-span-1 md:row-span-1 relative group overflow-hidden h-[200px] md:h-auto"
      >
        <Image
          src={articles[2].image}
          alt={articles[2].title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 p-3">
          <div className="text-xs text-brand-blue uppercase font-semibold mb-1">
            {articles[2].category}
          </div>
          <h3 className="font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-brand-blue transition-colors">
            {articles[2].title}
          </h3>
        </div>
      </Link>

      {/* Bottom Right Article - Portrait style */}
      <Link
        href={`/artikel/${articles[3].slug}`}
        className="md:col-span-1 md:row-span-1 relative group overflow-hidden h-[200px] md:h-auto"
      >
        <Image
          src={articles[3].image}
          alt={articles[3].title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {articles[3].premium && (
          <div className="absolute top-2 right-2 bg-brand-yellow text-black text-xs font-bold px-2 py-1 rounded uppercase z-10">
            PREMIUM
          </div>
        )}
        {/* Author label overlay */}
        <div className="absolute bottom-12 left-2 flex items-center">
          <span className="bg-brand-darkred text-white text-xs font-bold px-2 py-1 rounded uppercase">
            {articles[3].author}
          </span>
          {articles[3].comments > 0 && (
            <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded ml-1">
              {articles[3].comments}
            </span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 p-3">
          <h3 className="font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-brand-blue transition-colors">
            {articles[3].title}
          </h3>
        </div>
      </Link>
    </div>
  )
}