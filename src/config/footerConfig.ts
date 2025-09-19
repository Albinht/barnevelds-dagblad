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
      { label: "Over ons", href: "/over-ons" },
      { label: "Onze missie", href: "/missie" },
      { label: "Redactiestatuut", href: "/redactiestatuut" },
      { label: "Partners", href: "/partners" },
      { label: "Auteursrecht", href: "/auteursrecht" },
      { label: "Gebruiksvoorwaarden", href: "/gebruiksvoorwaarden" },
      { label: "Privacybeleid", href: "/privacy" },
      { label: "Cookiebeleid", href: "/cookies" },
      { label: "Vacatures", href: "/vacatures" }
    ]
  },
  {
    title: "Service",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Tip de redactie", href: "/tip-redactie" },
      { label: "Persbericht insturen", href: "/persbericht" },
      { label: "Adverteren", href: "/adverteren" },
      { label: "Nieuwsbrief", href: "/nieuwsbrief" },
      { label: "Veelgestelde vragen", href: "/faq" },
      { label: "Correcties", href: "/correcties" }
    ]
  },
  {
    title: "Rubrieken",
    links: [
      { label: "112 meldingen", href: "/112-meldingen" },
      { label: "Gemeentenieuws", href: "/gemeente" },
      { label: "Evenementen", href: "/evenementen" },
      { label: "Weer & Verkeer", href: "/weer" },
      { label: "Historie Barneveld", href: "/historie" },
      { label: "Opinie", href: "/opinie" }
    ]
  },
  {
    title: "Voor echte Barnevelders",
    links: [
      { label: "Familieberichten", href: "/familieberichten" },
      { label: "In het zonnetje", href: "/in-het-zonnetje" },
      { label: "Iets melden", href: "/iets-melden" },
      { label: "Evenementenkalender", href: "/evenementenkalender" },
      { label: "Verenigingsnieuws", href: "/verenigingsnieuws" },
      { label: "Buurtinitiatieven", href: "/buurtinitiatieven" },
      { label: "Lokale ondernemers", href: "/lokale-ondernemers" }
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