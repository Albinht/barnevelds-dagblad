import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types/article'

interface KijkGridProps {
  articles: Article[]
}

export default function KijkGrid({ articles }: KijkGridProps) {
  if (articles.length === 0) return null

  const gridArticles = articles.slice(0, 4)
  const listArticles = articles.slice(4)

  return (
    <section className="mb-12">
      <div className="border-b-4 border-brand-blue mb-6">
        <h2 className="text-2xl font-bold text-brand-blue uppercase mb-2">KIJK</h2>
      </div>

      {/* Grid Section */}
      {gridArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-auto md:h-[350px] mb-6">
          {/* Main Video Article - spans 2 columns */}
          {gridArticles[0] && (
            <Link
              href={`/artikel/${gridArticles[0].slug}`}
              className="md:col-span-2 relative group overflow-hidden h-[250px] md:h-auto"
            >
              <Image
                src={gridArticles[0].image}
                alt={gridArticles[0].title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Video Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 text-black rounded-full p-4 group-hover:bg-brand-yellow group-hover:scale-110 transition-all duration-300">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l8-5z"/>
                  </svg>
                </div>
              </div>
              
              {/* Tech Badge */}
              <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded uppercase">
                TECH TV
              </div>
              
              {/* Video Duration */}
              <div className="absolute top-4 right-4 bg-black/80 text-white text-xs font-bold px-3 py-1 rounded">
                12:34
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-xs text-white/80 uppercase font-semibold mb-2">
                  {gridArticles[0].category} • DOCUMENTAIRE
                </div>
                <h3 className="text-white text-lg font-bold leading-tight mb-2 group-hover:text-brand-yellow transition-colors">
                  {gridArticles[0].title}
                </h3>
                <div className="flex items-center text-white/70 text-xs">
                  <span>12.5K weergaven</span>
                  <span className="mx-2">•</span>
                  <span>{gridArticles[0].publishedAt}</span>
                </div>
              </div>
            </Link>
          )}

          {/* Right Column - Video Thumbnails */}
          {gridArticles[1] && (
            <Link
              href={`/artikel/${gridArticles[1].slug}`}
              className="md:col-span-1 relative group overflow-hidden h-[120px] md:h-auto"
            >
              <Image
                src={gridArticles[1].image}
                alt={gridArticles[1].title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Mini Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/60 text-white rounded-full p-2 group-hover:bg-brand-yellow group-hover:text-black transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l8-5z"/>
                  </svg>
                </div>
              </div>
              
              {/* Duration */}
              <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                5:21
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 p-2">
                <h4 className="font-bold text-gray-900 text-xs leading-tight line-clamp-2 group-hover:text-brand-blue transition-colors">
                  {gridArticles[1].title}
                </h4>
              </div>
            </Link>
          )}

          {gridArticles[2] && (
            <Link
              href={`/artikel/${gridArticles[2].slug}`}
              className="md:col-span-1 relative group overflow-hidden h-[120px] md:h-auto"
            >
              <Image
                src={gridArticles[2].image}
                alt={gridArticles[2].title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Live Badge */}
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded uppercase animate-pulse">
                LIVE
              </div>
              
              {/* Mini Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/60 text-white rounded-full p-2 group-hover:bg-red-600 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l8-5z"/>
                  </svg>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 p-2">
                <h4 className="font-bold text-gray-900 text-xs leading-tight line-clamp-2 group-hover:text-brand-blue transition-colors">
                  {gridArticles[2].title}
                </h4>
              </div>
            </Link>
          )}

          {gridArticles[3] && (
            <Link
              href={`/artikel/${gridArticles[3].slug}`}
              className="md:col-span-1 relative group overflow-hidden h-[120px] md:h-auto"
            >
              <Image
                src={gridArticles[3].image}
                alt={gridArticles[3].title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {gridArticles[3].premium && (
                <div className="absolute top-2 right-2 bg-brand-yellow text-black text-xs font-bold px-2 py-1 rounded">
                  PREMIUM
                </div>
              )}
              
              {/* Mini Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/60 text-white rounded-full p-2 group-hover:bg-brand-yellow group-hover:text-black transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l8-5z"/>
                  </svg>
                </div>
              </div>
              
              {/* Duration */}
              <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                8:45
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 p-2">
                <h4 className="font-bold text-gray-900 text-xs leading-tight line-clamp-1 group-hover:text-brand-blue transition-colors">
                  {gridArticles[3].title}
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
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/60 text-white rounded-full p-2 group-hover:bg-brand-yellow group-hover:text-black transition-all">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l8-5z"/>
                    </svg>
                  </div>
                </div>
                {article.premium && (
                  <span className="absolute top-1 left-1 bg-brand-yellow text-black px-1 py-0.5 text-xs font-bold rounded">
                    PREMIUM
                  </span>
                )}
                {/* Kijk Badge */}
                <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs font-bold px-1 py-0.5 rounded uppercase">
                  KIJK
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm text-blue-600 font-semibold mb-1 md:mb-2 uppercase">
                  KIJK • {article.publishedAt}
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