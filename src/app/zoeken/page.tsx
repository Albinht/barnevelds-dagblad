import SearchClient from '@/components/SearchClient'
import NetBinnenWidget from '@/components/widgets/NetBinnenWidget'
import MostReadWidget from '@/components/widgets/MostReadWidget'
import Advertisement from '@/components/widgets/Advertisement'

interface SearchPageProps {
  searchParams: { q?: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams.q || ''

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-4" style={{paddingLeft: '80px'}}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 py-6 md:py-8">
          {/* Main Content */}
          <div className="md:col-span-2 lg:col-span-3">
            <SearchClient initialQuery={query} />
          </div>
          
          {/* Sidebar */}
          <aside className="md:col-span-1 lg:col-span-1 space-y-4 md:space-y-6">
            <NetBinnenWidget />
            <MostReadWidget />
            <Advertisement />
          </aside>
        </div>
      </div>
    </div>
  )
}