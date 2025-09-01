import Link from 'next/link'
import BDLogo from './BDLogo'
import UtilityBar from './UtilityBar'
import Header from './Header'
import SubNavigation from './SubNavigation'
import MobileNavigation from './MobileNavigation'

export default function HeaderContainer() {
  return (
    <div className="relative">
      {/* Desktop Logo - positioned absolutely to span all header sections */}
      <Link href="/" className="hidden lg:block absolute top-5 left-8 xl:left-32 z-50 hover:scale-105 transition-transform duration-200">
        <BDLogo 
          size={105} 
          isOverlay={true}
        />
      </Link>
      
      {/* Mobile Logo - centered and smaller */}
      <Link href="/" className="lg:hidden absolute top-3 left-4 z-50">
        <BDLogo 
          size={60} 
          isOverlay={true}
        />
      </Link>
      
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Header sections with proper spacing for logo */}
      <UtilityBar />
      <Header />
      <SubNavigation />
    </div>
  )
}