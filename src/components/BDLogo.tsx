import Image from 'next/image'

interface BDLogoProps {
  size?: number
  className?: string
  isOverlay?: boolean
}

export default function BDLogo({ size = 40, className = "", isOverlay = false }: BDLogoProps) {
  const overlayClasses = isOverlay 

  return (
    <div 
      className={`flex items-center justify-center ${overlayClasses} ${className}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`
      }}
    >
      <Image
        src="/Barneveldsdagblad logo.webp"
        alt="Barnevelds Dagblad Logo"
        width={size - 8}
        height={size - 8}
        className="object-contain"
      />
    </div>
  )
}