import Link from 'next/link'
import { getAllArticles } from '@/lib/articles-db'
import { formatTime } from '@/lib/dateUtils'

// Determine emergency type from title or content
function getEmergencyType(title: string, content: string = ''): string {
  const text = (title + ' ' + content).toLowerCase()
  
  if (text.includes('brand') || text.includes('vuur') || text.includes('rook')) {
    return 'Brandweer'
  } else if (text.includes('ambulance') || text.includes('medisch') || text.includes('gewond') || text.includes('reanimatie')) {
    return 'Ambulance'
  } else if (text.includes('politie') || text.includes('ongeval') || text.includes('aanrijding') || text.includes('inbraak')) {
    return 'Politie'
  }
  return 'Melding'
}

// Extract location from title or excerpt
function getLocation(title: string, excerpt: string = ''): string {
  // Common location patterns
  const locations = ['Barneveld', 'Voorthuizen', 'Garderen', 'Kootwijkerbroek', 'Terschuur', 'Zwartebroek']
  const text = title + ' ' + excerpt
  
  // Check for street names
  if (text.includes('straat') || text.includes('weg') || text.includes('laan') || text.includes('plein')) {
    const match = text.match(/([A-Z][a-z]+(?:straat|weg|laan|plein))/);
    if (match) return match[1]
  }
  
  // Check for known locations
  for (const location of locations) {
    if (text.includes(location)) {
      return location
    }
  }
  
  // Check for A-roads
  const aRoadMatch = text.match(/A\d+/)
  if (aRoadMatch) {
    return aRoadMatch[0] + ' Barneveld'
  }
  
  return 'Barneveld e.o.'
}

export default async function Emergency112Widget() {
  try {
    // Get all articles from database
    const allArticles = await getAllArticles()
    
    // Filter for 112 articles
    const emergencyArticles = allArticles
      .filter(article => 
        article.published && (
          article.category === '112' || 
          article.category === '112 Meldingen' ||
          article.tags?.includes('112')
        )
      )
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt)
        const dateB = new Date(b.publishedAt || b.createdAt)
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, 3) // Get 3 most recent

    // If no 112 articles, don't render the widget
    if (emergencyArticles.length === 0) {
      return null
    }

    return (
      <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
        {/* Red Header with pulsing effect */}
        <div className="bg-red-600 px-4 py-3 relative">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-sm uppercase tracking-wide">
              112 MELDINGEN
            </h3>
            <span className="bg-white text-red-600 px-2 py-0.5 text-xs font-bold rounded animate-pulse">
              URGENT
            </span>
          </div>
        </div>
        
        {/* Emergency Articles List */}
        <div className="divide-y divide-gray-100">
          {emergencyArticles.map((article) => {
            const emergencyType = getEmergencyType(article.title, article.excerpt)
            const location = getLocation(article.title, article.excerpt)
            const time = formatTime(article.publishedAt || article.createdAt)
            
            return (
              <Link 
                key={article.id}
                href={`/artikel/${article.slug}`}
                className="block p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  {/* Emergency Type Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      emergencyType === 'Brandweer' ? 'bg-orange-100 text-orange-600' :
                      emergencyType === 'Ambulance' ? 'bg-green-100 text-green-600' :
                      emergencyType === 'Politie' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {emergencyType === 'Brandweer' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                      )}
                      {emergencyType === 'Ambulance' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                      {emergencyType === 'Politie' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                        </svg>
                      )}
                      {emergencyType === 'Melding' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  {/* Emergency Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-900">
                        {emergencyType}
                      </span>
                      <span className="text-xs text-gray-500">
                        {time}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {location}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        
        {/* View All Button */}
        <div className="p-4 bg-gray-50">
          <Link 
            href="/112-meldingen"
            className="block bg-red-600 text-white font-bold text-center py-2 px-4 rounded hover:bg-red-700 transition-colors text-sm"
          >
            ALLE 112 MELDINGEN →
          </Link>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading 112 widget:', error)
    return null
  }
}