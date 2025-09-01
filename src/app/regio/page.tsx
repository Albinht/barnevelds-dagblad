import CategoryPage from '@/templates/CategoryPage'
import { generatePageMetadata } from '@/components/PageLayout'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata('regio', {}, 'Regionaal Nieuws')

export default function RegioPage() {
  return (
    <CategoryPage
      category="Regionaal Nieuws"
      tag="regio"
      description="Het laatste regionale nieuws uit Barneveld en de Gelderse Vallei. Van gemeentepolitiek tot lokale ontwikkelingen."
    />
  )
}