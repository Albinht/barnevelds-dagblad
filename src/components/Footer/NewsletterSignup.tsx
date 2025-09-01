'use client'

import { useState } from 'react'
import Image from 'next/image'
import { footerContent } from '@/config/footerConfig'
import { NewsletterFormData, NewsletterResponse } from './types'

export default function NewsletterSignup() {
  const [formData, setFormData] = useState<NewsletterFormData>({ email: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email) {
      setMessage({ type: 'error', text: 'Voer een geldig e-mailadres in' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result: NewsletterResponse = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: 'Bedankt! Je bent aangemeld voor de nieuwsbrief.' })
        setFormData({ email: '' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Er is iets misgegaan. Probeer het opnieuw.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Er is iets misgegaan. Probeer het opnieuw.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="bg-brand-blue text-white pt-4 pb-2 relative">
      {/* Logo Overlay - positioned to overlap above the blue bar */}
      <div className="absolute -top-8 left-32 z-50">
        <div 
          className="flex items-center justify-center" 
          style={{width: '105px', height: '105px'}}
        >
          <Image
            src="/barneveldsdagblad logo.png"
            alt="Barnevelds Dagblad Logo"
            width={97}
            height={97}
            className="object-contain"
          />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3" style={{paddingLeft: '120px'}}>
          {/* Newsletter Content and Form */}
          <div className="flex-1 max-w-lg mx-auto lg:mx-0">
            <div className="text-center lg:text-left">
              <h2 className="text-lg lg:text-xl font-bold font-newspaper mb-2">
                {footerContent.newsletter.title}
              </h2>
              
              <p className="text-sm text-blue-100 mb-3">
                Wil je elke dag de Dagelijkse nieuwsupdate nieuwsbrief van BD ontvangen via e-mail?
              </p>
              
              <form onSubmit={handleSubmit} className="mb-1">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label htmlFor="newsletter-email" className="sr-only">
                      E-mailadres
                    </label>
                    <input
                      type="email"
                      id="newsletter-email"
                      value={formData.email}
                      onChange={(e) => setFormData({ email: e.target.value })}
                      placeholder={footerContent.newsletter.placeholder}
                      className="w-full px-3 py-1.5 rounded bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-1 focus:ring-offset-brand-blue text-sm"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-brand-yellow text-black font-semibold px-3 py-1.5 rounded hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-1 focus:ring-offset-brand-blue transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex-shrink-0"
                  >
                    {isSubmitting ? 'Aanmelden...' : footerContent.newsletter.buttonText}
                  </button>
                </div>
              </form>

              {/* Status Message */}
              {message && (
                <div className={`text-xs ${message.type === 'success' ? 'text-green-200' : 'text-red-200'}`}>
                  {message.text}
                </div>
              )}
            </div>
          </div>

          {/* Twitter Icon Only */}
          <div className="flex-shrink-0">
            <a
              href="https://twitter.com/barnevelds_dagblad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-brand-yellow transition-colors duration-200 block"
              aria-label="Volg ons op Twitter"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}