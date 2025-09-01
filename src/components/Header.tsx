import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-brand-blue hidden lg:block">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="flex items-center justify-between py-3 lg:pl-32">
          {/* Main Navigation */}
          <nav className="flex items-center flex-1">
            <ul className="flex items-center space-x-4 xl:space-x-8 font-newspaper font-bold uppercase text-white tracking-newspaper text-sm">
              <li>
                <Link href="/" className="hover:text-brand-yellow transition-colors">
                  NIEUWS
                </Link>
              </li>
              <li>
                <Link href="/regio" className="hover:text-brand-yellow transition-colors">
                  REGIO
                </Link>
              </li>
              <li>
                <Link href="/sport" className="hover:text-brand-yellow transition-colors">
                  SPORT
                </Link>
              </li>
              <li>
                <Link href="/show" className="hover:text-brand-yellow transition-colors">
                  SHOW
                </Link>
              </li>
              <li>
                <Link href="/kijk" className="hover:text-brand-yellow transition-colors">
                  KIJK
                </Link>
              </li>
              <li>
                <Link href="/podcast" className="hover:text-brand-yellow transition-colors">
                  PODCAST
                </Link>
              </li>
              <li>
                <Link href="/puzzel" className="hover:text-brand-yellow transition-colors">
                  PUZZEL
                </Link>
              </li>
            </ul>
            
            {/* Search Icon */}
            <button className="ml-6 text-white hover:text-brand-yellow transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Link 
              href="/abonneren"
              className="bg-brand-yellow text-black font-bold px-4 py-2 rounded text-sm hover:bg-yellow-400 transition-colors"
            >
              Abonneren
            </Link>
            <Link 
              href="/inloggen"
              className="bg-brand-darkred text-white font-bold px-4 py-2 rounded text-sm hover:bg-red-800 transition-colors"
            >
              Inloggen
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}