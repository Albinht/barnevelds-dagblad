'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Bedrijf } from '@/types/bedrijf'
import { useState } from 'react'

interface SpotlightBedrijvenProps {
  bedrijven: Bedrijf[]
}

export default function SpotlightBedrijven({ bedrijven }: SpotlightBedrijvenProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  const handleImageError = (bedrijfId: string) => {
    setFailedImages(prev => new Set(prev).add(bedrijfId))
  }

  const getImageSrc = (bedrijf: Bedrijf) => {
    if (failedImages.has(bedrijf.id)) {
      return '/barneveldsdagblad.jpeg'
    }
    
    if (!bedrijf.logo) {
      return '/barneveldsdagblad.jpeg'
    }
    
    // Fix malformed URLs
    let logo = bedrijf.logo
    if (logo.includes('localhost:3000/public/')) {
      logo = logo.replace('localhost:3000/public/', '/')
    }
    if (logo.endsWith('/') && !logo.endsWith('.svg/')) {
      logo = logo.slice(0, -1)
    }
    
    return logo
  }

  if (!bedrijven || bedrijven.length === 0) return null

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
      {/* Blue Header */}
      <div className="bg-[#0F47AF] px-4 py-3">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">
          BEDRIJVEN IN DE SPOTLIGHT
        </h3>
      </div>
      
      {/* Business List */}
      <div className="divide-y divide-gray-100">
        {bedrijven.slice(0, 5).map((bedrijf, index) => (
          <div key={bedrijf.id} className="relative">
            {/* Desktop Layout */}
            {bedrijf.website ? (
              <a 
                href={bedrijf.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden md:flex items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {/* Thumbnail - 30% width */}
                <div className="w-20 h-20 flex-shrink-0 relative overflow-hidden rounded mr-4">
                  <Image
                    src={getImageSrc(bedrijf)}
                    alt={bedrijf.naam}
                    fill
                    className="object-cover"
                    sizes="80px"
                    onError={() => handleImageError(bedrijf.id)}
                  />
                </div>
                
                {/* Content - 70% width */}
                <div className="flex-1 min-w-0 pr-12">
                  {/* Label Badge */}
                  {bedrijf.label && (
                    <div className="mb-2">
                      {bedrijf.label === 'PREMIUM' ? (
                        <span className="inline-block bg-[#FCDD0C] text-black px-2 py-1 text-xs font-bold rounded uppercase">
                          PREMIUM
                        </span>
                      ) : (
                        <span className="inline-block bg-[#0F47AF] text-white px-2 py-1 text-xs font-bold rounded uppercase">
                          NIEUW
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Business Name */}
                  <h4 className="font-bold text-black text-base mb-1 line-clamp-2 leading-tight group-hover:text-[#0F47AF]">
                    {bedrijf.naam}
                  </h4>
                  
                  {/* Tagline/Description */}
                  <p className="text-gray-600 text-sm line-clamp-1 mb-1">
                    {bedrijf.beschrijving}
                  </p>
                  
                  {/* Website indicator */}
                  <p className="text-xs text-[#0F47AF] font-medium">
                    Bezoek website →
                  </p>
                </div>
                
                {/* Ranking Number */}
                <div className="absolute top-4 right-4">
                  <span className="text-4xl font-bold text-gray-300">
                    {index + 1}
                  </span>
                </div>
              </a>
            ) : (
              <div className="hidden md:flex items-center p-4 hover:bg-gray-50 transition-colors">
                {/* Thumbnail - 30% width */}
                <div className="w-20 h-20 flex-shrink-0 relative overflow-hidden rounded mr-4">
                  <Image
                    src={getImageSrc(bedrijf)}
                    alt={bedrijf.naam}
                    fill
                    className="object-cover"
                    sizes="80px"
                    onError={() => handleImageError(bedrijf.id)}
                  />
                </div>
                
                {/* Content - 70% width */}
                <div className="flex-1 min-w-0 pr-12">
                  {/* Label Badge */}
                  {bedrijf.label && (
                    <div className="mb-2">
                      {bedrijf.label === 'PREMIUM' ? (
                        <span className="inline-block bg-[#FCDD0C] text-black px-2 py-1 text-xs font-bold rounded uppercase">
                          PREMIUM
                        </span>
                      ) : (
                        <span className="inline-block bg-[#0F47AF] text-white px-2 py-1 text-xs font-bold rounded uppercase">
                          NIEUW
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Business Name */}
                  <h4 className="font-bold text-black text-base mb-1 line-clamp-2 leading-tight">
                    {bedrijf.naam}
                  </h4>
                  
                  {/* Tagline/Description */}
                  <p className="text-gray-600 text-sm line-clamp-1">
                    {bedrijf.beschrijving}
                  </p>
                </div>
                
                {/* Ranking Number */}
                <div className="absolute top-4 right-4">
                  <span className="text-4xl font-bold text-gray-300">
                    {index + 1}
                  </span>
                </div>
              </div>
            )}
            
            {/* Mobile/Tablet Layout */}
            {bedrijf.website ? (
              <a 
                href={bedrijf.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="md:hidden block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="relative">
                  {/* Thumbnail above */}
                  <div className="w-full h-24 relative overflow-hidden rounded mb-3">
                    <Image
                      src={getImageSrc(bedrijf)}
                      alt={bedrijf.naam}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      onError={() => handleImageError(bedrijf.id)}
                    />
                  </div>
                  
                  {/* Content below */}
                  <div className="relative pr-8">
                    {/* Label Badge */}
                    {bedrijf.label && (
                      <div className="mb-2">
                        {bedrijf.label === 'PREMIUM' ? (
                          <span className="inline-block bg-[#FCDD0C] text-black px-2 py-1 text-xs font-bold rounded uppercase">
                            PREMIUM
                          </span>
                        ) : (
                          <span className="inline-block bg-[#0F47AF] text-white px-2 py-1 text-xs font-bold rounded uppercase">
                            NIEUW
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Business Name */}
                    <h4 className="font-bold text-black text-sm mb-1 line-clamp-2 leading-tight">
                      {bedrijf.naam}
                    </h4>
                    
                    {/* Tagline/Description */}
                    <p className="text-gray-600 text-xs line-clamp-1 mb-1">
                      {bedrijf.beschrijving}
                    </p>
                    
                    {/* Website indicator */}
                    <p className="text-xs text-[#0F47AF] font-medium">
                      Bezoek website →
                    </p>
                    
                    {/* Ranking Number */}
                    <div className="absolute top-0 right-0">
                      <span className="text-2xl font-bold text-gray-300">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ) : (
              <div className="md:hidden p-4 hover:bg-gray-50 transition-colors">
                <div className="relative">
                  {/* Thumbnail above */}
                  <div className="w-full h-24 relative overflow-hidden rounded mb-3">
                    <Image
                      src={getImageSrc(bedrijf)}
                      alt={bedrijf.naam}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      onError={() => handleImageError(bedrijf.id)}
                    />
                  </div>
                  
                  {/* Content below */}
                  <div className="relative pr-8">
                    {/* Label Badge */}
                    {bedrijf.label && (
                      <div className="mb-2">
                        {bedrijf.label === 'PREMIUM' ? (
                          <span className="inline-block bg-[#FCDD0C] text-black px-2 py-1 text-xs font-bold rounded uppercase">
                            PREMIUM
                          </span>
                        ) : (
                          <span className="inline-block bg-[#0F47AF] text-white px-2 py-1 text-xs font-bold rounded uppercase">
                            NIEUW
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Business Name */}
                    <h4 className="font-bold text-black text-sm mb-1 line-clamp-2 leading-tight">
                      {bedrijf.naam}
                    </h4>
                    
                    {/* Tagline/Description */}
                    <p className="text-gray-600 text-xs line-clamp-1">
                      {bedrijf.beschrijving}
                    </p>
                    
                    {/* Ranking Number */}
                    <div className="absolute top-0 right-0">
                      <span className="text-2xl font-bold text-gray-300">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Action Buttons */}
      <div className="p-4 bg-gray-50">
        <Link 
          href="/bedrijven"
          className="block bg-[#0F47AF] text-white font-bold text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm mb-3"
        >
          ALLE BEDRIJVEN →
        </Link>
        
        <div className="text-center">
          <Link 
            href="/admin/bedrijf-toevoegen"
            className="text-xs text-[#0F47AF] hover:text-blue-700 font-medium"
          >
            Uw bedrijf ook in de spotlight?
          </Link>
        </div>
      </div>
    </div>
  )
}