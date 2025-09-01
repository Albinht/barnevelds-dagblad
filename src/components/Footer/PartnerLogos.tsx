import Image from 'next/image'
import Link from 'next/link'
import { partnerLogos, PartnerLogo } from '@/config/partnerLogos'
import { footerContent } from '@/config/footerConfig'

export default function PartnerLogos() {
  return (
    <section className="bg-gray-100 py-6 md:py-8 border-t border-gray-200">
      <div className="container mx-auto px-4 lg:pl-32">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6">
          {/* Partner Logos */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 lg:gap-8">
            {partnerLogos.map((partner: PartnerLogo) => (
              <div key={partner.name} className="flex-shrink-0">
                {partner.href ? (
                  <a
                    href={partner.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:opacity-75 transition-opacity duration-200"
                    aria-label={`Bezoek ${partner.name}`}
                  >
                    <Image
                      src={partner.logo}
                      alt={partner.alt}
                      width={80}
                      height={40}
                      className="h-8 md:h-10 w-auto grayscale hover:grayscale-0 transition-all duration-200"
                    />
                  </a>
                ) : (
                  <Image
                    src={partner.logo}
                    alt={partner.alt}
                    width={80}
                    height={40}
                    className="h-8 md:h-10 w-auto grayscale"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Copyright and Legal Links */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-2 md:gap-4 text-center lg:text-right">
            <div className="text-xs md:text-sm text-gray-600">
              © {footerContent.copyright.year} {footerContent.copyright.text}
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 md:gap-1 text-xs text-gray-500">
              {footerContent.quickLinks.map((link, index) => (
                <span key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-blue transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                  {index < footerContent.quickLinks.length - 1 && (
                    <span className="mx-1 md:mx-2">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}