'use client'

import { useState } from 'react'

export default function TipRedactiePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    anonymous: false,
    tipTitle: '',
    tipDescription: '',
    location: '',
    datetime: '',
    hasMedia: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/tip', {
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
          phone: '',
          anonymous: false,
          tipTitle: '',
          tipDescription: '',
          location: '',
          datetime: '',
          hasMedia: false
        })
      } else {
        alert(data.message || 'Er ging iets mis. Probeer het later opnieuw.')
      }
    } catch (error) {
      console.error('Error submitting tip:', error)
      alert('Er ging iets mis. Probeer het later opnieuw.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-brand-blue mb-8">Tip de Redactie</h1>

      <div className="bg-brand-yellow bg-opacity-20 border-l-4 border-brand-yellow p-6 mb-8">
        <p className="text-lg font-semibold mb-2">Heeft u nieuws voor ons?</p>
        <p>
          Wij zijn altijd op zoek naar het laatste nieuws uit Barneveld en omstreken.
          Uw tip kan het verschil maken!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Stuur uw nieuwstip</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleChange}
                    className="mr-3 w-4 h-4"
                  />
                  <span className="font-medium">Ik wil anoniem blijven</span>
                </label>
              </div>

              {!formData.anonymous && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Naam
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        E-mail
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefoon (optioneel)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      placeholder="Voor eventueel contact"
                    />
                  </div>
                </>
              )}

              <hr className="my-6" />

              <div>
                <label htmlFor="tipTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Kort omschrijving van uw tip *
                </label>
                <input
                  type="text"
                  id="tipTitle"
                  name="tipTitle"
                  required
                  value={formData.tipTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  placeholder="Bijv: Ongeluk op de A30"
                />
              </div>

              <div>
                <label htmlFor="tipDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Volledige beschrijving *
                </label>
                <textarea
                  id="tipDescription"
                  name="tipDescription"
                  required
                  rows={6}
                  value={formData.tipDescription}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  placeholder="Geef zoveel mogelijk details. Wat gebeurde er? Wie zijn erbij betrokken? Waarom is dit nieuws?"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Locatie
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    placeholder="Waar gebeurde het?"
                  />
                </div>

                <div>
                  <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 mb-1">
                    Datum en tijd
                  </label>
                  <input
                    type="datetime-local"
                    id="datetime"
                    name="datetime"
                    value={formData.datetime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasMedia"
                    checked={formData.hasMedia}
                    onChange={handleChange}
                    className="mr-3 w-4 h-4"
                  />
                  <span className="font-medium">Ik heb foto&apos;s of video&apos;s</span>
                </label>
                {formData.hasMedia && (
                  <p className="text-sm text-gray-600 mt-2 ml-7">
                    Na het versturen van deze tip ontvangt u instructies voor het toesturen van beeldmateriaal.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="bg-brand-blue text-white font-bold px-6 py-3 rounded-md hover:bg-brand-darkblue transition-colors"
              >
                Verstuur tip
              </button>
            </form>

            <p className="text-sm text-gray-600 mt-4">
              * Verplichte velden. Uw gegevens worden vertrouwelijk behandeld volgens ons privacybeleid.
            </p>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">WhatsApp Tiplijn</h3>
            <p className="mb-4">
              Snel een tip doorgeven? Stuur een WhatsApp bericht!
            </p>
            <a
              href="https://wa.me/31612345678"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white font-bold px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              📱 06-12345678
            </a>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Wat maakt een goede tip?</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-brand-blue mr-2">✓</span>
                <span>Actueel en relevant voor Barneveld</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-blue mr-2">✓</span>
                <span>Concrete feiten en details</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-blue mr-2">✓</span>
                <span>Verifieerbare informatie</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-blue mr-2">✓</span>
                <span>Foto&apos;s of video&apos;s (indien mogelijk)</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-blue mr-2">✓</span>
                <span>Contactgegevens voor verificatie</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Bronbescherming</h3>
            <p className="text-sm">
              Wij respecteren uw privacy en beschermen onze bronnen.
              Als u anoniem wilt blijven, respecteren wij dat volledig.
              Lees meer in ons <a href="/redactiestatuut" className="text-brand-blue hover:underline">redactiestatuut</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}