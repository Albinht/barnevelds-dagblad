import ArticleCard from './ArticleCard'

interface Article {
  id: string
  title: string
  excerpt: string
  imageUrl?: string
  publishedAt: string
  slug: string
  category?: string
}

interface ArticleGridProps {
  articles: Article[]
  title?: string
}

export default function ArticleGrid({ articles, title }: ArticleGridProps) {
  return (
    <section className="py-8">
      {title && (
        <h2 className="text-3xl font-bold text-brand-blue mb-8 text-center">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            excerpt={article.excerpt}
            imageUrl={article.imageUrl}
            publishedAt={article.publishedAt}
            slug={article.slug}
            category={article.category}
          />
        ))}
      </div>
      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Geen artikelen gevonden.</p>
        </div>
      )}
    </section>
  )
}