'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MobileNavigation from './MobileNavigation'
import BDLogo from './BDLogo'

export default function MobileHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showDate, setShowDate] = useState(true)
  
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10
      setIsScrolled(scrolled)
      setShowDate(window.scrollY < 50) // Hide date when scrolled more than 50px
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const currentDate = new Date().toLocaleDateString('nl-NL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className={`lg:hidden sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-md'}`}>
      {/* Top Bar with Date - Collapsible on scroll */}
      <div className={`bg-gray-100 px-4 text-center overflow-hidden transition-all duration-300 ${showDate ? 'py-1 max-h-10' : 'py-0 max-h-0'}`}>
        <p className="text-xs text-gray-600">{currentDate}</p>
      </div>
      
      {/* Main Mobile Header */}
      <header className="bg-brand-blue">
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'py-1' : 'py-2'}`}>
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <BDLogo size={isScrolled ? 35 : 40} />
            </Link>
            
            {/* Center Content */}
            <div className="flex-1 text-center px-2">
              <h1 className={`text-white font-bold uppercase tracking-wide transition-all duration-300 ${isScrolled ? 'text-xs' : 'text-sm'}`}>
                Barnevelds Dagblad
              </h1>
              <p className={`text-white/80 mt-0.5 transition-all duration-300 ${isScrolled ? 'hidden' : 'text-xs hidden sm:block'}`}>
                Het laatste nieuws uit de regio
              </p>
            </div>
            
            {/* Hamburger Menu Button */}
            <MobileNavigation />
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
        </div>
      </div>
    </div>
  )
}