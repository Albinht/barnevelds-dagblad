import CategoryPage from '@/templates/CategoryPage'
import { generatePageMetadata } from '@/components/PageLayout'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata('mijn-gemeente', {}, 'Mijn Gemeente')

export default function MijnGemeentePage() {
  return (
    <CategoryPage
      category="Mijn Gemeente"
      tag="mijn-gemeente"
      description="Gemeentelijk nieuws, besluiten en ontwikkelingen in Barneveld en omliggende gemeenten."
    />
  )
}