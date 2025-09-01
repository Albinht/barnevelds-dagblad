import CategoryPage from '@/templates/CategoryPage'
import { generatePageMetadata } from '@/components/PageLayout'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata('sport', {}, 'Sport')

export default function SportPage() {
  return (
    <CategoryPage
      category="Sport"
      tag="sport"
      description="Het laatste sportniet uit Barneveld en omgeving. Voetbal, wielrennen, tennis en alle andere sporten."
    />
  )
}