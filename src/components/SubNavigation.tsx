import Link from 'next/link'

export default function SubNavigation() {
  return (
    <div className="hidden lg:block bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <nav className="py-3 lg:pl-32 overflow-x-auto">
          <ul className="flex items-center space-x-4 xl:space-x-8 text-sm font-newspaper whitespace-nowrap">
            <li>
              <Link href="/geldmaand" className="text-brand-blue font-bold hover:text-blue-700 transition-colors">
                Geldmaand
              </Link>
            </li>
            <li>
              <Link href="/mijn-gemeente" className="text-gray-700 hover:text-brand-blue transition-colors">
                Mijn Gemeente
              </Link>
            </li>
            <li>
              <Link href="/praat-mee" className="text-gray-700 hover:text-brand-blue transition-colors">
                Praat mee
              </Link>
            </li>
            <li>
              <Link href="/auto" className="text-gray-700 hover:text-brand-blue transition-colors">
                Auto
              </Link>
            </li>
            <li>
              <Link href="/geld" className="text-gray-700 hover:text-brand-blue transition-colors">
                Geld
              </Link>
            </li>
            <li>
              <Link href="/koken-eten" className="text-gray-700 hover:text-brand-blue transition-colors">
                Koken & Eten
              </Link>
            </li>
            <li>
              <Link href="/wonen" className="text-gray-700 hover:text-brand-blue transition-colors">
                Wonen
              </Link>
            </li>
            <li>
              <Link href="/gezond" className="text-gray-700 hover:text-brand-blue transition-colors">
                Gezond
              </Link>
            </li>
            <li>
              <Link href="/achter-de-schermen" className="text-gray-700 hover:text-brand-blue transition-colors">
                Achter de Schermen
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}