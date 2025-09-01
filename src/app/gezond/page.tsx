import CategoryPage from '@/templates/CategoryPage'
import { generatePageMetadata } from '@/components/PageLayout'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata('gezond', {}, 'Gezond Leven')

export default function GezondPage() {
  return (
    <CategoryPage
      category="Gezond Leven"
      tag="gezond"
      description="Gezondheidsnieuws, tips voor een gezonde lifestyle en medische ontwikkelingen."
    />
  )
}