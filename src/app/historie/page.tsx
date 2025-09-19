import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllArticles } from '@/lib/articles-db'
import { getArticles } from '@/lib/articles'
import { formatDate } from '@/lib/dateUtils'
import { Article } from '@/types/article'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Historie Barneveld | Barnevelds Dagblad',
  description: 'Ontdek de rijke geschiedenis van Barneveld. Historische verhalen, oude foto\'s en bijzondere gebeurtenissen uit het verleden.',
  keywords: 'historie, geschiedenis, Barneveld, erfgoed, oude foto\'s, historisch, verhalen',
}

// Historical periods/categories
const historicalPeriods = [
  { id: 'middeleeuwen', name: 'Middeleeuwen', period: 'Voor 1500' },
  { id: 'gouden-eeuw', name: 'Gouden Eeuw', period: '1500-1700' },
  { id: '18e-eeuw', name: '18e Eeuw', period: '1700-1800' },
  { id: '19e-eeuw', name: '19e Eeuw', period: '1800-1900' },
  { id: '20e-eeuw', name: '20e Eeuw', period: '1900-2000' },
  { id: 'modern', name: 'Recent verleden', period: '2000-heden' }
]

// Sample historical stories
const historicalStories = [
  {
    id: '1',
    title: 'De Oude Kerk van Barneveld',
    period: 'middeleeuwen',
    year: '13e eeuw',
    excerpt: 'De Oude Kerk, oorspronkelijk gebouwd in de 13e eeuw, is het oudste gebouw van Barneveld en heeft door de eeuwen heen een centrale rol gespeeld in het leven van de Barnevelders.',
    image: '/api/placeholder/400/300',
    tags: ['kerk', 'architectuur', 'middeleeuwen']
  },
  {
    id: '2',
    title: 'De Grote Brand van 1899',
    period: '19e-eeuw',
    year: '1899',
    excerpt: 'Op 15 augustus 1899 werd Barneveld getroffen door een verwoestende brand die grote delen van het centrum in de as legde. De wederopbouw bepaalde het gezicht van het moderne Barneveld.',
    image: '/api/placeholder/400/300',
    tags: ['brand', 'ramp', 'wederopbouw']
  },
  {
    id: '3',
    title: 'De Kippen van Barneveld',
    period: '20e-eeuw',
    year: '1900-1950',
    excerpt: 'Hoe Barneveld uitgroeide tot het centrum van de Nederlandse pluimveehouderij en wereldberoemd werd om zijn kippen en eieren.',
    image: '/api/placeholder/400/300',
    tags: ['pluimvee', 'economie', 'landbouw']
  },
  {
    id: '4',
    title: 'Jan van Schaffelaar: Held of Mythe?',
    period: 'middeleeuwen',
    year: '1482',
    excerpt: 'Het verhaal van Jan van Schaffelaar, die zich volgens de overlevering van de kerktoren stortte om zijn makkers te redden, blijft tot op de dag van vandaag onderwerp van discussie.',
    image: '/api/placeholder/400/300',
    tags: ['Jan van Schaffelaar', 'legende', 'middeleeuwen']
  },
  {
    id: '5',
    title: 'De Veluwe Lijn: Spoorweggeschiedenis',
    period: '19e-eeuw',
    year: '1876',
    excerpt: 'De aanleg van de spoorlijn Ede-Barneveld-Nijkerk in 1876 betekende een nieuwe fase in de ontwikkeling van Barneveld als handelscentrum.',
    image: '/api/placeholder/400/300',
    tags: ['spoorweg', 'transport', 'ontwikkeling']
  }
]

export default async function HistoriePage() {
  let articles: Article[] = []

  try {
    // Try to get from database first
    const dbArticles = await getAllArticles()

    // Filter for historie articles
    const filteredHistorieArticles = dbArticles.filter(article =>
      article.published && (
        article.category === 'Historie' ||
        article.category === 'Geschiedenis' ||
        article.tags?.includes('historie') ||
        article.tags?.includes('geschiedenis')
      )
    )

    if (filteredHistorieArticles.length > 0) {
      articles = filteredHistorieArticles.map(article => ({
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        summary: article.summary,
        content: article.content,
        image: article.image,
        category: article.category,
        tags: article.tags,
        premium: article.premium,
        author: article.authorName || article.author.username || article.author.email,
        publishedAt: article.publishedAt?.toISOString().split('T')[0] || '',
        comments: 0,
        timestamp: article.createdAt.toISOString()
      }))
    }
  } catch (dbError) {
    console.error('Database error:', dbError)

    try {
      const jsonArticles = await getArticles()
      articles = jsonArticles.filter(article =>
        article.category === 'Historie' ||
        article.tags?.includes('historie')
      )
    } catch (jsonError) {
      console.error('JSON fallback also failed:', jsonError)
    }
  }

  // Sort by date
  articles.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.timestamp || 0)
    const dateB = new Date(b.publishedAt || b.timestamp || 0)
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <div className="container mx-auto px-4 lg:px-8 py-4 lg:py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-lg">Historie</span>
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">Historie van Barneveld</h1>
        <p className="text-base lg:text-xl text-gray-600 max-w-3xl mx-auto">
          Duik in het rijke verleden van Barneveld. Van de middeleeuwen tot het recente verleden, ontdek de verhalen die onze gemeente hebben gevormd.
        </p>
      </div>

      {/* Timeline Navigation */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-4 min-w-max">
          {historicalPeriods.map((period) => (
            <div key={period.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer min-w-[150px]">
              <h3 className="font-bold text-gray-900">{period.name}</h3>
              <p className="text-sm text-gray-600">{period.period}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Historical Stories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Historische verhalen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historicalStories.map((story) => (
            <article key={story.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              {/* Story Image */}
              <div className="relative aspect-[16/9] w-full bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Story Content */}
              <div className="p-6">
                {/* Period Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block bg-amber-600 text-white px-2 py-1 text-xs font-bold rounded uppercase tracking-wide">
                    {story.year}
                  </span>
                </div>

                {/* Story Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {story.title}
                </h3>

                {/* Story Excerpt */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {story.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {story.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Read More Link */}
                <button className="text-amber-600 hover:text-amber-700 font-semibold text-sm">
                  Lees meer →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Recent Articles */}
      {articles.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recente historische artikelen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 6).map((article) => {
              const publishDate = formatDate(article.publishedAt || article.timestamp)

              return (
                <article key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  {article.image && (
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block bg-amber-600 text-white px-2 py-1 text-xs font-bold rounded uppercase tracking-wide">
                        Historie
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-amber-600 transition-colors">
                      <Link href={`/artikel/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    {article.excerpt && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}

                    <div className="text-xs text-gray-500">
                      <time dateTime={article.publishedAt || article.timestamp}>
                        {publishDate}
                      </time>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      )}

      {/* Historical Resources */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Photo Archive */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6">
          <div className="flex items-start">
            <svg className="w-8 h-8 text-amber-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Foto Archief</h3>
              <p className="text-sm text-gray-600 mb-4">
                Bekijk duizenden historische foto&apos;s uit het Barneveldse archief. Van oude dorpsgezichten tot bijzondere gebeurtenissen.
              </p>
              <button className="text-amber-600 hover:text-amber-700 font-semibold text-sm">
                Bekijk foto archief →
              </button>
            </div>
          </div>
        </div>

        {/* Submit Story */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-start">
            <svg className="w-8 h-8 text-blue-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Deel uw verhaal</h3>
              <p className="text-sm text-gray-600 mb-4">
                Heeft u een bijzonder verhaal, oude foto&apos;s of documenten over Barneveld? Deel ze met ons en help de geschiedenis levend te houden.
              </p>
              <Link href="/contact?subject=historie"
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                Verhaal insturen →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Organizations */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Historische partners</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <a href="https://www.historischeverenigingbarneveld.nl/" target="_blank" rel="noopener noreferrer"
             className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-2">Historische Vereniging Barneveld</h4>
            <p className="text-sm text-gray-600">De officiële historische vereniging van Barneveld met uitgebreide collectie en activiteiten.</p>
          </a>

          <a href="#" className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-2">Gemeentearchief Barneveld</h4>
            <p className="text-sm text-gray-600">Het gemeentelijk archief met historische documenten, akten en kaarten.</p>
          </a>

          <a href="#" className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-2">Museum Nairac</h4>
            <p className="text-sm text-gray-600">Het lokale museum met permanente en wisselende exposities over Barneveldse geschiedenis.</p>
          </a>
        </div>
      </div>
    </div>
  )
}