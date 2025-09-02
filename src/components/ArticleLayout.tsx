import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types/article'
import NetBinnenWidget from '@/components/widgets/NetBinnenWidget'
import Emergency112Widget from '@/components/widgets/Emergency112Widget'
import MostReadWidget from '@/components/widgets/MostReadWidget'
import Advertisement from '@/components/widgets/Advertisement'
import RelatedArticles from '@/components/widgets/RelatedArticles'
import SpotlightBedrijven from '@/components/SpotlightBedrijven'
import { formatDate, formatTime } from '@/lib/dateUtils'
import { getFeaturedBedrijven } from '@/lib/bedrijven'
import { DatabaseArticle } from '@/lib/articles-db'
import '@/styles/article.css'

interface ArticleLayoutProps {
  article: Article
  children: React.ReactNode
  featuredBedrijven?: Awaited<ReturnType<typeof getFeaturedBedrijven>>
  relatedArticles?: DatabaseArticle[]
}

export default function ArticleLayout({ article, children, featuredBedrijven = [], relatedArticles = [] }: ArticleLayoutProps) {
  const publishDate = formatDate(article.publishedAt || article.timestamp)
  const publishTime = formatTime(article.publishedAt || article.timestamp)

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
          
          {/* Article Content - Full width on mobile, 2 cols on tablet, 8 cols on desktop */}
          <article className="md:col-span-2 lg:col-span-8 bg-white rounded-lg shadow-sm overflow-hidden">
            
            {/* Hero Image */}
            {article.image && (
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
            )}
            
            {/* Article Header */}
            <div className="p-4 md:p-5 lg:p-8">
              {/* Category Badge */}
              {article.category && (
                <div className="mb-4">
                  <span className="inline-block bg-[#0F47AF] text-white px-3 py-1 text-xs font-bold rounded uppercase tracking-wide">
                    {article.category}
                  </span>
                  {article.premium && (
                    <span className="inline-block bg-[#FCDD0C] text-black px-3 py-1 text-xs font-bold rounded uppercase tracking-wide ml-2">
                      PREMIUM
                    </span>
                  )}
                </div>
              )}
              
              {/* Article Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
                {article.title}
              </h1>
              
              {/* Article Summary */}
              {article.summary && (
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed mb-4 md:mb-6 font-medium">
                  {article.summary}
                </p>
              )}
              
              {/* Article Metadata */}
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 mb-4 md:mb-8 pb-4 md:pb-6 border-b border-gray-200">
                <div className="flex items-center">
                  <span className="font-medium">Door {article.author}</span>
                </div>
                <div className="flex items-center">
                  <span>{publishDate} om {publishTime}</span>
                </div>
                {article.comments > 0 && (
                  <div className="flex items-center">
                    <span>{article.comments} reacties</span>
                  </div>
                )}
                {/* Share buttons placeholder */}
                <div className="ml-auto flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-[#0F47AF] transition-colors">
                    <span className="sr-only">Delen</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-[#0F47AF] transition-colors">
                    <span className="sr-only">Bewaren</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Article Content */}
              <div className="article-content max-w-none">
                {children}
              </div>
              
              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tag/${tag}`}
                        className="inline-block bg-gray-100 text-gray-700 px-3 py-1 text-sm rounded-full hover:bg-[#0F47AF] hover:text-white transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Related Articles */}
              {relatedArticles && relatedArticles.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Gerelateerde artikelen</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedArticles.map((relatedArticle) => (
                      <Link
                        key={relatedArticle.id}
                        href={`/artikel/${relatedArticle.slug}`}
                        className="group block bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {relatedArticle.image && (
                          <div className="relative aspect-[16/9] w-full">
                            <Image
                              src={relatedArticle.image}
                              alt={relatedArticle.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="mb-2">
                            <span className="text-xs font-bold text-[#0F47AF] uppercase tracking-wide">
                              {relatedArticle.category}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#0F47AF] line-clamp-2 mb-2 transition-colors">
                            {relatedArticle.title}
                          </h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>Door {relatedArticle.author.username}</span>
                            <span className="mx-1">•</span>
                            <span>{formatDate(relatedArticle.publishedAt?.toISOString() || relatedArticle.createdAt.toISOString())}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
          
          {/* Sidebar - Below article on mobile, 1 col on tablet, 4 cols on desktop */}
          <aside className="md:col-span-1 lg:col-span-4 space-y-4 md:space-y-6">
            
            {/* 112 Emergency Widget */}
            <Emergency112Widget />
            
            {/* Net Binnen Widget */}
            <NetBinnenWidget />
            
            {/* Advertisement Slot 1 */}
            <Advertisement height={250} />
            
            {/* Meest Gelezen Widget */}
            <MostReadWidget />
            
            {/* Related Articles */}
            <RelatedArticles currentArticle={article} limit={3} />
            
            {/* Advertisement Slot 2 */}
            <Advertisement height={600} />
            
            {/* Bedrijven in de Spotlight */}
            <SpotlightBedrijven bedrijven={featuredBedrijven} />
            
          </aside>
        </div>
    </div>
  )
}