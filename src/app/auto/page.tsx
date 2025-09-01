import CategoryPage from '@/templates/CategoryPage'
import { generatePageMetadata } from '@/components/PageLayout'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata('auto', {}, 'Auto & Verkeer')

export default function AutoPage() {
  return (
    <CategoryPage
      category="Auto & Verkeer"
      tag="auto"
      description="Autoniewus, verkeersinformatie en mobiliteit in Barneveld en omgeving."
    />
  )
}