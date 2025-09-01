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
          <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <BDLogo size={isScrolled ? 40 : 45} />
            </Link>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Link 
                href="/abonneren"
                className="bg-brand-yellow text-black font-bold px-3 py-1.5 rounded text-xs uppercase hover:bg-yellow-400 transition-colors"
              >
                Abonneren
              </Link>
              <Link 
                href="/inloggen"
                className="bg-brand-darkred text-white font-bold px-3 py-1.5 rounded text-xs uppercase hover:bg-red-800 transition-colors"
              >
                Inloggen
              </Link>
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