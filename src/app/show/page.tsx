import CategoryPage from '@/templates/CategoryPage'
import { generatePageMetadata } from '@/components/PageLayout'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata('show', {}, 'Entertainment')

export default function ShowPage() {
  return (
    <CategoryPage
      category="Entertainment"
      tag="show"
      description="Entertainment nieuws, celebrities, films, muziek en shows vanuit lokaal perspectief."
    />
  )
}