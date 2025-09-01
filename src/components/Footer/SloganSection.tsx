import Link from 'next/link'
import { footerContent } from '@/config/footerConfig'

export default function SloganSection() {
  return (
    <section className="bg-white py-6">
      <div className="container mx-auto px-4 text-left" style={{paddingLeft: '120px'}}>
        <h2 className="text-3xl lg:text-4xl font-bold text-black font-newspaper mb-4">
          {footerContent.slogan.main}
        </h2>
        <a
          href="mailto:info@barneveldsdagblad.nl"
          className="inline-flex items-center text-brand-blue hover:text-blue-700 text-lg font-semibold transition-colors duration-200 group"
        >
          Tip de redactie »
          <svg 
            className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  )
}