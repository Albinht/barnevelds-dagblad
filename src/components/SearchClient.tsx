'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDateDutch } from '@/lib/utils/dateUtils'

interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content?: string
  image_url: string
  category: string
  tags?: string[]
  premium: boolean
  published_at: string
  author?: string
  views: number
}

interface Business {
  id: string
  name: string
  description: string
  category: string
  logo_url?: string
  website?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  is_spotlight: boolean
}

interface SearchResults {
  articles: Article[]
  businesses: Business[]
}

interface SearchClientProps {
  initialQuery: string
}

export default function SearchClient({ initialQuery }: SearchClientProps) {
  const [query, setQuery] = useState(initialQuery)
  const [searchInput, setSearchInput] = useState(initialQuery)
  const [results, setResults] = useState<SearchResults>({ articles: [], businesses: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const searchContent = async () => {
      console.log('SearchClient: Starting search for query:', query)
      
      if (!query.trim()) {
        console.log('SearchClient: Empty query, skipping search')
        setResults({ articles: [], businesses: [] })
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        // Search articles
        console.log('SearchClient: Fetching articles...')
        const articlesResponse = await fetch(`/api/articles/search?q=${encodeURIComponent(query)}`)
        const articles = await articlesResponse.json()
        console.log('SearchClient: Articles response:', articles)

        // Search businesses
        console.log('SearchClient: Fetching businesses...')
        const businessesResponse = await fetch(`/api/businesses/search?q=${encodeURIComponent(query)}`)
        const businessesData = await businessesResponse.json()
        console.log('SearchClient: Businesses response:', businessesData)

        // Handle API errors
        const businesses = Array.isArray(businessesData) ? businessesData : []
        if (!Array.isArray(businessesData) && businessesData.error) {
          console.error('Business search API error:', businessesData.details)
        }

        setResults({ articles, businesses })
      } catch (error) {
        console.error('SearchClient: Search error:', error)
        setResults({ articles: [], businesses: [] })
      } finally {
        setLoading(false)
      }
    }

    searchContent()
  }, [query])

  const totalResults = results.articles.length + results.businesses.length

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setQuery(searchInput.trim())
    }
  }

  return (
    <div className="w-full">
        {/* Search Form */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Zoeken</h1>
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Zoeken..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-blue"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Zoeken
              </button>
            </div>
          </form>
        </div>
        
        {/* Search Results Header */}
        {query && (
          <div className="mb-6">
            <p className="text-gray-600 text-lg">
              {loading ? (
                'Zoeken...'
              ) : (
                <>
                  {totalResults} {totalResults === 1 ? 'resultaat' : 'resultaten'} voor "<strong>{query}</strong>"
                </>
              )}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
          </div>
        )}

        {/* No Results */}
        {!loading && query && totalResults === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Geen resultaten gevonden voor "{query}"</p>
            <p className="text-sm text-gray-500">Probeer andere zoektermen of controleer de spelling</p>
          </div>
        )}

        {/* Results */}
        {!loading && totalResults > 0 && (
          <div className="space-y-8">
            {/* Business Results */}
            {results.businesses.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">
                  Bedrijven ({results.businesses.length})
                </h2>
                <div className="grid gap-4">
                  {results.businesses.map((business) => (
                    <Link
                      key={business.id}
                      href={business.website || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        {business.logo_url && (
                          <div className="flex-shrink-0">
                            <Image
                              src={business.logo_url}
                              alt={business.name}
                              width={60}
                              height={60}
                              className="rounded-lg object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1 text-brand-blue hover:underline">
                            {business.name}
                          </h3>
                          {business.description && (
                            <p className="text-gray-600 text-sm line-clamp-2">{business.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            {business.category && (
                              <span className="bg-gray-100 px-2 py-1 rounded">{business.category}</span>
                            )}
                            {business.address && <span>{business.address}</span>}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Article Results */}
            {results.articles.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">
                  Artikelen ({results.articles.length})
                </h2>
                <div className="space-y-4">
                  {results.articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/artikel/${article.slug}`}
                      className="block group"
                    >
                      <article className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                          {article.image_url && (
                            <div className="flex-shrink-0">
                              <Image
                                src={article.image_url}
                                alt={article.title}
                                width={120}
                                height={80}
                                className="rounded-lg object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1 group-hover:text-brand-blue transition-colors">
                              {article.title}
                            </h3>
                            {article.excerpt && (
                              <p className="text-gray-600 text-sm line-clamp-2 mb-2">{article.excerpt}</p>
                            )}
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <span className="uppercase text-brand-darkred font-bold">{article.category}</span>
                              <span>{formatDateDutch(article.published_at)}</span>
                              {article.author && <span>Door {article.author}</span>}
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
    </div>
  )
}