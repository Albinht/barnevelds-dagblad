import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllArticles } from '@/lib/articles-db'
import { getArticles } from '@/lib/articles'
import { formatDate } from '@/lib/dateUtils'
import { Article } from '@/types/article'

// Force dynamic rendering and revalidate every 60 seconds
export const dynamic = 'force-dynamic'
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Gemeentenieuws | Barnevelds Dagblad',
  description: 'Officiële gemeentelijke aankondigingen, besluiten, vergunningen en bekendmakingen van de gemeente Barneveld.',
  keywords: 'gemeente, Barneveld, gemeentenieuws, vergunningen, besluiten, bekendmakingen, raadsvergadering',
}

export default async function GemeentePage() {
  let articles: Article[] = []

  try {
    // Try to get from database first
    const dbArticles = await getAllArticles()

    // Filter for gemeente articles
    const filteredGemeenteArticles = dbArticles.filter(article =>
      article.published && (
        article.category === 'Gemeente' ||
        article.category === 'Gemeentenieuws' ||
        article.tags?.includes('gemeente') ||
        article.tags?.includes('gemeenteraad') ||
        article.tags?.includes('burgemeester')
      )
    )

    if (filteredGemeenteArticles.length > 0) {
      // Transform to Article type
      articles = filteredGemeenteArticles.map(article => ({
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
    console.error('Database error, trying JSON fallback:', dbError)

    // Fallback to JSON
    try {
      const jsonArticles = await getArticles()
      articles = jsonArticles.filter(article =>
        article.category === 'Gemeente' ||
        article.category === 'Gemeentenieuws' ||
        article.tags?.includes('gemeente')
      )
    } catch (jsonError) {
      console.error('JSON fallback also failed:', jsonError)
    }
  }

  // Sort by date (newest first)
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
          <div className="bg-brand-blue text-white px-4 py-2 rounded-lg flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="font-bold text-lg">Gemeentenieuws</span>
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">Gemeentenieuws Barneveld</h1>
        <p className="text-base lg:text-xl text-gray-600 max-w-3xl mx-auto">
          Officiële mededelingen, vergunningen, besluiten en bekendmakingen van de gemeente Barneveld.
        </p>
      </div>

      {/* Quick Links */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Snel naar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="https://www.barneveld.nl/bestuur-organisatie/college-van-b-en-w" target="_blank" rel="noopener noreferrer"
             className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow">
            <svg className="w-8 h-8 text-brand-blue mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">College B&W</span>
          </a>

          <a href="https://www.barneveld.nl/inwoner/vergunningen" target="_blank" rel="noopener noreferrer"
             className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow">
            <svg className="w-8 h-8 text-brand-blue mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">Vergunningen</span>
          </a>

          <a href="https://www.barneveld.nl/bestuur-organisatie/gemeenteraad" target="_blank" rel="noopener noreferrer"
             className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow">
            <svg className="w-8 h-8 text-brand-blue mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">Gemeenteraad</span>
          </a>

          <a href="https://www.barneveld.nl/contact" target="_blank" rel="noopener noreferrer"
             className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow">
            <svg className="w-8 h-8 text-brand-blue mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">Contact</span>
          </a>
        </div>
      </div>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Laatste gemeentenieuws</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {articles.map((article) => {
              const publishDate = formatDate(article.publishedAt || article.timestamp)

              return (
                <article key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Article Image */}
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

                  {/* Article Content */}
                  <div className="p-6">
                    {/* Category and Tags */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block bg-brand-blue text-white px-2 py-1 text-xs font-bold rounded uppercase tracking-wide">
                        Gemeente
                      </span>
                      {article.premium && (
                        <span className="inline-block bg-brand-yellow text-black px-2 py-1 text-xs font-bold rounded uppercase tracking-wide">
                          PREMIUM
                        </span>
                      )}
                    </div>

                    {/* Article Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-brand-blue transition-colors">
                      <Link href={`/artikel/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>

                    {/* Article Excerpt */}
                    {article.excerpt && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}

                    {/* Article Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
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
      ) : (
        /* Empty State with Categories */
        <div className="space-y-8">
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Geen recente artikelen</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Er zijn momenteel geen gemeentenieuws artikelen beschikbaar. Bekijk de directe links hieronder voor actuele informatie.
            </p>
          </div>

          {/* Direct Links to Municipality */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Officiële bekendmakingen</h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://www.barneveld.nl/publicaties/bekendmakingen" target="_blank" rel="noopener noreferrer"
                     className="text-brand-blue hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Actuele bekendmakingen
                  </a>
                </li>
                <li>
                  <a href="https://www.barneveld.nl/publicaties/vergunningen" target="_blank" rel="noopener noreferrer"
                     className="text-brand-blue hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Verleende vergunningen
                  </a>
                </li>
                <li>
                  <a href="https://www.barneveld.nl/publicaties/plannen" target="_blank" rel="noopener noreferrer"
                     className="text-brand-blue hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Bestemmingsplannen
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Vergaderingen & besluiten</h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://barneveld.raadsinformatie.nl/" target="_blank" rel="noopener noreferrer"
                     className="text-brand-blue hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Raadsinformatie
                  </a>
                </li>
                <li>
                  <a href="https://www.barneveld.nl/bestuur-organisatie/vergaderkalender" target="_blank" rel="noopener noreferrer"
                     className="text-brand-blue hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Vergaderkalender
                  </a>
                </li>
                <li>
                  <a href="https://www.barneveld.nl/publicaties/besluiten" target="_blank" rel="noopener noreferrer"
                     className="text-brand-blue hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    College besluiten
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">
              Contact met de gemeente
            </h3>
            <div className="mt-2 text-sm text-gray-600">
              <p className="mb-2">
                <strong>Gemeente Barneveld</strong><br />
                Raadhuisplein 2, 3771 ER Barneveld
              </p>
              <p className="mb-2">
                <strong>Telefoon:</strong> 14 0342<br />
                <strong>E-mail:</strong> info@barneveld.nl
              </p>
              <p>
                <strong>Openingstijden:</strong> Ma-vr 8:30-12:30 uur (op afspraak)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}