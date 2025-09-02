import MainArticleCard from '@/components/MainArticleCard'
import { getCategoryPageArticles } from '@/lib/articleFilters'
import { getArticlesData } from '@/lib/serverData'
import CategoryContentWrapper from '@/components/CategoryContentWrapper'
import NetBinnenWidget from '@/components/widgets/NetBinnenWidget'
import Emergency112Widget from '@/components/widgets/Emergency112Widget'
import MostReadWidget from '@/components/widgets/MostReadWidget'
import SpotlightBedrijven from '@/components/SpotlightBedrijven'
import Advertisement from '@/components/widgets/Advertisement'
import { getBedrijvenData } from '@/lib/serverData'

// Force dynamic rendering to ensure fresh content
export const dynamic = 'force-dynamic'
export const revalidate = 60

// Server-side sidebar component
async function SidebarContent() {
  const bedrijven = await getBedrijvenData()

  return (
    <aside className="space-y-6">
      <Emergency112Widget />
      <NetBinnenWidget />
      <MostReadWidget />
      <SpotlightBedrijven bedrijven={bedrijven} />
      <Advertisement />
    </aside>
  )
}

interface CategoryPageProps {
  category: string
  tag: string
  description: string
  showLoadMore?: boolean
}

export default async function CategoryPage({ 
  category, 
  tag, 
  description,
  showLoadMore = true
}: CategoryPageProps) {
  // Server-side data loading
  const allArticles = await getArticlesData()
  const { heroArticle, gridArticles } = getCategoryPageArticles(allArticles, tag)
  
  const initialArticles = gridArticles.slice(0, 12) // Show first 12 articles
  const hasMore = gridArticles.length > 12

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8 py-4 lg:py-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6 lg:mb-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-blue font-newspaper mb-2">
                {category}
              </h1>
              <p className="text-gray-600 text-base lg:text-lg">
                {description}
              </p>
              <div className="w-16 h-1 bg-brand-yellow mt-3 lg:mt-4"></div>
            </div>
            {/* Hero Article */}
            {heroArticle && (
              <div className="mb-12">
                <MainArticleCard article={heroArticle} />
              </div>
            )}

            {/* No Articles Message */}
            {!heroArticle && initialArticles.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nog geen artikelen beschikbaar
                  </h3>
                  <p className="text-gray-600">
                    Er zijn momenteel nog geen artikelen in de categorie &quot;{category}&quot;.
                  </p>
                </div>
              </div>
            )}
            
            {/* Article Grid with Client-side Load More */}
            {initialArticles.length > 0 && (
              <CategoryContentWrapper
                category={category}
                initialArticles={initialArticles}
                allArticles={gridArticles}
                hasMore={hasMore}
                showLoadMore={showLoadMore}
              />
            )}

            {/* Structured Data */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "CollectionPage",
                  "name": category,
                  "description": description,
                  "url": `https://barnevelds-dagblad.nl/${tag}`,
                  "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": [
                      ...(heroArticle ? [{
                        "@type": "NewsArticle",
                        "headline": heroArticle.title,
                        "description": heroArticle.summary,
                        "author": {
                          "@type": "Person",
                          "name": heroArticle.author
                        },
                        "datePublished": heroArticle.publishedAt,
                        "publisher": {
                          "@type": "NewsMediaOrganization",
                          "name": "Barnevelds Dagblad",
                          "logo": {
                            "@type": "ImageObject",
                            "url": "https://barnevelds-dagblad.nl/barneveldsdagblad.jpeg"
                          }
                        }
                      }] : []),
                      ...initialArticles.slice(0, 5).map((article, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                          "@type": "NewsArticle",
                          "headline": article.title,
                          "description": article.summary,
                          "author": {
                            "@type": "Person", 
                            "name": article.author
                          },
                          "datePublished": article.publishedAt,
                          "publisher": {
                            "@type": "NewsMediaOrganization",
                            "name": "Barnevelds Dagblad"
                          }
                        }
                      }))
                    ]
                  },
                  "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                      {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://barnevelds-dagblad.nl"
                      },
                      {
                        "@type": "ListItem", 
                        "position": 2,
                        "name": category,
                        "item": `https://barnevelds-dagblad.nl/${tag}`
                      }
                    ]
                  }
                })
              }}
            />
          </div>
          
          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block">
            <SidebarContent />
          </div>
        </div>
      </div>
    </div>
  )
}