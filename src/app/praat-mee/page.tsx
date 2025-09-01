import CategoryPage from '@/templates/CategoryPage'
import { generatePageMetadata } from '@/components/PageLayout'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata('praat-mee', {}, 'Praat Mee')

export default function PraatMeePage() {
  return (
    <CategoryPage
      category="Praat Mee"
      tag="praat-mee"
      description="Doe mee aan discussies, deel je mening en praat mee over lokale onderwerpen."
    />
  )
}