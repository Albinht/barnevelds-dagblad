import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllArticles } from '@/lib/articles-db'
import { getArticles } from '@/lib/articles'
import { formatDate, formatTime } from '@/lib/dateUtils'
import { Article } from '@/types/article'

export const metadata: Metadata = {
  title: '112 Meldingen | Barnevelds Dagblad',
  description: 'Alle 112 meldingen uit Barneveld en omgeving. Blijf op de hoogte van incidenten, ongevallen en noodmeldingen in uw regio.',
  keywords: '112, noodmelding, incident, ongeval, brandweer, politie, ambulance, Barneveld',
}

export default async function Page112Meldingen() {
  let articles: Article[] = []
  
  try {
    // Try to get from database first
    const dbArticles = await getAllArticles()
    
    // Filter for 112 articles
    const filtered112Articles = dbArticles.filter(article => 
      article.published && (
        article.category === '112' || 
        article.category === '112 Meldingen' ||
        article.tags?.includes('112')
      )
    )
    
    if (filtered112Articles.length > 0) {
      // Transform to Article type
      articles = filtered112Articles.map(article => ({
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
        author: article.author.username || article.author.email,
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
        article.category === '112' || 
        article.category === '112 Meldingen' ||
        article.tags?.includes('112')
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-lg">112</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">112 Meldingen</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Alle 112 meldingen uit Barneveld en omgeving. Van incidenten en ongevallen tot brandweer-, politie- en ambulance-inzetten.
        </p>
      </div>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {articles.map((article) => {
            const publishDate = formatDate(article.publishedAt || article.timestamp)
            const publishTime = formatTime(article.publishedAt || article.timestamp)
            
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
                    <span className="inline-block bg-red-600 text-white px-2 py-1 text-xs font-bold rounded uppercase tracking-wide">
                      112
                    </span>
                    {article.category && article.category !== '112' && (
                      <span className="inline-block bg-[#0F47AF] text-white px-2 py-1 text-xs font-bold rounded uppercase tracking-wide">
                        {article.category}
                      </span>
                    )}
                    {article.premium && (
                      <span className="inline-block bg-[#FCDD0C] text-black px-2 py-1 text-xs font-bold rounded uppercase tracking-wide">
                        PREMIUM
                      </span>
                    )}
                  </div>
                  
                  {/* Article Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-[#0F47AF] transition-colors">
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
                    <div className="flex items-center">
                      <span>Door {article.author}</span>
                    </div>
                    <div className="flex items-center">
                      <time dateTime={article.publishedAt || article.timestamp}>
                        {publishDate} • {publishTime}
                      </time>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Geen 112 meldingen gevonden</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Er zijn momenteel geen artikelen in de 112 categorie. Zodra er nieuwe meldingen zijn, verschijnen ze hier.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center bg-[#0F47AF] text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Terug naar homepage
          </Link>
        </div>
      )}
      
      {/* Emergency Information */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">
              Noodgeval? Bel direct 112!
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p className="mb-2">
                Bij een noodgeval belt u direct <strong>112</strong> voor brandweer, ambulance of politie.
              </p>
              <p>
                Deze pagina toont nieuws over 112 meldingen en is niet bedoeld voor noodmeldingen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}