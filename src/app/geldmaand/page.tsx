import CategoryPage from '@/templates/CategoryPage'
import { generatePageMetadata } from '@/components/PageLayout'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata('geldmaand', {}, 'Geldmaand')

export default function GeldmaandPage() {
  return (
    <CategoryPage
      category="Geldmaand"
      tag="geldmaand"
      description="Financiële tips, geldzaken en economisch nieuws speciaal voor Geldmaand."
    />
  )
}