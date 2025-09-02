import NewsGrid from './NewsGrid'
import RegioGrid from './RegioGrid'
import SportGrid from './SportGrid'
import ShowGrid from './ShowGrid'
import KijkGrid from './KijkGrid'
import LoginCTA from './LoginCTA'
import SpotlightBedrijven from './SpotlightBedrijven'
import NewsTicker from './NewsTicker'
import Emergency112Widget from './widgets/Emergency112Widget'
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
    <div className="container mx-auto px-0 md:px-2 lg:px-4 py-4 md:py-6">
      <div className="flex flex-col md:flex-row lg:flex-row gap-4 md:gap-6">
        {/* Main Content */}
        <div className="flex-1 w-full md:w-2/3 lg:w-3/4">
          {/* Top Featured Grid */}
          <div className="mb-6 md:mb-8 lg:mb-12 px-4 md:px-2 lg:px-0">
            <NewsGrid articles={mainGridArticles} />
          </div>

          {/* Category Sections */}
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            <RegioGrid articles={regioArticles} />
            <SportGrid articles={sportArticles} />
            <ShowGrid articles={showArticles} />
            <KijkGrid articles={kijkArticles} />
          </div>
        </div>

        {/* Tablet/Desktop Sidebar */}
        <div className="w-full md:w-1/3 lg:w-80 flex-shrink-0 hidden md:block">
          <div className="space-y-4 md:space-y-6">
            <Emergency112Widget />
            <LoginCTA />
            <SpotlightBedrijven bedrijven={bedrijven} />
            <NewsTicker articles={tickerArticles} />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar - shown below main content on mobile only */}
      <div className="md:hidden mt-6 space-y-4 w-full max-w-md mx-auto px-4">
        <Emergency112Widget />
        <LoginCTA />
        <SpotlightBedrijven bedrijven={bedrijven} />
        <NewsTicker articles={tickerArticles} />
      </div>
    </div>
  )
}