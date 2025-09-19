'use client'

import { useState } from 'react'

export default function NieuwsbriefPage() {
  const [email, setEmail] = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [categories, setCategories] = useState({
    algemeen: true,
    regio: true,
    sport: false,
    show: false,
    evenementen: false
  })
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, frequency, categories })
      })

      const data = await response.json()

      if (data.success) {
        setSubscribed(true)
      } else {
        alert(data.message || 'Er ging iets mis. Probeer het later opnieuw.')
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error)
      alert('Er ging iets mis. Probeer het later opnieuw.')
    }
  }

  const handleCategoryChange = (category: string) => {
    setCategories({
      ...categories,
      [category]: !categories[category as keyof typeof categories]
    })
  }

  if (subscribed) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-4">Bedankt voor uw aanmelding!</h2>
          <p className="text-gray-700 mb-6">
            We hebben een bevestigingsmail gestuurd naar <strong>{email}</strong>.
            Klik op de link in de email om uw aanmelding te bevestigen.
          </p>
          <button
            onClick={() => {
              setSubscribed(false)
              setEmail('')
            }}
            className="text-brand-blue hover:underline"
          >
            Nog een email adres aanmelden
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-brand-blue mb-8">Nieuwsbrief</h1>

      <div className="bg-brand-blue text-white rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Blijf op de hoogte van het laatste nieuws</h2>
        <p className="text-lg">
          Ontvang het belangrijkste nieuws uit Barneveld direct in uw inbox.
          Gratis en u kunt zich altijd weer uitschrijven.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Meld u aan voor onze nieuwsbrief</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mailadres *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  placeholder="uw@email.nl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Hoe vaak wilt u de nieuwsbrief ontvangen?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="frequency"
                      value="daily"
                      checked={frequency === 'daily'}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="mr-3"
                    />
                    <span>Dagelijks (ma-za om 7:00 uur)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="frequency"
                      value="weekly"
                      checked={frequency === 'weekly'}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="mr-3"
                    />
                    <span>Wekelijks (vrijdag om 17:00 uur)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="frequency"
                      value="breaking"
                      checked={frequency === 'breaking'}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="mr-3"
                    />
                    <span>Alleen bij breaking news</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Welke onderwerpen interesseren u?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={categories.algemeen}
                      onChange={() => handleCategoryChange('algemeen')}
                      className="mr-3"
                    />
                    <span>Algemeen nieuws</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={categories.regio}
                      onChange={() => handleCategoryChange('regio')}
                      className="mr-3"
                    />
                    <span>Regionaal nieuws</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={categories.sport}
                      onChange={() => handleCategoryChange('sport')}
                      className="mr-3"
                    />
                    <span>Sport</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={categories.show}
                      onChange={() => handleCategoryChange('show')}
                      className="mr-3"
                    />
                    <span>Entertainment</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={categories.evenementen}
                      onChange={() => handleCategoryChange('evenementen')}
                      className="mr-3"
                    />
                    <span>Evenementen</span>
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  Door u aan te melden gaat u akkoord met ons{' '}
                  <a href="/privacy" className="text-brand-blue hover:underline">privacybeleid</a>.
                  U kunt zich op elk moment uitschrijven via de link in de nieuwsbrief.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-blue text-white font-bold px-6 py-3 rounded-md hover:bg-brand-darkblue transition-colors"
              >
                Aanmelden voor nieuwsbrief
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-yellow-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Wat kunt u verwachten?</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="text-brand-yellow text-xl mr-2">📰</span>
                <span>Het belangrijkste nieuws uit Barneveld</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-yellow text-xl mr-2">🎯</span>
                <span>Gepersonaliseerd op uw interesses</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-yellow text-xl mr-2">📱</span>
                <span>Leesbaar op alle apparaten</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-yellow text-xl mr-2">🚫</span>
                <span>Geen spam, alleen relevant nieuws</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-yellow text-xl mr-2">✉️</span>
                <span>Makkelijk uitschrijven</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">Voorbeeld nieuwsbrief</h3>
            <p className="text-sm text-gray-600 mb-4">
              Benieuwd hoe onze nieuwsbrief eruitziet? Bekijk hier een voorbeeld.
            </p>
            <a
              href="#"
              className="inline-block bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded hover:bg-gray-200 transition-colors"
            >
              Bekijk voorbeeld →
            </a>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Privacy gegarandeerd</h3>
            <p className="text-sm text-gray-700">
              Wij gaan zorgvuldig om met uw gegevens:
            </p>
            <ul className="text-sm text-gray-700 mt-2 space-y-1">
              <li>• Geen verkoop aan derden</li>
              <li>• Alleen voor nieuwsbrief gebruikt</li>
              <li>• Veilig opgeslagen</li>
              <li>• AVG-compliant</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Veelgestelde vragen</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Kan ik me weer uitschrijven?</h3>
            <p className="text-sm text-gray-600">
              Ja, onderaan elke nieuwsbrief vindt u een uitschrijflink. Met één klik bent u uitgeschreven.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Hoe vaak ontvang ik de nieuwsbrief?</h3>
            <p className="text-sm text-gray-600">
              Dat bepaalt u zelf! U kunt kiezen voor dagelijks, wekelijks of alleen bij breaking news.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Is de nieuwsbrief gratis?</h3>
            <p className="text-sm text-gray-600">
              Ja, onze nieuwsbrief is volledig gratis. Net als al ons andere nieuws.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}