import NewsHomepage from '@/components/NewsHomepage'
import { getArticles } from '@/lib/articles'
import { getFeaturedBedrijven } from '@/lib/bedrijven'

export default async function Home() {
  try {
    const [articles, bedrijven] = await Promise.allSettled([
      getArticles(),
      getFeaturedBedrijven()
    ])
    
    const articleData = articles.status === 'fulfilled' ? articles.value : []
    const bedrijvenData = bedrijven.status === 'fulfilled' ? bedrijven.value : []
    
    return <NewsHomepage articles={articleData} bedrijven={bedrijvenData} />
  } catch (error) {
    console.error('Error loading homepage data:', error)
    return <NewsHomepage articles={[]} bedrijven={[]} />
  }
}
