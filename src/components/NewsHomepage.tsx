import NewsGrid from './NewsGrid'
import RegioGrid from './RegioGrid'
import SportGrid from './SportGrid'
import ShowGrid from './ShowGrid'
import KijkGrid from './KijkGrid'
import LoginCTA from './LoginCTA'
import SpotlightBedrijven from './SpotlightBedrijven'
import NewsTicker from './NewsTicker'
import { Article } from '@/types/article'
import { Bedrijf } from '@/types/bedrijf'

interface NewsHomepageProps {
  articles: Article[]
  bedrijven: Bedrijf[]
}

export default function NewsHomepage({ articles, bedrijven }: NewsHomepageProps) {
  // Handle empty or invalid data
  if (!articles || articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Nieuws wordt geladen...</h2>
          <p className="text-gray-600">Er zijn momenteel geen artikelen beschikbaar.</p>
        </div>
      </div>
    )
  }

  // Sort articles by timestamp
  const sortedArticles = articles.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  // Use first 4 articles for the main grid, rest for ticker
  const mainGridArticles = sortedArticles.slice(0, 4)
  const tickerArticles = sortedArticles.slice(4)

  // Filter articles by category
  const regioArticles = sortedArticles.filter(article => 
    article.category.toLowerCase().includes('lokaal') || 
    article.category.toLowerCase().includes('regio')
  )
  const sportArticles = sortedArticles.filter(article => 
    article.category.toLowerCase().includes('sport')
  )
  const showArticles = sortedArticles.filter(article => 
    article.category.toLowerCase().includes('show') ||
    article.category.toLowerCase().includes('cultuur')
  )
  const kijkArticles = sortedArticles.filter(article => 
    article.category.toLowerCase().includes('technologie') ||
    article.category.toLowerCase().includes('kijk')
  )

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Main Content - 75% width */}
        <div className="flex-1">
          {/* Top Featured Grid */}
          <div className="mb-12">
            <NewsGrid articles={mainGridArticles} />
          </div>

          {/* Category Sections */}
          <RegioGrid articles={regioArticles} />
          <SportGrid articles={sportArticles} />
          <ShowGrid articles={showArticles} />
          <KijkGrid articles={kijkArticles} />
        </div>

        {/* Sidebar - 25% width */}
        <div className="w-80 flex-shrink-0 hidden lg:block">
          <LoginCTA />
          <SpotlightBedrijven bedrijven={bedrijven} />
          <NewsTicker articles={tickerArticles} />
        </div>
      </div>

      {/* Mobile Sidebar - shown below main content on smaller screens */}
      <div className="lg:hidden mt-8">
        <LoginCTA />
        <SpotlightBedrijven bedrijven={bedrijven} />
        <NewsTicker articles={tickerArticles} />
      </div>
    </div>
  )
}