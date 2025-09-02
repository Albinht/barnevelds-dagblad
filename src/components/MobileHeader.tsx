'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MobileNavigation from './MobileNavigation'
import MobileSearch from './MobileSearch'
import BDLogo from './BDLogo'

export default function MobileHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showDate, setShowDate] = useState(true)
  const [currentDate, setCurrentDate] = useState('')
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    setCurrentDate(new Date().toLocaleDateString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }))
    
    const handleScroll = () => {
      const scrolled = window.scrollY > 10
      setIsScrolled(scrolled)
      setShowDate(window.scrollY < 50) // Hide date when scrolled more than 50px
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`lg:hidden sticky top-0 z-50 bg-white transition-all duration-300 ${mounted && isScrolled ? 'shadow-lg' : 'shadow-md'}`}>
      {/* Top Bar with Date - Collapsible on scroll */}
      <div className={`bg-gray-100 px-4 text-center overflow-hidden transition-all duration-300 ${mounted && showDate ? 'py-1 max-h-10' : 'py-0 max-h-0'}`}>
        <p className="text-xs text-gray-600">{mounted ? currentDate : ''}</p>
      </div>
      
      {/* Main Mobile Header */}
      <header className="bg-brand-blue">
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between transition-all duration-300 ${mounted && isScrolled ? 'py-2' : 'py-3'}`}>
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <BDLogo size={mounted && isScrolled ? 40 : 45} />
            </Link>
            
            {/* Search and Menu Buttons */}
            <div className="flex items-center">
              <MobileSearch />
              <MobileNavigation />
            </div>
          </div>
        </div>
      </header>
      
      {/* Quick Links Bar */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex items-center space-x-4 px-4 py-2 text-xs font-medium whitespace-nowrap">
          <Link href="/weer" className="text-gray-700 hover:text-brand-blue">
            Weer
          </Link>
          <Link href="/tv-gids" className="text-gray-700 hover:text-brand-blue">
            TV Gids
          </Link>
          <Link href="/familieberichten" className="text-gray-700 hover:text-brand-blue">
            Familieberichten
          </Link>
          <Link href="/digitale-krant" className="text-brand-blue font-bold">
            Digitale Krant
          </Link>
          <Link href="/112-meldingen" className="text-red-600 font-bold">
            112 Meldingen
          </Link>
        </div>
      </div>
    </div>
  )
}