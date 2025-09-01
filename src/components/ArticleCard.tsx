import Link from 'next/link'
import Image from 'next/image'

interface ArticleCardProps {
  title: string
  excerpt: string
  imageUrl?: string
  publishedAt: string
  slug: string
  category?: string
}

export default function ArticleCard({
  title,
  excerpt,
  imageUrl,
  publishedAt,
  slug,
  category
}: ArticleCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        {category && (
          <span className="inline-block bg-brand-yellow text-brand-blue text-xs font-semibold px-2 py-1 rounded-full mb-2">
            {category}
          </span>
        )}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          <Link href={`/artikel/${slug}`} className="hover:text-brand-blue transition-colors">
            {title}
          </Link>
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        <div className="flex items-center justify-between">
          <time className="text-sm text-gray-500">{publishedAt}</time>
          <Link 
            href={`/artikel/${slug}`}
            className="text-brand-blue hover:text-brand-yellow font-semibold text-sm transition-colors"
          >
            Lees meer →
          </Link>
        </div>
      </div>
    </article>
  )
}