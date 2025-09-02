import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticleBySlug, getAllArticles, getRelatedArticles } from '@/lib/articles-db'
import { getFeaturedBedrijven } from '@/lib/bedrijven'

interface ArticlePageProps {
  params: {
    slug: string
  }
}


// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Artikel niet gevonden | Barnevelds Dagblad',
      description: 'Het opgevraagde artikel kon niet worden gevonden.'
    }
  }

  return {
    title: `${article.title} | Barnevelds Dagblad`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : undefined,
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      authors: [article.author.username],
      siteName: 'Barnevelds Dagblad'
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : undefined
    }
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  // Load featured bedrijven for spotlight
  const featuredBedrijven = await getFeaturedBedrijven()
  
  // Load related articles from same category
  const relatedArticles = await getRelatedArticles(article.slug, article.category, 3)

  // Use actual article content from database
  const articleContent = article.content || `<p>Geen content beschikbaar voor dit artikel.</p>`
  
  // Generate structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image,
    "author": {
      "@type": "Person",
      "name": article.author.username
    },
    "publisher": {
      "@type": "Organization",
      "name": "Barnevelds Dagblad"
    },
    "datePublished": article.publishedAt?.toISOString(),
    "dateModified": article.updatedAt.toISOString()
  }

  // Convert database article to component format
  const componentArticle = {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    summary: article.summary,
    content: article.content,
    image: article.image,
    category: article.category,
    tags: article.tags,
    premium: article.premium,
    featured: article.featured,
    views: article.views,
    publishedAt: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
    timestamp: article.createdAt.toISOString(),
    author: article.author.username,
    comments: 0 // Default value, can be updated with actual comment count
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ArticleLayout article={componentArticle} featuredBedrijven={featuredBedrijven} relatedArticles={relatedArticles}>
        <div dangerouslySetInnerHTML={{ __html: articleContent }} />
      </ArticleLayout>
    </>
  )
}

