export interface FooterLinkSection {
  title: string
  links: FooterLink[]
}

export interface FooterLink {
  label: string
  href: string
  external?: boolean
}

export const footerSections: FooterLinkSection[] = [
  {
    title: "Algemeen",
    links: [
      { label: "Colofon", href: "/colofon" },
      { label: "Auteursrecht", href: "/auteursrecht" },
      { label: "Abonnementsvoorwaarden", href: "/abonnementsvoorwaarden" },
      { label: "Gebruiksvoorwaarden", href: "/gebruiksvoorwaarden" },
      { label: "Privacybeleid", href: "/privacy" },
      { label: "Toegankelijkheidsverklaring", href: "/toegankelijkheid" },
      { label: "Cookiebeleid", href: "/cookies" },
      { label: "Vacatures", href: "/vacatures" },
      { label: "Privacy-instellingen", href: "/privacy-instellingen" }
    ]
  },
  {
    title: "Service", 
    links: [
      { label: "Klantenservice", href: "/klantenservice" },
      { label: "Bezorgklacht indienen", href: "/bezorgklacht" },
      { label: "Bezorging pauzeren", href: "/bezorging-pauzeren" },
      { label: "Bezorgadres wijzigen", href: "/bezorgadres-wijzigen" },
      { label: "Adverteren", href: "/adverteren" },
      { label: "Losse verkoop", href: "/losse-verkoop" }
    ]
  },
  {
    title: "Mijn Omgeving",
    links: [
      { label: "Mijn account", href: "/account" },
      { label: "Mijn abonnement(en)", href: "/mijn-abonnementen" }
    ]
  },
  {
    title: "Meer BD",
    links: [
      { label: "Abonnee worden", href: "/abonneren" },
      { label: "Digitale krant", href: "/digitale-krant" },
      { label: "Nieuwsbrieven", href: "/nieuwsbrieven" },
      { label: "Webwinkel", href: "/webwinkel" },
      { label: "RSS", href: "/rss" }
    ]
  }
]

export const footerContent = {
  newsletter: {
    title: "Meld je aan voor de nieuwsbrief",
    subtitle: "Wil je elke dag het laatste nieuws ontvangen?",
    placeholder: "E-mailadres",
    buttonText: "Aanmelden"
  },
  slogan: {
    main: "Wij zijn altijd op zoek naar het laatste nieuws",
    cta: "Tip de redactie »",
    ctaHref: "/tip-redactie"
  },
  copyright: {
    text: "Barnevelds Dagblad – onderdeel van BD Nieuwsmedia",
    year: new Date().getFullYear()
  },
  quickLinks: [
    { label: "Cookies", href: "/cookies" },
    { label: "Privacy", href: "/privacy" },
    { label: "Disclaimer", href: "/disclaimer" }
  ]
}