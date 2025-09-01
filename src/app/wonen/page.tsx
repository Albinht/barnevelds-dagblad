import CategoryPage from '@/templates/CategoryPage'
import { generatePageMetadata } from '@/components/PageLayout'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata('wonen', {}, 'Wonen & Lifestyle')

export default function WonenPage() {
  return (
    <CategoryPage
      category="Wonen & Lifestyle"
      tag="wonen"
      description="Woningniet, interieur tips en lifestyle trends in Barneveld."
    />
  )
}