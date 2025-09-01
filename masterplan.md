# 🧠 Barnevelds Dagblad - Complete Implementation Masterplan

## 🎯 Master Prompt & System Instructions

You are an expert Next.js + TailwindCSS coding agent building a scalable newspaper website for **Barnevelds Dagblad**. 

**Core Mission**: Build and maintain a fully-featured newspaper website with consistent branding, SEO optimization, and scalable architecture.

**Brand Colors**: 
- Primary Blue: `#0F47AF`
- Accent Yellow: `#FCDD0C` 
- Background White: `#FFFFFF`
- Text Black: `#000000`

**Fonts**: 
- Headlines: Poppins
- Body text: Inter

---

## 🏗️ Current Architecture State

### ✅ **Already Implemented**

#### **Core Components**
```
src/components/
├── Header.tsx                    # Main site header with navigation
├── Footer/                       # Complete footer with newsletter signup
├── ConditionalLayout.tsx         # Layout wrapper for admin vs public
├── HeaderContainer.tsx           # Header wrapper component
├── SubNavigation.tsx             # Secondary navigation
├── UtilityBar.tsx               # Top utility bar
└── BDLogo.tsx                   # Brand logo component
```

#### **Article Components**
```
src/components/
├── ArticleCard.tsx              # Basic article card
├── MainArticleCard.tsx          # Hero article card
├── MediumArticleCard.tsx        # Medium-sized article display
├── SmallArticleCard.tsx         # Small article cards
├── PortraitArticleCard.tsx      # Portrait-oriented cards
├── ArticleGrid.tsx              # Article grid layouts
├── ArticleLayout.tsx            # Individual article page layout
└── PremiumBadge.tsx             # Premium content indicator
```

#### **Category-Specific Grids**
```
src/components/
├── CategoryGrid.tsx             # Generic category grid
├── RegioGrid.tsx               # Regional news grid
├── SportGrid.tsx               # Sports news grid  
├── ShowGrid.tsx                # Entertainment grid
├── KijkGrid.tsx                # TV/Media content grid
└── NewsGrid.tsx                # General news grid
```

#### **Widgets & Sidebar**
```
src/components/widgets/
├── NetBinnenWidget.tsx         # Latest news widget
├── MostReadWidget.tsx          # Most read articles
├── RelatedArticles.tsx         # Related content
└── Advertisement.tsx           # Ad placements
```

#### **Admin System**
```
src/app/admin/
├── dashboard/page.tsx          # Admin dashboard
├── artikelen/page.tsx          # Article management
├── bedrijven/page.tsx          # Company management
├── nieuwe-artikel/page.tsx     # Create new articles
└── bedrijf-toevoegen/page.tsx  # Add companies
```

#### **Special Pages**
```
src/app/
├── tv-gids/page.tsx            # TV Guide
├── familieberichten/page.tsx   # Family announcements
├── adverteren/page.tsx         # Advertising info
├── weer/page.tsx               # Weather
└── artikel/[slug]/page.tsx     # Dynamic article pages
```

#### **Configuration**
```
src/config/
├── footerConfig.ts             # Footer links and content
├── partnerLogos.ts             # Partner/sponsor logos
├── socialLinks.ts              # Social media links
└── articleTheme.ts             # Article styling config
```

#### **Data Structure**
```
data/
├── articles.json               # Article database
└── bedrijven.json             # Company/business database
```

#### **Brand Configuration** 
```javascript
// tailwind.config.js - Already configured
colors: {
  brand: {
    yellow: "#FCDD0C",
    blue: "#0F47AF", 
    white: "#FFFFFF",
    darkred: "#8B0000"
  }
}
```

### ❌ **Missing Implementation**

#### **Core Architecture**
- [ ] `PageLayout.tsx` - Universal layout wrapper
- [ ] `src/config/seo.ts` - Centralized SEO configuration
- [ ] `src/templates/CategoryPage.tsx` - Template for category pages
- [ ] `src/lib/articleFilters.ts` - Category filtering utilities

#### **Category Pages** (Need Implementation)
- [ ] `/regio` - Regional news
- [ ] `/sport` - Sports coverage  
- [ ] `/show` - Entertainment news
- [ ] `/kijk` - TV/Media content
- [ ] `/podcast` - Podcast content
- [ ] `/puzzel` - Puzzles and games
- [ ] `/geldmaand` - Financial content
- [ ] `/mijn-gemeente` - Municipal news
- [ ] `/praat-mee` - Community discussion
- [ ] `/auto` - Automotive news
- [ ] `/geld` - Finance/money
- [ ] `/koken-eten` - Food and cooking
- [ ] `/wonen` - Housing/lifestyle
- [ ] `/gezond` - Health content
- [ ] `/achter-de-schermen` - Behind the scenes

#### **Enhanced Special Pages**
- [ ] `/digitale-krant` - Digital newspaper viewer
- [ ] `/klantenservice` - Customer service with contact form
- [ ] Enhanced `/tv-gids` with proper TV program grid
- [ ] Enhanced `/familieberichten` with announcement cards

---

## 🎯 Implementation Strategy

### **Phase 1: Core Architecture Setup**

#### 1.1 Create Universal PageLayout Component
```typescript
// src/components/PageLayout.tsx
interface PageLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  category?: string
  showSidebar?: boolean
}

export default function PageLayout({
  children,
  title,
  description, 
  category,
  showSidebar = true
}: PageLayoutProps) {
  return (
    <>
      <Head>
        <title>{title} | Barnevelds Dagblad</title>
        <meta name="description" content={description} />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <SubNavigation />
        
        <main className="flex-1">
          <div className="container mx-auto px-4" style={{paddingLeft: '80px'}}>
            <div className={showSidebar ? 'grid grid-cols-1 lg:grid-cols-4 gap-8' : ''}>
              <div className={showSidebar ? 'lg:col-span-3' : 'w-full'}>
                {category && (
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold text-brand-blue font-newspaper">
                      {category}
                    </h1>
                    <p className="text-gray-600 mt-2">{description}</p>
                  </div>
                )}
                {children}
              </div>
              
              {showSidebar && (
                <aside className="space-y-6">
                  <NetBinnenWidget />
                  <MostReadWidget />
                  <SpotlightBedrijven />
                  <Advertisement />
                </aside>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
}
```

#### 1.2 Create SEO Configuration System
```typescript
// src/config/seo.ts
interface SEOConfig {
  title: string
  description: string  
  keywords?: string[]
  image?: string
}

export const defaultSEO: SEOConfig = {
  title: "Barnevelds Dagblad - Lokaal nieuws uit Barneveld en omgeving",
  description: "Het laatste lokale nieuws uit Barneveld en omstreken. Sport, politiek, cultuur en meer.",
  keywords: ["barneveld", "nieuws", "lokaal", "dagblad"],
  image: "/barneveldsdagblad.jpeg"
}

export const categorySEO: Record<string, SEOConfig> = {
  sport: {
    title: "Sport - Barnevelds Dagblad", 
    description: "Het laatste sportniet uit Barneveld en omgeving. Voetbal, wielrennen, tennis en meer lokale sport.",
    keywords: ["sport", "barneveld", "voetbal", "wielrennen"]
  },
  regio: {
    title: "Regionaal Nieuws - Barnevelds Dagblad",
    description: "Regionaal nieuws uit Barneveld en de Gelderse Vallei. Politiek, economie en maatschappij.",
    keywords: ["regio", "barneveld", "gelderland", "lokaal nieuws"]
  },
  show: {
    title: "Entertainment - Barnevelds Dagblad", 
    description: "Entertainment nieuws, celebrities, films, muziek en shows vanuit lokaal perspectief.",
    keywords: ["entertainment", "show", "muziek", "film"]
  }
  // ... more categories
}
```

#### 1.3 Create Category Page Template  
```typescript
// src/templates/CategoryPage.tsx
interface CategoryPageProps {
  category: string
  tag: string
  description: string
}

export default function CategoryPage({ 
  category, 
  tag, 
  description 
}: CategoryPageProps) {
  const articles = useArticlesByTag(tag)
  const seoConfig = categorySEO[tag] || defaultSEO
  
  return (
    <PageLayout 
      title={seoConfig.title}
      description={seoConfig.description}
      category={category}
    >
      {/* Hero Article */}
      {articles[0] && (
        <div className="mb-8">
          <MainArticleCard article={articles[0]} />
        </div>
      )}
      
      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(1, 10).map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      
      {/* Load More */}
      <div className="mt-12 text-center">
        <button className="bg-brand-blue text-white px-6 py-3 rounded hover:bg-blue-700">
          Meer artikelen laden
        </button>
      </div>
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": category,
            "description": description,
            "mainEntity": articles.slice(0, 5).map(article => ({
              "@type": "NewsArticle",
              "headline": article.title,
              "description": article.summary,
              "author": article.author,
              "datePublished": article.publishedAt
            }))
          })
        }}
      />
    </PageLayout>
  )
}
```

### **Phase 2: Category Pages Implementation**

#### 2.1 Article Filtering System
```typescript
// src/lib/articleFilters.ts
import { Article } from '@/types/article'

export function getArticlesByCategory(
  articles: Article[], 
  category: string
): Article[] {
  return articles
    .filter(article => 
      article.category.toLowerCase() === category.toLowerCase() ||
      article.tags?.includes(category.toLowerCase())
    )
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getArticlesByTag(
  articles: Article[],
  tag: string  
): Article[] {
  return articles
    .filter(article => 
      article.tags?.includes(tag) ||
      article.category.toLowerCase() === tag.toLowerCase()
    )
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getFeaturedArticles(articles: Article[]): Article[] {
  return articles
    .filter(article => article.featured || article.premium)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5)
}
```

#### 2.2 Generate All Category Pages
For each category, create a page following this pattern:

```typescript
// src/app/regio/page.tsx
import CategoryPage from '@/templates/CategoryPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Regionaal Nieuws - Barnevelds Dagblad",
  description: "Het laatste regionale nieuws uit Barneveld en omgeving. Lokale politiek, economie en maatschappelijke ontwikkelingen.",
}

export default function RegioPage() {
  return (
    <CategoryPage
      category="Regionaal Nieuws"
      tag="regio"
      description="Blijf op de hoogte van alle ontwikkelingen in Barneveld en de Gelderse Vallei."
    />
  )
}
```

**Complete Category Pages List:**
1. `/src/app/regio/page.tsx` - Regional news
2. `/src/app/sport/page.tsx` - Sports  
3. `/src/app/show/page.tsx` - Entertainment
4. `/src/app/kijk/page.tsx` - TV/Media
5. `/src/app/podcast/page.tsx` - Podcasts
6. `/src/app/puzzel/page.tsx` - Puzzles
7. `/src/app/geldmaand/page.tsx` - Financial content
8. `/src/app/mijn-gemeente/page.tsx` - Municipal news
9. `/src/app/praat-mee/page.tsx` - Community discussion
10. `/src/app/auto/page.tsx` - Automotive
11. `/src/app/geld/page.tsx` - Finance
12. `/src/app/koken-eten/page.tsx` - Food & cooking
13. `/src/app/wonen/page.tsx` - Housing & lifestyle
14. `/src/app/gezond/page.tsx` - Health
15. `/src/app/achter-de-schermen/page.tsx` - Behind the scenes

### **Phase 3: Enhanced Special Pages**

#### 3.1 Digital Newspaper Page
```typescript
// src/app/digitale-krant/page.tsx
export default function DigitaleKrantPage() {
  return (
    <PageLayout 
      title="Digitale Krant"
      description="Lees de volledige Barnevelds Dagblad online"
      showSidebar={false}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-brand-blue font-newspaper">
            Digitale Krant
          </h1>
          <p className="text-gray-600 mt-2">
            Lees de volledige editie van vandaag online
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <iframe 
            src="/krant/today.pdf"
            width="100%" 
            height="800"
            className="border-0 rounded"
          />
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="/krant/today.pdf"
            download
            className="bg-brand-blue text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Download PDF
          </a>
        </div>
      </div>
    </PageLayout>
  )
}
```

#### 3.2 Customer Service Page
```typescript
// src/app/klantenservice/page.tsx  
export default function KlantenservicePage() {
  return (
    <PageLayout
      title="Klantenservice"
      description="Vragen? Neem contact op met de klantenservice van Barnevelds Dagblad"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-brand-blue font-newspaper mb-8">
          Klantenservice
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Contact Informatie
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Telefoon</h3>
                <p className="text-gray-600">0342-123456</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900">E-mail</h3>
                <p className="text-gray-600">klantenservice@barneveldsdagblad.nl</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900">Openingstijden</h3>
                <p className="text-gray-600">
                  Maandag t/m vrijdag: 08:00 - 17:00<br/>
                  Zaterdag: 08:00 - 12:00
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Stuur een bericht
            </h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Naam
                </label>
                <input 
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input 
                  type="email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Onderwerp
                </label>
                <input 
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bericht
                </label>
                <textarea 
                  rows={6}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <button 
                type="submit"
                className="bg-brand-blue text-white px-6 py-3 rounded hover:bg-blue-700"
              >
                Verstuur bericht
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
```

### **Phase 4: Enhanced Widgets & Sidebar**

#### 4.1 Spotlight Bedrijven Widget
```typescript
// src/components/SpotlightBedrijven.tsx
export default function SpotlightBedrijven() {
  const [bedrijven, setBedrijven] = useState([])
  
  useEffect(() => {
    // Load companies data
    fetch('/api/bedrijven')
      .then(res => res.json())
      .then(data => setBedrijven(data.slice(0, 3)))
  }, [])
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 font-newspaper">
        Bedrijven in de Spotlight
      </h3>
      
      <div className="space-y-4">
        {bedrijven.map((bedrijf: any) => (
          <div key={bedrijf.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex items-center space-x-3">
              {bedrijf.logo && (
                <img 
                  src={bedrijf.logo}
                  alt={bedrijf.naam}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {bedrijf.naam}
                </h4>
                <p className="text-gray-600 text-xs">
                  {bedrijf.categorie}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-2">
              {bedrijf.beschrijving?.substring(0, 100)}...
            </p>
            <a 
              href={`/bedrijf/${bedrijf.slug}`}
              className="text-brand-blue text-xs hover:underline"
            >
              Meer info »
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### **Phase 5: SEO & Metadata Enhancement**

#### 5.1 Structured Data for Articles
```typescript
// src/lib/structuredData.ts
export function generateArticleStructuredData(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.summary,
    "author": {
      "@type": "Person", 
      "name": article.author
    },
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "Barnevelds Dagblad",
      "logo": {
        "@type": "ImageObject",
        "url": "https://barneveldsdagblad.nl/logo.png"
      }
    },
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt || article.publishedAt,
    "image": article.image,
    "articleSection": article.category,
    "keywords": article.tags?.join(", ")
  }
}
```

---

## 🚀 Implementation Rules & Guidelines

### **Layout Consistency**
- All pages use `PageLayout` component
- Sidebar appears on all content pages (except special full-width pages)
- Consistent `paddingLeft: '80px'` for content alignment
- Grid system: `container mx-auto px-4` with proper responsive breakpoints

### **Brand Adherence**  
- Always use brand colors: Blue `#0F47AF`, Yellow `#FCDD0C`, White `#FFFFFF`
- Typography: Headlines with `font-newspaper` class, body text with Inter
- Logo placement consistent across all pages
- Footer newsletter signup matches brand styling

### **SEO Requirements**
- Each page has unique meta title and description
- Structured data for articles and categories  
- Proper heading hierarchy (H1 → H2 → H3)
- Alt text on all images
- Semantic HTML (`<article>`, `<aside>`, `<nav>`)

### **Responsiveness**
- **Desktop**: 3-column layout (main content + sidebar)
- **Tablet**: 2-column layout  
- **Mobile**: Single column, stacked layout
- Touch-friendly buttons and navigation

### **Data Structure**
```typescript
interface Article {
  id: string
  title: string
  summary: string
  excerpt: string
  content?: string
  image: string
  category: string
  tags?: string[]
  premium: boolean
  featured?: boolean
  author: string
  publishedAt: string
  updatedAt?: string
  comments?: number
  slug: string
}
```

### **Reproducibility**
- **New category page**: Copy `/src/templates/CategoryPage.tsx`, change tag filter
- **New special page**: Use `PageLayout` wrapper, add custom content
- **New widget**: Follow existing pattern in `/src/components/widgets/`
- **SEO updates**: Modify `/src/config/seo.ts` configuration

---

## ✅ Success Criteria

Upon completion, the Barnevelds Dagblad website will have:

1. **15+ Category Pages** - All functioning with proper content filtering
2. **Consistent Branding** - Blue-yellow-white theme throughout
3. **SEO Optimized** - Proper metadata, structured data, semantic HTML
4. **Mobile Responsive** - Works perfectly on all devices
5. **Scalable Architecture** - Easy to add new categories and pages
6. **Performance Optimized** - Fast loading times, efficient data loading
7. **Admin Integration** - Seamless content management system
8. **Widget System** - Dynamic sidebar content across all pages

The implementation will be **future-proof** and **maintainable**, allowing non-technical users to add new content categories by simply copying templates and changing configuration values.

---

*This masterplan serves as the definitive guide for building the complete Barnevelds Dagblad newspaper website with all required functionality, branding, and scalability.*