import CategoryPage from '@/templates/CategoryPage'
import { generatePageMetadata } from '@/components/PageLayout'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata('kijk', {}, 'TV & Media')

export default function KijkPage() {
  return (
    <CategoryPage
      category="TV & Media"
      tag="kijk"
      description="TV programma's, media nieuws en kijktips vanuit Barneveld en omgeving."
    />
  )
}