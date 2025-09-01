import CategoryPage from '@/templates/CategoryPage'
import { generatePageMetadata } from '@/components/PageLayout'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata('achter-de-schermen', {}, 'Achter de Schermen')

export default function AchterDeSchermenPage() {
  return (
    <CategoryPage
      category="Achter de Schermen"
      tag="achter-de-schermen"
      description="Kijk achter de schermen bij bedrijven, organisaties en events in Barneveld."
    />
  )
}