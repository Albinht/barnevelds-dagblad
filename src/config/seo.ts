export interface SEOConfig {
  title: string
  description: string  
  keywords?: string[]
  image?: string
  canonical?: string
}

export const defaultSEO: SEOConfig = {
  title: "Barnevelds Dagblad - Lokaal nieuws uit Barneveld en omgeving",
  description: "Het laatste lokale nieuws uit Barneveld en omstreken. Sport, politiek, cultuur en meer uit de Gelderse Vallei.",
  keywords: ["barneveld", "nieuws", "lokaal", "dagblad", "gelderse vallei", "regio"],
  image: "/barneveldsdagblad.jpeg"
}

export const categorySEO: Record<string, SEOConfig> = {
  // Main Navigation Categories
  regio: {
    title: "Regionaal Nieuws - Barnevelds Dagblad",
    description: "Regionaal nieuws uit Barneveld en de Gelderse Vallei. Politiek, economie, maatschappij en lokale ontwikkelingen.",
    keywords: ["regio", "barneveld", "gelderland", "lokaal nieuws", "gemeente", "politiek"],
    image: "/barneveldsdagblad.jpeg"
  },
  sport: {
    title: "Sport - Barnevelds Dagblad", 
    description: "Het laatste sportniet uit Barneveld en omgeving. Voetbal, wielrennen, tennis en meer lokale sport.",
    keywords: ["sport", "barneveld", "voetbal", "wielrennen", "tennis", "lokale sport"],
    image: "/barneveldsdagblad.jpeg"
  },
  show: {
    title: "Entertainment - Barnevelds Dagblad", 
    description: "Entertainment nieuws, celebrities, films, muziek en shows vanuit lokaal perspectief.",
    keywords: ["entertainment", "show", "muziek", "film", "celebrities", "cultuur"],
    image: "/barneveldsdagblad.jpeg"
  },
  kijk: {
    title: "TV & Media - Barnevelds Dagblad",
    description: "TV programma's, media nieuws en kijktips vanuit Barneveld en omgeving.", 
    keywords: ["tv", "media", "televisie", "programmas", "kijken", "entertainment"],
    image: "/barneveldsdagblad.jpeg"
  },
  podcast: {
    title: "Podcasts - Barnevelds Dagblad",
    description: "Lokale podcasts en audio content uit Barneveld. Luister naar verhalen uit de regio.",
    keywords: ["podcast", "audio", "verhalen", "interviews", "barneveld", "lokaal"],
    image: "/barneveldsdagblad.jpeg"
  },
  puzzel: {
    title: "Puzzels & Spelletjes - Barnevelds Dagblad",
    description: "Dagelijkse puzzels, kruiswoordraadsels en spelletjes voor de hele familie.",
    keywords: ["puzzel", "kruiswoord", "sudoku", "spelletjes", "familie", "ontspanning"],
    image: "/barneveldsdagblad.jpeg"
  },

  // Sub Navigation Categories
  geldmaand: {
    title: "Geldmaand - Financieel Nieuws - Barnevelds Dagblad",
    description: "Financiële tips, geldzaken en economisch nieuws speciaal voor Geldmaand.",
    keywords: ["geld", "financieel", "economie", "tips", "beleggen", "sparen"],
    image: "/barneveldsdagblad.jpeg"
  },
  "mijn-gemeente": {
    title: "Mijn Gemeente - Barnevelds Dagblad",
    description: "Gemeentelijk nieuws, besluiten en ontwikkelingen in Barneveld en omliggende gemeenten.",
    keywords: ["gemeente", "bestuur", "politiek", "besluiten", "raad", "burgemeester"],
    image: "/barneveldsdagblad.jpeg"
  },
  "praat-mee": {
    title: "Praat Mee - Community - Barnevelds Dagblad", 
    description: "Doe mee aan discussies, deel je mening en praat mee over lokale onderwerpen.",
    keywords: ["discussie", "mening", "community", "praten", "meedoen", "betrokkenheid"],
    image: "/barneveldsdagblad.jpeg"
  },
  auto: {
    title: "Auto & Verkeer - Barnevelds Dagblad",
    description: "Autoniewus, verkeersinformatie en mobiliteit in Barneveld en omgeving.",
    keywords: ["auto", "verkeer", "mobiliteit", "wegen", "transport", "rijden"],
    image: "/barneveldsdagblad.jpeg"
  },
  geld: {
    title: "Geld & Financiën - Barnevelds Dagblad",
    description: "Financieel nieuws, geldzaken en economische ontwikkelingen die jou raken.",
    keywords: ["geld", "financiën", "economie", "inkomen", "belasting", "hypotheek"],
    image: "/barneveldsdagblad.jpeg"
  },
  "koken-eten": {
    title: "Koken & Eten - Barnevelds Dagblad",
    description: "Recepten, restaurant reviews en culinaire tips uit Barneveld en omgeving.",
    keywords: ["koken", "eten", "recepten", "restaurants", "culinair", "food"],
    image: "/barneveldsdagblad.jpeg"
  },
  wonen: {
    title: "Wonen & Lifestyle - Barnevelds Dagblad",
    description: "Woningnitet, interieur tips en lifestyle trends in Barneveld.",
    keywords: ["wonen", "huis", "interieur", "lifestyle", "woontrends", "verhuizen"],
    image: "/barneveldsdagblad.jpeg"
  },
  gezond: {
    title: "Gezond Leven - Barnevelds Dagblad",
    description: "Gezondheidsnieuws, tips voor een gezonde lifestyle en medische ontwikkelingen.",
    keywords: ["gezond", "gezondheid", "medisch", "lifestyle", "fitness", "welzijn"],
    image: "/barneveldsdagblad.jpeg"
  },
  "achter-de-schermen": {
    title: "Achter de Schermen - Barnevelds Dagblad",
    description: "Kijk achter de schermen bij bedrijven, organisaties en events in Barneveld.",
    keywords: ["achter de schermen", "bedrijven", "organisaties", "inside", "verhalen"],
    image: "/barneveldsdagblad.jpeg"
  }
}

export const specialPagesSEO: Record<string, SEOConfig> = {
  "digitale-krant": {
    title: "Digitale Krant - Barnevelds Dagblad",
    description: "Lees de volledige Barnevelds Dagblad online. Alle artikelen en advertenties in digitale vorm.",
    keywords: ["digitale krant", "online lezen", "pdf", "volledig", "editie"],
    image: "/barneveldsdagblad.jpeg"
  },
  klantenservice: {
    title: "Klantenservice - Barnevelds Dagblad",
    description: "Contact opnemen met Barnevelds Dagblad. Vragen, klachten en service informatie.",
    keywords: ["contact", "klantenservice", "hulp", "vragen", "service"],
    image: "/barneveldsdagblad.jpeg"
  },
  "tv-gids": {
    title: "TV Gids - Barnevelds Dagblad",
    description: "Overzicht van TV programma's voor vandaag en de komende dagen. Alle zenders op één plek.",
    keywords: ["tv gids", "televisie", "programmas", "zenders", "vanavond"],
    image: "/barneveldsdagblad.jpeg"
  },
  familieberichten: {
    title: "Familieberichten - Barnevelds Dagblad",
    description: "Geboortes, overlijdens, huwelijken en andere familieberichten uit Barneveld en omgeving.",
    keywords: ["familieberichten", "geboorte", "overlijden", "huwelijk", "rouw"],
    image: "/barneveldsdagblad.jpeg"
  }
}

// Utility function to get SEO config for any page
export function getSEOConfig(pageType: string): SEOConfig {
  return categorySEO[pageType] || specialPagesSEO[pageType] || defaultSEO
}