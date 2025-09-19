'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BDLogo from './BDLogo'
import UtilityBar from './UtilityBar'
import Header from './Header'
import SubNavigation from './SubNavigation'
import MobileHeader from './MobileHeader'

export default function HeaderContainer() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative">
      {/* Desktop Header sections */}
      <div className="hidden lg:block">
        {/* Static header */}
        <div className={mounted && isScrolled ? 'invisible' : 'visible'}>
          <UtilityBar />
          <div className="relative">
            <Link href="/" className="absolute top-5 left-4 md:left-8 xl:left-32 z-50 hover:scale-105 transition-transform duration-200">
              <div className="w-[85px] md:w-[95px] xl:w-[105px]">
                <BDLogo size={105} isOverlay={true} className="max-w-full" />
              </div>
            </Link>
            <Header />
          </div>
          <SubNavigation />
        </div>
        
        {/* Sticky header for desktop */}
        <div className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-lg transition-transform duration-300 ${mounted && isScrolled ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="bg-brand-blue">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between py-2">
                <Link href="/" className="flex items-center">
                  <BDLogo size={50} />
                </Link>
                <nav className="flex-1 ml-8">
                  <ul className="flex items-center space-x-6 font-newspaper font-bold uppercase text-white tracking-newspaper text-sm">
                    <li><Link href="/" className="hover:text-brand-yellow">NIEUWS</Link></li>
                    <li><Link href="/regio" className="hover:text-brand-yellow">REGIO</Link></li>
                    <li><Link href="/sport" className="hover:text-brand-yellow">SPORT</Link></li>
                    <li><Link href="/show" className="hover:text-brand-yellow">SHOW</Link></li>
                    <li><Link href="/kijk" className="hover:text-brand-yellow">KIJK</Link></li>
                    <li><Link href="/podcast" className="hover:text-brand-yellow">PODCAST</Link></li>
                    <li><Link href="/puzzel" className="hover:text-brand-yellow">PUZZEL</Link></li>
                  </ul>
                </nav>
                <div className="flex items-center space-x-3">
                  <Link href="/abonneren" className="bg-brand-yellow text-black font-bold px-3 py-1.5 rounded text-sm hover:bg-yellow-400">
                    Abonneren
                  </Link>
                  <Link href="/inloggen" className="bg-brand-darkred text-white font-bold px-3 py-1.5 rounded text-sm hover:bg-red-800">
                    Inloggen
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Header - Sticky with integrated hamburger */}
      <MobileHeader />
    </div>
  )
}