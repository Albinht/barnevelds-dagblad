'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const mainNavItems = [
    { href: '/', label: 'NIEUWS' },
    { href: '/regio', label: 'REGIO' },
    { href: '/sport', label: 'SPORT' },
    { href: '/show', label: 'SHOW' },
    { href: '/kijk', label: 'KIJK' },
    { href: '/podcast', label: 'PODCAST' },
    { href: '/puzzel', label: 'PUZZEL' },
  ]

  const subNavItems = [
    { href: '/geldmaand', label: 'Geldmaand' },
    { href: '/mijn-gemeente', label: 'Mijn Gemeente' },
    { href: '/praat-mee', label: 'Praat mee' },
    { href: '/auto', label: 'Auto' },
    { href: '/geld', label: 'Geld' },
    { href: '/koken-eten', label: 'Koken & Eten' },
    { href: '/wonen', label: 'Wonen' },
    { href: '/gezond', label: 'Gezond' },
    { href: '/achter-de-schermen', label: 'Achter de Schermen' },
  ]

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-[60] p-2 rounded-lg bg-brand-blue text-white"
        aria-label="Toggle navigation menu"
      >
        <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
          <span className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 z-[55] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`lg:hidden fixed top-0 right-0 w-[85%] max-w-sm h-full bg-white z-[58] transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 pt-16">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="search"
                placeholder="Zoeken..."
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-blue"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 mb-6">
            <Link 
              href="/abonneren"
              onClick={handleLinkClick}
              className="bg-brand-yellow text-black font-bold px-4 py-3 rounded-lg text-center hover:bg-yellow-400 transition-colors"
            >
              Abonneren
            </Link>
            <Link 
              href="/inloggen"
              onClick={handleLinkClick}
              className="bg-brand-darkred text-white font-bold px-4 py-3 rounded-lg text-center hover:bg-red-800 transition-colors"
            >
              Inloggen
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className="border-t border-gray-200 pt-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Hoofdmenu</h3>
            <ul className="space-y-2">
              {mainNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`block py-3 px-4 font-bold text-gray-800 hover:bg-gray-100 rounded-lg transition-colors ${
                      pathname === item.href ? 'bg-brand-blue/10 text-brand-blue' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sub Navigation */}
          <nav className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Meer</h3>
            <ul className="space-y-2">
              {subNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
                      pathname === item.href ? 'bg-brand-blue/10 text-brand-blue' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Additional Links */}
          <nav className="border-t border-gray-200 pt-6 mt-6 pb-8">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/familieberichten"
                  onClick={handleLinkClick}
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Familieberichten
                </Link>
              </li>
              <li>
                <Link
                  href="/adverteren"
                  onClick={handleLinkClick}
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Adverteren
                </Link>
              </li>
              <li>
                <Link
                  href="/weer"
                  onClick={handleLinkClick}
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Weer
                </Link>
              </li>
              <li>
                <Link
                  href="/tv-gids"
                  onClick={handleLinkClick}
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  TV Gids
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}