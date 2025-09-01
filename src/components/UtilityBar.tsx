import Link from 'next/link'

export default function UtilityBar() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-sm" style={{ paddingLeft: '120px' }}>
          <div className="flex items-center space-x-6">
            <Link href="/weer" className="flex items-center space-x-1 text-gray-700 hover:text-brand-blue transition-colors">
              <span>Weer de komende dagen</span>
            </Link>
            <Link href="/tv-gids" className="flex items-center space-x-1 text-gray-700 hover:text-brand-blue transition-colors">
              <span>TV-Gids</span>
            </Link>
            <Link href="/digitale-krant" className="flex items-center space-x-1 text-gray-700 hover:text-brand-blue transition-colors">
              <span>Digitale krant</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link href="/familieberichten" className="text-gray-700 hover:text-brand-blue transition-colors">
              Familieberichten
            </Link>
            <Link href="/klantenservice" className="text-gray-700 hover:text-brand-blue transition-colors">
              Klantenservice
            </Link>
            <Link href="/adverteren" className="text-gray-700 hover:text-brand-blue transition-colors">
              Adverteren
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}