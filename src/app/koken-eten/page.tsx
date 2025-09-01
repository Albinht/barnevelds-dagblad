import CategoryPage from '@/templates/CategoryPage'
import { generatePageMetadata } from '@/components/PageLayout'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata('koken-eten', {}, 'Koken & Eten')

export default function KokenEtenPage() {
  return (
    <CategoryPage
      category="Koken & Eten"
      tag="koken-eten"
      description="Recepten, restaurant reviews en culinaire tips uit Barneveld en omgeving."
    />
  )
}