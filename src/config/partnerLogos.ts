export interface PartnerLogo {
  name: string
  logo: string
  href?: string
  alt: string
}

export const partnerLogos: PartnerLogo[] = [
  {
    name: "Barnevelds Dagblad",
    logo: "/Barneveldsdagblad logo.png",
    href: "https://www.barneveldsdagblad.nl",
    alt: "Barnevelds Dagblad logo"
  },
  {
    name: "Gemeente Barneveld", 
    logo: "/assets/partners/gemeente-barneveld.png",
    href: "https://barneveld.nl",
    alt: "Gemeente Barneveld logo"
  }
]

export const appBadges = [
  {
    name: "Google Play",
    href: "https://play.google.com/store/apps/details?id=nl.barnevelds.dagblad",
    image: "/assets/badges/google-play-badge.png",
    alt: "Download op Google Play"
  },
  {
    name: "App Store",
    href: "https://apps.apple.com/nl/app/barnevelds-dagblad/id123456789",
    image: "/assets/badges/app-store-badge.png", 
    alt: "Download in de App Store"
  }
]