import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ArticleNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center">
          {/* 404 Icon */}
          <div className="mx-auto w-24 h-24 bg-[#0F47AF] rounded-full flex items-center justify-center mb-8">
            <span className="text-white text-3xl font-bold">404</span>
          </div>
          
          {/* Error Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Artikel niet gevonden
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Het artikel dat u zoekt bestaat niet of is verplaatst. 
            Het kan zijn dat de link onjuist is of dat het artikel offline is gehaald.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/"
              className="bg-[#0F47AF] text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Naar de homepage
            </Link>
            
            <Link 
              href="/zoeken"
              className="bg-white text-[#0F47AF] font-bold py-3 px-8 rounded-lg border-2 border-[#0F47AF] hover:bg-[#0F47AF] hover:text-white transition-colors"
            >
              Artikel zoeken
            </Link>
          </div>
          
          {/* Suggestions */}
          <div className="bg-white rounded-lg shadow-sm p-8 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Dit kunt u proberen:
            </h2>
            
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-[#0F47AF] text-white text-xs font-bold rounded-full flex items-center justify-center mr-3 mt-0.5">
                  1
                </span>
                <span>Controleer of de URL correct is getypt</span>
              </li>
              
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-[#0F47AF] text-white text-xs font-bold rounded-full flex items-center justify-center mr-3 mt-0.5">
                  2
                </span>
                <span>Ga terug naar de <Link href="/" className="text-[#0F47AF] hover:underline">homepage</Link> en zoek het artikel</span>
              </li>
              
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-[#0F47AF] text-white text-xs font-bold rounded-full flex items-center justify-center mr-3 mt-0.5">
                  3
                </span>
                <span>Bekijk de verschillende <Link href="/categorie" className="text-[#0F47AF] hover:underline">categorieën</Link></span>
              </li>
              
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-[#0F47AF] text-white text-xs font-bold rounded-full flex items-center justify-center mr-3 mt-0.5">
                  4
                </span>
                <span>Neem contact op met de <Link href="/klantenservice" className="text-[#0F47AF] hover:underline">redactie</Link> als u denkt dat dit een fout is</span>
              </li>
            </ul>
          </div>
          
          {/* Recent Articles */}
          <div className="mt-12 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Misschien interessant:
            </h2>
            
            <div className="text-center text-gray-500">
              <p>Recente artikelen worden hier weergegeven...</p>
              <p className="text-sm mt-2">
                <Link href="/" className="text-[#0F47AF] hover:underline">
                  Bekijk alle artikelen →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}