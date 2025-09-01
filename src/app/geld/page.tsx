import CategoryPage from '@/templates/CategoryPage'
import { generatePageMetadata } from '@/components/PageLayout'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata('geld', {}, 'Geld & Financiën')

export default function GeldPage() {
  return (
    <CategoryPage
      category="Geld & Financiën"
      tag="geld"
      description="Financieel nieuws, geldzaken en economische ontwikkelingen die jou raken."
    />
  )
}