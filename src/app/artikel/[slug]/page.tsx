import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticles } from '@/lib/articles'
import { getFeaturedBedrijven } from '@/lib/bedrijven'
import { Article } from '@/types/article'
import { generateArticleMetadata, generateArticleJsonLd } from '@/lib/articleSEO'

interface ArticlePageProps {
  params: {
    slug: string
  }
}

// Generate static params for all articles
export async function generateStaticParams() {
  const articles = await getArticles()
  
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

// Generate metadata for SEO using centralized system
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const articles = await getArticles()
  const article = articles.find((a) => a.slug === slug)

  if (!article) {
    return {
      title: 'Artikel niet gevonden | Barnevelds Dagblad',
    }
  }

  return generateArticleMetadata(article)
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const articles = await getArticles()
  const article = articles.find((a) => a.slug === slug)

  if (!article) {
    notFound()
  }

  // Load featured bedrijven for spotlight
  const featuredBedrijven = await getFeaturedBedrijven()

  // Use actual article content if available, otherwise generate mock content
  const articleContent = article.content || generateMockContent(article)
  
  // Generate structured data
  const jsonLd = generateArticleJsonLd(article)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ArticleLayout article={article} featuredBedrijven={featuredBedrijven}>
        <div dangerouslySetInnerHTML={{ __html: articleContent }} />
      </ArticleLayout>
    </>
  )
}

// Mock content generator - will be replaced with actual article.content field
function generateMockContent(article: Article): string {
  return `
    <p><strong>${article.excerpt}</strong></p>
    
    <p>Dit is de volledige inhoud van het artikel "${article.title}". In een echte implementatie zou deze content komen uit het content veld van het artikel object.</p>
    
    <p>Het artikel werd gepubliceerd door ${article.author} en valt onder de categorie "${article.category}". ${article.premium ? 'Dit is een premium artikel.' : 'Dit artikel is gratis toegankelijk.'}</p>
    
    <h2>Meer details</h2>
    <p>Hier zou de volledige artikelinhoud staan met alle details, quotes, en bronvermeldingen. De content zou kunnen worden opgeslagen als HTML, Markdown, of via een headless CMS.</p>
    
    <blockquote>"Dit is een voorbeeld quote die de kern van het verhaal samenvat." - ${article.author}</blockquote>
    
    <p>Voor de toekomst kan deze implementatie worden uitgebreid met:</p>
    
    <ul>
      <li>Rich text content van een CMS</li>
      <li>Embedded media (video's, audio)</li>
      <li>Interactive elementen</li>
      <li>Related articles suggestions</li>
      <li>Comment systeem</li>
    </ul>
    
    <h3>Technische mogelijkheden</h3>
    <p>Het systeem ondersteunt verschillende content formaten en kan eenvoudig worden geïntegreerd met bestaande CMS-systemen.</p>
    
    <p><strong>Tags:</strong> ${article.tags?.join(', ') || 'Geen tags'}</p>
  `
}