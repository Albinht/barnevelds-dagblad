'use client'

import { useState } from 'react'

export default function AdverterenPage() {
  const [formData, setFormData] = useState({
    company: '',
    contactName: '',
    email: '',
    phone: '',
    adType: '',
    budget: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/adverteren', {
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
          company: '',
          contactName: '',
          email: '',
          phone: '',
          adType: '',
          budget: '',
          message: ''
        })
      } else {
        alert(data.message || 'Er ging iets mis. Probeer het later opnieuw.')
      }
    } catch (error) {
      console.error('Error submitting advertising request:', error)
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
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-4xl font-bold text-brand-blue mb-8">Adverteren bij Barnevelds Dagblad</h1>

      <div className="bg-brand-blue text-white rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Bereik uw doelgroep in Barneveld</h2>
        <p className="text-lg">
          Met duizenden dagelijkse bezoekers uit Barneveld en omstreken is Barnevelds Dagblad
          het perfecte platform om uw boodschap te delen met de lokale gemeenschap.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">📊 Groot Bereik</h3>
          <p className="text-gray-600">
            Dagelijks duizenden unieke bezoekers uit Barneveld en omgeving
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">🎯 Lokale Focus</h3>
          <p className="text-gray-600">
            100% gefocust op de Barneveldse markt en gemeenschap
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">💡 Flexibele Opties</h3>
          <p className="text-gray-600">
            Van banners tot sponsored content, verschillende mogelijkheden beschikbaar
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-brand-blue mb-6">Advertentiemogelijkheden</h2>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Display Advertenties</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Homepage banner (728x90)</li>
                <li>• Artikel banner (728x90)</li>
                <li>• Sidebar advertentie (300x250)</li>
                <li>• Mobile banner (320x50)</li>
              </ul>
              <p className="text-sm mt-3 font-semibold">Vanaf €150 per maand</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Sponsored Content</h3>
              <p className="text-sm text-gray-600 mb-2">
                Laat uw verhaal vertellen door onze redactie in een gesponsord artikel.
                Altijd duidelijk gemarkeerd als advertentie.
              </p>
              <p className="text-sm font-semibold">Prijs op aanvraag</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Nieuwsbrief Sponsoring</h3>
              <p className="text-sm text-gray-600 mb-2">
                Bereik onze trouwe lezers direct in hun inbox met een bericht in onze nieuwsbrief.
              </p>
              <p className="text-sm font-semibold">€75 per editie</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Vacature Plaatsing</h3>
              <p className="text-sm text-gray-600 mb-2">
                Zoekt u personeel in Barneveld? Plaats uw vacature prominent op onze site.
              </p>
              <p className="text-sm font-semibold">€50 per vacature (30 dagen)</p>
            </div>

            <div className="bg-brand-yellow bg-opacity-20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Maatwerk Campagnes</h3>
              <p className="text-sm">
                Heeft u specifieke wensen? We denken graag met u mee over een campagne op maat.
                Van evenement promotie tot product lanceringen.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-2xl font-semibold mb-6">Vraag een offerte aan</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrijfsnaam *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                  Contactpersoon *
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  required
                  value={formData.contactName}
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

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefoon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label htmlFor="adType" className="block text-sm font-medium text-gray-700 mb-1">
                  Type advertentie *
                </label>
                <select
                  id="adType"
                  name="adType"
                  required
                  value={formData.adType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="">Selecteer type</option>
                  <option value="display">Display advertenties</option>
                  <option value="sponsored">Sponsored content</option>
                  <option value="newsletter">Nieuwsbrief sponsoring</option>
                  <option value="vacancy">Vacature plaatsing</option>
                  <option value="custom">Maatwerk campagne</option>
                  <option value="multiple">Combinatie van opties</option>
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                  Indicatief budget
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="">Selecteer budget</option>
                  <option value="<250">Minder dan €250 per maand</option>
                  <option value="250-500">€250 - €500 per maand</option>
                  <option value="500-1000">€500 - €1000 per maand</option>
                  <option value=">1000">Meer dan €1000 per maand</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Aanvullende informatie
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  placeholder="Vertel ons meer over uw wensen..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-blue text-white font-bold px-6 py-3 rounded-md hover:bg-brand-darkblue transition-colors"
              >
                Vraag offerte aan
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-4">
              * Verplichte velden. We nemen binnen 24 uur contact met u op.
            </p>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm font-semibold mb-2">Direct contact?</p>
              <p className="text-sm">
                Mail: <a href="mailto:adverteren@barneveldsdagblad.nl" className="text-brand-blue hover:underline">
                  adverteren@barneveldsdagblad.nl
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}