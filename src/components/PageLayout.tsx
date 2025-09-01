import { Metadata } from 'next'
import Header from './Header'
import SubNavigation from './SubNavigation'
import Footer from './Footer'
import NetBinnenWidget from './widgets/NetBinnenWidget'
import MostReadWidget from './widgets/MostReadWidget'
import SpotlightBedrijven from './SpotlightBedrijven'
import Advertisement from './widgets/Advertisement'
import { getSEOConfig, SEOConfig } from '@/config/seo'
import { getBedrijvenData } from '@/lib/serverData'

// Server-side sidebar component
async function SidebarContent() {
  const bedrijven = await getBedrijvenData()

  return (
    <aside className="space-y-6">
      <NetBinnenWidget />
      <MostReadWidget />
      <SpotlightBedrijven bedrijven={bedrijven} />
      <Advertisement />
    </aside>
  )
}

interface PageLayoutProps {
  children: React.ReactNode
  category?: string
  description?: string
  showSidebar?: boolean
  pageType?: string
  customSEO?: Partial<SEOConfig>
  className?: string
}

export default function PageLayout({
  children,
  category,
  description,
  showSidebar = true,
  className = ""
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <Header />
      <SubNavigation />
      
      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4" style={{paddingLeft: '80px'}}>
          <div className={showSidebar ? 'grid grid-cols-1 lg:grid-cols-4 gap-8 py-8' : 'py-8'}>
            {/* Main Content */}
            <div className={showSidebar ? 'lg:col-span-3' : 'w-full'}>
              {category && (
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-brand-blue font-newspaper mb-2">
                    {category}
                  </h1>
                  {description && (
                    <p className="text-gray-600 text-lg">
                      {description}
                    </p>
                  )}
                  <div className="w-16 h-1 bg-brand-yellow mt-4"></div>
                </div>
              )}
              {children}
            </div>
            
            {/* Sidebar */}
            {showSidebar && (
              <SidebarContent />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

// Utility function to generate metadata for pages
export function generatePageMetadata(
  pageType?: string,
  customSEO: Partial<SEOConfig> = {},
  category?: string
): Metadata {
  const seoConfig = pageType ? getSEOConfig(pageType) : getSEOConfig('default')
  
  // Merge with custom SEO
  const finalSEO = {
    ...seoConfig,
    ...customSEO,
    title: customSEO.title || (category ? `${category} - Barnevelds Dagblad` : seoConfig.title)
  }
  
  return {
    title: finalSEO.title,
    description: finalSEO.description,
    keywords: finalSEO.keywords?.join(', '),
    openGraph: {
      title: finalSEO.title,
      description: finalSEO.description,
      images: finalSEO.image ? [finalSEO.image] : undefined,
      type: 'website',
      siteName: 'Barnevelds Dagblad'
    },
    twitter: {
      card: 'summary_large_image',
      title: finalSEO.title,
      description: finalSEO.description,
      images: finalSEO.image ? [finalSEO.image] : undefined
    },
    alternates: {
      canonical: finalSEO.canonical
    }
  }
}