'use client'

import { useState } from 'react'
import Link from 'next/link'
import { footerSections } from '@/config/footerConfig'

export default function FooterLinks() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const toggleAccordion = (title: string) => {
    setOpenAccordion(openAccordion === title ? null : title)
  }

  return (
    <section className="bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Desktop Layout */}
        <div className="hidden lg:block lg:pl-20">
          <div className="grid grid-cols-4 gap-8 mb-8">
            {footerSections.map((section, index) => (
              <div key={section.title} className={
                index === 0 ? 'ml-4' : 
                index === footerSections.length - 1 ? 'mr-4' : 
                undefined
              }>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-newspaper">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-brand-blue hover:underline transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-gray-600 hover:text-brand-blue hover:underline transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:block lg:hidden">
          <div className="grid grid-cols-2 gap-8 mb-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-newspaper">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-brand-blue hover:underline transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-gray-600 hover:text-brand-blue hover:underline transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Accordion Layout */}
        <div className="md:hidden">
          <div className="space-y-4">
            {footerSections.map((section) => (
              <div key={section.title} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleAccordion(section.title)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  aria-expanded={openAccordion === section.title}
                  aria-controls={`accordion-${section.title}`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 font-newspaper">
                    {section.title}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                      openAccordion === section.title ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div
                  id={`accordion-${section.title}`}
                  className={`overflow-hidden transition-all duration-200 ${
                    openAccordion === section.title ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 pb-4">
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link.label}>
                          {link.external ? (
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-brand-blue hover:underline transition-colors duration-200 block py-1"
                            >
                              {link.label}
                            </a>
                          ) : (
                            <Link
                              href={link.href}
                              className="text-gray-600 hover:text-brand-blue hover:underline transition-colors duration-200 block py-1"
                            >
                              {link.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}