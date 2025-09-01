import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types/article'

interface CategoryGridProps {
  title: string
  articles: Article[]
  maxGridItems?: number
}

export default function CategoryGrid({ title, articles, maxGridItems = 4 }: CategoryGridProps) {
  if (articles.length === 0) return null

  const gridArticles = articles.slice(0, maxGridItems)
  const listArticles = articles.slice(maxGridItems)

  return (
    <section className="mb-12">
      <div className="border-b-4 border-brand-blue mb-6">
        <h2 className="text-2xl font-bold text-brand-blue uppercase mb-2">{title}</h2>
      </div>

      {/* Grid Section */}
      {gridArticles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {gridArticles.map((article) => (
            <Link 
              key={article.id} 
              href={`/artikel/${article.slug}`}
              className="group block relative overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {article.premium && (
                  <span className="absolute top-2 left-2 bg-brand-yellow text-black px-2 py-1 text-xs font-bold">
                    PREMIUM
                  </span>
                )}
              </div>
              <div className="p-3">
                <div className="text-xs text-gray-500 mb-1 uppercase">
                  {article.category} • {article.publishedAt}
                </div>
                <h3 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-brand-blue transition-colors">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* List Section */}
      {listArticles.length > 0 && (
        <div className="space-y-2">
          {listArticles.map((article) => (
            <Link 
              key={article.id}
              href={`/artikel/${article.slug}`}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-16 h-12 flex-shrink-0 relative overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-1">
                  {article.publishedAt} • {article.author}
                </div>
                <h4 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-brand-blue transition-colors">
                  {article.title}
                </h4>
              </div>
              {article.premium && (
                <span className="bg-brand-yellow text-black px-2 py-1 text-xs font-bold">
                  PREMIUM
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}