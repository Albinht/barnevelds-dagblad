import CategoryPage from '@/templates/CategoryPage'
import { generatePageMetadata } from '@/components/PageLayout'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata('puzzel', {}, 'Puzzels & Spelletjes')

export default function PuzzelPage() {
  return (
    <CategoryPage
      category="Puzzels & Spelletjes"
      tag="puzzel"
      description="Dagelijkse puzzels, kruiswoordraadsels en spelletjes voor de hele familie."
    />
  )
}