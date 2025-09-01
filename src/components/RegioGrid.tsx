import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types/article'

interface RegioGridProps {
  articles: Article[]
}

export default function RegioGrid({ articles }: RegioGridProps) {
  if (articles.length === 0) return null

  const gridArticles = articles.slice(0, 3)
  const listArticles = articles.slice(3)

  return (
    <section className="mb-12 px-4 lg:px-0">
      <div className="border-b-4 border-brand-blue mb-6">
        <h2 className="text-2xl font-bold text-brand-blue uppercase mb-2">REGIO</h2>
      </div>

      {/* Grid Section */}
      {gridArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-2 h-auto md:h-[400px] mb-6">
          {/* Main Article - spans 2 columns and 2 rows */}
          {gridArticles[0] && (
            <Link
              href={`/artikel/${gridArticles[0].slug}`}
              className="md:col-span-2 md:row-span-2 relative group overflow-hidden h-[300px] md:h-auto"
            >
              <Image
                src={gridArticles[0].image}
                alt={gridArticles[0].title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Local News Badge */}
              <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded uppercase">
                LOKAAL NIEUWS
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-xs text-white/80 uppercase font-semibold mb-2">
                  {gridArticles[0].category} • BARNEVELD
                </div>
                <h3 className="text-white text-xl font-bold leading-tight mb-2 group-hover:text-brand-yellow transition-colors">
                  {gridArticles[0].title}
                </h3>
                <p className="text-white/90 text-sm line-clamp-2 mb-2">
                  {gridArticles[0].summary}
                </p>
                <div className="flex items-center text-white/70 text-xs">
                  <span>{gridArticles[0].author}</span>
                  <span className="mx-2">•</span>
                  <span>{gridArticles[0].publishedAt}</span>
                </div>
              </div>
            </Link>
          )}

          {/* Top Right Article */}
          {gridArticles[1] && (
            <Link
              href={`/artikel/${gridArticles[1].slug}`}
              className="md:col-span-1 md:row-span-1 relative group overflow-hidden h-[200px] md:h-auto"
            >
              <Image
                src={gridArticles[1].image}
                alt={gridArticles[1].title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {gridArticles[1].premium && (
                <div className="absolute top-2 right-2 bg-brand-yellow text-black text-xs font-bold px-2 py-1 rounded uppercase">
                  PREMIUM
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 p-3">
                <div className="text-xs text-green-600 uppercase font-semibold mb-1">
                  {gridArticles[1].category}
                </div>
                <h4 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-brand-blue transition-colors">
                  {gridArticles[1].title}
                </h4>
              </div>
            </Link>
          )}

          {/* Bottom Right Article */}
          {gridArticles[2] && (
            <Link
              href={`/artikel/${gridArticles[2].slug}`}
              className="md:col-span-1 md:row-span-1 relative group overflow-hidden h-[200px] md:h-auto"
            >
              <Image
                src={gridArticles[2].image}
                alt={gridArticles[2].title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Community Badge */}
              <div className="absolute bottom-12 left-2 bg-green-700 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                GEMEENTE
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 p-3">
                <h4 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-brand-blue transition-colors">
                  {gridArticles[2].title}
                </h4>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Horizontal List Section */}
      {listArticles.length > 0 && (
        <div className="space-y-4">
          {listArticles.slice(0, 3).map((article) => (
            <Link 
              key={article.id}
              href={`/artikel/${article.slug}`}
              className="flex gap-4 group hover:bg-gray-50 transition-colors p-2 -m-2 rounded"
            >
              <div className="w-24 h-16 md:w-40 md:h-24 flex-shrink-0 relative overflow-hidden rounded">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 96px, 160px"
                />
                {article.premium && (
                  <span className="absolute top-1 left-1 bg-brand-yellow text-black px-1 py-0.5 text-xs font-bold rounded">
                    PREMIUM
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm text-green-600 font-semibold mb-1 md:mb-2 uppercase">
                  REGIO • {article.publishedAt}
                </div>
                <h5 className="font-bold text-sm md:text-lg leading-tight line-clamp-2 group-hover:text-brand-blue transition-colors mb-1 md:mb-2">
                  {article.title}
                </h5>
                <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                  {article.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}