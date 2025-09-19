'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        alert(data.message)
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
      } else {
        alert(data.message || 'Er ging iets mis. Probeer het later opnieuw.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Er ging iets mis. Probeer het later opnieuw.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-brand-blue mb-8">Contact</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Stuur ons een bericht</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Naam *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Onderwerp *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="">Selecteer een onderwerp</option>
                  <option value="algemeen">Algemene vraag</option>
                  <option value="redactie">Redactionele vraag</option>
                  <option value="technisch">Technisch probleem</option>
                  <option value="adverteren">Adverteren</option>
                  <option value="klacht">Klacht</option>
                  <option value="suggestie">Suggestie</option>
                  <option value="anders">Anders</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Bericht *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  placeholder="Typ hier uw bericht..."
                />
              </div>

              <button
                type="submit"
                className="bg-brand-blue text-white font-bold px-6 py-3 rounded-md hover:bg-brand-darkblue transition-colors"
              >
                Verstuur bericht
              </button>
            </form>

            <p className="text-sm text-gray-600 mt-4">
              * Verplichte velden. We reageren binnen 48 uur op uw bericht.
            </p>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Contactgegevens</h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold">E-mail</p>
                <a href="mailto:redactie@barneveldsdagblad.nl" className="text-brand-blue hover:underline">
                  redactie@barneveldsdagblad.nl
                </a>
              </div>
              <div>
                <p className="font-semibold">Locatie</p>
                <p>Barneveld, Nederland</p>
              </div>
              <div>
                <p className="font-semibold">Responstijd</p>
                <p>Binnen 48 uur</p>
              </div>
            </div>
          </div>

          <div className="bg-brand-yellow bg-opacity-20 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Nieuwstip?</h3>
            <p className="mb-4">
              Heeft u een nieuwstip voor ons? Gebruik dan onze speciale tiplijn!
            </p>
            <a
              href="/tip-redactie"
              className="inline-block bg-brand-blue text-white font-bold px-4 py-2 rounded hover:bg-brand-darkblue transition-colors"
            >
              Tip de redactie →
            </a>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Volg ons</h3>
            <p className="text-sm mb-3">
              Blijf op de hoogte via onze social media kanalen:
            </p>
            <div className="space-y-2">
              <a href="#" className="block text-brand-blue hover:underline">Facebook</a>
              <a href="#" className="block text-brand-blue hover:underline">Instagram</a>
              <a href="#" className="block text-brand-blue hover:underline">Twitter/X</a>
              <a href="#" className="block text-brand-blue hover:underline">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}