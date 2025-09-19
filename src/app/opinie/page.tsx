import { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticles } from '@/lib/articles-db'
import { getArticles } from '@/lib/articles'
import { formatDate } from '@/lib/dateUtils'
import { Article } from '@/types/article'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Opinie | Barnevelds Dagblad',
  description: 'Opiniestukken, columns en ingezonden brieven over Barneveld. Deel uw mening over lokale onderwerpen.',
  keywords: 'opinie, column, ingezonden brief, mening, debat, Barneveld, discussie',
}

export default async function OpiniePage() {
  let articles: Article[] = []

  try {
    // Try to get from database first
    const dbArticles = await getAllArticles()

    // Filter for opinie articles
    const filteredOpinieArticles = dbArticles.filter(article =>
      article.published && (
        article.category === 'Opinie' ||
        article.category === 'Column' ||
        article.tags?.includes('opinie') ||
        article.tags?.includes('column') ||
        article.tags?.includes('ingezonden')
      )
    )

    if (filteredOpinieArticles.length > 0) {
      articles = filteredOpinieArticles.map(article => ({
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
        article.category === 'Opinie' ||
        article.tags?.includes('opinie')
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

  // Sample opinion pieces for demonstration
  const sampleOpinions = [
    {
      id: '1',
      type: 'column',
      title: 'Barneveld moet durven kiezen voor duurzaamheid',
      author: 'Jan de Vries',
      authorRole: 'Columnist',
      excerpt: 'Het is tijd dat onze gemeente grootschaliger inzet op duurzame energie. De klimaatdoelen wachten niet en Barneveld kan een voorbeeldrol vervullen in de regio.',
      date: '2024-01-18',
      readTime: '5 min',
      comments: 23
    },
    {
      id: '2',
      type: 'ingezonden',
      title: 'Verkeersoverlast in het centrum moet aangepakt worden',
      author: 'M. Jansen',
      authorRole: 'Inwoner Barneveld',
      excerpt: 'Als bewoner van het centrum ervaar ik dagelijks de overlast van het toenemende verkeer. Het is tijd voor actie van de gemeente.',
      date: '2024-01-17',
      readTime: '3 min',
      comments: 45
    },
    {
      id: '3',
      type: 'column',
      title: 'De waarde van lokale ondernemers',
      author: 'Els Bakker',
      authorRole: 'Columnist',
      excerpt: 'In tijden van grote ketens en online shopping moeten we de waarde van onze lokale ondernemers niet vergeten. Zij maken Barneveld tot wat het is.',
      date: '2024-01-16',
      readTime: '4 min',
      comments: 18
    },
    {
      id: '4',
      type: 'gastcolumn',
      title: 'Jongeren verdienen meer aandacht in gemeentelijk beleid',
      author: 'Tom Hendriks',
      authorRole: 'Voorzitter Jongerenraad',
      excerpt: 'De stem van jongeren wordt te weinig gehoord in belangrijke beslissingen. Het is tijd dat de gemeente meer investeert in jongerenparticipatie.',
      date: '2024-01-15',
      readTime: '6 min',
      comments: 67
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'column': return 'bg-purple-600'
      case 'ingezonden': return 'bg-green-600'
      case 'gastcolumn': return 'bg-blue-600'
      default: return 'bg-gray-600'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'column': return 'Column'
      case 'ingezonden': return 'Ingezonden brief'
      case 'gastcolumn': return 'Gastcolumn'
      default: return 'Opinie'
    }
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-4 lg:py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-lg">Opinie</span>
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">Opinie & Debat</h1>
        <p className="text-base lg:text-xl text-gray-600 max-w-3xl mx-auto">
          Columns, opiniestukken en ingezonden brieven over actuele onderwerpen in Barneveld. Deel uw mening en draag bij aan het lokale debat.
        </p>
      </div>

      {/* Featured Opinion */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-lg text-white p-8 mb-8">
        <div className="max-w-4xl">
          <span className="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold mb-4">
            Opinie van de week
          </span>
          <h2 className="text-3xl font-bold mb-4">
            {sampleOpinions[0].title}
          </h2>
          <p className="text-lg mb-6 text-purple-100">
            {sampleOpinions[0].excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">{sampleOpinions[0].author}</p>
                <p className="text-sm text-purple-200">{sampleOpinions[0].authorRole}</p>
              </div>
            </div>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
              Lees artikel →
            </button>
          </div>
        </div>
      </div>

      {/* Opinion Categories */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <button className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left">
          <div className="flex items-center mb-3">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-lg mr-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Columns</h3>
              <p className="text-sm text-gray-600">Vaste columnisten</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-600">24</p>
          <p className="text-xs text-gray-500">Deze maand</p>
        </button>

        <button className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left">
          <div className="flex items-center mb-3">
            <div className="bg-green-100 text-green-600 p-3 rounded-lg mr-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Ingezonden</h3>
              <p className="text-sm text-gray-600">Brieven van lezers</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">18</p>
          <p className="text-xs text-gray-500">Deze maand</p>
        </button>

        <button className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left">
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg mr-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Gastcolumns</h3>
              <p className="text-sm text-gray-600">Externe auteurs</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600">12</p>
          <p className="text-xs text-gray-500">Deze maand</p>
        </button>
      </div>

      {/* Opinion Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recente opiniestukken</h2>

          {/* Sample Opinions */}
          <div className="space-y-6">
            {sampleOpinions.slice(1).map((opinion) => (
              <article key={opinion.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Type Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-block ${getTypeColor(opinion.type)} text-white px-2 py-1 text-xs font-bold rounded uppercase tracking-wide`}>
                      {getTypeLabel(opinion.type)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-purple-600 transition-colors">
                    <a href="#">{opinion.title}</a>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {opinion.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{opinion.author}</p>
                          <p className="text-xs text-gray-500">{opinion.authorRole}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {opinion.readTime}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {opinion.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Database Articles */}
          {articles.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Meer opiniestukken</h3>
              <div className="space-y-4">
                {articles.map((article) => (
                  <article key={article.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-gray-900 mb-2 hover:text-purple-600 transition-colors">
                      <Link href={`/artikel/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h4>
                    {article.excerpt && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{article.author}</span>
                      <span className="mx-2">•</span>
                      <time>{formatDate(article.publishedAt || article.timestamp)}</time>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Submit Opinion */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Deel uw mening</h3>
            <p className="text-sm text-gray-600 mb-4">
              Heeft u een mening over een actueel onderwerp in Barneveld? Stuur uw opiniestuk of ingezonden brief in.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-4">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Max. 600 woorden
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Naam en woonplaats verplicht
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Redactie behoudt recht op plaatsing
              </li>
            </ul>
            <Link href="/contact?subject=opinie"
                  className="inline-flex items-center justify-center w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Opinie insturen →
            </Link>
          </div>

          {/* Popular Topics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Populaire onderwerpen</h3>
            <div className="flex flex-wrap gap-2">
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-purple-100 hover:text-purple-700 cursor-pointer transition-colors">
                Gemeentepolitiek
              </span>
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-purple-100 hover:text-purple-700 cursor-pointer transition-colors">
                Verkeer
              </span>
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-purple-100 hover:text-purple-700 cursor-pointer transition-colors">
                Woningbouw
              </span>
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-purple-100 hover:text-purple-700 cursor-pointer transition-colors">
                Duurzaamheid
              </span>
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-purple-100 hover:text-purple-700 cursor-pointer transition-colors">
                Onderwijs
              </span>
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-purple-100 hover:text-purple-700 cursor-pointer transition-colors">
                Cultuur
              </span>
            </div>
          </div>

          {/* Columnists */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Onze columnisten</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Jan de Vries</p>
                  <p className="text-sm text-gray-600">Schrijft over lokale politiek</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Els Bakker</p>
                  <p className="text-sm text-gray-600">Schrijft over ondernemen</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Peter van Dam</p>
                  <p className="text-sm text-gray-600">Schrijft over cultuur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discussion Guidelines */}
      <div className="bg-gray-50 rounded-lg p-6 mt-12">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Discussieregels</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Respectvol debat</h4>
            <p className="text-sm text-gray-600">
              We verwelkomen verschillende meningen en moedigen constructieve discussie aan. Blijf respectvol naar andersdenkenden.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Onderbouwde argumenten</h4>
            <p className="text-sm text-gray-600">
              Onderbouw uw mening met feiten en argumenten. Vermijd ongefundeerde beweringen of desinformatie.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}