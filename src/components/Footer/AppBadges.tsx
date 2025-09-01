import Image from 'next/image'
import { appBadges } from '@/config/partnerLogos'

export default function AppBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Download de app</h4>
      <div className="flex flex-col space-y-3">
        {appBadges.map((badge) => (
          <a
            key={badge.name}
            href={badge.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:opacity-80 transition-opacity duration-200"
            aria-label={badge.alt}
          >
            <Image
              src={badge.image}
              alt={badge.alt}
              width={140}
              height={42}
              className="h-12 w-auto"
            />
          </a>
        ))}
      </div>
    </div>
  )
}