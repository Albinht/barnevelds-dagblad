import { Article } from '@/types/article'
import { Metadata } from 'next'

// Default SEO configuration
export const defaultSEO = {
  siteName: 'Barnevelds Dagblad',
  domain: 'barnevelds-dagblad.nl',
  defaultImage: '/barneveldsdagblad.jpeg',
  description: 'Het lokale nieuws van Barneveld en omgeving',
  keywords: ['Barneveld', 'nieuws', 'lokaal', 'gemeente', 'dagblad'],
  author: 'Redactie Barnevelds Dagblad',
  language: 'nl-NL',
  country: 'NL'
}

// Generate comprehensive metadata for articles
export function generateArticleMetadata(article: Article): Metadata {
  const publishDate = new Date(article.publishedAt || article.timestamp)
  const updatedDate = article.updatedAt ? new Date(article.updatedAt) : null
  
  // Generate keywords from article data
  const keywords = [
    ...defaultSEO.keywords,
    article.category.toLowerCase(),
    ...(article.tags || [])
  ].join(', ')
  
  // Generate structured data
  const jsonLd = generateArticleJsonLd(article)
  
  return {
    title: `${article.title} | ${defaultSEO.siteName}`,
    description: article.summary || article.excerpt,
    keywords,
    authors: [{ name: article.author }],
    publisher: defaultSEO.siteName,
    
    // Open Graph metadata
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.summary || article.excerpt,
      url: `https://${defaultSEO.domain}/artikel/${article.slug}`,
      siteName: defaultSEO.siteName,
      publishedTime: publishDate.toISOString(),
      modifiedTime: updatedDate?.toISOString(),
      authors: [article.author],
      section: article.category,
      tags: article.tags,
      images: article.image ? [
        {
          url: article.image.startsWith('http') 
            ? article.image 
            : `https://${defaultSEO.domain}${article.image}`,
          width: 1200,
          height: 630,
          alt: article.title,
          type: 'image/jpeg'
        }
      ] : [
        {
          url: `https://${defaultSEO.domain}${defaultSEO.defaultImage}`,
          width: 1200,
          height: 630,
          alt: defaultSEO.siteName,
          type: 'image/jpeg'
        }
      ],
      locale: defaultSEO.language,
    },
    
    // Twitter metadata
    twitter: {
      card: 'summary_large_image',
      site: `@${defaultSEO.siteName.replace(/\s+/g, '')}`,
      creator: `@${article.author.replace(/\s+/g, '')}`,
      title: article.title,
      description: article.summary || article.excerpt,
      images: article.image ? [
        article.image.startsWith('http') 
          ? article.image 
          : `https://${defaultSEO.domain}${article.image}`
      ] : [`https://${defaultSEO.domain}${defaultSEO.defaultImage}`],
    },
    
    // Additional metadata
    category: article.category,
    classification: article.premium ? 'Premium Content' : 'Free Content',
    
    // Article-specific metadata
    other: {
      'article:published_time': publishDate.toISOString(),
      'article:modified_time': updatedDate?.toISOString(),
      'article:author': article.author,
      'article:section': article.category,
      'article:tag': article.tags?.join(', ') || '',
      'article:publisher': defaultSEO.siteName,
      
      // Reading time metadata
      ...(article.readTime && {
        'article:reading_time': `${article.readTime} minutes`,
        'twitter:label1': 'Leestijd',
        'twitter:data1': `${article.readTime} min`,
      }),
      
      // Premium content indicator
      ...(article.premium && {
        'article:content_tier': 'premium',
        'twitter:label2': 'Content',
        'twitter:data2': 'Premium',
      }),
      
      // Comments count
      ...(article.comments > 0 && {
        'article:comment_count': article.comments.toString(),
      }),
    },
    
    // Robots and crawling directives
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Verification and canonical
    alternates: {
      canonical: `https://${defaultSEO.domain}/artikel/${article.slug}`,
      languages: {
        'nl-NL': `https://${defaultSEO.domain}/artikel/${article.slug}`,
      },
    },
    
    // Structured data
    ...(jsonLd && {
      other: {
        ...((typeof jsonLd === 'object') ? jsonLd : {}),
      }
    }),
  }
}

// Generate JSON-LD structured data for articles
export function generateArticleJsonLd(article: Article) {
  const publishDate = new Date(article.publishedAt || article.timestamp)
  const updatedDate = article.updatedAt ? new Date(article.updatedAt) : publishDate
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary || article.excerpt,
    image: article.image ? [
      article.image.startsWith('http') 
        ? article.image 
        : `https://${defaultSEO.domain}${article.image}`
    ] : [`https://${defaultSEO.domain}${defaultSEO.defaultImage}`],
    datePublished: publishDate.toISOString(),
    dateModified: updatedDate.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author,
      url: `https://${defaultSEO.domain}/auteur/${article.author.toLowerCase().replace(/\s+/g, '-')}`
    },
    publisher: {
      '@type': 'Organization',
      name: defaultSEO.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `https://${defaultSEO.domain}${defaultSEO.defaultImage}`,
        width: 400,
        height: 400
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://${defaultSEO.domain}/artikel/${article.slug}`
    },
    url: `https://${defaultSEO.domain}/artikel/${article.slug}`,
    articleSection: article.category,
    keywords: article.tags?.join(', ') || '',
    wordCount: article.content ? article.content.replace(/<[^>]*>/g, '').split(/\s+/).length : undefined,
    commentCount: article.comments,
    
    // Premium content indicator
    ...(article.premium && {
      isAccessibleForFree: false,
      hasPart: {
        '@type': 'WebPageElement',
        isAccessibleForFree: false,
        cssSelector: '.premium-content'
      }
    }),
    
    // Reading time
    ...(article.readTime && {
      timeRequired: `PT${article.readTime}M` // ISO 8601 duration format
    }),
    
    // Breadcrumb navigation
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `https://${defaultSEO.domain}`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: article.category,
          item: `https://${defaultSEO.domain}/categorie/${article.category.toLowerCase()}`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: article.title,
          item: `https://${defaultSEO.domain}/artikel/${article.slug}`
        }
      ]
    }
  }
  
  return jsonLd
}

// Generate metadata for category pages
export function generateCategoryMetadata(category: string): Metadata {
  return {
    title: `${category} | ${defaultSEO.siteName}`,
    description: `Alle ${category.toLowerCase()} nieuws uit Barneveld en omgeving`,
    keywords: [...defaultSEO.keywords, category.toLowerCase()].join(', '),
    
    openGraph: {
      title: `${category} Nieuws`,
      description: `Blijf op de hoogte van al het ${category.toLowerCase()} nieuws`,
      url: `https://${defaultSEO.domain}/categorie/${category.toLowerCase()}`,
      siteName: defaultSEO.siteName,
      type: 'website',
    },
    
    alternates: {
      canonical: `https://${defaultSEO.domain}/categorie/${category.toLowerCase()}`,
    }
  }
}

// Calculate estimated reading time based on word count
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200 // Average reading speed
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Generate article excerpt from content
export function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content.replace(/<[^>]*>/g, '').trim()
  
  if (plainText.length <= maxLength) {
    return plainText
  }
  
  return plainText.substring(0, maxLength).replace(/\s+\w*$/, '') + '...'
}