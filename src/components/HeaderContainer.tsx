import Link from 'next/link'
import BDLogo from './BDLogo'
import UtilityBar from './UtilityBar'
import Header from './Header'
import SubNavigation from './SubNavigation'

export default function HeaderContainer() {
  return (
    <div className="relative">
      {/* Overlay Logo - positioned absolutely to span all header sections */}
      <Link href="/" className="absolute top-5 left-32 z-50 hover:scale-105 transition-transform duration-200">
        <BDLogo 
          size={105} 
          isOverlay={true}
        />
      </Link>
      
      {/* Header sections with proper spacing for logo */}
      <UtilityBar />
      <Header />
      <SubNavigation />
    </div>
  )
}