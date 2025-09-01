import CategoryPage from '@/templates/CategoryPage'
import { generatePageMetadata } from '@/components/PageLayout'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata('podcast', {}, 'Podcasts')

export default function PodcastPage() {
  return (
    <CategoryPage
      category="Podcasts"
      tag="podcast"
      description="Lokale podcasts en audio content uit Barneveld. Luister naar verhalen uit de regio."
    />
  )
}