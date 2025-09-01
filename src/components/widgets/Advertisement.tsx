interface AdvertisementProps {
  height?: number
  className?: string
}

export default function Advertisement({ 
  height = 250, 
  className = "" 
}: AdvertisementProps) {
  // In a real implementation, this would integrate with Google AdSense, 
  // or other ad networks using the slot parameter
  
  return (
    <div 
      className={`bg-gray-100 rounded-lg text-center border-2 border-dashed border-gray-300 flex flex-col items-center justify-center ${className}`}
      style={{ minHeight: `${height}px` }}
    >
      <div className="p-6 text-center">
        <div className="mb-3">
          <h4 className="text-brand-blue text-lg font-bold font-newspaper mb-2">
            Jouw advertentie hier?
          </h4>
          <p className="text-gray-600 text-sm font-medium mb-1">
            Bereik 75.000+ Barnevelders
          </p>
        </div>
        <div className="mt-4">
          <a 
            href="mailto:info@barneveldsdagblad.nl?subject=Advertentie%20plaatsing%20interesse" 
            className="inline-flex items-center text-brand-blue hover:text-blue-700 text-sm font-semibold transition-colors group"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            info@barneveldsdagblad.nl
          </a>
        </div>
      </div>
    </div>
  )
}

// Predefined ad sizes for common placements
export const AdSizes = {
  BANNER: { width: 728, height: 90 },
  RECTANGLE: { width: 300, height: 250 },
  SKYSCRAPER: { width: 300, height: 600 },
  LEADERBOARD: { width: 970, height: 250 },
  MOBILE_BANNER: { width: 320, height: 50 },
  SQUARE: { width: 250, height: 250 }
} as const