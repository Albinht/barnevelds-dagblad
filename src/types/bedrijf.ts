export interface Bedrijf {
  id: string
  naam: string
  beschrijving: string
  categorie: string
  adres: string
  telefoon?: string
  website?: string
  logo?: string
  featured: boolean
  label?: 'PREMIUM' | 'NIEUW' | null
  timestamp: string
}