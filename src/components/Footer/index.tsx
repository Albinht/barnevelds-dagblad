import NewsletterSignup from './NewsletterSignup'
import SloganSection from './SloganSection'
import FooterLinks from './FooterLinks'
import PartnerLogos from './PartnerLogos'
import { FooterProps } from './types'

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`mt-auto ${className}`} role="contentinfo">
      {/* Layer 1: Newsletter CTA */}
      <NewsletterSignup />
      
      {/* Layer 2: Slogan Section */}
      <SloganSection />
      
      {/* Layer 3: Navigation Links */}
      <FooterLinks />
      
      {/* Layer 4: Partner Logos & Copyright */}
      <PartnerLogos />
      
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsMediaOrganization",
            "name": "Barnevelds Dagblad",
            "url": "https://barnevelds-dagblad.nl",
            "logo": "https://barnevelds-dagblad.nl/barneveldsdagblad.jpeg",
            "sameAs": [
              "https://facebook.com/barnevelds-dagblad",
              "https://twitter.com/barnevelds_dagblad",
              "https://instagram.com/barnevelds_dagblad",
              "https://linkedin.com/company/barnevelds-dagblad",
              "https://youtube.com/barnevelds-dagblad"
            ],
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Langstraat 123",
              "addressLocality": "Barneveld",
              "postalCode": "3771 AB",
              "addressCountry": "NL"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+31342123456",
              "contactType": "customer service",
              "availableLanguage": "Dutch"
            },
            "publishingPrinciples": "https://barnevelds-dagblad.nl/auteursrecht",
            "diversityPolicy": "https://barnevelds-dagblad.nl/toegankelijkheid",
            "ethicsPolicy": "https://barnevelds-dagblad.nl/gebruiksvoorwaarden"
          })
        }}
      />
    </footer>
  )
}